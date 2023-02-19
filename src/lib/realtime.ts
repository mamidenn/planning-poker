import { supabase } from '$lib/supabase';
import {
	filter,
	BehaviorSubject,
	delayWhen,
	map,
	debounceTime,
	shareReplay,
	finalize,
	Observable
} from 'rxjs';
import _ from 'lodash';
import { get, type Readable, type Writable } from 'svelte/store';

interface PresenceState {
	[key: string]: Presence[];
}
interface Presence {
	presence_ref: string;
	[key: string]: unknown;
}
export interface UserData {
	id: string;
	name: string;
	vote?: number;
	spectating: boolean;
}

type ConnectionStatus = 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR';

export const realtime: (
	channelName: string,
	user: Readable<UserData>
) => {
	users: Readable<UserData[]>;
	revealed: Writable<boolean>;
} = (channelName, user) => {
	const connectionStatus = new BehaviorSubject<ConnectionStatus>('CLOSED');
	const presenceState = new BehaviorSubject<PresenceState>({});
	const channel = supabase.channel(channelName, {
		config: { presence: { key: get(user).id } }
	});
	const _users = presenceState.pipe(
		map(
			(state) => Object.values(state).map((presences) => _.last(presences)) as unknown as UserData[]
		),
		finalize(() => channel.unsubscribe()),
		shareReplay({ bufferSize: 1, refCount: true })
	);
	const users: Readable<UserData[]> = {
		subscribe: (run) => {
			const sub = _users.subscribe((value) => run(value));
			return () => sub.unsubscribe();
		}
	};

	const _revealed = new BehaviorSubject({
		revealed: false,
		isLocalValue: false
	});
	_revealed
		.pipe(
			filter(({ isLocalValue }) => isLocalValue),
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
	supabase
		.from('sessions')
		.upsert({ id: channelName })
		.select('revealed')
		.single()
		.then<boolean>((res) => res.data?.revealed)
		.then((revealed) => _revealed.next({ revealed, isLocalValue: false }));

	new Observable<UserData>((sub) => user.subscribe((u) => sub.next(u)))
		.pipe(
			debounceTime(500),
			delayWhen(() => connectionStatus.pipe(filter((status) => status === 'SUBSCRIBED')))
		)
		.subscribe((user) => {
			channel.track(user);
			return channel.untrack();
		});

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

	return { users, revealed };
};
