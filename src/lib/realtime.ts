import { supabase } from '$lib/supabase';
import { filter, Observable, BehaviorSubject, delayWhen } from 'rxjs';
import { v4 as uuid } from 'uuid';
import Cookies from 'js-cookie';
import { browser } from '$app/environment';
import {
	writable,
	readable,
	type Readable,
	type StartStopNotifier,
	type Writable,
	get
} from 'svelte/store';
import { last } from 'lodash';

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

function cookieWriteable<T>(key: string, value?: T, start?: StartStopNotifier<T>): Writable<T> {
	const cookie = Cookies.get(key);
	const initial = cookie ? (JSON.parse(cookie) as T) : value;
	const store = writable<T>(initial, start);
	store.subscribe((value) => {
		if (browser && value) {
			Cookies.set(key, JSON.stringify(value));
		}
	});
	return store;
}

const sessionId = cookieWriteable('session_id', uuid());

export const realtime = (channelName: string) => {
	const user = cookieWriteable<UserData>('user');
	const connectionStatus = new BehaviorSubject<ConnectionStatus>('');
	const presenceState = writable<PresenceState>({});
	const users = readable<UserData[]>([], (set) => {
		presenceState.subscribe((data) =>
			set(Object.values(data).map((session) => last(session)) as unknown as UserData[])
		);
	});

	const channel = supabase.channel(channelName, {
		config: { presence: { key: get(sessionId) } }
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
