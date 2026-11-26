import { CalendarCheck2, Repeat2, Timer, Weight } from 'lucide-react';
import { fmtDate, fmtDuration, fmtTime, lastWeek } from '@/lib/store';
import type { Session } from '@/types';

export default function Progress({ sessions }: { sessions: Session[] }) {
  const week = lastWeek(sessions);
  const hasVolume = week.some((d) => d.volume > 0);
  const series = week.map((d) => (hasVolume ? d.volume : d.count));
  const maxVal = Math.max(...series, 1);
  const totalTime = sessions.reduce((n, s) => n + (s.finishedAt - s.startedAt) / 1000, 0);
  const totalReps = sessions.reduce((n, s) => n + s.totalReps, 0);
  const totalVol = sessions.reduce((n, s) => n + s.totalVolume, 0);

  if (sessions.length === 0) {
    return (
      <div className="mx-auto flex min-h-100dvh w-full max-w-md flex-col items-center justify-center px-8 pb-24 text-center">
        <div className="card-surface mb-6 flex h-24 w-24 items-center justify-center !rounded-full">
          <CalendarCheck2 size={40} className="text-[var(--brand)]" />
        </div>
        <h1 className="font-display text-3xl font-semibold">Здесь будет ваш прогресс</h1>
        <p className="mt-3 max-w-xs text-[var(--sub)]">
          Завершите первую тренировку — и мы покажем статистику, график недели и историю занятий.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-32 pt-6 md:max-w-2xl">
      <h1 className="font-display mb-6 text-4xl font-semibold">Прогресс</h1>

      <div className="mb-6 grid grid-cols-2 gap-2.5">
        <div className="card-surface p-4">
          <div className="flex items-center gap-2 text-[var(--sub)]"><Timer size={15} /><span className="text-xs">Всего времени</span></div>
          <p className="font-display tnum mt-2 text-2xl font-semibold">{fmtDuration(totalTime)}</p>
        </div>
        <div className="card-surface p-4">
          <div className="flex items-center gap-2 text-[var(--sub)]"><Repeat2 size={15} /><span className="text-xs">Повторений</span></div>
          <p className="font-display tnum mt-2 text-2xl font-semibold">{totalReps.toLocaleString('ru-RU')}</p>
        </div>
        <div className="card-surface p-4">
          <div className="flex items-center gap-2 text-[var(--sub)]"><Weight size={15} /><span className="text-xs">Поднятый вес</span></div>
          <p className="font-display tnum mt-2 text-2xl font-semibold">{totalVol.toLocaleString('ru-RU')} кг</p>
        </div>
        <div className="card-surface p-4">
          <div className="flex items-center gap-2 text-[var(--sub)]"><CalendarCheck2 size={15} /><span className="text-xs">Тренировок</span></div>
          <p className="font-display tnum mt-2 text-2xl font-semibold">{sessions.length}</p>
        </div>
      </div>

      <div className="card-surface mb-6 p-5">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--sub)]">
          {hasVolume ? 'Объём за неделю, кг' : 'Тренировки за неделю'}
        </p>
        <div className="flex h-36 items-end justify-between gap-2">
          {week.map((d, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-28 w-full items-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-300 ${series[i] > 0 ? 'bg-[var(--brand)]' : 'bg-white/10'}`}
                  style={{ height: `${series[i] > 0 ? Math.max(8, (series[i] / maxVal) * 100) : 4}%` }}
                  title={hasVolume ? `${d.volume} кг` : `${d.count} трен.`}
                />
              </div>
              <span className="text-[11px] uppercase text-[var(--sub)]">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--sub)]">
        История
      </p>
      <ul className="space-y-2.5">
        {sessions.slice(0, 20).map((s) => (
          <li key={s.id} className="card-surface flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-semibold">{s.workoutTitle}</p>
              <p className="mt-0.5 text-xs text-[var(--sub)]">
                {fmtDate(s.finishedAt)} · {fmtTime(Math.round((s.finishedAt - s.startedAt) / 1000))}
              </p>
            </div>
            <div className="tnum shrink-0 text-right text-sm">
              <p className="font-semibold">{s.totalSets} подходов</p>
              <p className="mt-0.5 text-xs text-[var(--sub)]">{s.totalVolume} кг</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
