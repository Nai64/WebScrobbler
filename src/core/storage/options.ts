import type { ConnectorMeta } from '@/core/connectors';
import connectors from '@/core/connectors';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { debugLog } from '../content/util';
import { DEFAULT_SCROBBLE_PERCENT } from '@/util/util';

const options = BrowserStorage.getStorage(BrowserStorage.OPTIONS);
const connectorsOptions = BrowserStorage.getStorage(
	BrowserStorage.CONNECTORS_OPTIONS,
);
const connectorsOverrideOptions = BrowserStorage.getStorage(
	BrowserStorage.CONNECTORS_OVERRIDE_OPTIONS,
);

export const USE_NOTIFICATIONS = 'useNotifications';
export const USE_UNRECOGNIZED_SONG_NOTIFICATIONS =
	'useUnrecognizedSongNotifications';
export const USE_INFOBOX = 'showInfobox';
export const SCROBBLE_PODCASTS = 'scrobblePodcasts';
export const AUTO_TOGGLE_LOVE = 'autoToggleLove';
export const AUTO_LOVE_SCROBBLED_TRACKS = 'autoLoveScrobbledTracks';
export const SHOW_ARTIST_SCROBBLE_COUNT = 'showArtistScrobbleCount';
export const FORCE_RECOGNIZE = 'forceRecognize';
export const SHOW_TRACK_DURATION = 'showTrackDuration';
export const SHOW_SCROBBLE_PROGRESS = 'showScrobbleProgress';
export const SHOW_SCROBBLE_PERCENT = 'showScrobblePercent';
export const COLORIZE_PLAY_COUNT = 'colorizePlayCount';
export const SCROBBLE_RECOGNIZED_TRACKS = 'scrobbleRecognizedTracks';
export const POPUP_BG_COLOR = 'popupBgColor';
export const POPUP_TEXT_COLOR = 'popupTextColor';
export const POPUP_ACCENT_COLOR = 'popupAccentColor';
export const POPUP_FONT = 'popupFont';
export const POPUP_SCALE = 'popupScale';
export const POPUP_GAP = 'popupGap';
export const POPUP_PADDING = 'popupPadding';
export const POPUP_BORDER_RADIUS = 'popupBorderRadius';
export const POPUP_SHOW_ALBUM = 'popupShowAlbum';
export const POPUP_SHOW_ALBUM_ARTIST = 'popupShowAlbumArtist';
export const POPUP_SHOW_CONNECTOR = 'popupShowConnector';
export const POPUP_BOLD_ARTIST = 'popupBoldArtist';
export const POPUP_UPPERCASE_TRACK = 'popupUppercaseTrack';
export const POPUP_SHOW_COVER_ART = 'popupShowCoverArt';
export const POPUP_COVER_ART_SIZE = 'popupCoverArtSize';
export const POPUP_ROUNDED_CORNERS = 'popupRoundedCorners';
export const POPUP_SHADOW = 'popupShadow';
export const SCROBBLE_EDITED_TRACKS_ONLY = 'scrobbleEditedTracksOnly';
export const SCROBBLE_PERCENT = 'scrobblePercent';
export const DISABLED_CONNECTORS = 'disabledConnectors';
export const DEBUG_LOGGING_ENABLED = 'debugLoggingEnabled';
export const ALBUM_GUESSING_DISABLED = 'albumGuessingDisabled';
export const ALBUM_GUESSING_UNEDITED_ONLY = 'albumGuessingUneditedOnly';
export const ALBUM_GUESSING_ALL_TRACKS = 'albumGuessingAllTracks';

export interface GlobalOptions {
	/**
	 * Force song recognition.
	 */
	[FORCE_RECOGNIZE]: boolean;

	/**
	 * Use now playing notifications.
	 */
	[USE_NOTIFICATIONS]: boolean;

	/**
	 * Show the infobox for supported connectors
	 */
	[USE_INFOBOX]: boolean;

	/**
	 * Scrobble percent.
	 */
	[SCROBBLE_PERCENT]: number;

	/**
	 * Object contains info of disabled connectors.
	 * Each key is a connector ID. If the connector is disabled,
	 * key value should be true. If connector is enabled, key should not exist.
	 */
	[DISABLED_CONNECTORS]: { [connectorId: string]: boolean };

	/**
	 * Notify if song is not recognized.
	 */
	[USE_UNRECOGNIZED_SONG_NOTIFICATIONS]: boolean;

	/**
	 * Only scrobble tracks if they are recognized or edited.
	 */
	[SCROBBLE_RECOGNIZED_TRACKS]: boolean;

	/**
	 * Only scrobble tracks if they are edited.
	 */
	[SCROBBLE_EDITED_TRACKS_ONLY]: boolean;

	/**
	 * Scrobble podcast episodes.
	 */
	[SCROBBLE_PODCASTS]: boolean;

	/**
	 * Allow debug messages to be logged to the browser console.
	 */
	[DEBUG_LOGGING_ENABLED]: boolean;

	/**
	 * Automatically toggle love on scrobbling service when doing so on website.
	 */
	[AUTO_TOGGLE_LOVE]: boolean;

	/**
	 * Automatically love tracks after they are scrobbled.
	 */
	[AUTO_LOVE_SCROBBLED_TRACKS]: boolean;

	/**
	 * Show artist scrobble count in popup.
	 */
	[SHOW_ARTIST_SCROBBLE_COUNT]: boolean;

	/**
	 * Show track duration in popup.
	 */
	[SHOW_TRACK_DURATION]: boolean;

	/**
	 * Show scrobble progress countdown in popup.
	 */
	[SHOW_SCROBBLE_PROGRESS]: boolean;

	/**
	 * Show scrobble percent in progress.
	 */
	[SHOW_SCROBBLE_PERCENT]: boolean;

	/**
	 * Colorize play count based on milestones.
	 */
	[COLORIZE_PLAY_COUNT]: boolean;

	/**
	 * Popup background color.
	 */
	[POPUP_BG_COLOR]: string;

	/**
	 * Popup text color.
	 */
	[POPUP_TEXT_COLOR]: string;

	/**
	 * Popup accent color (links, buttons).
	 */
	[POPUP_ACCENT_COLOR]: string;

	/**
	 * Popup font family.
	 */
	[POPUP_FONT]: string;

	/**
	 * Popup scale multiplier.
	 */
	[POPUP_SCALE]: number;

	/**
	 * Gap between popup elements in pixels.
	 */
	[POPUP_GAP]: number;

	/**
	 * Popup padding in pixels.
	 */
	[POPUP_PADDING]: number;

	/**
	 * Popup border radius in pixels.
	 */
	[POPUP_BORDER_RADIUS]: number;

	/**
	 * Show album name in popup.
	 */
	[POPUP_SHOW_ALBUM]: boolean;

	/**
	 * Show album artist in popup.
	 */
	[POPUP_SHOW_ALBUM_ARTIST]: boolean;

	/**
	 * Show connector name in popup.
	 */
	[POPUP_SHOW_CONNECTOR]: boolean;

	/**
	 * Bold artist name.
	 */
	[POPUP_BOLD_ARTIST]: boolean;

	/**
	 * Uppercase track name.
	 */
	[POPUP_UPPERCASE_TRACK]: boolean;

	/**
	 * Show cover art in popup.
	 */
	[POPUP_SHOW_COVER_ART]: boolean;

	/**
	 * Cover art size in pixels.
	 */
	[POPUP_COVER_ART_SIZE]: number;

	/**
	 * Use rounded corners.
	 */
	[POPUP_ROUNDED_CORNERS]: boolean;

	/**
	 * Enable popup shadow.
	 */
	[POPUP_SHADOW]: boolean;

	/**
	 * Disable guessing of albums
	 */
	[ALBUM_GUESSING_DISABLED]: boolean;

	/**
	 * Only guess albums of unedited tracks
	 */
	[ALBUM_GUESSING_UNEDITED_ONLY]: boolean;

	/**
	 * Guess albums for all albumless tracks including edited ones
	 */
	[ALBUM_GUESSING_ALL_TRACKS]: boolean;
}

/**
 * Object that stores default option values.
 */
const DEFAULT_OPTIONS: GlobalOptions = {
	[FORCE_RECOGNIZE]: false,
	[SCROBBLE_PODCASTS]: true,
	[USE_NOTIFICATIONS]: true,
	[USE_UNRECOGNIZED_SONG_NOTIFICATIONS]: false,
	[SCROBBLE_RECOGNIZED_TRACKS]: true,
	[SCROBBLE_EDITED_TRACKS_ONLY]: false,
	[DEBUG_LOGGING_ENABLED]: false,
	[SCROBBLE_PERCENT]: DEFAULT_SCROBBLE_PERCENT,
	[USE_INFOBOX]: true,
	[AUTO_TOGGLE_LOVE]: true,
	[AUTO_LOVE_SCROBBLED_TRACKS]: false,
	[SHOW_ARTIST_SCROBBLE_COUNT]: true,
	[SHOW_TRACK_DURATION]: true,
	[SHOW_SCROBBLE_PROGRESS]: true,
	[SHOW_SCROBBLE_PERCENT]: true,
	[COLORIZE_PLAY_COUNT]: true,
	[POPUP_BG_COLOR]: '',
	[POPUP_TEXT_COLOR]: '',
	[POPUP_ACCENT_COLOR]: '',
	[POPUP_FONT]: 'default',
	[POPUP_SCALE]: 1,
	[POPUP_GAP]: 8,
	[POPUP_PADDING]: 15,
	[POPUP_BORDER_RADIUS]: 4,
	[POPUP_SHOW_ALBUM]: true,
	[POPUP_SHOW_ALBUM_ARTIST]: false,
	[POPUP_SHOW_CONNECTOR]: true,
	[POPUP_BOLD_ARTIST]: true,
	[POPUP_UPPERCASE_TRACK]: false,
	[POPUP_SHOW_COVER_ART]: true,
	[POPUP_COVER_ART_SIZE]: 100,
	[POPUP_ROUNDED_CORNERS]: true,
	[POPUP_SHADOW]: true,
	[ALBUM_GUESSING_DISABLED]: false,
	[ALBUM_GUESSING_UNEDITED_ONLY]: true,
	[ALBUM_GUESSING_ALL_TRACKS]: false,
	[DISABLED_CONNECTORS]: {},
};

const OVERRIDE_CONTENT = {
	[FORCE_RECOGNIZE]: false,
	[SCROBBLE_RECOGNIZED_TRACKS]: true,
	[SCROBBLE_EDITED_TRACKS_ONLY]: false,
	[SCROBBLE_PODCASTS]: true,
	[USE_NOTIFICATIONS]: true,
	[USE_UNRECOGNIZED_SONG_NOTIFICATIONS]: false,
	[USE_INFOBOX]: true,
	[AUTO_TOGGLE_LOVE]: true,
};

export interface ConnectorOptions {
	YouTube: {
		scrobbleMusicOnly: boolean;
		scrobbleEntertainmentOnly: boolean;
		scrobbleMusicRecognisedOnly: boolean;
		enableGetTrackInfoFromYtMusic: boolean;
	};
}

/**
 * Object that stores default option values for specific connectors.
 */
const DEFAULT_CONNECTOR_OPTIONS: ConnectorOptions = {
	YouTube: {
		scrobbleMusicOnly: false,
		scrobbleEntertainmentOnly: false,
		scrobbleMusicRecognisedOnly: false,
		enableGetTrackInfoFromYtMusic: false,
	},
};

export interface ConnectorsOverrideOptionValues {
	[FORCE_RECOGNIZE]?: boolean;
	[USE_NOTIFICATIONS]?: boolean;
	[USE_INFOBOX]?: boolean;
	[SCROBBLE_PODCASTS]?: boolean;
	[AUTO_TOGGLE_LOVE]?: boolean;
	[USE_UNRECOGNIZED_SONG_NOTIFICATIONS]?: boolean;
	[SCROBBLE_RECOGNIZED_TRACKS]?: boolean;
	[SCROBBLE_EDITED_TRACKS_ONLY]?: boolean;
}

export interface ConnectorsOverrideOptions {
	[connectorId: string]: ConnectorsOverrideOptionValues;
}

export type SavedEdit = {
	album: string | null;
	albumArtist: string | null;
	artist: string;
	track: string;
};

/**
 * Setup default options values.
 * This function is called on module init.
 */
async function setupDefaultConfigValues() {
	const data = { ...DEFAULT_OPTIONS, ...(await options.get()) };

	await options.set(data);
	void options.debugLog([DISABLED_CONNECTORS]);

	const connectorData = {
		...DEFAULT_CONNECTOR_OPTIONS,
		...(await connectorsOptions.get()),
	};
	for (const connectorKey in DEFAULT_CONNECTOR_OPTIONS) {
		const typedKey = connectorKey as keyof ConnectorOptions;
		connectorData[typedKey] = {
			...DEFAULT_CONNECTOR_OPTIONS[typedKey],
			...connectorData[typedKey],
		};
	}
	await connectorsOptions.set(connectorData);

	void connectorsOptions.debugLog();
	void connectorsOverrideOptions.debugLog();
}

async function cleanupConfigValues() {
	const data = await options.get();
	if (!data) {
		throw new Error('No options data found');
	}

	for (const connectorId of Object.keys(data[DISABLED_CONNECTORS])) {
		let isFound = false;

		for (const connector of connectors) {
			if (connector.id === connectorId) {
				isFound = true;
				break;
			}
		}

		if (!isFound) {
			delete data[DISABLED_CONNECTORS][connectorId];
			debugLog(`Remove ${connectorId} from storage`);
		}
	}
}

export async function getOption(
	key: string,
	connector?: string,
): Promise<unknown> {
	if (!assertValidOptionKey(key)) {
		return;
	}

	if (connector !== undefined) {
		const optionValue = await getConnectorOverrideOption(connector, key);
		if (optionValue !== undefined) {
			return optionValue;
		}
	}

	const data = await options.get();
	return data?.[key];
}

export async function setOption<T extends keyof GlobalOptions>(
	key: T,
	value: GlobalOptions[T],
): Promise<void> {
	if (!assertValidOptionKey(key)) {
		return;
	}

	await options.update({ [key]: value });
}

// TODO: the types could be a little stricter on these functions, but it's not too bad
export async function getConnectorOption(
	connector: string,
	key: string,
): Promise<boolean | undefined> {
	if (!assertValidConnector(connector)) {
		return;
	}
	if (!assertValidConnectorOptionKey(connector, key)) {
		return;
	}

	const data = await connectorsOptions.get();
	return data?.[connector][key];
}

export async function setConnectorOption(
	connector: string,
	key: string,
	value: boolean,
): Promise<void> {
	if (!assertValidConnector(connector)) {
		return;
	}
	if (!assertValidConnectorOptionKey(connector, key)) {
		return;
	}

	const data = await connectorsOptions.get();
	if (!data?.[connector]) {
		throw new Error(`Connector ${connector} not found in storage`);
	}
	data[connector][key] = value;

	await connectorsOptions.set(data);
}

export async function getConnectorOverrideOption(
	connector: string,
	key: keyof GlobalOptions,
): Promise<boolean | undefined> {
	if (!assertValidOverride(key)) {
		return;
	}
	const data = await connectorsOverrideOptions.get();
	return data?.[connector]?.[key];
}

export async function setConnectorOverrideOption(
	connector: string,
	key: keyof ConnectorsOverrideOptionValues,
	value: boolean | undefined,
): Promise<void> {
	const data = await connectorsOverrideOptions.get();
	if (!data) {
		throw new Error('No connectors override data found');
	}
	if (!data[connector]) {
		data[connector] = {};
	}
	data[connector][key] = value;

	await connectorsOverrideOptions.set(data);
}

function assertValidOptionKey(key: string): key is keyof GlobalOptions {
	if (!(key in DEFAULT_OPTIONS)) {
		throw new Error(`Unknown option key: ${key}`);
	}
	return true;
}

function assertValidOverride(
	key: string,
): key is keyof ConnectorsOverrideOptionValues {
	if (!(key in OVERRIDE_CONTENT)) {
		return false;
	}
	return true;
}

function assertValidConnector(
	connector: string,
): connector is keyof ConnectorOptions {
	if (!(connector in DEFAULT_CONNECTOR_OPTIONS)) {
		throw new Error(`Unknown connector: ${connector}`);
	}
	return true;
}

function assertValidConnectorOptionKey(
	connector: keyof ConnectorOptions,
	key: string,
): key is keyof ConnectorOptions[keyof ConnectorOptions] {
	if (!(key in DEFAULT_CONNECTOR_OPTIONS[connector])) {
		throw new Error(`Unknown connector option key: ${key}`);
	}
	return true;
}

/**
 * Check if connector is enabled.
 * @param connector - Connector
 * @returns Check result
 */
export async function isConnectorEnabled(
	connector: ConnectorMeta,
): Promise<boolean> {
	const data = await options.get();
	if (!data) {
		throw new Error('No options data found');
	}
	return !data[DISABLED_CONNECTORS][connector.id] === true;
}

/**
 * Enable or disable connector.
 * @param connector - Connector
 * @param state - True if connector is enabled; false otherwise
 */
export async function setConnectorEnabled(
	connector: ConnectorMeta,
	state: boolean,
): Promise<void> {
	const data = await options.get();
	if (!data) {
		throw new Error('No options data found');
	}

	if (state) {
		delete data[DISABLED_CONNECTORS][connector.id];
	} else {
		data[DISABLED_CONNECTORS][connector.id] = true;
	}

	await options.set(data);
}

/**
 * Enable or disable all connectors.
 * @param state - True if connector is enabled; false otherwise
 */
export async function setAllConnectorsEnabled(state: boolean): Promise<void> {
	const data = await options.get();
	if (!data) {
		throw new Error('No options data found');
	}

	data[DISABLED_CONNECTORS] = {};
	if (!state) {
		for (const connector of connectors) {
			data[DISABLED_CONNECTORS][connector.id] = true;
		}
	}

	await options.set(data);
}

setTimeout(() => {
	void setupDefaultConfigValues().then(cleanupConfigValues);
}, 0);
