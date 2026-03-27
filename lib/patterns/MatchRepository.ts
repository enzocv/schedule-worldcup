import { SportMatch, MatchPhase, DaySchedule } from '../types/schedule.types';
import { WORLDCUP_2026_MATCHES } from '../data/worldcup2026';
import { DAY_LABELS_ES, MONTH_NAMES_ES } from '../utils/locale';

// Contrato para cualquier fuente de datos de partidos.
// Nuevas fuentes (API REST, GraphQL, mock) solo tienen que implementar esta interfaz;
// los consumidores no necesitan cambiar.

export interface IMatchRepository {
  getAll(): SportMatch[];
  getByDate(date: string): SportMatch[];
  getByPhase(phase: MatchPhase): SportMatch[];
  getLive(): SportMatch[];
  getUpcoming(fromDate: string): SportMatch[];
  /** Agrupa todos los partidos en objetos DaySchedule para renderizar. */
  toDaySchedules(todayKey: string): DaySchedule[];
}

// Implementación concreta con array en memoria.
// Reemplazar por ApiMatchRepository cuando haya un endpoint real.

export class StaticMatchRepository implements IMatchRepository {
  constructor(private readonly matches: SportMatch[] = WORLDCUP_2026_MATCHES) {}

  getAll(): SportMatch[] {
    return this.matches;
  }

  getByDate(date: string): SportMatch[] {
    return this.matches.filter((m) => m.date === date);
  }

  getByPhase(phase: MatchPhase): SportMatch[] {
    return this.matches.filter((m) => m.phase === phase);
  }

  getLive(): SportMatch[] {
    return this.matches.filter((m) => m.isLive === true);
  }

  getUpcoming(fromDate: string): SportMatch[] {
    return this.matches.filter((m) => m.date >= fromDate);
  }

  toDaySchedules(todayKey: string): DaySchedule[] {
    const grouped = new Map<string, SportMatch[]>();
    for (const match of this.matches) {
      if (!grouped.has(match.date)) grouped.set(match.date, []);
      grouped.get(match.date)!.push(match);
    }
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, dayMatches]) => {
        const d = new Date(date + 'T00:00:00');
        return {
          date,
          dayLabel: DAY_LABELS_ES[d.getDay()],
          dayNumber: d.getDate(),
          monthName: MONTH_NAMES_ES[d.getMonth()],
          isToday: date === todayKey,
          matches: dayMatches,
        };
      });
  }
}

// Singleton del dataset del Mundial
export const worldCupRepository = new StaticMatchRepository();
