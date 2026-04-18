import { useMinesweeperStore } from '../stores/minesweeperStore';
import { useShortcutStore } from '../stores/shortcutStore';
import { SHORTCUT_DEFINITIONS, keyBindingToString, SHORTCUT_CATEGORIES } from '@shudu/shared';
import type { ShortcutCategory } from '@shudu/shared';

const MINE_CATEGORIES: ShortcutCategory[] = ['minesweeper', 'navigation', 'other'];

export function MineShortcutHelp() {
  const platform = useShortcutStore((s) => s.platform);
  const getBinding = useShortcutStore((s) => s.getBinding);
  const toggleFlagMode = useMinesweeperStore((s) => s.toggleFlagMode);
  const flagMode = useMinesweeperStore((s) => s.flagMode);

  const mineShortcuts = SHORTCUT_DEFINITIONS.filter((d) =>
    MINE_CATEGORIES.includes(d.category),
  );

  const grouped = MINE_CATEGORIES.map((cat) => ({
    category: cat,
    label: SHORTCUT_CATEGORIES[cat],
    shortcuts: mineShortcuts.filter((s) => s.category === cat),
  })).filter((g) => g.shortcuts.length > 0);

  return (
    <div className="mine-shortcut-help">
      {grouped.map((group) => (
        <div key={group.category} className="mine-shortcut-help__group">
          <span className="mine-shortcut-help__group-title">{group.label}</span>
          <div className="mine-shortcut-help__list">
            {group.shortcuts.map((shortcut) => (
              <div key={shortcut.id} className="mine-shortcut-help__item">
                <span className="mine-shortcut-help__label">{shortcut.label}</span>
                <span className="mine-shortcut-help__key">
                  {keyBindingToString(getBinding(shortcut.id), platform)}
                </span>
              </div>
            ))}
            {group.category === 'minesweeper' && (
              <div className="mine-shortcut-help__item">
                <span className="mine-shortcut-help__label">标旗模式</span>
                <span className={`mine-shortcut-help__mode ${flagMode ? 'mine-shortcut-help__mode--active' : ''}`}>
                  {flagMode ? '🚩 已开启' : '👆 已关闭'}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
      <button className="mine-shortcut-help__toggle" onClick={toggleFlagMode}>
        {flagMode ? '👆 切换到揭开模式' : '🚩 切换到标旗模式'}
      </button>
    </div>
  );
}
