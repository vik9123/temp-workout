import { useCallback, useState } from 'react';
import BottomNav from '@/components/BottomNav';
import ActiveWorkout from '@/sections/ActiveWorkout';
import Home from '@/sections/Home';
import Profile from '@/sections/Profile';
import Progress from '@/sections/Progress';
import WorkoutDetail from '@/sections/WorkoutDetail';
import { addSession, clearSessions, loadSessions, loadSettings, saveSettings } from '@/lib/store';
import type { Screen, Session, Settings } from '@/types';

type Tab = 'home' | 'progress' | 'profile';

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' });
  const [sessions, setSessions] = useState<Session[]>(() => loadSessions());
  const [settings, setSettingsState] = useState<Settings>(() => loadSettings());

  const tab: Tab =
    screen.name === 'progress'
      ? 'progress'
      : screen.name === 'profile'
        ? 'profile'
        : 'home';

  const goTab = (t: Tab) => setScreen({ name: t } as Screen);

  const handleFinish = useCallback((s: Session) => {
    setSessions(addSession(s));
  }, []);

  const updateSettings = (s: Settings) => {
    setSettingsState(s);
    saveSettings(s);
  };

  const resetAll = () => {
    clearSessions();
    setSessions([]);
  };

  const immersive = screen.name === 'active' || screen.name === 'workout';

  return (
    <div className="min-h-100dvh">
      {screen.name === 'home' && (
        <Home sessions={sessions} onOpen={(id) => setScreen({ name: 'workout', workoutId: id })} />
      )}

      {screen.name === 'progress' && <Progress sessions={sessions} />}

      {screen.name === 'profile' && (
        <Profile
          settings={settings}
          onSettings={updateSettings}
          onReset={resetAll}
          sessionCount={sessions.length}
        />
      )}

      {screen.name === 'workout' && (
        <WorkoutDetail
          workoutId={screen.workoutId}
          onBack={() => setScreen({ name: 'home' })}
          onStart={() => setScreen({ name: 'active', workoutId: screen.workoutId })}
        />
      )}

      {screen.name === 'active' && (
        <ActiveWorkout
          workoutId={screen.workoutId}
          settings={settings}
          onFinish={handleFinish}
          onQuit={() => setScreen({ name: 'home' })}
        />
      )}

      {!immersive && <BottomNav tab={tab} onChange={goTab} />}
    </div>
  );
}
