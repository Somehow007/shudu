export type ShortcutAction =
  | 'input1' | 'input2' | 'input3' | 'input4' | 'input5'
  | 'input6' | 'input7' | 'input8' | 'input9'
  | 'erase' | 'undo' | 'redo' | 'toggleNote' | 'hint'
  | 'pause' | 'moveUp' | 'moveDown' | 'moveLeft' | 'moveRight'
  | 'showShortcuts'
  | 'mineFlag' | 'mineReveal' | 'mineChord' | 'mineToggleFlagMode'
  | 'mineNewGame' | 'mineHint' | 'minePause';

export type Platform = 'mac' | 'windows' | 'linux' | 'mobile';

export interface KeyBinding {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

export interface ShortcutDefinition {
  id: ShortcutAction;
  label: string;
  category: ShortcutCategory;
  bindings: Record<Platform, KeyBinding>;
  allowCustomize: boolean;
}

export type ShortcutCategory = 'input' | 'navigation' | 'game' | 'other' | 'minesweeper';

export const SHORTCUT_CATEGORIES: Record<ShortcutCategory, string> = {
  input: '输入',
  navigation: '导航',
  game: '游戏操作',
  other: '其他',
  minesweeper: '扫雷操作',
};

export const SHORTCUT_DEFINITIONS: ShortcutDefinition[] = [
  {
    id: 'input1',
    label: '填入数字 1',
    category: 'input',
    bindings: {
      mac: { key: '1' },
      windows: { key: '1' },
      linux: { key: '1' },
      mobile: { key: '1' },
    },
    allowCustomize: true,
  },
  {
    id: 'input2',
    label: '填入数字 2',
    category: 'input',
    bindings: {
      mac: { key: '2' },
      windows: { key: '2' },
      linux: { key: '2' },
      mobile: { key: '2' },
    },
    allowCustomize: true,
  },
  {
    id: 'input3',
    label: '填入数字 3',
    category: 'input',
    bindings: {
      mac: { key: '3' },
      windows: { key: '3' },
      linux: { key: '3' },
      mobile: { key: '3' },
    },
    allowCustomize: true,
  },
  {
    id: 'input4',
    label: '填入数字 4',
    category: 'input',
    bindings: {
      mac: { key: '4' },
      windows: { key: '4' },
      linux: { key: '4' },
      mobile: { key: '4' },
    },
    allowCustomize: true,
  },
  {
    id: 'input5',
    label: '填入数字 5',
    category: 'input',
    bindings: {
      mac: { key: '5' },
      windows: { key: '5' },
      linux: { key: '5' },
      mobile: { key: '5' },
    },
    allowCustomize: true,
  },
  {
    id: 'input6',
    label: '填入数字 6',
    category: 'input',
    bindings: {
      mac: { key: '6' },
      windows: { key: '6' },
      linux: { key: '6' },
      mobile: { key: '6' },
    },
    allowCustomize: true,
  },
  {
    id: 'input7',
    label: '填入数字 7',
    category: 'input',
    bindings: {
      mac: { key: '7' },
      windows: { key: '7' },
      linux: { key: '7' },
      mobile: { key: '7' },
    },
    allowCustomize: true,
  },
  {
    id: 'input8',
    label: '填入数字 8',
    category: 'input',
    bindings: {
      mac: { key: '8' },
      windows: { key: '8' },
      linux: { key: '8' },
      mobile: { key: '8' },
    },
    allowCustomize: true,
  },
  {
    id: 'input9',
    label: '填入数字 9',
    category: 'input',
    bindings: {
      mac: { key: '9' },
      windows: { key: '9' },
      linux: { key: '9' },
      mobile: { key: '9' },
    },
    allowCustomize: true,
  },
  {
    id: 'erase',
    label: '擦除',
    category: 'input',
    bindings: {
      mac: { key: 'Backspace' },
      windows: { key: 'Delete' },
      linux: { key: 'Delete' },
      mobile: { key: 'Backspace' },
    },
    allowCustomize: true,
  },
  {
    id: 'undo',
    label: '撤销',
    category: 'game',
    bindings: {
      mac: { key: 'z', metaKey: true },
      windows: { key: 'z', ctrlKey: true },
      linux: { key: 'z', ctrlKey: true },
      mobile: { key: 'z', ctrlKey: true },
    },
    allowCustomize: true,
  },
  {
    id: 'redo',
    label: '重做',
    category: 'game',
    bindings: {
      mac: { key: 'z', metaKey: true, shiftKey: true },
      windows: { key: 'y', ctrlKey: true },
      linux: { key: 'y', ctrlKey: true },
      mobile: { key: 'y', ctrlKey: true },
    },
    allowCustomize: true,
  },
  {
    id: 'toggleNote',
    label: '切换笔记模式',
    category: 'game',
    bindings: {
      mac: { key: 'n' },
      windows: { key: 'n' },
      linux: { key: 'n' },
      mobile: { key: 'n' },
    },
    allowCustomize: true,
  },
  {
    id: 'hint',
    label: '提示',
    category: 'game',
    bindings: {
      mac: { key: 'h' },
      windows: { key: 'h' },
      linux: { key: 'h' },
      mobile: { key: 'h' },
    },
    allowCustomize: true,
  },
  {
    id: 'pause',
    label: '暂停/继续',
    category: 'game',
    bindings: {
      mac: { key: 'p' },
      windows: { key: 'p' },
      linux: { key: 'p' },
      mobile: { key: 'p' },
    },
    allowCustomize: true,
  },
  {
    id: 'moveUp',
    label: '向上移动',
    category: 'navigation',
    bindings: {
      mac: { key: 'ArrowUp' },
      windows: { key: 'ArrowUp' },
      linux: { key: 'ArrowUp' },
      mobile: { key: 'ArrowUp' },
    },
    allowCustomize: false,
  },
  {
    id: 'moveDown',
    label: '向下移动',
    category: 'navigation',
    bindings: {
      mac: { key: 'ArrowDown' },
      windows: { key: 'ArrowDown' },
      linux: { key: 'ArrowDown' },
      mobile: { key: 'ArrowDown' },
    },
    allowCustomize: false,
  },
  {
    id: 'moveLeft',
    label: '向左移动',
    category: 'navigation',
    bindings: {
      mac: { key: 'ArrowLeft' },
      windows: { key: 'ArrowLeft' },
      linux: { key: 'ArrowLeft' },
      mobile: { key: 'ArrowLeft' },
    },
    allowCustomize: false,
  },
  {
    id: 'moveRight',
    label: '向右移动',
    category: 'navigation',
    bindings: {
      mac: { key: 'ArrowRight' },
      windows: { key: 'ArrowRight' },
      linux: { key: 'ArrowRight' },
      mobile: { key: 'ArrowRight' },
    },
    allowCustomize: false,
  },
  {
    id: 'showShortcuts',
    label: '查看快捷键',
    category: 'other',
    bindings: {
      mac: { key: '/' },
      windows: { key: '/' },
      linux: { key: '/' },
      mobile: { key: '/' },
    },
    allowCustomize: false,
  },
  {
    id: 'mineFlag',
    label: '标记/取消旗帜',
    category: 'minesweeper',
    bindings: {
      mac: { key: 'f' },
      windows: { key: 'f' },
      linux: { key: 'f' },
      mobile: { key: 'f' },
    },
    allowCustomize: true,
  },
  {
    id: 'mineReveal',
    label: '揭开格子',
    category: 'minesweeper',
    bindings: {
      mac: { key: ' ' },
      windows: { key: ' ' },
      linux: { key: ' ' },
      mobile: { key: ' ' },
    },
    allowCustomize: true,
  },
  {
    id: 'mineChord',
    label: '双击揭开 (Chord)',
    category: 'minesweeper',
    bindings: {
      mac: { key: 'Enter' },
      windows: { key: 'Enter' },
      linux: { key: 'Enter' },
      mobile: { key: 'Enter' },
    },
    allowCustomize: true,
  },
  {
    id: 'mineToggleFlagMode',
    label: '切换标旗模式',
    category: 'minesweeper',
    bindings: {
      mac: { key: 'n' },
      windows: { key: 'n' },
      linux: { key: 'n' },
      mobile: { key: 'n' },
    },
    allowCustomize: true,
  },
  {
    id: 'mineNewGame',
    label: '新游戏 (F2)',
    category: 'minesweeper',
    bindings: {
      mac: { key: 'F2' },
      windows: { key: 'F2' },
      linux: { key: 'F2' },
      mobile: { key: 'F2' },
    },
    allowCustomize: false,
  },
  {
    id: 'mineHint',
    label: '扫雷提示',
    category: 'minesweeper',
    bindings: {
      mac: { key: 'h' },
      windows: { key: 'h' },
      linux: { key: 'h' },
      mobile: { key: 'h' },
    },
    allowCustomize: true,
  },
  {
    id: 'minePause',
    label: '扫雷暂停/继续',
    category: 'minesweeper',
    bindings: {
      mac: { key: 'p' },
      windows: { key: 'p' },
      linux: { key: 'p' },
      mobile: { key: 'p' },
    },
    allowCustomize: false,
  },
];

export const BROWSER_SHORTCUTS: KeyBinding[] = [
  { key: 't', ctrlKey: true },
  { key: 'w', ctrlKey: true },
  { key: 'n', ctrlKey: true },
  { key: 'l', ctrlKey: true },
  { key: 'r', ctrlKey: true },
  { key: 't', metaKey: true },
  { key: 'w', metaKey: true },
  { key: 'n', metaKey: true },
  { key: 'l', metaKey: true },
  { key: 'r', metaKey: true },
  { key: 'q', metaKey: true },
  { key: 'a', metaKey: true },
  { key: 'F5' },
  { key: 'F11' },
  { key: 'F12' },
];

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'linux';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return 'mobile';
  if (/Mac|iPhone|iPad/i.test(ua)) return 'mac';
  if (/Win/i.test(ua)) return 'windows';
  return 'linux';
}

export function keyBindingToString(binding: KeyBinding, platform: Platform): string {
  const parts: string[] = [];
  const isMac = platform === 'mac';

  if (binding.ctrlKey) parts.push(isMac ? '⌃' : 'Ctrl');
  if (binding.altKey) parts.push(isMac ? '⌥' : 'Alt');
  if (binding.shiftKey) parts.push(isMac ? '⇧' : 'Shift');
  if (binding.metaKey) parts.push(isMac ? '⌘' : 'Meta');

  const keyDisplay = getKeyDisplay(binding.key, platform);
  parts.push(keyDisplay);

  return parts.join(isMac ? '' : '+');
}

export function getKeyDisplay(key: string, platform: Platform): string {
  const isMac = platform === 'mac';
  const keyMap: Record<string, string> = {
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
    Backspace: isMac ? '⌫' : 'Backspace',
    Delete: isMac ? '⌦' : 'Delete',
    Escape: isMac ? '⎋' : 'Esc',
    Enter: isMac ? '↵' : 'Enter',
    Tab: isMac ? '⇥' : 'Tab',
    ' ': isMac ? '␣' : 'Space',
  };
  return keyMap[key] || key.toUpperCase();
}

export function isKeyBindingMatch(binding: KeyBinding, event: KeyboardEvent, platform: Platform): boolean {
  const isMac = platform === 'mac';
  const modifierKey = isMac ? 'metaKey' : 'ctrlKey';

  const bindingModifier = !!(binding.metaKey || binding.ctrlKey);
  const eventModifier = !!event[modifierKey];

  if (bindingModifier !== eventModifier) return false;
  if (!!binding.shiftKey !== !!event.shiftKey) return false;
  if (!!binding.altKey !== !!event.altKey) return false;

  return event.key.toLowerCase() === binding.key.toLowerCase();
}

export function isBrowserShortcut(binding: KeyBinding): boolean {
  return BROWSER_SHORTCUTS.some((bs) => {
    const ctrlMatch = binding.ctrlKey === bs.ctrlKey && binding.metaKey === bs.metaKey;
    const shiftMatch = binding.shiftKey === bs.shiftKey;
    const altMatch = binding.altKey === bs.altKey;
    const keyMatch = binding.key.toLowerCase() === bs.key.toLowerCase();
    return ctrlMatch && shiftMatch && altMatch && keyMatch;
  });
}

export function findConflicts(
  actionId: ShortcutAction,
  binding: KeyBinding,
  platform: Platform,
  allBindings: Record<ShortcutAction, KeyBinding>,
): ShortcutAction[] {
  const conflicts: ShortcutAction[] = [];
  for (const [id, existing] of Object.entries(allBindings)) {
    if (id === actionId) continue;
    if (isKeyBindingEqual(binding, existing, platform)) {
      conflicts.push(id as ShortcutAction);
    }
  }
  return conflicts;
}

export function isKeyBindingEqual(a: KeyBinding, b: KeyBinding, _platform: Platform): boolean {
  const normalize = (k: KeyBinding) => ({
    key: k.key.toLowerCase(),
    hasModifier: !!(k.ctrlKey || k.metaKey),
    shiftKey: !!k.shiftKey,
    altKey: !!k.altKey,
  });
  const na = normalize(a);
  const nb = normalize(b);
  return na.key === nb.key && na.hasModifier === nb.hasModifier && na.shiftKey === nb.shiftKey && na.altKey === nb.altKey;
}

export function getDefaultBindings(platform: Platform): Record<ShortcutAction, KeyBinding> {
  const result = {} as Record<ShortcutAction, KeyBinding>;
  for (const def of SHORTCUT_DEFINITIONS) {
    result[def.id] = { ...def.bindings[platform] };
  }
  return result;
}
