import { supabase } from '$lib/supabase';
import { filter, Observable, BehaviorSubject, delayWhen } from 'rxjs';
import { writable, readable, type Readable } from 'svelte/store';
import { last } from 'lodash';
import type { Session } from './sessioncookie';

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

function fromReadable<T>(store: Readable<T>) {
	return new Observable<T>((subscriber) => {
		return store.subscribe((data) => {
			subscriber.next(data);
		});
	});
}

export const realtime = (channelName: string, session: Session) => {
	const connectionStatus = new BehaviorSubject<ConnectionStatus>('');
	const presenceState = writable<PresenceState>({});
	const user = writable<UserData>(session);
	const users = readable<UserData[]>([], (set) =>
		presenceState.subscribe((data) => {
			set(Object.values(data).map((presences) => last(presences)) as unknown as UserData[]);
		})
	);

	const channel = supabase.channel(channelName, {
		config: { presence: { key: session.id } }
	});

	fromReadable(user)
		.pipe(delayWhen(() => connectionStatus.pipe(filter((status) => status === 'SUBSCRIBED'))))
		.subscribe((user) => channel.track(user));

	channel
		.on('presence', { event: 'sync' }, () => {
			presenceState.set(channel.presenceState());
		})
		.subscribe(async (status: ConnectionStatus) => {
			connectionStatus.next(status);
		});

	return { user, users };
};
