import type { Exercise, Workout, WorkoutStep } from '@/types';

export const EXERCISES: Exercise[] = [
  // --- Вторник ---
  {
    id: 'pullup-weighted',
    name: 'Подтягивания с весом',
    muscle: 'Широчайшие',
    equipment: 'Турник + пояс',
    hint: 'С полного виса до подбородка над перекладиной, без раскачки. Не идут 6 повторений с весом — подтягиваетесь без веса.',
  },
  {
    id: 'incline-machine-press',
    name: 'Жим в тренажёре на наклонной',
    muscle: 'Грудь (верх), передняя дельта',
    equipment: 'Тренажёр',
    hint: 'Спинка под 30–45°, рукояти на уровне верха груди. Лопатки прижаты, локти чуть ниже плеч, не разводить их в стороны на 90°. Внизу без рывка.',
  },
  {
    id: 'lever-row',
    name: 'Тяга в рычажном тренажёре',
    muscle: 'Середина спины, задняя дельта',
    equipment: 'Рычажный тренажёр',
    hint: 'Грудь плотно на подушке, поясница не работает. В конце сводите лопатки.',
  },
  {
    id: 'dips',
    name: 'Отжимания на брусьях',
    muscle: 'Грудь (низ), трицепс',
    equipment: 'Брусья',
    hint: 'Не опускаться ниже 90° в локте, корпус слегка вперёд для акцента на грудь.',
  },
  {
    id: 'db-press-neutral',
    name: 'Жим гантелей сидя, нейтральный хват',
    muscle: 'Передняя и средняя дельта',
    equipment: 'Гантели',
    hint: 'Нейтральный хват (ладони друг к другу), спинка почти вертикальная. Резкая боль в плече — подход заканчиваете.',
  },
  {
    id: 'bent-db-fly',
    name: 'Махи гантелей в наклоне',
    muscle: 'Задняя дельта',
    equipment: 'Гантели',
    hint: 'Наклон 45–60°, спина прямая, локти слегка согнуты и неподвижны. Разводите руки до уровня спины, в конце сводите лопатки, без рывка корпусом.',
  },
  {
    id: 'leg-extension',
    name: 'Разгибания ног в станке',
    muscle: 'Квадрицепс',
    equipment: 'Тренажёр',
    hint: 'Спинку отрегулируйте так, чтобы ось колена совпадала с осью тренажёра. Вверху — мощное, но контролируемое выпрямление без рывка, вниз вес не опускайте до конца с расслаблением.',
  },
  {
    id: 'leg-curl',
    name: 'Сгибания ног в станке',
    muscle: 'Бицепс бедра',
    equipment: 'Тренажёр',
    hint: 'Бёдра прижаты к подушке, сгибание до конца, вниз под контролем, без рывка.',
  },
  // --- Четверг ---
  {
    id: 'step-up',
    name: 'Прямой подъём на тумбу',
    muscle: 'Квадрицепс, ягодицы',
    equipment: 'Тумба + гантели',
    hint: 'Тумба такой высоты, чтобы в начале движения бедро рабочей ноги было параллельно полу (угол в колене около 90°). Поднимаетесь за счёт ноги на тумбе, нижней не отталкиваетесь, спуск под контролем.',
  },
  {
    id: 'sl-rdl',
    name: 'Румынская тяга на одной ноге',
    muscle: 'Бицепс бедра, ягодицы',
    equipment: 'Гантель',
    hint: 'Свободной рукой держитесь за стойку, гантель в другой руке. Спина прямая, таз назад, опорное колено слегка согнуто.',
  },
  {
    id: 'sl-calf',
    name: 'Подъёмы на носок на одной ноге стоя',
    muscle: 'Икроножная, камбаловидная',
    equipment: 'Гантель + ступенька',
    hint: 'Носок на краю ступеньки или блина, гантель в руке со стороны рабочей ноги, другой рукой держитесь за стойку. Внизу пауза 1–2 секунды в растяжении, вверху — на самый носок.',
  },
  {
    id: 'sa-machine-press',
    name: 'Жим в тренажёре одной рукой',
    muscle: 'Грудь, передняя дельта',
    equipment: 'Тренажёр',
    hint: 'Рукоять на уровне середины груди. Свободной рукой держитесь за рукоять или сиденье, корпус не разворачиваете в сторону рабочей руки. Начинайте со слабой руки.',
  },
  {
    id: 'sa-db-row',
    name: 'Тяга гантели одной рукой с упором',
    muscle: 'Широчайшие, середина спины',
    equipment: 'Гантель + скамья',
    hint: 'Колено и рука той же стороны на скамье, спина параллельно полу. Тянете локтем к поясу, корпус не поворачиваете.',
  },
  {
    id: 'low-cable-raise',
    name: 'Разведения на нижнем блоке одной рукой',
    muscle: 'Средняя дельта',
    equipment: 'Кроссовер',
    hint: 'Боком к блоку, трос проходит перед телом, свободной рукой держитесь за стойку. Подъём до уровня плеча.',
  },
  {
    id: 'reverse-pecdeck',
    name: 'Обратные разведения в тренажёре',
    muscle: 'Задняя дельта',
    equipment: 'Тренажёр',
    hint: 'Ведёте локтем, а не кистью, корпус неподвижен. Помогаете себе телом — вес велик.',
  },
  // --- Воскресенье ---
  {
    id: 'smith-rdl',
    name: 'Румынская становая в Смите',
    muscle: 'Бицепс бедра, ягодицы, разгибатели спины',
    equipment: 'Смит',
    hint: 'Гриф скользит по бёдрам, таз назад, спина прямая, колени слегка согнуты и не двигаются. Опускаете до середины голени или ниже — по растяжению задней поверхности бедра, без округления поясницы. Встаёте за счёт ягодиц, не тянете спиной.',
  },
  {
    id: 'leg-press',
    name: 'Жим ногами',
    muscle: 'Квадрицепс, ягодицы',
    equipment: 'Тренажёр',
    hint: 'Стопы на ширине плеч, внизу угол в колене около 90°, поясница и таз прижаты к спинке, в коленях не выпрямляете до замка.',
  },
  {
    id: 'calf-press',
    name: 'Жим носками в станке для жима ногами',
    muscle: 'Икроножная, камбаловидная',
    equipment: 'Тренажёр',
    hint: 'На платформе только носки, пятки свободны. Внизу пауза 1–2 секунды в растяжении, вверху — полный выжим носками с задержкой 1 секунда. Колени почти прямые, но не в замке.',
  },
  {
    id: 'lat-pulldown',
    name: 'Тяга вертикального блока',
    muscle: 'Широчайшие',
    equipment: 'Верхний блок',
    hint: 'Хват шире плеч, тянете рукоять к верху груди, локти вниз и назад, корпус почти вертикально, без раскачки. Внизу руки полностью выпрямляются, в конце сводите лопатки.',
  },
  {
    id: 'incline-db-press',
    name: 'Жим гантелей на наклонной 30°',
    muscle: 'Грудь (верх), передняя дельта',
    equipment: 'Гантели',
    hint: 'Лопатки прижаты к спинке, внизу гантели у краёв груди, локти примерно под 45° к корпусу. Без отбива в нижней точке.',
  },
  {
    id: 'db-lateral-raise',
    name: 'Подъём гантелей через стороны',
    muscle: 'Средняя дельта',
    equipment: 'Гантели',
    hint: 'Лёгкий наклон корпуса вперёд, локти чуть согнуты, ведёте локтями до уровня плеч. Вверху без паузы, вниз под контролем.',
  },
];

export const exerciseById = (id: string): Exercise =>
  EXERCISES.find((e) => e.id === id) ?? EXERCISES[0];

/** Есть ли видеодемонстрация техники */
export const hasDemo = (e: Exercise): boolean => Boolean(e.video);

export const WORKOUTS: Workout[] = [
  {
    id: 'tue-heavy',
    title: 'Вторник · тяжёлый',
    goal: 'Суперсеты из антагонистов · запас 2 повторения',
    level: 'Продвинутый',
    minutes: 54,
    kcal: 430,
    tag: '2026/27',
    day: 'ВТ',
    weekday: 2,
    mode: 'superset',
    roundRest: 90,
    notes: [
      'Подход пары: первое упражнение → отдых 45 с → второе → отдых 120/90 с',
      'Вес во втором упражнении просел больше чем на 10 % — отдых между кругами 150 с',
      'Верх диапазона во всех подходах обоих упражнений пары — в следующий раз плюс 1,25–2,5 кг',
    ],
    warmup: [
      'Эллипс — 4 минуты, лёгкий темп',
      'Круги плечами, сведение лопаток, повороты корпуса — 2 минуты; наружная ротация плеча на блоке или резине 2 × 15 на каждую руку',
      'Подводящие подтягивания: 12 повторений с 50 % и 6 с 75 % рабочего веса',
      'Перед разгибаниями ног достаточно одного лёгкого подхода',
    ],
    exercises: [
      { exerciseId: 'pullup-weighted', sets: 3, reps: 6, repsMax: 8, weight: 0, rest: 45, pair: 0, pairRest: 120 },
      { exerciseId: 'incline-machine-press', sets: 3, reps: 8, repsMax: 10, weight: 0, rest: 45, pair: 0, pairRest: 120 },
      { exerciseId: 'lever-row', sets: 3, reps: 8, repsMax: 10, weight: 0, rest: 45, pair: 1, pairRest: 120 },
      { exerciseId: 'dips', sets: 3, reps: 8, repsMax: 10, weight: 0, rest: 45, pair: 1, pairRest: 120 },
      { exerciseId: 'db-press-neutral', sets: 3, reps: 8, repsMax: 10, weight: 0, rest: 45, pair: 2, pairRest: 90 },
      { exerciseId: 'bent-db-fly', sets: 3, reps: 12, repsMax: 15, weight: 0, rest: 45, pair: 2, pairRest: 90 },
      { exerciseId: 'leg-extension', sets: 3, reps: 10, repsMax: 12, weight: 0, rest: 45, pair: 3, pairRest: 90 },
      { exerciseId: 'leg-curl', sets: 3, reps: 10, repsMax: 12, weight: 0, rest: 45, pair: 3, pairRest: 90 },
    ],
  },
  {
    id: 'thu-light',
    title: 'Четверг · лёгкий',
    goal: 'Одна нога / одна рука · вес около 65 % от тяжёлого дня',
    level: 'Средний',
    minutes: 62,
    kcal: 360,
    tag: '2026/27',
    day: 'ЧТ',
    weekday: 4,
    mode: 'straight',
    roundRest: 90,
    notes: [
      'Сначала все повторения слабой стороной, сразу — сильной тем же числом, потом отдых',
      'Запас 2–3 повторения: подход должен быть неприятным от жжения, а не от веса',
      'Прогрессия: держите вес и добавляйте повторения; дошли до верха диапазона — поднимите вес',
      'На разведениях сначала доведите до 20 повторений, потом шаг веса 1–2 кг',
    ],
    warmup: [
      'Эллипс — 4 минуты, лёгкий темп',
      'Круги плечами, сведение лопаток, повороты корпуса — 2 минуты; наружная ротация 2 × 15 на каждую руку',
      'Перед подъёмом на тумбу: 10 подъёмов без веса на каждую ногу',
      '10 наклонов на одной ноге без гантели, держась за стойку',
    ],
    exercises: [
      { exerciseId: 'step-up', sets: 3, reps: 12, repsMax: 15, weight: 0, rest: 45, perSide: true },
      { exerciseId: 'sl-rdl', sets: 3, reps: 12, repsMax: 15, weight: 0, rest: 45, perSide: true },
      { exerciseId: 'sl-calf', sets: 3, reps: 12, repsMax: 15, weight: 0, rest: 30, perSide: true },
      { exerciseId: 'sa-machine-press', sets: 3, reps: 12, repsMax: 15, weight: 0, rest: 30, perSide: true },
      { exerciseId: 'sa-db-row', sets: 3, reps: 12, repsMax: 15, weight: 0, rest: 30, perSide: true },
      { exerciseId: 'low-cable-raise', sets: 3, reps: 15, weight: 0, rest: 30, perSide: true },
      { exerciseId: 'reverse-pecdeck', sets: 3, reps: 15, weight: 0, rest: 45 },
    ],
  },
  {
    id: 'sun-circuit',
    title: 'Воскресенье · круговая',
    goal: '3 круга × 7 упражнений · веса на 10–15 % ниже тяжёлого дня',
    level: 'Продвинутый',
    minutes: 50,
    kcal: 450,
    tag: '2026/27',
    day: 'ВС',
    weekday: 0,
    mode: 'circuit',
    roundRest: 90,
    notes: [
      'По одному подходу каждого упражнения за круг; отдых 60 с после упражнения, 90 с между кругами',
      'В 3-м круге на тяге вертикального блока и жиме гантелей — дроп-сет 6-8-10: дважды минус 25–40 % веса, между частями без отдыха',
      'Запас 2 повторения; в круге накапливается усталость — веса ниже тяжёлого вторника',
    ],
    warmup: [
      'Эллипс — 4 минуты, лёгкий темп',
      'Круги плечами, сведение лопаток, повороты корпуса — 2 минуты; наружная ротация 2 × 15 на каждую руку',
      'Перед румынской становой: 12 повторений с 50 % и 6 с 75 % рабочего веса',
      'Перед жимом ногами — 8–10 лёгких повторений',
    ],
    exercises: [
      { exerciseId: 'smith-rdl', sets: 3, reps: 8, repsMax: 10, weight: 0, rest: 60 },
      { exerciseId: 'leg-press', sets: 3, reps: 10, repsMax: 12, weight: 0, rest: 60 },
      { exerciseId: 'calf-press', sets: 3, reps: 10, repsMax: 12, weight: 0, rest: 60 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 8, repsMax: 10, weight: 0, rest: 60, dropSet: true },
      { exerciseId: 'incline-db-press', sets: 3, reps: 10, repsMax: 12, weight: 0, rest: 60, dropSet: true },
      { exerciseId: 'db-lateral-raise', sets: 3, reps: 12, repsMax: 15, weight: 0, rest: 60 },
      { exerciseId: 'bent-db-fly', sets: 3, reps: 12, repsMax: 15, weight: 0, rest: 60 },
    ],
  },
];

export const workoutById = (id: string): Workout =>
  WORKOUTS.find((w) => w.id === id) ?? WORKOUTS[0];

/** Недельный объём из программы (подходов в неделю) */
export const WEEKLY_VOLUME: Array<[string, string]> = [
  ['Грудь', '11'],
  ['Спина', '11'],
  ['Задняя дельта', '12'],
  ['Квадрицепс', '9'],
  ['Бицепс бедра', '9'],
  ['Передняя дельта', '8,5'],
  ['Средняя дельта', '7,5'],
  ['Ягодицы', '6'],
  ['Икры', '6'],
  ['Бицепс / трицепс', '5,5 / 7'],
];

/** Общие правила программы (вход, прогрессия, разгрузка) */
export const PROGRAM_RULES: string[] = [
  'Неделя 1 — калибровочная: везде, где 3 подхода, делаете 2 и записываете рабочие веса',
  'Тяжёлый день: набрали верх диапазона в обоих упражнениях пары во всех подходах — плюс 1,25–2,5 кг',
  'Лёгкий день: вес держите, добавляете повторения; разведения — сначала до 20 повторений, потом вес',
  'Неделя 8 — разгрузка: подходов вдвое меньше, веса те же',
  'Пн, Ср, Пт и Сб — отдых; между тренировками всегда минимум сутки',
];

const DROP_REPS: [number, number, number] = [6, 8, 10];

/** Разворачивает программу тренировки в линейную очередь шагов */
export function buildSteps(w: Workout): WorkoutStep[] {
  const steps: WorkoutStep[] = [];
  const exs = w.exercises;

  if (w.mode === 'superset') {
    const pairs: number[][] = [];
    exs.forEach((e, i) => {
      const p = e.pair ?? 0;
      (pairs[p] ??= []).push(i);
    });
    pairs.forEach((idxs, p) => {
      const rounds = exs[idxs[0]].sets;
      for (let r = 1; r <= rounds; r++) {
        idxs.forEach((ei, pos) => {
          const e = exs[ei];
          const lastInPair = pos === idxs.length - 1;
          const lastRound = r === rounds;
          const lastPair = p === pairs.length - 1;
          let restAfter: number;
          if (!lastInPair) restAfter = e.rest; // между упражнениями пары (45 с)
          else if (!lastRound) restAfter = e.pairRest ?? e.rest; // между кругами (120/90 с)
          else if (!lastPair) restAfter = w.roundRest ?? 90; // переход к следующей паре
          else restAfter = 0;
          steps.push({
            exerciseIdx: ei,
            setNo: r,
            setsTotal: rounds,
            round: r,
            roundsTotal: rounds,
            pair: p,
            restAfter,
          });
        });
      }
    });
    return steps;
  }

  if (w.mode === 'circuit') {
    const rounds = Math.max(...exs.map((e) => e.sets));
    for (let r = 1; r <= rounds; r++) {
      exs.forEach((e, ei) => {
        const lastEx = ei === exs.length - 1;
        const lastRound = r === rounds;
        const baseRest = lastRound && lastEx ? 0 : lastEx ? (w.roundRest ?? 90) : e.rest;
        if (e.dropSet && r === rounds) {
          DROP_REPS.forEach((_, stage) => {
            steps.push({
              exerciseIdx: ei,
              setNo: r,
              setsTotal: rounds,
              round: r,
              roundsTotal: rounds,
              drop: { stage: stage as 0 | 1 | 2, reps: DROP_REPS },
              restAfter: stage < DROP_REPS.length - 1 ? 0 : baseRest,
            });
          });
        } else {
          steps.push({
            exerciseIdx: ei,
            setNo: r,
            setsTotal: rounds,
            round: r,
            roundsTotal: rounds,
            restAfter: baseRest,
          });
        }
      });
    }
    return steps;
  }

  // straight: четверг — односторонние подходы и обычные
  exs.forEach((e, ei) => {
    const lastEx = ei === exs.length - 1;
    for (let s = 1; s <= e.sets; s++) {
      const lastSet = s === e.sets;
      const restAfter = lastSet ? (lastEx ? 0 : (w.roundRest ?? 90)) : e.rest;
      if (e.perSide) {
        steps.push({ exerciseIdx: ei, setNo: s, setsTotal: e.sets, side: 1, restAfter: 0 });
        steps.push({ exerciseIdx: ei, setNo: s, setsTotal: e.sets, side: 2, restAfter });
      } else {
        steps.push({ exerciseIdx: ei, setNo: s, setsTotal: e.sets, restAfter });
      }
    }
  });
  return steps;
}

/** Подпись контекста шага для шапки плеера */
export function stepContext(step: WorkoutStep, w: Workout): string {
  if (w.mode === 'superset' && step.round !== undefined && step.roundsTotal !== undefined) {
    return `Суперсет ${(step.pair ?? 0) + 1} · круг ${step.round} из ${step.roundsTotal}`;
  }
  if (w.mode === 'circuit' && step.round !== undefined && step.roundsTotal !== undefined) {
    return `Круг ${step.round} из ${step.roundsTotal}`;
  }
  return `Подход ${step.setNo} из ${step.setsTotal}`;
}

/** Сколько подходов засчитывает программа (стороны и части дроп-сета = 1 подход) */
export const plannedSets = (w: Workout): number =>
  w.exercises.reduce((n, e) => n + e.sets, 0);
