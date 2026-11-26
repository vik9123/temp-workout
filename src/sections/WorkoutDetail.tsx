import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, Flame, Info, Play, Repeat, Zap } from 'lucide-react';
import ExerciseSheet from '@/components/ExerciseSheet';
import { exerciseById, hasDemo, plannedSets, workoutById } from '@/data/library';
import type { Workout, WorkoutExercise } from '@/types';

const fmtReps = (we: WorkoutExercise) =>
  `${we.sets} × ${we.reps}${we.repsMax && we.repsMax !== we.reps ? `–${we.repsMax}` : ''}`;

interface Group {
  label: string | null;
  meta: string | null;
  idxs: number[];
}

function buildGroups(w: Workout): Group[] {
  if (w.mode === 'superset') {
    const pairs = new Map<number, number[]>();
    w.exercises.forEach((e, i) => {
      const p = e.pair ?? 0;
      pairs.set(p, [...(pairs.get(p) ?? []), i]);
    });
    return Array.from(pairs.entries()).map(([p, idxs]) => {
      const a = w.exercises[idxs[0]];
      const b = w.exercises[idxs[idxs.length - 1]];
      return {
        label: `Суперсет ${p + 1}`,
        meta: `${a.sets} круга · отдых ${a.rest} с между упражнениями, ${b.pairRest ?? b.rest} с между кругами`,
        idxs,
      };
    });
  }
  if (w.mode === 'circuit') {
    return [
      {
        label: 'Круговая',
        meta: `3 круга · отдых 60 с после упражнения, ${w.roundRest ?? 90} с между кругами`,
        idxs: w.exercises.map((_, i) => i),
      },
    ];
  }
  return [{ label: null, meta: null, idxs: w.exercises.map((_, i) => i) }];
}

export default function WorkoutDetail({
  workoutId,
  onBack,
  onStart,
}: {
  workoutId: string;
  onBack: () => void;
  onStart: () => void;
}) {
  const w = workoutById(workoutId);
  const totalSets = plannedSets(w);
  const groups = useMemo(() => buildGroups(w), [w]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const exRow = (i: number) => {
    const we = w.exercises[i];
    const ex = exerciseById(we.exerciseId);
    const isFirstOfPair = w.mode === 'superset' && i % 2 === 0;
    const restShown = w.mode === 'superset'
      ? (isFirstOfPair ? we.rest : (we.pairRest ?? we.rest))
      : we.rest;
    return (
      <li key={we.exerciseId}>
        <button
          type="button"
          onClick={() => setOpenIdx(i)}
          className="card-surface flex w-full cursor-pointer items-center gap-4 p-4 text-left transition-all duration-200 hover:border-white/25 hover:bg-white/[0.05] active:scale-[0.99]"
        >
          <span className="font-display tnum w-7 shrink-0 text-lg font-medium text-[var(--sub)]">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{ex.name}</p>
            <p className="mt-0.5 truncate text-xs text-[var(--sub)]">
              {ex.muscle} · {ex.equipment}
            </p>
            {(we.perSide || we.dropSet) && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {we.perSide && (
                  <span className="flex items-center gap-1 rounded-full border border-[var(--indigo)]/40 bg-[var(--indigo)]/15 px-2 py-0.5 text-[10px] font-semibold text-[#aab2ff]">
                    <Repeat size={10} />
                    на каждую сторону
                  </span>
                )}
                {we.dropSet && (
                  <span className="flex items-center gap-1 rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                    <Zap size={10} />
                    дроп-сет в 3-м круге
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="tnum shrink-0 text-right text-sm">
            <p className="font-semibold">{fmtReps(we)}</p>
            <p className="mt-0.5 text-xs text-[var(--sub)]">отдых {restShown} с</p>
          </div>
          {hasDemo(ex) ? (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/15 text-[var(--brand)]">
              <Play size={14} className="ml-0.5" />
            </span>
          ) : (
            <ChevronRight size={16} className="shrink-0 text-[var(--sub)]" />
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="mx-auto flex min-h-100dvh w-full max-w-md flex-col md:max-w-2xl">
      <header className="flex items-center gap-3 px-4 pb-2 pt-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Назад"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] text-white transition-colors hover:bg-white/10 active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="font-display text-xs font-medium uppercase text-[var(--brand)]">
            {w.tag} · {w.day}
          </p>
          <h1 className="font-display text-2xl font-semibold leading-tight">{w.title}</h1>
        </div>
      </header>

      <div className="mx-4 mb-4 mt-3 grid grid-cols-3 gap-2.5">
        <div className="card-surface px-3 py-3 text-center">
          <p className="font-display tnum text-xl font-semibold">{w.minutes}</p>
          <p className="text-[11px] text-[var(--sub)]">минут</p>
        </div>
        <div className="card-surface px-3 py-3 text-center">
          <p className="font-display tnum text-xl font-semibold">{totalSets}</p>
          <p className="text-[11px] text-[var(--sub)]">подходов</p>
        </div>
        <div className="card-surface px-3 py-3 text-center">
          <p className="font-display tnum text-xl font-semibold">{w.kcal}</p>
          <p className="text-[11px] text-[var(--sub)]">ккал</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-44">
        {/* разминка */}
        <div className="card-surface mb-4 p-4">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--sub)]">
            <Flame size={13} className="text-[var(--brand)]" />
            Разминка · 8 минут
          </p>
          <ul className="space-y-1.5">
            {w.warmup.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-snug text-[var(--sub)]">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--brand)]" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* правила дня */}
        <div className="card-surface mb-5 p-4">
          <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--sub)]">
            <Info size={13} className="text-[var(--indigo)]" />
            Правила дня
          </p>
          <ul className="space-y-1.5">
            {w.notes.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-snug text-[var(--sub)]">
                <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--indigo)]" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* программа */}
        {groups.map((g) => (
          <div key={g.label ?? 'main'} className="mb-5">
            {g.label && (
              <div className="mb-2.5">
                <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand)]">
                  {g.label}
                </p>
                {g.meta && <p className="mt-0.5 text-xs text-[var(--sub)]">{g.meta}</p>}
              </div>
            )}
            {!g.label && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--sub)]">
                Программа · {w.exercises.length} упражнений
              </p>
            )}
            <ol className="space-y-2.5">{g.idxs.map(exRow)}</ol>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-gradient-to-t from-[var(--navy)] via-[var(--navy)]/95 to-transparent px-4 pb-6 pt-10 safe-bottom md:max-w-2xl">
        <button
          type="button"
          onClick={onStart}
          className="flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--brand)] font-display text-lg font-semibold uppercase tracking-wide text-[var(--brand-ink)] transition-transform duration-150 hover:brightness-110 active:scale-[0.97]"
        >
          <Play size={20} strokeWidth={2.5} />
          Начать тренировку
        </button>
      </div>

      {openIdx !== null && (
        <ExerciseSheet
          exercise={exerciseById(w.exercises[openIdx].exerciseId)}
          plan={w.exercises[openIdx]}
          onClose={() => setOpenIdx(null)}
        />
      )}
    </div>
  );
}
