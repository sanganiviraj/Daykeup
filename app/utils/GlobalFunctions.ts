import { MathChallenge, MathOption } from '../types';

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

