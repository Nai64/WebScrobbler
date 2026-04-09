import type { Resource, ResourceActions } from 'solid-js';
import { For } from 'solid-js';
import * as Options from '@/core/storage/options';
import * as BrowserStorage from '@/core/storage/browser-storage';
import { GlobalOptionEntry } from '../inputs';
import styles from '../components.module.scss';
import { t } from '@/util/i18n';

const globalOptions = BrowserStorage.getStorage(BrowserStorage.OPTIONS);

const fontOptions = [
	{ value: 'default', label: 'Default' },
	{ value: 'arial', label: 'Arial' },
	{ value: 'georgia', label: 'Georgia' },
	{ value: 'monospace', label: 'Monospace' },
	{ value: 'comic-sans', label: 'Comic Sans' },
	{ value: 'roboto', label: 'Roboto' },
];

/**
 * Component for customizing the now playing popup appearance
 */
export default function PopupCustomization(props: {
	options: Resource<Options.GlobalOptions | null>;
	setOptions: ResourceActions<
		Options.GlobalOptions | null | undefined,
		unknown
	>;
}) {
	const updateValue = (key: keyof Options.GlobalOptions, value: any) => {
		props.setOptions.mutate((o) => {
			if (!o) return o;
			const newOptions = { ...o, [key]: value };
			globalOptions.set(newOptions);
			return newOptions;
		});
	};

	return (
		<>
			<h2 id="header-popup-customization">{t('optionsPopupCustomization')}</h2>
			
			<h3>{t('popupColors')}</h3>
			<div class={styles.colorPickers}>
				<label class={styles.colorPickerLabel}>
					{t('popupBgColor')}
					<input
						type="color"
						value={props.options()?.[Options.POPUP_BG_COLOR] || '#1e1e1e'}
						onChange={(e) => updateValue(Options.POPUP_BG_COLOR, e.currentTarget.value)}
					/>
				</label>
				<label class={styles.colorPickerLabel}>
					{t('popupTextColor')}
					<input
						type="color"
						value={props.options()?.[Options.POPUP_TEXT_COLOR] || '#eeeeee'}
						onChange={(e) => updateValue(Options.POPUP_TEXT_COLOR, e.currentTarget.value)}
					/>
				</label>
				<label class={styles.colorPickerLabel}>
					{t('popupAccentColor')}
					<input
						type="color"
						value={props.options()?.[Options.POPUP_ACCENT_COLOR] || '#fc3434'}
						onChange={(e) => updateValue(Options.POPUP_ACCENT_COLOR, e.currentTarget.value)}
					/>
				</label>
			</div>

			<h3>{t('popupTypography')}</h3>
			<div class={styles.selectOption}>
				<label title={t('optionPopupFont')} class={styles.bigLabel}>
					{t('optionPopupFont')}
					<select
						value={props.options()?.[Options.POPUP_FONT] || 'default'}
						onChange={(e) => updateValue(Options.POPUP_FONT, e.currentTarget.value)}
					>
						<For each={fontOptions}>
							{(font) => (
								<option value={font.value}>{font.label}</option>
							)}
						</For>
					</select>
				</label>
			</div>

			<GlobalOptionEntry
				options={props.options}
				setOptions={props.setOptions}
				globalOptions={globalOptions}
				i18ntitle="optionPopupBoldArtistTitle"
				i18nlabel="optionPopupBoldArtist"
				key={Options.POPUP_BOLD_ARTIST}
			/>
			<GlobalOptionEntry
				options={props.options}
				setOptions={props.setOptions}
				globalOptions={globalOptions}
				i18ntitle="optionPopupUppercaseTrackTitle"
				i18nlabel="optionPopupUppercaseTrack"
				key={Options.POPUP_UPPERCASE_TRACK}
			/>

			<h3>{t('popupLayout')}</h3>
			<div class={styles.sliderGroup}>
				<label class={styles.sliderLabel}>
					{t('optionPopupScale')}: {props.options()?.[Options.POPUP_SCALE] ?? 1}x
					<input
						type="range"
						min="0.5"
						max="2"
						step="0.1"
						value={props.options()?.[Options.POPUP_SCALE] ?? 1}
						onChange={(e) => updateValue(Options.POPUP_SCALE, parseFloat(e.currentTarget.value))}
					/>
				</label>
				<label class={styles.sliderLabel}>
					{t('optionPopupGap')}: {props.options()?.[Options.POPUP_GAP] ?? 8}px
					<input
						type="range"
						min="0"
						max="30"
						step="1"
						value={props.options()?.[Options.POPUP_GAP] ?? 8}
						onChange={(e) => updateValue(Options.POPUP_GAP, parseInt(e.currentTarget.value))}
					/>
				</label>
				<label class={styles.sliderLabel}>
					{t('optionPopupPadding')}: {props.options()?.[Options.POPUP_PADDING] ?? 15}px
					<input
						type="range"
						min="0"
						max="50"
						step="1"
						value={props.options()?.[Options.POPUP_PADDING] ?? 15}
						onChange={(e) => updateValue(Options.POPUP_PADDING, parseInt(e.currentTarget.value))}
					/>
				</label>
				<label class={styles.sliderLabel}>
					{t('optionPopupBorderRadius')}: {props.options()?.[Options.POPUP_BORDER_RADIUS] ?? 4}px
					<input
						type="range"
						min="0"
						max="30"
						step="1"
						value={props.options()?.[Options.POPUP_BORDER_RADIUS] ?? 4}
						onChange={(e) => updateValue(Options.POPUP_BORDER_RADIUS, parseInt(e.currentTarget.value))}
					/>
				</label>
				<label class={styles.sliderLabel}>
					{t('optionPopupCoverArtSize')}: {props.options()?.[Options.POPUP_COVER_ART_SIZE] ?? 100}px
					<input
						type="range"
						min="50"
						max="200"
						step="10"
						value={props.options()?.[Options.POPUP_COVER_ART_SIZE] ?? 100}
						onChange={(e) => updateValue(Options.POPUP_COVER_ART_SIZE, parseInt(e.currentTarget.value))}
					/>
				</label>
			</div>

			<h3>{t('popupVisibility')}</h3>
			<GlobalOptionEntry
				options={props.options}
				setOptions={props.setOptions}
				globalOptions={globalOptions}
				i18ntitle="optionPopupShowCoverArtTitle"
				i18nlabel="optionPopupShowCoverArt"
				key={Options.POPUP_SHOW_COVER_ART}
			/>
			<GlobalOptionEntry
				options={props.options}
				setOptions={props.setOptions}
				globalOptions={globalOptions}
				i18ntitle="optionPopupShowAlbumTitle"
				i18nlabel="optionPopupShowAlbum"
				key={Options.POPUP_SHOW_ALBUM}
			/>
			<GlobalOptionEntry
				options={props.options}
				setOptions={props.setOptions}
				globalOptions={globalOptions}
				i18ntitle="optionPopupShowAlbumArtistTitle"
				i18nlabel="optionPopupShowAlbumArtist"
				key={Options.POPUP_SHOW_ALBUM_ARTIST}
			/>
			<GlobalOptionEntry
				options={props.options}
				setOptions={props.setOptions}
				globalOptions={globalOptions}
				i18ntitle="optionPopupShowConnectorTitle"
				i18nlabel="optionPopupShowConnector"
				key={Options.POPUP_SHOW_CONNECTOR}
			/>
			<GlobalOptionEntry
				options={props.options}
				setOptions={props.setOptions}
				globalOptions={globalOptions}
				i18ntitle="optionPopupRoundedCornersTitle"
				i18nlabel="optionPopupRoundedCorners"
				key={Options.POPUP_ROUNDED_CORNERS}
			/>
			<GlobalOptionEntry
				options={props.options}
				setOptions={props.setOptions}
				globalOptions={globalOptions}
				i18ntitle="optionPopupShadowTitle"
				i18nlabel="optionPopupShadow"
				key={Options.POPUP_SHADOW}
			/>
		</>
	);
}
