import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Flag, Minus, MonitorPlay, Pause, Play, Plus, Repeat, X, Zap } from 'lucide-react';
import ExerciseSheet from '@/components/ExerciseSheet';
import RingTimer from '@/components/RingTimer';
import { buildSteps, exerciseById, hasDemo, stepContext, workoutById } from '@/data/library';
import { fmtTime } from '@/lib/store';
import type { CompletedSet, Session, Settings, WorkoutStep } from '@/types';

type Phase = 'work' | 'rest' | 'summary';

function beep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.18, 0.36].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.15);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.16);
    });
  } catch {
    /* звук недоступен */
  }
}

/** короткий сигнал при переходе без отдыха (сторона / дроп) */
function tick() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 660;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.13);
  } catch {
    /* звук недоступен */
  }
}

const DROP_STAGE_TEXT = [
  'Этап 1 из 3 · 6 повторений с рабочим весом — и сразу дальше',
  'Этап 2 из 3 · снизьте вес на 25–40 % → 8 повторений без отдыха',
  'Этап 3 из 3 · ещё минус 25–40 % → 10 повторений',
];

export default function ActiveWorkout({
  workoutId,
  settings,
  onFinish,
  onQuit,
}: {
  workoutId: string;
  settings: Settings;
  onFinish: (s: Session) => void;
  onQuit: () => void;
}) {
  const w = workoutById(workoutId);
  const steps = useMemo(() => buildSteps(w), [w]);

  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('work');
  const [restLeft, setRestLeft] = useState(0);
  const [restTotal, setRestTotal] = useState(1);
  const [paused, setPaused] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [session, setSession] = useState<Session | null>(null);

  const step: WorkoutStep = steps[stepIdx];
  const plan = w.exercises[step.exerciseIdx];
  const ex = exerciseById(plan.exerciseId);

  const [reps, setReps] = useState(plan.reps);
  const [weight, setWeight] = useState(plan.weight);
  const setsRef = useRef<CompletedSet[]>([]);
  const startedAtRef = useRef(Date.now());
  /** последние выполненные значения по каждому упражнению */
  const lastDoneRef = useRef<Record<string, { reps: number; weight: number }>>({});

  // общий секундомер тренировки
  useEffect(() => {
    if (phase === 'summary' || paused) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [phase, paused]);

  // таймер отдыха
  useEffect(() => {
    if (phase !== 'rest' || paused) return;
    if (restLeft <= 0) {
      if (settings.sound) beep();
      if (settings.vibration && 'vibrate' in navigator) navigator.vibrate([120, 60, 120]);
      setPhase('work');
      return;
    }
    const id = window.setTimeout(() => setRestLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, paused, restLeft, settings.sound, settings.vibration]);

  const startRest = (sec: number) => {
    setRestTotal(sec);
    setRestLeft(sec);
    setPhase('rest');
  };

  const finishWorkout = () => {
    const finishedAt = Date.now();
    const sets = setsRef.current;
    const s: Session = {
      id: `${finishedAt}-${w.id}`,
      workoutId: w.id,
      workoutTitle: w.title,
      startedAt: startedAtRef.current,
      finishedAt,
      totalSets: sets.length,
      totalReps: sets.reduce((n, x) => n + x.reps, 0),
      totalVolume: sets.reduce((n, x) => n + x.reps * x.weight, 0),
      sets,
    };
    onFinish(s);
    setSession(s);
    setPhase('summary');
    if (settings.vibration && 'vibrate' in navigator) navigator.vibrate(200);
  };

  const completeSet = () => {
    const done: CompletedSet = {
      exerciseId: plan.exerciseId,
      reps,
      weight,
      ...(step.side ? { side: step.side } : {}),
      ...(step.drop ? { dropStage: step.drop.stage } : {}),
    };
    setsRef.current.push(done);
    lastDoneRef.current[plan.exerciseId] = { reps, weight };

    if (stepIdx + 1 >= steps.length) {
      finishWorkout();
      return;
    }

    const next = steps[stepIdx + 1];
    const nextPlan = w.exercises[next.exerciseIdx];
    setStepIdx(stepIdx + 1);

    // подготовка повторений и веса для следующего шага
    if (next.drop) {
      setReps(next.drop.reps[next.drop.stage]);
      if (next.drop.stage === 0) {
        const prev = lastDoneRef.current[nextPlan.exerciseId];
        setWeight(prev?.weight ?? nextPlan.weight);
      } else {
        setWeight(Math.max(1, Math.round(weight * 0.65)));
      }
    } else if (next.side === 2) {
      // сильная сторона повторяет число повторений слабой
      setReps(reps);
      setWeight(weight);
    } else {
      const prev = lastDoneRef.current[nextPlan.exerciseId];
      setReps(prev?.reps ?? nextPlan.reps);
      setWeight(prev?.weight ?? nextPlan.weight);
    }

    if (step.restAfter > 0) {
      startRest(step.restAfter);
    } else {
      // смена стороны или часть дроп-сета — сразу дальше
      if (settings.sound) tick();
      if (settings.vibration && 'vibrate' in navigator) navigator.vibrate(80);
    }
  };

  const progressPct = Math.round((stepIdx / steps.length) * 100);

  const nextLabel = (() => {
    const n = exerciseById(plan.exerciseId).name;
    if (step.side === 1) return `${n} · слабая сторона`;
    if (step.side === 2) return `${n} · сильная сторона`;
    if (step.drop) return `${n} · дроп, этап ${step.drop.stage + 1}`;
    return n;
  })();

  const accentLine = (() => {
    if (step.drop) return `Дроп-сет · этап ${step.drop.stage + 1} из 3`;
    if (step.side === 1) return 'Слабая сторона — начните с неё';
    if (step.side === 2) return 'Сильная сторона — то же число повторений';
    return `Подход ${step.setNo} из ${step.setsTotal}`;
  })();

  const completeLabel = (() => {
    if (step.restAfter > 0) return 'Подход выполнен';
    if (step.side === 1) return 'Готово — вторая сторона';
    if (step.drop && step.drop.stage < 2) return 'Готово — снижаем вес';
    return 'Готово — сразу дальше';
  })();

  if (phase === 'summary' && session) {
    return (
      <div className="mx-auto flex min-h-100dvh w-full max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand)] text-[var(--brand-ink)]">
          <Flag size={34} strokeWidth={2.2} />
        </div>
        <h1 className="font-display text-4xl font-semibold">Тренировка завершена!</h1>
        <p className="mt-2 text-[var(--sub)]">{w.title}</p>
        <div className="mt-8 grid w-full grid-cols-3 gap-2.5">
          <div className="card-surface px-2 py-4">
            <p className="font-display tnum text-2xl font-semibold">{fmtTime(Math.round((session.finishedAt - session.startedAt) / 1000))}</p>
            <p className="mt-1 text-[11px] text-[var(--sub)]">время</p>
          </div>
          <div className="card-surface px-2 py-4">
            <p className="font-display tnum text-2xl font-semibold">{session.totalReps}</p>
            <p className="mt-1 text-[11px] text-[var(--sub)]">повторений</p>
          </div>
          <div className="card-surface px-2 py-4">
            <p className="font-display tnum text-2xl font-semibold">{session.totalVolume}</p>
            <p className="mt-1 text-[11px] text-[var(--sub)]">кг объём</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onQuit}
          className="mt-10 min-h-[56px] w-full cursor-pointer rounded-full bg-[var(--brand)] font-display text-lg font-semibold uppercase text-[var(--brand-ink)] transition-transform hover:brightness-110 active:scale-[0.97]"
        >
          Отлично, спасибо
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-100dvh w-full max-w-md flex-col px-4 pb-8 pt-5">
      {/* верхняя панель */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setConfirmQuit(true)}
          aria-label="Завершить досрочно"
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] transition-colors hover:bg-white/10 active:scale-95"
        >
          <X size={20} />
        </button>
        <div className="text-center">
          <p className="font-display tnum text-lg font-semibold leading-none">{fmtTime(elapsed)}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--sub)]">
            {stepContext(step, w)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Продолжить' : 'Пауза'}
          className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] transition-colors hover:bg-white/10 active:scale-95"
        >
          {paused ? <Play size={19} /> : <Pause size={19} />}
        </button>
      </div>

      {/* прогресс-бар */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {phase === 'work' ? (
        <div className="flex flex-1 flex-col">
          <div className="text-center">
            <p className="font-display text-sm font-medium uppercase text-[var(--brand)]">
              {accentLine}
            </p>
            <h1 className="font-display mt-1 text-4xl font-semibold leading-tight">{ex.name}</h1>
            <p className="mt-1 text-sm text-[var(--sub)]">{ex.muscle} · {ex.equipment}</p>
          </div>

          {step.drop && (
            <div className="mx-auto mt-4 flex w-full max-w-sm items-start gap-2.5 rounded-2xl border border-[var(--brand)]/40 bg-[var(--brand)]/10 px-4 py-3">
              <Zap size={17} className="mt-0.5 shrink-0 text-[var(--brand)]" />
              <p className="text-sm leading-snug">{DROP_STAGE_TEXT[step.drop.stage]}</p>
            </div>
          )}

          <div className="card-surface mx-auto mt-4 w-full max-w-sm px-5 py-4">
            <p className="text-center text-sm leading-relaxed text-[var(--sub)]">{ex.hint}</p>
            {hasDemo(ex) && (
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className="mx-auto mt-3 flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-[var(--brand)]/50 px-5 text-sm font-semibold text-[var(--brand)] transition-colors hover:bg-[var(--brand)]/10 active:scale-95"
              >
                <MonitorPlay size={17} />
                Смотреть технику
              </button>
            )}
          </div>

          {/* регулировка повторений и веса */}
          <div className="mx-auto mt-5 grid w-full max-w-sm grid-cols-2 gap-3">
            <div className="card-surface p-4">
              <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--sub)]">Повторения</p>
              <div className="mt-2 flex items-center justify-between">
                <button type="button" aria-label="Меньше повторений" onClick={() => setReps((r) => Math.max(1, r - 1))} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] hover:bg-white/10 active:scale-95"><Minus size={18} /></button>
                <span className="font-display tnum text-3xl font-semibold">{reps}</span>
                <button type="button" aria-label="Больше повторений" onClick={() => setReps((r) => r + 1)} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] hover:bg-white/10 active:scale-95"><Plus size={18} /></button>
              </div>
            </div>
            <div className="card-surface p-4">
              <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--sub)]">Вес, кг</p>
              <div className="mt-2 flex items-center justify-between">
                <button type="button" aria-label="Меньше веса" onClick={() => setWeight((v) => Math.max(0, v - 1))} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] hover:bg-white/10 active:scale-95"><Minus size={18} /></button>
                <span className="font-display tnum text-3xl font-semibold">{weight}</span>
                <button type="button" aria-label="Больше веса" onClick={() => setWeight((v) => v + 1)} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] hover:bg-white/10 active:scale-95"><Plus size={18} /></button>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={completeSet}
              className="flex min-h-[60px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full bg-[var(--brand)] font-display text-xl font-semibold uppercase tracking-wide text-[var(--brand-ink)] transition-transform hover:brightness-110 active:scale-[0.97]"
            >
              {step.restAfter === 0 ? <Repeat size={22} strokeWidth={2.4} /> : <Check size={22} strokeWidth={2.6} />}
              {completeLabel}
            </button>
          </div>
        </div>
      ) : (
        /* фаза отдыха */
        <div className="flex flex-1 flex-col items-center">
          <p className="font-display mt-4 text-center text-sm font-medium uppercase text-[var(--sub)]">
            Далее: {nextLabel}
          </p>
          <div className="mt-8">
            <RingTimer left={restLeft} total={restTotal} />
          </div>
          <div className="mt-8 flex w-full max-w-sm gap-3">
            <button
              type="button"
              onClick={() => { setRestLeft((s) => s + 15); setRestTotal((t) => t + 15); }}
              className="min-h-[52px] flex-1 cursor-pointer rounded-full border border-[var(--line)] font-semibold transition-colors hover:bg-white/10 active:scale-95"
            >
              +15 сек
            </button>
            <button
              type="button"
              onClick={() => setPhase('work')}
              className="min-h-[52px] flex-1 cursor-pointer rounded-full bg-white font-semibold text-[var(--brand-ink)] transition-transform hover:brightness-95 active:scale-95"
            >
              Пропустить
            </button>
          </div>
        </div>
      )}

      {/* пауза */}
      {paused && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--navy)]/90 backdrop-blur-sm" role="dialog" aria-label="Пауза">
          <p className="font-display text-4xl font-semibold">Пауза</p>
          <p className="mt-2 text-[var(--sub)]">Отдохните — таймер остановлен</p>
          <button
            type="button"
            onClick={() => setPaused(false)}
            className="mt-8 flex min-h-[56px] cursor-pointer items-center gap-2 rounded-full bg-[var(--brand)] px-10 font-display text-lg font-semibold uppercase text-[var(--brand-ink)] transition-transform hover:brightness-110 active:scale-95"
          >
            <Play size={19} /> Продолжить
          </button>
        </div>
      )}

      {/* техника упражнения */}
      {showVideo && (
        <ExerciseSheet exercise={ex} plan={plan} onClose={() => setShowVideo(false)} />
      )}

      {/* подтверждение выхода */}
      {confirmQuit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm" role="dialog" aria-label="Подтверждение выхода" onClick={() => setConfirmQuit(false)}>
          <div className="card-surface w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-semibold">Завершить досрочно?</h2>
            <p className="mt-2 text-sm text-[var(--sub)]">
              Прогресс этой тренировки не сохранится.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmQuit(false)}
                className="min-h-[48px] flex-1 cursor-pointer rounded-full border border-[var(--line)] font-semibold transition-colors hover:bg-white/10 active:scale-95"
              >
                Остаться
              </button>
              <button
                type="button"
                onClick={onQuit}
                className="min-h-[48px] flex-1 cursor-pointer rounded-full bg-red-500 font-semibold text-white transition-transform hover:brightness-110 active:scale-95"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
