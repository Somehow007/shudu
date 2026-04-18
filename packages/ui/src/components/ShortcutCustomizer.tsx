import { useState, useEffect, useCallback, useRef } from 'react';
import { useShortcutStore } from '../stores/shortcutStore';
import {
  SHORTCUT_DEFINITIONS,
  SHORTCUT_CATEGORIES,
  keyBindingToString,
  type ShortcutAction,
  type KeyBinding,
  type ShortcutCategory,
} from '@shudu/shared';

export function ShortcutCustomizer() {
  const platform = useShortcutStore((s) => s.platform);
  const getBinding = useShortcutStore((s) => s.getBinding);
  const setCustomBinding = useShortcutStore((s) => s.setCustomBinding);
  const resetBinding = useShortcutStore((s) => s.resetBinding);
  const resetAllBindings = useShortcutStore((s) => s.resetAllBindings);
  const getConflicts = useShortcutStore((s) => s.getConflicts);
  const isBrowserConflict = useShortcutStore((s) => s.isBrowserConflict);

  const [recordingAction, setRecordingAction] = useState<ShortcutAction | null>(null);
  const [tempBinding, setTempBinding] = useState<KeyBinding | null>(null);
  const [conflictInfo, setConflictInfo] = useState<{ conflicts: ShortcutAction[]; isBrowserShortcut: boolean } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const recordRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (recordingAction && recordRef.current) {
      recordRef.current.focus();
    }
  }, [recordingAction]);

  const handleRecordKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!recordingAction) return;
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        setRecordingAction(null);
        setTempBinding(null);
        setConflictInfo(null);
        return;
      }

      if (e.key === 'Enter' && tempBinding) {
        const result = setCustomBinding(recordingAction, tempBinding);
        setConflictInfo(result);
        setTimeout(() => {
          setRecordingAction(null);
          setTempBinding(null);
          setConflictInfo(null);
        }, 1500);
        return;
      }

      if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) return;

      const newBinding: KeyBinding = {
        key: e.key,
        ctrlKey: e.ctrlKey || false,
        metaKey: e.metaKey || false,
        shiftKey: e.shiftKey || false,
        altKey: e.altKey || false,
      };

      setTempBinding(newBinding);
      const conflicts = getConflicts(recordingAction, newBinding);
      const isBrowserShortcut = isBrowserConflict(newBinding);
      setConflictInfo({ conflicts, isBrowserShortcut });
    },
    [recordingAction, tempBinding, setCustomBinding, getConflicts, isBrowserConflict],
  );

  const handleStartRecord = (action: ShortcutAction) => {
    setRecordingAction(action);
    setTempBinding(null);
    setConflictInfo(null);
  };

  const handleCancelRecord = () => {
    setRecordingAction(null);
    setTempBinding(null);
    setConflictInfo(null);
  };

  const handleResetOne = (action: ShortcutAction) => {
    resetBinding(action);
  };

  const handleResetAll = () => {
    resetAllBindings();
    setShowResetConfirm(false);
  };

  const categories = Object.keys(SHORTCUT_CATEGORIES) as ShortcutCategory[];
  const customizableShortcuts = SHORTCUT_DEFINITIONS.filter((d) => d.allowCustomize);

  return (
    <div className="shortcut-customizer">
      <div className="shortcut-customizer__header">
        <h3 className="shortcut-customizer__title">快捷键设置</h3>
        <button
          className="shortcut-customizer__reset-all"
          onClick={() => setShowResetConfirm(true)}
        >
          恢复默认
        </button>
      </div>

      {showResetConfirm && (
        <div className="shortcut-customizer__confirm">
          <span>确定恢复所有快捷键为默认设置？</span>
          <div className="shortcut-customizer__confirm-actions">
            <button onClick={() => setShowResetConfirm(false)}>取消</button>
            <button className="shortcut-customizer__confirm-danger" onClick={handleResetAll}>确定</button>
          </div>
        </div>
      )}

      {categories.map((category) => {
        const shortcuts = customizableShortcuts.filter((d) => d.category === category);
        if (shortcuts.length === 0) return null;
        return (
          <div key={category} className="shortcut-customizer__group">
            <h4 className="shortcut-customizer__group-title">{SHORTCUT_CATEGORIES[category]}</h4>
            <div className="shortcut-customizer__list">
              {shortcuts.map((def) => {
                const binding = getBinding(def.id);
                const isRecording = recordingAction === def.id;
                return (
                  <div key={def.id} className="shortcut-customizer__item">
                    <span className="shortcut-customizer__item-label">{def.label}</span>
                    <div className="shortcut-customizer__item-right">
                      {isRecording ? (
                        <div className="shortcut-customizer__recording">
                          <button
                            ref={recordRef}
                            className="shortcut-customizer__record-btn shortcut-customizer__record-btn--active"
                            onKeyDown={handleRecordKey}
                            tabIndex={0}
                          >
                            {tempBinding
                              ? keyBindingToString(tempBinding, platform)
                              : '按下快捷键...'}
                          </button>
                          <button
                            className="shortcut-customizer__cancel-btn"
                            onClick={handleCancelRecord}
                          >
                            取消
                          </button>
                          {tempBinding && (
                            <button
                              className="shortcut-customizer__confirm-btn"
                              onClick={() => {
                                if (recordingAction) {
                                  const result = setCustomBinding(recordingAction, tempBinding);
                                  setConflictInfo(result);
                                  setTimeout(() => {
                                    setRecordingAction(null);
                                    setTempBinding(null);
                                    setConflictInfo(null);
                                  }, 1500);
                                }
                              }}
                            >
                              确认
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="shortcut-customizer__binding">
                          <button
                            className="shortcut-customizer__record-btn"
                            onClick={() => handleStartRecord(def.id)}
                          >
                            <kbd>{keyBindingToString(binding, platform)}</kbd>
                          </button>
                          <button
                            className="shortcut-customizer__reset-btn"
                            onClick={() => handleResetOne(def.id)}
                            title="重置为默认"
                          >
                            ↺
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {conflictInfo && (conflictInfo.conflicts.length > 0 || conflictInfo.isBrowserShortcut) && (
        <div className="shortcut-customizer__warning">
          {conflictInfo.isBrowserShortcut && (
            <p className="shortcut-customizer__warning-text">⚠️ 此快捷键与浏览器快捷键冲突，可能无法正常使用</p>
          )}
          {conflictInfo.conflicts.length > 0 && (
            <p className="shortcut-customizer__warning-text">
              ⚠️ 与以下快捷键冲突: {conflictInfo.conflicts.map((c) => SHORTCUT_DEFINITIONS.find((d) => d.id === c)?.label).join('、')}
            </p>
          )}
        </div>
      )}

      <div className="shortcut-customizer__tips">
        <p>💡 点击快捷键按钮可重新绑定，按 <kbd>Esc</kbd> 取消，按 <kbd>Enter</kbd> 确认</p>
        <p>💡 方向键和 <kbd>/</kbd> 快捷键不支持自定义</p>
      </div>
    </div>
  );
}
