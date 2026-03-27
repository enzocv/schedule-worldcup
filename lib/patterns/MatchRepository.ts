import { SportMatch, MatchPhase, DaySchedule } from '../types/schedule.types';
import { WORLDCUP_2026_MATCHES } from '../data/worldcup2026';
import { DAY_LABELS_ES, MONTH_NAMES_ES } from '../utils/locale';

// ─── Interface ────────────────────────────────────────────────
//
// Defines the contract for any match data source.
// New data sources (REST API, GraphQL, mock) only need
// to implement this interface — consumers never change.

export interface IMatchRepository {
  getAll(): SportMatch[];
  getByDate(date: string): SportMatch[];
  getByPhase(phase: MatchPhase): SportMatch[];
  getLive(): SportMatch[];
  getUpcoming(fromDate: string): SportMatch[];
  /** Groups all matches into DaySchedule objects for rendering. */
  toDaySchedules(todayKey: string): DaySchedule[];
}

// ─── Concrete implementation ──────────────────────────────────
//
// StaticMatchRepository works with an in-memory array of SportMatch.
// Swap this class for an ApiMatchRepository when a real endpoint is available.

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

// ─── Singleton for the World Cup dataset ─────────────────────
export const worldCupRepository = new StaticMatchRepository();
