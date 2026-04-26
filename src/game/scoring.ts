export const STARTING_HEARTS = 3;
export const XP_PER_CORRECT = 10;
export const XP_BONUS_LESSON = 20;

export function lessonXp(correct: number, hearts: number): number {
  const heartBonus = hearts * 5;
  return correct * XP_PER_CORRECT + XP_BONUS_LESSON + heartBonus;
}

export function accuracy(correct: number, total: number): number {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}
