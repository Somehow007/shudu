import { useEffect, useRef } from 'react';
import { useShortcutStore } from '../stores/shortcutStore';
import {
  SHORTCUT_DEFINITIONS,
  SHORTCUT_CATEGORIES,
  keyBindingToString,
  type ShortcutCategory,
} from '@shudu/shared';

interface ShortcutHelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutHelpPanel({ isOpen, onClose }: ShortcutHelpPanelProps) {
  const platform = useShortcutStore((s) => s.platform);
  const getBinding = useShortcutStore((s) => s.getBinding);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = Object.keys(SHORTCUT_CATEGORIES) as ShortcutCategory[];

  const platformLabel = platform === 'mac' ? 'macOS' : platform === 'windows' ? 'Windows' : platform === 'linux' ? 'Linux' : '移动端';

  return (
    <div className="shortcut-overlay" onClick={onClose}>
      <div
        className="shortcut-panel"
        onClick={(e) => e.stopPropagation()}
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="shortcut-panel__header">
          <h2 className="shortcut-panel__title">⌨️ 键盘快捷键</h2>
          <div className="shortcut-panel__meta">
            <span className="shortcut-panel__platform">{platformLabel}</span>
            <button className="shortcut-panel__close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="shortcut-panel__body">
          {categories.map((category) => {
            const shortcuts = SHORTCUT_DEFINITIONS.filter((d) => d.category === category);
            if (shortcuts.length === 0) return null;
            return (
              <div key={category} className="shortcut-group">
                <h3 className="shortcut-group__title">{SHORTCUT_CATEGORIES[category]}</h3>
                <div className="shortcut-group__list">
                  {shortcuts.map((def) => {
                    const binding = getBinding(def.id);
                    return (
                      <div key={def.id} className="shortcut-item">
                        <span className="shortcut-item__label">{def.label}</span>
                        <kbd className="shortcut-item__key">
                          {keyBindingToString(binding, platform)}
                        </kbd>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="shortcut-panel__footer">
          <span className="shortcut-panel__hint">按 <kbd>Esc</kbd> 或 <kbd>/</kbd> 关闭</span>
          <span className="shortcut-panel__customize-hint">在 设置 → 快捷键 中自定义快捷键</span>
        </div>
      </div>
    </div>
  );
}
