import { MathChallenge, MathOption } from '../types';
import { commonString } from '../constants/Strings';

export const generateMathChallenge = (): MathChallenge => {
  // Generates speed math challenges matching the Stitch reference (e.g., 17 + 26 = 43)
  const num1 = Math.floor(Math.random() * 25) + 12; // 12 - 36
  const num2 = Math.floor(Math.random() * 25) + 14; // 14 - 38
  const correctAnswer = num1 + num2;

  // Generate 3 unique wrong answers close to correct answer
  const wrongOffsets = [-2, -1, 1, 2, -3, 3];
  const shuffledOffsets = wrongOffsets.sort(() => Math.random() - 0.5);

  const wrongAnswers = new Set<number>();
  for (const offset of shuffledOffsets) {
    const val = correctAnswer + offset;
    if (val !== correctAnswer && val > 0) {
      wrongAnswers.add(val);
      if (wrongAnswers.size === 3) break;
    }
  }

  const allValues = [correctAnswer, ...Array.from(wrongAnswers)].sort(() => Math.random() - 0.5);
  const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  const options: MathOption[] = allValues.map((val, idx) => ({
    id: `opt-${idx}`,
    letter: letters[idx],
    value: val,
  }));

  return {
    id: `math-${Date.now()}`,
    num1,
    num2,
    operator: '+',
    question: `${num1} + ${num2}`,
    options,
    correctAnswer,
    timeLimit: 30,
  };
};

export const formatTwoDigits = (val: number | string): string => {
  const num = typeof val === 'string' ? parseInt(val, 10) : val;
  return num < 10 ? `0${num}` : `${num}`;
};

export interface Time12 {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
}

export const getCurrentTime12 = (date: Date = new Date()): Time12 => {
  let h = date.getHours();
  const m = date.getMinutes();
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return {
    hour: formatTwoDigits(h),
    minute: formatTwoDigits(m),
    period,
  };
};

export const calculateRestDuration = (
  targetHour: string,
  targetMinute: string,
  targetPeriod: 'AM' | 'PM',
  baseDate: Date = new Date(),
): string => {
  let h = parseInt(targetHour, 10);
  const m = parseInt(targetMinute, 10);
  if (isNaN(h) || isNaN(m)) return '';
  if (targetPeriod === 'PM' && h < 12) h += 12;
  if (targetPeriod === 'AM' && h === 12) h = 0;

  const target = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    h,
    m,
    0,
    0,
  );
  if (target.getTime() <= baseDate.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  const diffMs = target.getTime() - baseDate.getTime();
  const totalMins = Math.round(diffMs / 60000);
  const diffHours = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;
  if (diffHours === 0) {
    return `${remainingMins}m of rest`;
  }
  return `${diffHours}h ${remainingMins}m of rest`;
};



const SHORT_DAY_NAMES = commonString.shortDayNames;

// repeatDays uses 0 = Mon ... 6 = Sun
export const formatRepeatDays = (repeatDays: number[] = []): string => {
  const days = [...new Set(repeatDays)].sort((a, b) => a - b);
  if (days.length === 0) return commonString.repeatOnce;
  if (days.length === 7) return commonString.repeatEveryDay;
  if (days.join() === '0,1,2,3,4') return commonString.repeatWeekdays;
  if (days.join() === '5,6') return commonString.repeatWeekends;
  return days.map(d => SHORT_DAY_NAMES[d]).join(', ');
};

export interface WeekDay {
  key: string;
  label: string;
  date: number;
  isToday: boolean;
  isPast: boolean;
}

// Monday-first list of the current week's days
export const getCurrentWeek = (today: Date = new Date()): WeekDay[] => {
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  return SHORT_DAY_NAMES.map((label, index) => {
    const day = new Date(monday);
    day.setDate(monday.getDate() + index);
    return {
      key: label.toLowerCase(),
      label,
      date: day.getDate(),
      isToday: index === mondayOffset,
      isPast: index < mondayOffset,
    };
  });
};
