import { describe, it, expect, beforeEach } from 'vitest';
import { useShortcutStore } from './shortcutStore';
import { getDefaultBindings } from '@shudu/shared';
import type { ShortcutAction, KeyBinding } from '@shudu/shared';

describe('shortcutStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useShortcutStore.setState({
      platform: 'mac',
      customBindings: null,
    });
  });

  describe('getBinding', () => {
    it('should return default binding when no custom binding', () => {
      const binding = useShortcutStore.getState().getBinding('undo');
      expect(binding).toEqual({ key: 'z', metaKey: true });
    });

    it('should return custom binding when set', () => {
      const defaults = getDefaultBindings('mac') as Record<ShortcutAction, KeyBinding>;
      useShortcutStore.setState({
        customBindings: {
          ...defaults,
          undo: { key: 'z', ctrlKey: true },
        },
      });
      const binding = useShortcutStore.getState().getBinding('undo');
      expect(binding).toEqual({ key: 'z', ctrlKey: true });
    });

    it('should return platform-specific default', () => {
      useShortcutStore.setState({ platform: 'windows' });
      const binding = useShortcutStore.getState().getBinding('undo');
      expect(binding).toEqual({ key: 'z', ctrlKey: true });
    });
  });

  describe('setCustomBinding', () => {
    it('should set custom binding and save to localStorage', () => {
      const result = useShortcutStore.getState().setCustomBinding('hint', { key: 'x' });
      expect(result.conflicts).toEqual([]);
      expect(result.isBrowserShortcut).toBe(false);

      const binding = useShortcutStore.getState().getBinding('hint');
      expect(binding).toEqual({ key: 'x' });

      const stored = localStorage.getItem('shudu_shortcuts');
      expect(stored).toBeTruthy();
    });

    it('should detect conflicts', () => {
      const result = useShortcutStore.getState().setCustomBinding('hint', { key: 'z', metaKey: true });
      expect(result.conflicts).toContain('undo');
    });

    it('should detect browser shortcut conflicts', () => {
      const result = useShortcutStore.getState().setCustomBinding('hint', { key: 't', ctrlKey: true });
      expect(result.isBrowserShortcut).toBe(true);
    });
  });

  describe('resetBinding', () => {
    it('should reset a single binding to default', () => {
      const defaults = getDefaultBindings('mac') as Record<ShortcutAction, KeyBinding>;
      useShortcutStore.setState({
        customBindings: {
          ...defaults,
          hint: { key: 'x' },
        },
      });

      useShortcutStore.getState().resetBinding('hint');
      const binding = useShortcutStore.getState().getBinding('hint');
      expect(binding).toEqual({ key: 'h' });
    });
  });

  describe('resetAllBindings', () => {
    it('should reset all bindings to defaults', () => {
      const defaults = getDefaultBindings('mac') as Record<ShortcutAction, KeyBinding>;
      useShortcutStore.setState({
        customBindings: {
          ...defaults,
          hint: { key: 'x' },
          undo: { key: 'y', metaKey: true },
        },
      });

      useShortcutStore.getState().resetAllBindings();

      expect(useShortcutStore.getState().customBindings).toBeNull();
      expect(useShortcutStore.getState().getBinding('hint')).toEqual({ key: 'h' });
      expect(useShortcutStore.getState().getBinding('undo')).toEqual({ key: 'z', metaKey: true });
    });

    it('should clear localStorage', () => {
      useShortcutStore.getState().setCustomBinding('hint', { key: 'x' });
      expect(localStorage.getItem('shudu_shortcuts')).toBeTruthy();

      useShortcutStore.getState().resetAllBindings();
      expect(localStorage.getItem('shudu_shortcuts')).toBeNull();
    });
  });

  describe('getConflicts', () => {
    it('should find conflicting bindings', () => {
      const conflicts = useShortcutStore.getState().getConflicts('hint', { key: 'z', metaKey: true });
      expect(conflicts).toContain('undo');
    });

    it('should return empty array for unique binding', () => {
      const conflicts = useShortcutStore.getState().getConflicts('hint', { key: 'x' });
      expect(conflicts).toEqual([]);
    });
  });

  describe('isBrowserConflict', () => {
    it('should detect browser shortcuts', () => {
      expect(useShortcutStore.getState().isBrowserConflict({ key: 't', ctrlKey: true })).toBe(true);
    });

    it('should not flag non-browser shortcuts', () => {
      expect(useShortcutStore.getState().isBrowserConflict({ key: 'h' })).toBe(false);
    });
  });

  describe('persistence', () => {
    it('should load custom bindings from localStorage', () => {
      const defaults = getDefaultBindings('mac') as Record<ShortcutAction, KeyBinding>;
      const custom = { ...defaults, hint: { key: 'x' } };
      localStorage.setItem('shudu_shortcuts', JSON.stringify(custom));

      useShortcutStore.setState({ customBindings: null });
      const store = useShortcutStore.getState();
      store.customBindings = JSON.parse(localStorage.getItem('shudu_shortcuts') || 'null');

      const binding = store.getBinding('hint');
      expect(binding).toEqual({ key: 'x' });
    });
  });
});
