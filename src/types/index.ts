export interface ExerciseVideo {
  /** YouTube video ID */
  id: string;
  title: string;
  author: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  hint: string;
  video?: ExerciseVideo;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  /** верхняя граница диапазона повторений (6–8 → reps: 6, repsMax: 8) */
  repsMax?: number;
  /** 0 = собственный вес / вес подбирается */
  weight: number;
  /** отдых после подхода (в суперсете — после первого упражнения пары) */
  rest: number;
  /** суперсет: номер пары с 0; упражнения одной пары идут подряд */
  pair?: number;
  /** суперсет: отдых между кругами пары (после последнего упражнения пары) */
  pairRest?: number;
  /** каждый подход выполняется по очереди на каждую сторону */
  perSide?: boolean;
  /** в последнем круге — дроп-сет 6-8-10 */
  dropSet?: boolean;
}

export type WorkoutLevel = 'Новичок' | 'Средний' | 'Продвинутый';

export type WorkoutMode = 'straight' | 'superset' | 'circuit';

export interface Workout {
  id: string;
  title: string;
  goal: string;
  level: WorkoutLevel;
  minutes: number;
  kcal: number;
  tag: string;
  /** короткий ярлык дня: ВТ / ЧТ / ВС */
  day: string;
  /** getDay(): 0 = воскресенье */
  weekday: number;
  mode: WorkoutMode;
  /** отдых между кругами (круговая) или переход между парами/упражнениями */
  roundRest?: number;
  /** правила дня — показываются на экране программы */
  notes: string[];
  /** протокол разминки */
  warmup: string[];
  exercises: WorkoutExercise[];
}

/** Один выполняемый шаг тренировки (один подход / одна сторона / часть дроп-сета) */
export interface WorkoutStep {
  exerciseIdx: number;
  /** номер подхода этого упражнения, с 1 */
  setNo: number;
  setsTotal: number;
  round?: number;
  roundsTotal?: number;
  /** номер пары в суперсете */
  pair?: number;
  /** 1 = слабая сторона (первая), 2 = сильная */
  side?: 1 | 2;
  /** часть дроп-сета: stage 0 → 6 повт., 1 → 8, 2 → 10 */
  drop?: { stage: 0 | 1 | 2; reps: [number, number, number] };
  /** отдых после шага, сек; 0 = сразу дальше */
  restAfter: number;
}

export interface CompletedSet {
  exerciseId: string;
  reps: number;
  weight: number;
  side?: 1 | 2;
  dropStage?: 0 | 1 | 2;
}

export interface Session {
  id: string;
  workoutId: string;
  workoutTitle: string;
  startedAt: number;
  finishedAt: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  sets: CompletedSet[];
}

export interface Settings {
  sound: boolean;
  vibration: boolean;
}

export type Screen =
  | { name: 'home' }
  | { name: 'progress' }
  | { name: 'profile' }
  | { name: 'workout'; workoutId: string }
  | { name: 'active'; workoutId: string };
