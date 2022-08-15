import { Session } from 'node:inspector';

export type Profile = Record<string, any>;

export class Profiler {

	private readonly _session: Session;

	public constructor() {
		this._session = new Session;
	}

	public async start(): Promise<void> {
		this._session.connect();
		await new Promise<void>((resolve: Function): void => void this._session.post('Profiler.enable', resolve));
		await new Promise<void>((resolve: Function): void => void this._session.post('Profiler.start', resolve));
	}

	public async stop(): Promise<Profile> {
		const profile: Profile = (await new Promise<{ profile: Profile }>((resolve: Function, reject: Function): void => {
			this._session.post('Profiler.stop', (error: Error | null, profile: Profile): void => {
				if (error) {
					reject(error);
				} else {
					resolve(profile);
				}
			});
		})).profile;
		await new Promise<void>((resolve: Function): void => void this._session.post('Profiler.disable', resolve));
		this._session.disconnect();
		return profile;
	}
}
