import { t } from '@/util/i18n';
import styles from './popup.module.scss';
import type { Accessor, JSXElement, Resource, Setter } from 'solid-js';
import {
	Match,
	Show,
	Switch,
	createEffect,
	createMemo,
	createResource,
	createSignal,
	onCleanup,
	onMount,
} from 'solid-js';
import type { ManagerTab } from '@/core/storage/wrapper';
import browser from 'webextension-polyfill';
import ClonedSong from '@/core/object/cloned-song';
import Base from './base';
import { LastFMIcon } from '@/util/icons';
import {
	EditOutlined,
	BlockOutlined,
	FavoriteOutlined,
	HeartBrokenOutlined,
	RestartAltOutlined,
	ContentCopyOutlined,
} from '@/ui/components/icons';
import { sendBackgroundMessage } from '@/util/communication';
import * as ControllerMode from '@/core/object/controller/controller-mode';
import EditComponent from './edit';
import {
	createAlbumURL,
	createArtistURL,
	createTrackLibraryURL,
	createTrackURL,
} from '@/util/util';
import scrobbleService from '@/core/object/scrobble-service';
import type { SessionData } from '@/core/scrobbler/base-scrobbler';
import { PopupAnchor, Squircle, isIos } from '../components/util';
import ContextMenu from '../components/context-menu/context-menu';
import type { Navigator } from '../options/components/navigator';
import { getMobileNavigatorGroup } from '../options/components/navigator';
import * as Options from '@/core/storage/options';

/**
 * Component showing info for currently playing song if there is one
 */
export default function NowPlaying(props: { tab: Resource<ManagerTab> }) {
	const [isEditing, setIsEditing] = createSignal(false);
	const [popupOptions, setPopupOptions] = createSignal({
		bgColor: '',
		textColor: '',
		accentColor: '',
		font: 'default',
		scale: 1,
		gap: 8,
		padding: 15,
		borderRadius: 4,
		showAlbum: true,
		showAlbumArtist: false,
		showConnector: true,
		boldArtist: true,
		uppercaseTrack: false,
		showCoverArt: true,
		coverArtSize: 100,
		roundedCorners: true,
		shadow: true,
	});

	const song = createMemo(() => {
		const rawTab = props.tab();
		if (!rawTab) {
			return null;
		}
		const rawSong = rawTab.song;
		if (!rawSong) {
			return null;
		}
		return new ClonedSong(rawSong, rawTab.tabId);
	});

	// Load popup customization options
	onMount(async () => {
		setPopupOptions({
			bgColor: (await Options.getOption(Options.POPUP_BG_COLOR)) as string,
			textColor: (await Options.getOption(Options.POPUP_TEXT_COLOR)) as string,
			accentColor: (await Options.getOption(Options.POPUP_ACCENT_COLOR)) as string,
			font: (await Options.getOption(Options.POPUP_FONT)) as string,
			scale: (await Options.getOption(Options.POPUP_SCALE)) as number,
			gap: (await Options.getOption(Options.POPUP_GAP)) as number,
			padding: (await Options.getOption(Options.POPUP_PADDING)) as number,
			borderRadius: (await Options.getOption(Options.POPUP_BORDER_RADIUS)) as number,
			showAlbum: (await Options.getOption(Options.POPUP_SHOW_ALBUM)) as boolean,
			showAlbumArtist: (await Options.getOption(Options.POPUP_SHOW_ALBUM_ARTIST)) as boolean,
			showConnector: (await Options.getOption(Options.POPUP_SHOW_CONNECTOR)) as boolean,
			boldArtist: (await Options.getOption(Options.POPUP_BOLD_ARTIST)) as boolean,
			uppercaseTrack: (await Options.getOption(Options.POPUP_UPPERCASE_TRACK)) as boolean,
			showCoverArt: (await Options.getOption(Options.POPUP_SHOW_COVER_ART)) as boolean,
			coverArtSize: (await Options.getOption(Options.POPUP_COVER_ART_SIZE)) as number,
			roundedCorners: (await Options.getOption(Options.POPUP_ROUNDED_CORNERS)) as boolean,
			shadow: (await Options.getOption(Options.POPUP_SHADOW)) as boolean,
		});
	});

	// Generate font family CSS
	const fontFamily = createMemo(() => {
		const font = popupOptions().font;
		switch (font) {
			case 'arial': return 'Arial, sans-serif';
			case 'georgia': return 'Georgia, serif';
			case 'monospace': return 'monospace';
			case 'comic-sans': return '"Comic Sans MS", cursive';
			case 'roboto': return 'Roboto, sans-serif';
			default: return 'Helvetica, Arial, sans-serif';
		}
	});

	// Generate popup style object
	const popupStyle = createMemo(() => {
		const opts = popupOptions();
		return {
			'background-color': opts.bgColor || undefined,
			'color': opts.textColor || undefined,
			'font-family': fontFamily(),
			'transform': `scale(${opts.scale})`,
			'transform-origin': 'top left',
			'gap': `${opts.gap}px`,
			'padding': `${opts.padding}px`,
			'box-shadow': opts.shadow ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
		} as any;
	});

	// set width property manually, safari doesnt play well with dynamic
	let nowplaying: HTMLDivElement | undefined;
	function resizeWindow() {
		if (!nowplaying || nowplaying.scrollWidth < 10) {
			return;
		}
		document.body.style.width = `${nowplaying.scrollWidth}px`;
	}
	const observer = new ResizeObserver(resizeWindow);

	onMount(() => {
		if (!nowplaying) {
			return;
		}
		observer.observe(nowplaying);
	});

	onCleanup(() => {
		observer.disconnect();
		document.body.style.width = 'auto';
	});

	createEffect(() => {
		if (isEditing()) {
			observer.disconnect();
		} else {
			if (!nowplaying) {
				return;
			}
			observer.disconnect();
			observer.observe(nowplaying);

			if (nowplaying.scrollWidth > 10) {
				document.body.style.width = `${nowplaying.scrollWidth}px`;
			}
		}
	});

	return (
		<Switch fallback={<Base />}>
			<Match when={isEditing()}>
				<EditComponent tab={props.tab} />
			</Match>
			<Match when={song()}>
				<Show when={isIos()}>
					<NowPlayingContextMenu
						song={song}
						tab={props.tab}
						setIsEditing={setIsEditing}
					/>
				</Show>
				<div 
					class={styles.nowPlayingPopup} 
					ref={nowplaying}
					style={popupStyle()}
				>
					<Show when={popupOptions().showCoverArt}>
						<PopupLink
							class={styles.coverArtWrapper}
							href={
								song()?.getTrackArt() ??
								browser.runtime.getURL('img/cover_art_default.png')
							}
							title={t('infoOpenAlbumArt')}
						>
							<div
								class={styles.coverArtBackground}
								style={{
									'background-image': `url(${
										song()?.getTrackArt() ??
										browser.runtime.getURL(
											'img/cover_art_default.png',
										)
									})`,
									'width': `${popupOptions().coverArtSize}px`,
									'height': `${popupOptions().coverArtSize}px`,
								}}
							>
								<img
									class={styles.coverArt}
									src={
										song()?.getTrackArt() ??
										browser.runtime.getURL(
											'img/cover_art_default.png',
										)
									}
									style={{
										'border-radius': popupOptions().roundedCorners ? `${popupOptions().borderRadius}px` : '0',
									}}
								/>
							</div>
							<Squircle id="coverArtClip" />
						</PopupLink>
					</Show>
					<SongDetails
						song={song}
						tab={props.tab}
						setIsEditing={setIsEditing}
						popupOpts={popupOptions()}
					/>
				</div>
			</Match>
		</Switch>
	);
}

function NowPlayingContextMenu(props: {
	song: Accessor<ClonedSong | null>;
	tab: Resource<ManagerTab>;
	setIsEditing: Setter<boolean>;
}) {
	const [navigatorResource] = createResource(getMobileNavigatorGroup);
	const items = createMemo(() => {
		const items: Navigator = [
			{
				namei18n:
					props.tab()?.permanentMode === ControllerMode.Playing
						? 'infoEditTitleShort'
						: 'infoEditUnableTitleShort',
				icon: EditOutlined,
				action: () => props.setIsEditing(true),
			},
			{
				namei18n: 'infoCopyTrackInfoShort',
				icon: ContentCopyOutlined,
				action: () => actionCopyTrackInfo(props.song),
			},
		];
		if (props.song()?.flags.isCorrectedByUser) {
			items.push({
				namei18n:
					props.tab()?.permanentMode === ControllerMode.Playing
						? 'infoRevertTitleShort'
						: 'infoRevertUnableTitleShort',
				icon: RestartAltOutlined,
				action: () => actionResetSongData(props.tab),
			});
		}
		items.push({
			namei18n: getSkipLabel(props.tab, true),
			icon: BlockOutlined,
			action: () => actionSkipCurrentSong(props.tab),
		});
		if (!navigatorResource.loading) {
			const navigatorGroup = navigatorResource();
			if (navigatorGroup) {
				items.push(navigatorGroup);
			}
		}
		return items;
	});

	return <ContextMenu items={items()} />;
}

/**
 * Component containing the metadata for the currently playing song
 */
function SongDetails(props: {
	song: Accessor<ClonedSong | null>;
	tab: Resource<ManagerTab>;
	setIsEditing: Setter<boolean>;
	popupOpts: any;
}) {
	return (
		<div class={styles.songDetails} style={{ 'gap': `${props.popupOpts.gap}px` }}>
			<TrackData song={props.song} popupOpts={props.popupOpts} />
			<Show when={isIos()}>
				<IOSLoveTrack song={props.song} tab={props.tab} />
			</Show>
			<TrackMetadata song={props.song} />
			<Show when={!isIos()}>
				<TrackControls
					song={props.song}
					tab={props.tab}
					setIsEditing={props.setIsEditing}
				/>
			</Show>
		</div>
	);
}

/**
 * Component containing the button for loving track on iOS
 */
function IOSLoveTrack(props: {
	tab: Resource<ManagerTab>;
	song: Accessor<ClonedSong | null>;
}) {
	return (
		<button
			class={`${styles.iosLoveButton}${
				props.song()?.metadata.userloved ? ` ${styles.active}` : ''
			}`}
			onClick={() => toggleLove(props.tab, props.song)}
			title={
				props.song()?.metadata.userloved
					? t('infoUnlove')
					: t('infoLove')
			}
		>
			<FavoriteOutlined />
		</button>
	);
}

/**
 * The component showing the track data.
 */
function TrackData(props: { song: Accessor<ClonedSong | null>; popupOpts: any }) {
	const trackName = props.popupOpts.uppercaseTrack 
		? (props.song()?.getTrack() || '').toUpperCase()
		: props.song()?.getTrack();
	
	const artistClass = props.popupOpts.boldArtist ? styles.bold : '';
	
	return (
		<>
			<PopupLink
				class={artistClass}
				href={createTrackURL(
					props.song()?.getArtist(),
					props.song()?.getTrack(),
				)}
				title={t('infoViewTrackPage', trackName ?? '')}
			>
				{trackName}
			</PopupLink>
			<PopupLink
				href={createArtistURL(props.song()?.getArtist())}
				title={t('infoViewArtistPage', props.song()?.getArtist() ?? '')}
			>
				{props.song()?.getArtist()}
			</PopupLink>
			<Show when={props.popupOpts.showAlbum}>
				<PopupLink
					href={createAlbumURL(
						props.song()?.getAlbumArtist() || props.song()?.getArtist(),
						props.song()?.getAlbum(),
					)}
					title={t('infoViewAlbumPage', props.song()?.getAlbum() ?? '')}
				>
					{props.song()?.getAlbum()}
				</PopupLink>
			</Show>
			<Show when={props.popupOpts.showAlbumArtist}>
				<PopupLink
					href={createArtistURL(props.song()?.getAlbumArtist())}
					title={t(
						'infoViewArtistPage',
						props.song()?.getAlbumArtist() ?? '',
					)}
				>
					{props.song()?.getAlbumArtist()}
				</PopupLink>
			</Show>
		</>
	);
}

/**
 * The component showing the number of times scrobbled and the connector.
 */
function TrackMetadata(props: { song: Accessor<ClonedSong | null> }) {
	const [session, setSession] = createSignal<SessionData>();
	const [showDuration, setShowDuration] = createSignal(true);
	const [showProgress, setShowProgress] = createSignal(true);
	const [showPercent, setShowPercent] = createSignal(true);
	const [colorizePlayCount, setColorizePlayCount] = createSignal(true);
	const [showConnector, setShowConnector] = createSignal(true);
	const [scrobblePercent, setScrobblePercent] = createSignal(50);
	const [timeUntilScrobble, setTimeUntilScrobble] = createSignal<number | null>(null);
	const [duration, setDuration] = createSignal<number | null>(null);

	scrobbleService
		.getScrobblerByLabel('Last.fm')
		?.getSession()
		.then(setSession);

	// Load options
	onMount(async () => {
		setShowDuration(await Options.getOption(Options.SHOW_TRACK_DURATION) as boolean);
		setShowProgress(await Options.getOption(Options.SHOW_SCROBBLE_PROGRESS) as boolean);
		setShowPercent(await Options.getOption(Options.SHOW_SCROBBLE_PERCENT) as boolean);
		setColorizePlayCount(await Options.getOption(Options.COLORIZE_PLAY_COUNT) as boolean);
		setShowConnector(await Options.getOption(Options.POPUP_SHOW_CONNECTOR) as boolean);
		setScrobblePercent(await Options.getOption(Options.SCROBBLE_PERCENT) as number);
	});

	// Update countdown timer
	createEffect(() => {
		const songDuration = props.song()?.getDuration();
		setDuration(songDuration ?? null);
		
		if (songDuration && showProgress()) {
			const scrobbleTime = (songDuration * scrobblePercent()) / 100;
			// Start countdown from duration down to scrobble time
			const startTime = Date.now();
			const interval = setInterval(() => {
				const elapsed = (Date.now() - startTime) / 1000;
				const remaining = Math.max(0, scrobbleTime - elapsed);
				setTimeUntilScrobble(remaining);
				
				if (remaining <= 0) {
					clearInterval(interval);
				}
			}, 100);
			
			onCleanup(() => clearInterval(interval));
		}
	});

	const playCount = props.song()?.metadata.userPlayCount || 0;
	const playCountClass = colorizePlayCount() && playCount > 0
		? playCount >= 1000
			? styles.playCountMilestone3
			: playCount >= 100
				? styles.playCountMilestone2
				: playCount >= 10
					? styles.playCountMilestone1
					: styles.playCount
		: styles.playCount;

	return (
		<div class={styles.playDetails}>
			<PopupLink
				class={`${playCountClass} ${styles.label}`}
				href={createTrackLibraryURL(
					session()?.sessionName,
					props.song()?.getArtist(),
					props.song()?.getTrack(),
				)}
				title={t(
					'infoYourScrobbles',
					playCount.toString(),
				)}
			>
				<LastFMIcon />
				{playCount}
			</PopupLink>
			<Show when={showDuration() && duration()}>
				<span class={styles.label}>
					⏱ {formatDuration(duration()!)}
				</span>
			</Show>
			<Show when={showProgress() && timeUntilScrobble() !== null && timeUntilScrobble()! > 0}>
				<span class={`${styles.label} ${styles.scrobbleCountdown}`}>
					⏳ {Math.ceil(timeUntilScrobble()!).toString().padStart(2, '0')}s
					<Show when={showPercent()}>
						{' '}(@{scrobblePercent()}%)
					</Show>
				</span>
			</Show>
			<Show when={showConnector()}>
				<span class={styles.label}>{props.song()?.connector.label}</span>
			</Show>
		</div>
	);
}

/**
 * Format duration in seconds to MM:SS
 */
function formatDuration(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * The component for the footer of the now playing popup, showing buttons to control and edit.
 */
function TrackControls(props: {
	song: Accessor<ClonedSong | null>;
	tab: Resource<ManagerTab>;
	setIsEditing: Setter<boolean>;
}) {
	return (
		<div class={styles.controlButtons}>
			<button
				class={styles.controlButton}
				disabled={props.tab()?.permanentMode !== ControllerMode.Playing}
				title={
					props.tab()?.permanentMode === ControllerMode.Playing
						? t('infoEditTitle')
						: t('infoEditUnableTitle')
				}
				onClick={() => props.setIsEditing(true)}
			>
				<EditOutlined />
			</button>
			<Show when={props.song()?.flags.isCorrectedByUser}>
				<button
					class={styles.controlButton}
					disabled={
						props.tab()?.permanentMode !== ControllerMode.Playing
					}
					title={
						props.tab()?.permanentMode === ControllerMode.Playing
							? t('infoRevertTitle')
							: t('infoRevertUnableTitle')
					}
					onClick={() => actionResetSongData(props.tab)}
				>
					<RestartAltOutlined />
				</button>
			</Show>
			<button
				class={`${styles.controlButton}${
					props.tab()?.permanentMode !== ControllerMode.Scrobbled
						? ` ${styles.hiddenDisabled}`
						: ''
				}${
					props.tab()?.permanentMode === ControllerMode.Skipped
						? ` ${styles.active}`
						: ''
				}`}
				disabled={props.tab()?.permanentMode !== ControllerMode.Playing}
				onClick={() => actionSkipCurrentSong(props.tab)}
				title={t(getSkipLabel(props.tab, false))}
			>
				<BlockOutlined />
			</button>
			<button
				class={`${styles.controlButton}${
					props.song()?.metadata.userloved ? ` ${styles.active}` : ''
				}`}
				onClick={() => toggleLove(props.tab, props.song)}
				title={
					props.song()?.metadata.userloved
						? t('infoUnlove')
						: t('infoLove')
				}
			>
				<span class={styles.nonHover}>
					<FavoriteOutlined />
				</span>
				<span class={styles.hover}>
					<Show
						when={props.song()?.metadata.userloved}
						fallback={<FavoriteOutlined />}
					>
						<HeartBrokenOutlined />
					</Show>
				</span>
			</button>
			<button
				class={styles.controlButton}
				onClick={() => actionCopyTrackInfo(props.song)}
				title={t('infoCopyTrackInfo')}
			>
				<ContentCopyOutlined />
			</button>
		</div>
	);
}

/**
 * Create a link that opens in a new tab
 */
function PopupLink(props: {
	class?: string;
	href: string;
	title: string;
	children: string | JSXElement | JSXElement[];
}) {
	return (
		<PopupAnchor
			class={`${props.class} ${styles.notRedAnchor}`}
			href={props.href}
			title={props.title}
		>
			{props.children}
		</PopupAnchor>
	);
}

/**
 * Get the correct label for the skip label based on current controller mode
 *
 * @param tab - currently active tab
 * @param isShort - if the label should be short
 * @returns label for skip button
 */
function getSkipLabel(tab: Resource<ManagerTab>, isShort: boolean): string {
	let res = 'infoSkipUnableTitle';
	switch (tab()?.permanentMode) {
		case ControllerMode.Playing:
			res = 'infoSkipTitle';
			break;
		case ControllerMode.Skipped:
			res = 'infoSkippedTitle';
			break;
		case ControllerMode.Scrobbled:
			res = 'infoSkipUnableTitle';
			break;
	}
	return isShort ? `${res}Short` : res;
}

/**
 * Skip current song
 *
 * @param tab - currently active tab
 */
function actionSkipCurrentSong(tab: Resource<ManagerTab>) {
	sendBackgroundMessage(tab()?.tabId || -1, {
		type: 'skipCurrentSong',
		payload: undefined,
	});
}

/**
 * Copy track info to clipboard
 *
 * @param song - currently playing song
 */
function actionCopyTrackInfo(song: Accessor<ClonedSong | null>) {
	const songData = song();
	if (!songData) return;
	
	const artist = songData.getArtist() || 'Unknown Artist';
	const track = songData.getTrack() || 'Unknown Track';
	const album = songData.getAlbum();
	
	const text = album
		? `${artist} - ${track} (${album})`
		: `${artist} - ${track}`;
	
	navigator.clipboard.writeText(text).then(() => {
		// Optional: show a brief success indicator
		console.log('Track info copied to clipboard');
	}).catch(err => {
		console.error('Failed to copy track info:', err);
	});
}

/**
 * Reset song data
 *
 * @param tab - currently active tab
 */
function actionResetSongData(tab: Resource<ManagerTab>) {
	sendBackgroundMessage(tab()?.tabId ?? -1, {
		type: 'resetData',
		payload: undefined,
	});
}

/**
 * Love current song
 * @param tab - currently active tab
 * @param song - currently playing song
 */
function toggleLove(
	tab: Resource<ManagerTab>,
	song: Accessor<ClonedSong | null>,
) {
	sendBackgroundMessage(tab()?.tabId ?? -1, {
		type: 'toggleLove',
		payload: {
			isLoved: !song()?.metadata.userloved,
			shouldShowNotification: false,
		},
	});
}
