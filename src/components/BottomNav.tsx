import { Dumbbell, LineChart, UserRound } from 'lucide-react';

type Tab = 'home' | 'progress' | 'profile';

const TABS: { id: Tab; label: string; icon: typeof Dumbbell }[] = [
  { id: 'home', label: 'Тренировки', icon: Dumbbell },
  { id: 'progress', label: 'Прогресс', icon: LineChart },
  { id: 'profile', label: 'Профиль', icon: UserRound },
];

export default function BottomNav({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4 pb-3 safe-bottom"
      aria-label="Основная навигация"
    >
      <div className="card-surface flex items-stretch justify-between gap-1 !rounded-full p-1.5 backdrop-blur-xl">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-[48px] flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 ${
                active
                  ? 'bg-[var(--brand)] text-[var(--brand-ink)]'
                  : 'text-[var(--sub)] hover:text-white active:scale-95'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[11px] font-semibold leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
