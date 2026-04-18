import { describe, it, expect } from 'vitest';
import {
  detectPlatform,
  keyBindingToString,
  getKeyDisplay,
  isKeyBindingMatch,
  isBrowserShortcut,
  findConflicts,
  isKeyBindingEqual,
  getDefaultBindings,
  SHORTCUT_DEFINITIONS,
  SHORTCUT_CATEGORIES,
  BROWSER_SHORTCUTS,
} from './shortcuts';
import type { KeyBinding, Platform, ShortcutAction } from './shortcuts';

describe('shortcuts', () => {
  describe('detectPlatform', () => {
    it('should return mac for Mac user agent', () => {
      const original = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        configurable: true,
      });
      expect(detectPlatform()).toBe('mac');
      Object.defineProperty(navigator, 'userAgent', {
        value: original,
        configurable: true,
      });
    });

    it('should return windows for Windows user agent', () => {
      const original = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        configurable: true,
      });
      expect(detectPlatform()).toBe('windows');
      Object.defineProperty(navigator, 'userAgent', {
        value: original,
        configurable: true,
      });
    });

    it('should return mobile for mobile user agents', () => {
      const original = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        configurable: true,
      });
      expect(detectPlatform()).toBe('mobile');
      Object.defineProperty(navigator, 'userAgent', {
        value: original,
        configurable: true,
      });
    });

    it('should return mobile for Android user agent', () => {
      const original = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 13; Pixel 7)',
        configurable: true,
      });
      expect(detectPlatform()).toBe('mobile');
      Object.defineProperty(navigator, 'userAgent', {
        value: original,
        configurable: true,
      });
    });

    it('should return linux as default', () => {
      const original = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (X11; Linux x86_64)',
        configurable: true,
      });
      expect(detectPlatform()).toBe('linux');
      Object.defineProperty(navigator, 'userAgent', {
        value: original,
        configurable: true,
      });
    });
  });

  describe('keyBindingToString', () => {
    it('should format simple key for mac', () => {
      expect(keyBindingToString({ key: '1' }, 'mac')).toBe('1');
    });

    it('should format simple key for windows', () => {
      expect(keyBindingToString({ key: '1' }, 'windows')).toBe('1');
    });

    it('should format Cmd+Z for mac', () => {
      expect(keyBindingToString({ key: 'z', metaKey: true }, 'mac')).toBe('⌘Z');
    });

    it('should format Ctrl+Z for windows', () => {
      expect(keyBindingToString({ key: 'z', ctrlKey: true }, 'windows')).toBe('Ctrl+Z');
    });

    it('should format Cmd+Shift+Z for mac', () => {
      expect(keyBindingToString({ key: 'z', metaKey: true, shiftKey: true }, 'mac')).toBe('⇧⌘Z');
    });

    it('should format Ctrl+Shift+Z for windows', () => {
      expect(keyBindingToString({ key: 'z', ctrlKey: true, shiftKey: true }, 'windows')).toBe('Ctrl+Shift+Z');
    });

    it('should format arrow keys', () => {
      expect(keyBindingToString({ key: 'ArrowUp' }, 'mac')).toBe('↑');
      expect(keyBindingToString({ key: 'ArrowUp' }, 'windows')).toBe('↑');
    });

    it('should format Backspace differently per platform', () => {
      expect(keyBindingToString({ key: 'Backspace' }, 'mac')).toBe('⌫');
      expect(keyBindingToString({ key: 'Backspace' }, 'windows')).toBe('Backspace');
    });
  });

  describe('getKeyDisplay', () => {
    it('should display arrow keys as arrows', () => {
      expect(getKeyDisplay('ArrowUp', 'mac')).toBe('↑');
      expect(getKeyDisplay('ArrowDown', 'windows')).toBe('↓');
      expect(getKeyDisplay('ArrowLeft', 'linux')).toBe('←');
      expect(getKeyDisplay('ArrowRight', 'mac')).toBe('→');
    });

    it('should display Backspace as ⌫ on mac', () => {
      expect(getKeyDisplay('Backspace', 'mac')).toBe('⌫');
      expect(getKeyDisplay('Backspace', 'windows')).toBe('Backspace');
    });

    it('should display Delete as ⌦ on mac', () => {
      expect(getKeyDisplay('Delete', 'mac')).toBe('⌦');
      expect(getKeyDisplay('Delete', 'windows')).toBe('Delete');
    });

    it('should display Escape as ⎋ on mac', () => {
      expect(getKeyDisplay('Escape', 'mac')).toBe('⎋');
      expect(getKeyDisplay('Escape', 'windows')).toBe('Esc');
    });

    it('should uppercase regular keys', () => {
      expect(getKeyDisplay('a', 'mac')).toBe('A');
      expect(getKeyDisplay('z', 'windows')).toBe('Z');
    });
  });

  describe('isKeyBindingMatch', () => {
    function createMockEvent(overrides: { key: string; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; altKey?: boolean }) {
      return {
        key: overrides.key,
        ctrlKey: overrides.ctrlKey || false,
        metaKey: overrides.metaKey || false,
        shiftKey: overrides.shiftKey || false,
        altKey: overrides.altKey || false,
      } as KeyboardEvent;
    }

    it('should match simple key on mac', () => {
      const binding: KeyBinding = { key: '1' };
      const event = createMockEvent({ key: '1' });
      expect(isKeyBindingMatch(binding, event, 'mac')).toBe(true);
    });

    it('should match Cmd+Z on mac', () => {
      const binding: KeyBinding = { key: 'z', metaKey: true };
      const event = createMockEvent({ key: 'z', metaKey: true });
      expect(isKeyBindingMatch(binding, event, 'mac')).toBe(true);
    });

    it('should not match Cmd+Z on mac when Ctrl is pressed instead', () => {
      const binding: KeyBinding = { key: 'z', metaKey: true };
      const event = createMockEvent({ key: 'z', ctrlKey: true });
      expect(isKeyBindingMatch(binding, event, 'mac')).toBe(false);
    });

    it('should match Ctrl+Z on windows', () => {
      const binding: KeyBinding = { key: 'z', ctrlKey: true };
      const event = createMockEvent({ key: 'z', ctrlKey: true });
      expect(isKeyBindingMatch(binding, event, 'windows')).toBe(true);
    });

    it('should not match Ctrl+Z on windows when Cmd is pressed instead', () => {
      const binding: KeyBinding = { key: 'z', ctrlKey: true };
      const event = createMockEvent({ key: 'z', metaKey: true });
      expect(isKeyBindingMatch(binding, event, 'windows')).toBe(false);
    });

    it('should match Cmd+Shift+Z on mac', () => {
      const binding: KeyBinding = { key: 'z', metaKey: true, shiftKey: true };
      const event = createMockEvent({ key: 'z', metaKey: true, shiftKey: true });
      expect(isKeyBindingMatch(binding, event, 'mac')).toBe(true);
    });

    it('should not match when shift is not pressed', () => {
      const binding: KeyBinding = { key: 'z', metaKey: true, shiftKey: true };
      const event = createMockEvent({ key: 'z', metaKey: true });
      expect(isKeyBindingMatch(binding, event, 'mac')).toBe(false);
    });

    it('should match case-insensitively', () => {
      const binding: KeyBinding = { key: 'N' };
      const event = createMockEvent({ key: 'n' });
      expect(isKeyBindingMatch(binding, event, 'mac')).toBe(true);
    });

    it('should match arrow keys', () => {
      const binding: KeyBinding = { key: 'ArrowUp' };
      const event = createMockEvent({ key: 'ArrowUp' });
      expect(isKeyBindingMatch(binding, event, 'mac')).toBe(true);
    });
  });

  describe('isBrowserShortcut', () => {
    it('should detect Ctrl+T as browser shortcut', () => {
      expect(isBrowserShortcut({ key: 't', ctrlKey: true })).toBe(true);
    });

    it('should detect Cmd+W as browser shortcut', () => {
      expect(isBrowserShortcut({ key: 'w', metaKey: true })).toBe(true);
    });

    it('should detect Cmd+Q as browser shortcut', () => {
      expect(isBrowserShortcut({ key: 'q', metaKey: true })).toBe(true);
    });

    it('should detect F5 as browser shortcut', () => {
      expect(isBrowserShortcut({ key: 'F5' })).toBe(true);
    });

    it('should not flag game shortcuts as browser shortcuts', () => {
      expect(isBrowserShortcut({ key: '1' })).toBe(false);
      expect(isBrowserShortcut({ key: 'z', ctrlKey: true })).toBe(false);
      expect(isBrowserShortcut({ key: 'n' })).toBe(false);
      expect(isBrowserShortcut({ key: 'h' })).toBe(false);
    });
  });

  describe('findConflicts', () => {
    it('should find no conflicts for unique binding', () => {
      const bindings = getDefaultBindings('mac');
      const conflicts = findConflicts('undo', { key: 'x', ctrlKey: true }, 'mac', bindings);
      expect(conflicts).toEqual([]);
    });

    it('should find conflict when binding matches existing', () => {
      const bindings = getDefaultBindings('mac');
      const conflicts = findConflicts('hint', { key: 'z', metaKey: true }, 'mac', bindings);
      expect(conflicts).toContain('undo');
    });

    it('should not conflict with itself', () => {
      const bindings = getDefaultBindings('mac');
      const conflicts = findConflicts('undo', bindings['undo'], 'mac', bindings);
      expect(conflicts).not.toContain('undo');
    });
  });

  describe('isKeyBindingEqual', () => {
    it('should consider same bindings equal', () => {
      const a: KeyBinding = { key: 'z', ctrlKey: true };
      const b: KeyBinding = { key: 'z', ctrlKey: true };
      expect(isKeyBindingEqual(a, b, 'mac')).toBe(true);
    });

    it('should consider different keys not equal', () => {
      const a: KeyBinding = { key: 'z', ctrlKey: true };
      const b: KeyBinding = { key: 'y', ctrlKey: true };
      expect(isKeyBindingEqual(a, b, 'mac')).toBe(false);
    });

    it('should consider different modifiers not equal', () => {
      const a: KeyBinding = { key: 'z', ctrlKey: true };
      const b: KeyBinding = { key: 'z', metaKey: true };
      expect(isKeyBindingEqual(a, b, 'mac')).toBe(true);
    });

    it('should consider case-insensitive keys equal', () => {
      const a: KeyBinding = { key: 'Z', ctrlKey: true };
      const b: KeyBinding = { key: 'z', ctrlKey: true };
      expect(isKeyBindingEqual(a, b, 'mac')).toBe(true);
    });
  });

  describe('getDefaultBindings', () => {
    it('should return bindings for all actions on mac', () => {
      const bindings = getDefaultBindings('mac');
      expect(bindings.undo).toEqual({ key: 'z', metaKey: true });
      expect(bindings.redo).toEqual({ key: 'z', metaKey: true, shiftKey: true });
      expect(bindings.input1).toEqual({ key: '1' });
      expect(bindings.erase).toEqual({ key: 'Backspace' });
      expect(bindings.moveUp).toEqual({ key: 'ArrowUp' });
    });

    it('should return bindings for all actions on windows', () => {
      const bindings = getDefaultBindings('windows');
      expect(bindings.undo).toEqual({ key: 'z', ctrlKey: true });
      expect(bindings.redo).toEqual({ key: 'y', ctrlKey: true });
      expect(bindings.erase).toEqual({ key: 'Delete' });
    });

    it('should return bindings for all actions on linux', () => {
      const bindings = getDefaultBindings('linux');
      expect(bindings.undo).toEqual({ key: 'z', ctrlKey: true });
      expect(bindings.redo).toEqual({ key: 'y', ctrlKey: true });
    });

    it('should have all shortcut actions defined', () => {
      const bindings = getDefaultBindings('mac');
      const allActions: ShortcutAction[] = [
        'input1', 'input2', 'input3', 'input4', 'input5',
        'input6', 'input7', 'input8', 'input9',
        'erase', 'undo', 'redo', 'toggleNote', 'hint',
        'pause', 'moveUp', 'moveDown', 'moveLeft', 'moveRight',
        'showShortcuts',
      ];
      for (const action of allActions) {
        expect(bindings[action]).toBeDefined();
        expect(bindings[action].key).toBeTruthy();
      }
    });
  });

  describe('SHORTCUT_DEFINITIONS', () => {
    it('should have definitions for all 20 actions', () => {
      expect(SHORTCUT_DEFINITIONS).toHaveLength(20);
    });

    it('should have all categories covered', () => {
      const categories = new Set(SHORTCUT_DEFINITIONS.map((d) => d.category));
      expect(categories.has('input')).toBe(true);
      expect(categories.has('navigation')).toBe(true);
      expect(categories.has('game')).toBe(true);
      expect(categories.has('other')).toBe(true);
    });

    it('should have bindings for all platforms', () => {
      for (const def of SHORTCUT_DEFINITIONS) {
        expect(def.bindings.mac).toBeDefined();
        expect(def.bindings.windows).toBeDefined();
        expect(def.bindings.linux).toBeDefined();
        expect(def.bindings.mobile).toBeDefined();
      }
    });

    it('should have unique ids', () => {
      const ids = SHORTCUT_DEFINITIONS.map((d) => d.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('SHORTCUT_CATEGORIES', () => {
    it('should have labels for all categories', () => {
      expect(SHORTCUT_CATEGORIES.input).toBe('输入');
      expect(SHORTCUT_CATEGORIES.navigation).toBe('导航');
      expect(SHORTCUT_CATEGORIES.game).toBe('游戏操作');
      expect(SHORTCUT_CATEGORIES.other).toBe('其他');
    });
  });

  describe('BROWSER_SHORTCUTS', () => {
    it('should contain common browser shortcuts', () => {
      expect(BROWSER_SHORTCUTS.length).toBeGreaterThan(0);
    });

    it('should include Ctrl+T', () => {
      expect(BROWSER_SHORTCUTS.some((s) => s.key === 't' && s.ctrlKey)).toBe(true);
    });

    it('should include Cmd+Q', () => {
      expect(BROWSER_SHORTCUTS.some((s) => s.key === 'q' && s.metaKey)).toBe(true);
    });
  });

  describe('cross-platform consistency', () => {
    it('should have undo use metaKey on mac and ctrlKey on windows', () => {
      const macBindings = getDefaultBindings('mac');
      const winBindings = getDefaultBindings('windows');
      expect(macBindings.undo.metaKey).toBe(true);
      expect(macBindings.undo.ctrlKey).toBeFalsy();
      expect(winBindings.undo.ctrlKey).toBe(true);
      expect(winBindings.undo.metaKey).toBeFalsy();
    });

    it('should have redo use Cmd+Shift+Z on mac and Ctrl+Y on windows', () => {
      const macBindings = getDefaultBindings('mac');
      const winBindings = getDefaultBindings('windows');
      expect(macBindings.redo.metaKey).toBe(true);
      expect(macBindings.redo.shiftKey).toBe(true);
      expect(winBindings.redo.ctrlKey).toBe(true);
      expect(winBindings.redo.key).toBe('y');
    });

    it('should have erase use Backspace on mac and Delete on windows', () => {
      const macBindings = getDefaultBindings('mac');
      const winBindings = getDefaultBindings('windows');
      expect(macBindings.erase.key).toBe('Backspace');
      expect(winBindings.erase.key).toBe('Delete');
    });

    it('should have same navigation keys across all platforms', () => {
      const platforms: Platform[] = ['mac', 'windows', 'linux', 'mobile'];
      for (const platform of platforms) {
        const bindings = getDefaultBindings(platform);
        expect(bindings.moveUp.key).toBe('ArrowUp');
        expect(bindings.moveDown.key).toBe('ArrowDown');
        expect(bindings.moveLeft.key).toBe('ArrowLeft');
        expect(bindings.moveRight.key).toBe('ArrowRight');
      }
    });

    it('should have same input keys across all platforms', () => {
      const platforms: Platform[] = ['mac', 'windows', 'linux', 'mobile'];
      for (const platform of platforms) {
        const bindings = getDefaultBindings(platform);
        for (let i = 1; i <= 9; i++) {
          const action = `input${i}` as ShortcutAction;
          expect(bindings[action].key).toBe(String(i));
        }
      }
    });
  });
});
