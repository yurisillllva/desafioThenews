export const calculateStreak = (dates: Date[]): { 
  currentStreak: number; 
  maxStreak: number; 
  streakHistory: number[] 
} => {
  if (dates.length === 0) return { currentStreak: 0, maxStreak: 0, streakHistory: [] };

  // Passo 1: Processar datas em UTC e ordenar
  const validDates = Array.from(new Set(
    dates
      .map(date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))) // UTC
      .filter(date => date.getUTCDay() !== 0) // Domingo = 0 em UTC
      .sort((a, b) => a.getTime() - b.getTime())
  ));

  // Passo 2: Calcular streak histórico
  let currentStreak = 1;
  let maxStreak = 1;
  const streakHistory = [];

  for (let i = 1; i < validDates.length; i++) {
    const prev = validDates[i - 1];
    const curr = validDates[i];
    const diffDays = (curr.getTime() - prev.getTime()) / (86400000); // 1 dia em ms

    if (diffDays === 1 || (prev.getUTCDay() === 6 && curr.getUTCDay() === 1 && diffDays === 2)) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    streakHistory.push(currentStreak);
  }

  // Passo 3: Verificar data atual (em UTC)
  const todayUTC = new Date();
  todayUTC.setUTCHours(0, 0, 0, 0); // Normaliza para UTC

  if (validDates.length > 0 && todayUTC.getUTCDay() !== 0) {
    const lastValidDate = validDates[validDates.length - 1];
    const diffDays = (todayUTC.getTime() - lastValidDate.getTime()) / 86400000;

    if (diffDays === 1 || (lastValidDate.getUTCDay() === 6 && todayUTC.getUTCDay() === 1 && diffDays === 2)) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    }
  }

  if (maxStreak === 1) {
    currentStreak = 0;
    maxStreak = 0 
  } else if (maxStreak === 2) {
    currentStreak = 1;
    maxStreak = 1 
  }

  return { currentStreak, maxStreak, streakHistory };
};