import type { Session, Settings } from '@/types';

const SESSIONS_KEY = 'temp.sessions.v1';
const SETTINGS_KEY = 'temp.settings.v1';

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function addSession(session: Session): Session[] {
  const next = [session, ...loadSessions()];
  saveSessions(next);
  return next;
}

export function clearSessions(): void {
  localStorage.removeItem(SESSIONS_KEY);
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { sound: true, vibration: true };
    return { sound: true, vibration: true, ...JSON.parse(raw) };
  } catch {
    return { sound: true, vibration: true };
  }
}

export function saveSettings(s: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export const fmtTime = (sec: number): string => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const fmtDate = (ts: number): string =>
  new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

export const fmtDuration = (sec: number): string => {
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} мин`;
  const h = Math.floor(m / 60);
  return `${h} ч ${m % 60} мин`;
};

/** Текущая серия дней с тренировками подряд */
export function streakDays(sessions: Session[]): number {
  const days = new Set(
    sessions.map((s) => new Date(s.finishedAt).toDateString()),
  );
  let streak = 0;
  const cursor = new Date();
  // если сегодня ещё не тренировались — начинаем со вчерашнего дня
  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Сессии за последние 7 дней по датам (для графика) */
export function lastWeek(sessions: Session[]): { label: string; volume: number; count: number }[] {
  const out: { label: string; volume: number; count: number }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const day = sessions.filter(
      (s) => new Date(s.finishedAt).toDateString() === key,
    );
    out.push({
      label: d.toLocaleDateString('ru-RU', { weekday: 'short' }),
      volume: day.reduce((sum, s) => sum + s.totalVolume, 0),
      count: day.length,
    });
  }
  return out;
}
