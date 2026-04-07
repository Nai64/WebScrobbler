import { SHORT_TRACK_CACHE } from './browser-storage';
import type { DataModels, ShortTrackCache } from './wrapper';
import type StorageWrapper from './wrapper';
import * as BrowserStorage from './browser-storage';
import ShortTrackCacheModel from './short-track-cache.model';

type K = typeof SHORT_TRACK_CACHE;
type V = DataModels[K];
type T = Record<K, V>;

class ShortTrackCacheImpl extends ShortTrackCacheModel {
	private shortTrackCacheStorage = this.getStorage();

	public init() {
		this._init(
			BrowserStorage.getLocalStorage(BrowserStorage.SHORT_TRACK_CACHE),
		);

		// #v-ifdef VITE_DEV
		void this.shortTrackCacheStorage.debugLog();
		// #v-endif
	}

	/** @override */
	async getShortTrackCacheStorage(): Promise<ShortTrackCache[] | null> {
		return this.shortTrackCacheStorage.get();
	}

	/** @override */
	async getShortTrackCacheStorageLocking(): Promise<ShortTrackCache[] | null> {
		return this.shortTrackCacheStorage.getLocking();
	}

	/** @override */
	async saveShortTrackCacheToStorage(data: T[K]): Promise<void> {
		return await this.shortTrackCacheStorage.set(data);
	}

	/** @override */
	async saveShortTrackCacheToStorageLocking(data: T[K]): Promise<void> {
		return await this.shortTrackCacheStorage.setLocking(data);
	}

	/** @override */
	getStorage(): StorageWrapper<K> {
		return BrowserStorage.getStorage(SHORT_TRACK_CACHE);
	}
}

export default new ShortTrackCacheImpl();
