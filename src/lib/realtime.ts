import { supabase } from '$lib/supabase';
import { filter, Observable, BehaviorSubject, delayWhen } from 'rxjs';
import { writable, readable, type Readable } from 'svelte/store';

interface PresenceState {
	[key: string]: Presence[];
}
interface Presence {
	presence_ref: string;
	[key: string]: unknown;
}
interface UserData {
	name: string;
	vote?: number;
}

type ConnectionStatus = 'SUBSCRIBED' | unknown;

function fromReadable<T>(store: Readable<T>) {
	return new Observable<T>((subscriber) => {
		store.subscribe((data) => {
			subscriber.next(data);
		});
	});
}

export const realtime = (channelName: string) => {
	const channel = supabase.channel(channelName);
	const connectionStatus = new BehaviorSubject<ConnectionStatus>('');
	const presenceState = writable<PresenceState>({});

	const user = writable<UserData>({ name: '', vote: 0 });
	const users = readable<UserData[]>([], (set) => {
		presenceState.subscribe((data) => set(Object.values(data).flat() as unknown as UserData[]));
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
