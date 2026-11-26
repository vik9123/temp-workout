import { useEffect, useState } from 'react';
import { BadgeCheck, MonitorPlay, Play, Repeat, Timer, X, Zap } from 'lucide-react';
import type { Exercise, WorkoutExercise } from '@/types';

const fmtReps = (we: WorkoutExercise) =>
  `${we.sets} × ${we.reps}${we.repsMax && we.repsMax !== we.reps ? `–${we.repsMax}` : ''}`;

/** Видео-блок: сначала превью (загружается само), iframe — только по тапу */
function VideoBlock({ videoId, title }: { videoId: string; title: string }) {
  const [play, setPlay] = useState(false);
  const [thumbOk, setThumbOk] = useState(true);

  if (play) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlay(true)}
      aria-label={`Смотреть видео: ${title}`}
      className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-xl bg-[var(--surface-2)]"
    >
      {thumbOk && (
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          onError={() => setThumbOk(false)}
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-200 group-hover:opacity-100"
        />
      )}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand)] text-[var(--brand-ink)] shadow-lg transition-transform duration-150 group-hover:scale-105 group-active:scale-95">
          <Play size={24} strokeWidth={2.5} className="ml-0.5" />
        </span>
      </span>
      <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white">
        YouTube
      </span>
    </button>
  );
}

export default function ExerciseSheet({
  exercise,
  plan,
  onClose,
}: {
  exercise: Exercise;
  plan?: WorkoutExercise;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={exercise.name}
      onClick={onClose}
    >
      <div
        className="max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-[var(--line)] bg-[var(--surface)] p-5 pb-8 safe-bottom sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold leading-tight">{exercise.name}</h2>
            <p className="mt-1 text-sm text-[var(--sub)]">
              {exercise.muscle} · {exercise.equipment}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--line)] transition-colors hover:bg-white/10 active:scale-95"
          >
            <X size={19} />
          </button>
        </div>

        {plan && (
          <div className="mb-4 flex flex-wrap gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-sm font-semibold">
              <BadgeCheck size={15} className="text-[var(--brand)]" />
              <span className="tnum">{fmtReps(plan)}</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-sm font-semibold">
              <Timer size={15} className="text-[var(--brand)]" />
              <span className="tnum">отдых {plan.rest} с</span>
            </span>
            {plan.perSide && (
              <span className="flex items-center gap-1.5 rounded-full border border-[var(--indigo)]/40 bg-[var(--indigo)]/15 px-3 py-1.5 text-sm font-semibold text-[#aab2ff]">
                <Repeat size={14} />
                на каждую сторону
              </span>
            )}
            {plan.dropSet && (
              <span className="flex items-center gap-1.5 rounded-full border border-[var(--brand)]/40 bg-[var(--brand)]/15 px-3 py-1.5 text-sm font-semibold text-[var(--brand)]">
                <Zap size={14} />
                дроп-сет 6-8-10 в 3-м круге
              </span>
            )}
          </div>
        )}

        {exercise.video ? (
          <div className="mb-4">
            <VideoBlock videoId={exercise.video.id} title={exercise.video.title} />
            <p className="mt-2 flex items-start gap-1.5 text-xs leading-snug text-[var(--sub)]">
              <MonitorPlay size={13} className="mt-0.5 shrink-0" />
              <span>
                {exercise.video.title} — {exercise.video.author}
              </span>
            </p>
          </div>
        ) : (
          <div className="mb-4 flex aspect-video items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--sub)]">
            Видео для этого упражнения скоро добавим
          </div>
        )}

        <div className="card-surface p-4">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--sub)]">
            Контроль техники
          </p>
          <p className="text-sm leading-relaxed">{exercise.hint}</p>
        </div>
      </div>
    </div>
  );
}
