import { supabase } from '$lib/supabase';
import { filter, BehaviorSubject, delayWhen, map, of } from 'rxjs';
import { last } from 'lodash';
import type { Session } from './sessioncookie';
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

type ConnectionStatus = 'SUBSCRIBED' | unknown;

class SvelteSubject<T> extends BehaviorSubject<T> {
	set(value: T): void {
		this.next(value);
	}
	update(updater: Updater<T>): void {
		this.next(updater(this.value));
	}
}

export const realtime = (channelName: string, session: Session) => {
	if (!browser) {
		return {
			user: new SvelteSubject<UserData>({ id: '', name: '' }),
			users: of<UserData[]>([])
		};
	}
	const connectionStatus = new BehaviorSubject<ConnectionStatus>('');
	const presenceState = new BehaviorSubject<PresenceState>({});
	const user = new SvelteSubject<UserData>(session);
	const users = presenceState.pipe(
		map(
			(state) => Object.values(state).map((presences) => last(presences)) as unknown as UserData[]
		)
	);

	const channel = supabase.channel(channelName, {
		config: { presence: { key: session.id } }
	});

	user
		.pipe(delayWhen(() => connectionStatus.pipe(filter((status) => status === 'SUBSCRIBED'))))
		.subscribe((user) => channel.track(user));

	channel
		.on('presence', { event: 'sync' }, () => {
			presenceState.next(channel.presenceState());
		})
		.subscribe(async (status: ConnectionStatus) => {
			connectionStatus.next(status);
		});

	return { user, users };
};
