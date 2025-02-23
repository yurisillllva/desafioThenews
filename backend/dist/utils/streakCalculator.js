"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStreak = void 0;
const calculateStreak = (dates) => {
    if (dates.length === 0)
        return { currentStreak: 0, maxStreak: 0, streakHistory: [] };
    // Passo 1: Remover duplicatas e domingos, ordenar datas
    const uniqueDates = Array.from(new Set(dates
        .map(date => {
        // Converter para data local (ignorando horário)
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    })
        .filter(date => date.getDay() !== 0) // Não pegar os domingos
        .sort((a, b) => a.getTime() - b.getTime())));
    // Passo 2: Calcular streaks
    let currentStreak = 1;
    let maxStreak = 1;
    const streakHistory = [1];
    for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = uniqueDates[i - 1];
        const currDate = uniqueDates[i];
        const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            currentStreak++;
        }
        else {
            currentStreak = 1; // Quebra de sequência
        }
        maxStreak = Math.max(maxStreak, currentStreak);
        streakHistory.push(currentStreak);
    }
    return { currentStreak, maxStreak, streakHistory };
};
exports.calculateStreak = calculateStreak;
