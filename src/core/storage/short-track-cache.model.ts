import type { SHORT_TRACK_CACHE } from './browser-storage';
import { CustomStorage } from './custom-storage';
import type {
	DataModels,
	ShortTrackCache,
	ShortTrackCacheData,
} from './wrapper';

type K = typeof SHORT_TRACK_CACHE;
type V = DataModels[K];
type T = Record<K, V>;

export default abstract class ShortTrackCacheModel extends CustomStorage<K> {
	public abstract getShortTrackCacheStorage(): Promise<ShortTrackCache[] | null>;
	public abstract getShortTrackCacheStorageLocking(): Promise<ShortTrackCache[] | null>;
	public abstract saveShortTrackCacheToStorage(data: T[K]): Promise<void>;
	public abstract saveShortTrackCacheToStorageLocking(
		data: T[K],
	): Promise<void>;
	private MAX_SHORT_TRACK_CACHE_SIZE = 500;

	/**
	 * Save short track to the storage.
	 *
	 * @param shortTrack - {@link ShortTrackCacheData} to save
	 *
	 * @returns the id of the new short track cache entry
	 */
	async pushShortTrack(shortTrack: ShortTrackCacheData): Promise<number> {
		const storageData = await this.getShortTrackCacheStorageLocking();
		if (storageData === null) {
			await this.saveShortTrackCacheToStorageLocking([
				{
					...shortTrack,
					id: 1,
				},
			]);
			return 1;
		}

		const id = (storageData.at(-1)?.id ?? 0) + 1;
		storageData.push({
			...shortTrack,
			id,
		});

		// limit how much we store
		await this.saveShortTrackCacheToStorageLocking(
			storageData.slice(-this.MAX_SHORT_TRACK_CACHE_SIZE),
		);
		return id;
	}

	/**
	 * Replace the data for a short track in the cache
	 *
	 * @param id - ID of the cache entry to modify
	 * @param shortTrack - data to replace it with
	 */
	async replaceShortTrack(
		id: number,
		shortTrack: ShortTrackCacheData,
	): Promise<void> {
		const storageData = await this.getShortTrackCacheStorageLocking();
		if (!storageData) {
			return;
		}

		for (let i = 0; i < storageData.length; i++) {
			if (storageData[i].id === id) {
				storageData[i] = {
					...shortTrack,
					id,
				};
			}
		}
		await this.saveShortTrackCacheToStorageLocking(storageData);
	}

	async deleteShortTracks(ids: number[]): Promise<void> {
		const storageData = await this.getShortTrackCacheStorageLocking();
		if (!storageData) {
			return;
		}
		const cacheIdMap = new Map<number, boolean>();
		for (const id of ids) {
			cacheIdMap.set(id, true);
		}

		await this.saveShortTrackCacheToStorageLocking(
			storageData.filter((e) => cacheIdMap.get(e.id) !== true),
		);
	}
}
