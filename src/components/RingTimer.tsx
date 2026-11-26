import { fmtTime } from '@/lib/store';

/** Кольцевой таймер отдыха с анимированным прогрессом */
export default function RingTimer({
  left,
  total,
  size = 220,
}: {
  left: number;
  total: number;
  size?: number;
}) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = total > 0 ? left / total : 0;

  return (
    <div className="relative" style={{ width: size, height: size }} role="timer" aria-label={`Осталось ${left} секунд`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--brand)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 0.95s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display tnum text-6xl font-semibold leading-none">
          {fmtTime(left)}
        </span>
        <span className="mt-2 text-sm font-medium uppercase tracking-widest text-[var(--sub)]">
          отдых
        </span>
      </div>
    </div>
  );
}
