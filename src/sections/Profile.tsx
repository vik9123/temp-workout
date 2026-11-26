import { useState } from 'react';
import { BellRing, Trash2, Vibrate } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import type { Settings } from '@/types';

export default function Profile({
  settings,
  onSettings,
  onReset,
  sessionCount,
}: {
  settings: Settings;
  onSettings: (s: Settings) => void;
  onReset: () => void;
  sessionCount: number;
}) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-32 pt-6 md:max-w-2xl">
      <h1 className="font-display mb-6 text-4xl font-semibold">Профиль</h1>

      <div className="card-surface mb-6 divide-y divide-white/10">
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <BellRing size={19} className="text-[var(--brand)]" />
            <div>
              <p className="font-semibold">Звук таймера</p>
              <p className="text-xs text-[var(--sub)]">Сигнал в конце отдыха</p>
            </div>
          </div>
          <Switch
            checked={settings.sound}
            onCheckedChange={(v) => onSettings({ ...settings, sound: v })}
            aria-label="Звук таймера"
          />
        </div>
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <Vibrate size={19} className="text-[var(--brand)]" />
            <div>
              <p className="font-semibold">Вибрация</p>
              <p className="text-xs text-[var(--sub)]">Отклик при событиях тренировки</p>
            </div>
          </div>
          <Switch
            checked={settings.vibration}
            onCheckedChange={(v) => onSettings({ ...settings, vibration: v })}
            aria-label="Вибрация"
          />
        </div>
      </div>

      <div className="card-surface mb-6 p-5">
        <p className="font-display text-lg font-semibold">О приложении</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--sub)]">
          Темп — персональный тренер в кармане. Готовые программы, таймер отдыха,
          учёт подходов и статистика. Все данные хранятся только на этом устройстве.
        </p>
        <p className="tnum mt-3 text-xs text-[var(--sub)]">
          Выполнено тренировок: {sessionCount}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setConfirmReset(true)}
        className="flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-red-400/40 font-semibold text-red-300 transition-colors hover:bg-red-500/10 active:scale-[0.98]"
      >
        <Trash2 size={18} />
        Сбросить всю статистику
      </button>

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm" role="dialog" aria-label="Подтверждение сброса" onClick={() => setConfirmReset(false)}>
          <div className="card-surface w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-semibold">Удалить все данные?</h2>
            <p className="mt-2 text-sm text-[var(--sub)]">
              История тренировок и статистика будут удалены безвозвратно.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[48px] flex-1 cursor-pointer rounded-full border border-[var(--line)] font-semibold transition-colors hover:bg-white/10 active:scale-95"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => { onReset(); setConfirmReset(false); }}
                className="min-h-[48px] flex-1 cursor-pointer rounded-full bg-red-500 font-semibold text-white transition-transform hover:brightness-110 active:scale-95"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
