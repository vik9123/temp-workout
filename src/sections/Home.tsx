import { ArrowRight, CalendarDays, Clock3, Flame, Info, Repeat, TrendingUp, Zap } from 'lucide-react';
import { PROGRAM_RULES, WEEKLY_VOLUME, WORKOUTS, plannedSets } from '@/data/library';
import { fmtDuration, streakDays } from '@/lib/store';
import type { Session, WorkoutLevel } from '@/types';

const LEVEL_STYLE: Record<WorkoutLevel, string> = {
  Новичок: 'text-emerald-300 border-emerald-300/30',
  Средний: 'text-amber-300 border-amber-300/30',
  Продвинутый: 'text-red-300 border-red-300/30',
};

const MODE_LABEL = {
  superset: { text: 'Суперсеты', icon: Zap },
  circuit: { text: 'Круговая', icon: Repeat },
  straight: { text: 'Односторонняя', icon: Repeat },
} as const;

export default function Home({
  sessions,
  onOpen,
}: {
  sessions: Session[];
  onOpen: (workoutId: string) => void;
}) {
  const today = new Date().getDay();

  const streak = streakDays(sessions);
  const weekCount = sessions.filter(
    (s) => Date.now() - s.finishedAt < 7 * 24 * 3600 * 1000,
  ).length;
  const totalTime = sessions.reduce((sum, s) => sum + (s.finishedAt - s.startedAt) / 1000, 0);

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-32 pt-6 md:max-w-2xl lg:max-w-4xl">
      <header className="mb-6">
        <p className="font-display text-sm font-medium text-[var(--brand)]">
          Темп · сезон 2026/27
        </p>
        <h1 className="font-display mt-1 text-4xl font-semibold leading-[1.05]">
          Фулбоди · 3 дня в неделю
        </h1>
      </header>

      <div className="mb-7 grid grid-cols-3 gap-2.5">
        <div className="card-surface px-3 py-3.5">
          <Flame size={18} className="mb-1.5 text-[var(--brand)]" />
          <p className="font-display tnum text-2xl font-semibold leading-none">{streak}</p>
          <p className="mt-1 text-xs text-[var(--sub)]">дней подряд</p>
        </div>
        <div className="card-surface px-3 py-3.5">
          <Zap size={18} className="mb-1.5 text-[var(--indigo)]" />
          <p className="font-display tnum text-2xl font-semibold leading-none">{weekCount}</p>
          <p className="mt-1 text-xs text-[var(--sub)]">за неделю</p>
        </div>
        <div className="card-surface px-3 py-3.5">
          <Clock3 size={18} className="mb-1.5 text-emerald-300" />
          <p className="font-display tnum text-2xl font-semibold leading-none">
            {Math.round(totalTime / 3600)}
          </p>
          <p className="mt-1 text-xs text-[var(--sub)]">часов всего</p>
        </div>
      </div>

      <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--sub)]">
        <CalendarDays size={15} className="text-[var(--brand)]" />
        Твоя неделя
      </p>

      <div className="grid gap-3">
        {WORKOUTS.map((w) => {
          const isToday = w.weekday === today;
          const ModeIcon = MODE_LABEL[w.mode].icon;
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => onOpen(w.id)}
              className={`card-surface group cursor-pointer p-5 text-left transition-all duration-200 hover:border-white/25 hover:bg-white/[0.06] active:scale-[0.98] ${
                isToday ? 'border-[var(--brand)]/60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <span
                  className={`font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold ${
                    isToday
                      ? 'bg-[var(--brand)] text-[var(--brand-ink)]'
                      : 'bg-white/[0.07] text-white'
                  }`}
                >
                  {w.day}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display truncate text-xl font-semibold leading-tight">
                      {w.title}
                    </h2>
                    {isToday && (
                      <span className="shrink-0 rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--brand-ink)]">
                        Сегодня
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-snug text-[var(--sub)]">{w.goal}</p>
                  <div className="tnum mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[var(--sub)]">
                    <span>{w.minutes} мин</span>
                    <span>{plannedSets(w)} подходов</span>
                    <span>{w.exercises.length} упр.</span>
                    <span className="flex items-center gap-1 text-[var(--brand)]">
                      <ModeIcon size={12} />
                      {MODE_LABEL[w.mode].text}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${LEVEL_STYLE[w.level]}`}>
                      {w.level}
                    </span>
                  </div>
                </div>
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-[var(--brand-ink)] transition-transform duration-200 group-hover:translate-x-0.5">
                  <ArrowRight size={17} strokeWidth={2.5} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* недельный объём */}
      <div className="card-surface mt-6 p-4">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--sub)]">
          <TrendingUp size={13} className="text-[var(--brand)]" />
          Недельный объём · 66 подходов
        </p>
        <div className="flex flex-wrap gap-1.5">
          {WEEKLY_VOLUME.map(([muscle, sets]) => (
            <span
              key={muscle}
              className="tnum rounded-full border border-[var(--line)] px-2.5 py-1 text-[11px] text-[var(--sub)]"
            >
              {muscle} <span className="font-semibold text-white">{sets}</span>
            </span>
          ))}
        </div>
      </div>

      {/* правила программы */}
      <div className="card-surface mt-3 p-4">
        <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--sub)]">
          <Info size={13} className="text-[var(--indigo)]" />
          Вход и прогрессия
        </p>
        <ul className="space-y-1.5">
          {PROGRAM_RULES.map((line) => (
            <li key={line} className="flex gap-2 text-sm leading-snug text-[var(--sub)]">
              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--indigo)]" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      {sessions.length > 0 && (
        <p className="mt-6 text-center text-xs text-[var(--sub)]">
          Последняя тренировка: {sessions[0].workoutTitle} ·{' '}
          {fmtDuration((sessions[0].finishedAt - sessions[0].startedAt) / 1000)}
        </p>
      )}
    </div>
  );
}
