import { supabase } from '$lib/supabase';
import {
	filter,
	BehaviorSubject,
	delayWhen,
	map,
	of,
	debounceTime,
	shareReplay,
	finalize,
	from,
	Observable
} from 'rxjs';
import { last } from 'lodash';
import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

interface PresenceState {
	[key: string]: Presence[];
}
interface Presence {
	presence_ref: string;
	[key: string]: unknown;
}
interface UserData {
	id: string;
	name: string;
	vote?: number;
}

type ConnectionStatus = 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR';

class SvelteSubject<T> extends BehaviorSubject<T> {
	set(value: T): void {
		this.next(value);
	}
	update(updater: (value: T) => T): void {
		this.next(updater(this.value));
	}
}

export const realtime: (
	channelName: string,
	user: UserData
) => {
	user: SvelteSubject<UserData>;
	users: Observable<UserData[]>;
	revealed: Writable<boolean>;
} = (channelName, user) => {
	if (!browser) {
		return {
			user: new SvelteSubject<UserData>({ id: '', name: '' }),
			users: of<UserData[]>([]),
			revealed: writable<boolean>(false)
		};
	}
	const connectionStatus = new BehaviorSubject<ConnectionStatus>('CLOSED');
	const presenceState = new BehaviorSubject<PresenceState>({});
	const user$ = new SvelteSubject<UserData>(user);
	const channel = supabase.channel(channelName, {
		config: { presence: { key: user.id } }
	});
	const users = presenceState.pipe(
		map(
			(state) => Object.values(state).map((presences) => last(presences)) as unknown as UserData[]
		),
		finalize(() => channel.unsubscribe()),
		shareReplay({ bufferSize: 1, refCount: true })
	);

	const _revealed = new BehaviorSubject({
		revealed: false,
		isLocalValue: false
	});
	_revealed
		.pipe(
			filter(({ isLocalValue }) => isLocalValue),
			map(({ revealed }) => ({ revealed, isLocalValue: false })),
			debounceTime(500)
		)
		.subscribe(async ({ revealed }) => {
			await supabase.from('sessions').upsert({ id: channelName, revealed });
		});

	const revealed: Writable<boolean> = {
		set: (revealed: boolean) => _revealed.next({ revealed, isLocalValue: true }),
		update: (fn: (v: boolean) => boolean) =>
			_revealed.next({ revealed: fn(_revealed.value.revealed), isLocalValue: true }),
		subscribe: (o) => {
			const sub = _revealed.subscribe(({ revealed }) => o(revealed));
			return () => sub.unsubscribe();
		}
	};

	from(
		supabase
			.from('sessions')
			.upsert({ id: channelName })
			.select('revealed')
			.single()
			.then<boolean>((res) => res.data?.revealed)
	).subscribe((revealed) => _revealed.next({ revealed, isLocalValue: false }));

	user$
		.pipe(
			debounceTime(500),
			delayWhen(() => connectionStatus.pipe(filter((status) => status === 'SUBSCRIBED')))
		)
		.subscribe((user) => channel.track(user));

	channel
		.on(
			'postgres_changes',
			{ event: 'UPDATE', schema: 'public', table: 'sessions', filter: `id=eq.${channelName}` },
			({ new: { revealed } }) => {
				_revealed.next({ revealed, isLocalValue: false });
			}
		)
		.on('presence', { event: 'sync' }, () => {
			presenceState.next(channel.presenceState());
		})
		.subscribe(async (status) => {
			connectionStatus.next(status);
		});

	return { user: user$, users, revealed };
};
