import { useState, useEffect, useCallback } from 'react';
import { useAchievementStore } from '../stores/achievementStore';
import type { AchievementCategory } from '../stores/achievementStore';

export function AchievementPanel({ category }: { category?: AchievementCategory }) {
  const achievements = useAchievementStore((s) => s.achievements);
  const unlocked = useAchievementStore((s) => s.unlocked);
  const isUnlocked = useAchievementStore((s) => s.isUnlocked);
  const getUnlockedCount = useAchievementStore((s) => s.getUnlockedCount);
  const getTotalCount = useAchievementStore((s) => s.getTotalCount);

  const filtered = category
    ? achievements.filter((a) => a.category === category)
    : achievements;

  const unlockedCount = getUnlockedCount(category);
  const totalCount = getTotalCount(category);
  const progress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const unlockedMap = new Map(unlocked.map((u) => [u.id, u.unlockedAt]));

  return (
    <div className="achievement-panel">
      <div className="achievement-panel__progress">
        <div className="achievement-panel__progress-bar">
          <div
            className="achievement-panel__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="achievement-panel__progress-text">
          {unlockedCount}/{totalCount} ({progress}%)
        </span>
      </div>
      <div className="achievement-panel__list">
        {filtered.map((achievement) => {
          const done = isUnlocked(achievement.id);
          const unlockedAt = unlockedMap.get(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`achievement-card ${done ? 'achievement-card--unlocked' : 'achievement-card--locked'}`}
            >
              <span className="achievement-card__icon">
                {achievement.hidden && !done ? '🔒' : achievement.icon}
              </span>
              <div className="achievement-card__info">
                <span className="achievement-card__name">
                  {achievement.hidden && !done ? '隐藏成就' : achievement.name}
                </span>
                <span className="achievement-card__desc">
                  {achievement.hidden && !done ? '继续游戏来解锁' : achievement.description}
                </span>
                {done && unlockedAt && (
                  <span className="achievement-card__date">
                    {new Date(unlockedAt).toLocaleDateString('zh-CN')}
                  </span>
                )}
              </div>
              {done && <span className="achievement-card__check">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ACHIEVEMENT_NOTIFICATION_DURATION = 4000;

interface NotificationItem {
  id: string;
  icon: string;
  name: string;
  fading: boolean;
}

export function AchievementUnlockNotification() {
  const recentlyUnlocked = useAchievementStore((s) => s.recentlyUnlocked);
  const achievements = useAchievementStore((s) => s.achievements);
  const clearRecentlyUnlocked = useAchievementStore((s) => s.clearRecentlyUnlocked);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    if (!recentlyUnlocked) return;
    const achievement = achievements.find((a) => a.id === recentlyUnlocked);
    if (!achievement) return;

    const notifId = recentlyUnlocked + '-' + Date.now();
    setNotifications((prev) => [
      ...prev,
      { id: notifId, icon: achievement.icon, name: achievement.name, fading: false },
    ]);
    clearRecentlyUnlocked();

    const fadeTimer = setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, fading: true } : n)),
      );
    }, ACHIEVEMENT_NOTIFICATION_DURATION - 500);

    const removeTimer = setTimeout(() => {
      removeNotification(notifId);
    }, ACHIEVEMENT_NOTIFICATION_DURATION);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [recentlyUnlocked, achievements, clearRecentlyUnlocked, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="achievement-notification-container">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`achievement-notification ${notif.fading ? 'achievement-notification--fading' : ''}`}
          onClick={() => removeNotification(notif.id)}
        >
          <span className="achievement-notification__icon">{notif.icon}</span>
          <div className="achievement-notification__info">
            <span className="achievement-notification__title">🎉 成就解锁!</span>
            <span className="achievement-notification__name">{notif.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
