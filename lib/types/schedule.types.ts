/**
 * Tipos para la vista de agenda deportiva
 */

export type ScheduleViewMode = 'agenda' | '3days' | 'week';

export type MatchPhase =
  | 'Grupo A'
  | 'Grupo B'
  | 'Grupo C'
  | 'Grupo D'
  | 'Grupo E'
  | 'Grupo F'
  | 'Grupo G'
  | 'Grupo H'
  | 'Grupo I'
  | 'Grupo J'
  | 'Grupo K'
  | 'Grupo L'
  | '16vos'
  | '8vos'
  | '4tos'
  | 'Semi'
  | '3er'
  | 'Final';

export const MATCH_PHASES: MatchPhase[] = [
  'Grupo A', 'Grupo B', 'Grupo C', 'Grupo D',
  'Grupo E', 'Grupo F', 'Grupo G', 'Grupo H',
  'Grupo I', 'Grupo J', 'Grupo K', 'Grupo L',
  '16vos', '8vos', '4tos', 'Semi', '3er', 'Final',
];

export const PHASE_FILTER_LABELS: { value: MatchPhase | null; label: string }[] = [
  { value: null, label: 'Grupo A, B, C...etc' },
  { value: '16vos', label: '16vos' },
  { value: '8vos', label: '8vos' },
  { value: '4tos', label: '4tos' },
  { value: 'Semi', label: 'Semi' },
  { value: '3er', label: '3er' },
  { value: 'Final', label: 'Final' },
];

export interface Team {
  id: string;
  name: string;
  flagEmoji?: string;
}

export interface OddsOption {
  label: string;
  value: number;
}

export interface MatchOddsData {
  homeWin: OddsOption;
  draw: OddsOption;
  awayWin: OddsOption;
}

export interface LiveStream {
  label: string;
  url?: string;
}

export interface SportMatch {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
  competition: string;
  phase: MatchPhase;
  isLive?: boolean;
  liveStream?: LiveStream;
  odds?: MatchOddsData;
  result?: {
    homeScore: number;
    awayScore: number;
  };
}

export interface DaySchedule {
  /** YYYY-MM-DD */
  date: string;
  /** "Lun", "Mar", etc. */
  dayLabel: string;
  dayNumber: number;
  monthName: string;
  isToday: boolean;
  matches: SportMatch[];
}
