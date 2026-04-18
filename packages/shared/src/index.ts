export { APP_NAME, APP_VERSION, STORAGE_KEYS, DIFFICULTY_LABELS, DIFFICULTY_GIVEN_COUNT, THEME_OPTIONS, INPUT_MODES, } from './constants';
export type { ThemeOption, InputMode } from './constants';
export { type IStorageAdapter, BrowserStorageAdapter } from './storage';
export { registerLocale, getTranslation, t, type Translations } from './i18n';
export {
  SHORTCUT_DEFINITIONS,
  SHORTCUT_CATEGORIES,
  BROWSER_SHORTCUTS,
  detectPlatform,
  keyBindingToString,
  getKeyDisplay,
  isKeyBindingMatch,
  isBrowserShortcut,
  findConflicts,
  isKeyBindingEqual,
  getDefaultBindings,
} from './shortcuts';
export type {
  ShortcutAction,
  Platform,
  KeyBinding,
  ShortcutDefinition,
  ShortcutCategory,
} from './shortcuts';
