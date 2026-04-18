import { create } from 'zustand';
import {
  type ShortcutAction,
  type KeyBinding,
  type Platform,
  STORAGE_KEYS,
  detectPlatform,
  getDefaultBindings,
  findConflicts,
  isBrowserShortcut,
} from '@shudu/shared';

interface ShortcutStore {
  platform: Platform;
  customBindings: Record<ShortcutAction, KeyBinding> | null;

  getBinding: (action: ShortcutAction) => KeyBinding;
  setCustomBinding: (action: ShortcutAction, binding: KeyBinding) => { conflicts: ShortcutAction[]; isBrowserShortcut: boolean };
  resetBinding: (action: ShortcutAction) => void;
  resetAllBindings: () => void;
  getConflicts: (action: ShortcutAction, binding: KeyBinding) => ShortcutAction[];
  isBrowserConflict: (binding: KeyBinding) => boolean;
}

function loadCustomBindings(): Record<ShortcutAction, KeyBinding> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SHORTCUTS);
    if (stored) return JSON.parse(stored);
  } catch {}
  return null;
}

function saveCustomBindings(bindings: Record<ShortcutAction, KeyBinding>) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHORTCUTS, JSON.stringify(bindings));
  } catch {}
}

function clearCustomBindings() {
  try {
    localStorage.removeItem(STORAGE_KEYS.SHORTCUTS);
  } catch {}
}

export const useShortcutStore = create<ShortcutStore>((set, get) => ({
  platform: detectPlatform(),
  customBindings: loadCustomBindings(),

  getBinding: (action) => {
    const { customBindings, platform } = get();
    if (customBindings && customBindings[action]) {
      return customBindings[action];
    }
    return getDefaultBindings(platform)[action];
  },

  setCustomBinding: (action, binding) => {
    const { customBindings, platform } = get();
    const current = customBindings || getDefaultBindings(platform);
    const newBindings = { ...current, [action]: binding };
    set({ customBindings: newBindings });
    saveCustomBindings(newBindings);

    const conflicts = findConflicts(action, binding, platform, newBindings);
    const isBrowser = isBrowserShortcut(binding);
    return { conflicts, isBrowserShortcut: isBrowser };
  },

  resetBinding: (action) => {
    const { customBindings, platform } = get();
    if (!customBindings) return;
    const defaults = getDefaultBindings(platform);
    const newBindings = { ...customBindings };
    delete newBindings[action];
    if (Object.keys(newBindings).length === 0) {
      set({ customBindings: null });
      clearCustomBindings();
    } else {
      if (newBindings[action]) {
        newBindings[action] = defaults[action];
      }
      set({ customBindings: newBindings });
      saveCustomBindings(newBindings);
    }
  },

  resetAllBindings: () => {
    set({ customBindings: null });
    clearCustomBindings();
  },

  getConflicts: (action, binding) => {
    const { customBindings, platform } = get();
    const allBindings = customBindings || getDefaultBindings(platform);
    return findConflicts(action, binding, platform, allBindings);
  },

  isBrowserConflict: (binding) => {
    return isBrowserShortcut(binding);
  },
}));
