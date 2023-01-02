import { supabase } from '$lib/supabase';
import {
	filter,
	BehaviorSubject,
	delayWhen,
	map,
	of,
	debounceTime,
	shareReplay,
	finalize
} from 'rxjs';
import { last } from 'lodash';
import type { Updater } from 'svelte/store';
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
	update(updater: Updater<T>): void {
		this.next(updater(this.value));
	}
}

export const realtime = (channelName: string, user: UserData) => {
	if (!browser) {
		return {
			user$: new SvelteSubject<UserData>({ id: '', name: '' }),
			users$: of<UserData[]>([])
		};
	}
	const connectionStatus = new BehaviorSubject<ConnectionStatus>('CLOSED');
	const presenceState = new BehaviorSubject<PresenceState>({});
	const user$ = new SvelteSubject<UserData>(user);
	const channel = supabase.channel(channelName, {
		config: { presence: { key: user.id } }
	});
	const users$ = presenceState.pipe(
		map(
			(state) => Object.values(state).map((presences) => last(presences)) as unknown as UserData[]
		),
		finalize(() => channel.unsubscribe()),
		shareReplay({ bufferSize: 1, refCount: true })
	);

	user$
		.pipe(
			debounceTime(500),
			delayWhen(() => connectionStatus.pipe(filter((status) => status === 'SUBSCRIBED')))
		)
		.subscribe((user) => channel.track(user));

	channel
		.on('presence', { event: 'sync' }, () => {
			presenceState.next(channel.presenceState());
		})
		.subscribe(async (status) => {
			connectionStatus.next(status);
		});

	return { user$, users$ };
};
