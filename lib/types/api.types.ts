/**
 * Estructura del evento tal como lo devuelve el endpoint de partidos.
 * Solo se tipean los campos que la app consume; el resto (Markets, etc.)
 * se ignora intencionalmente.
 */

export interface ApiEventMetadata {
  HomeShirtColorPrimary?: string;
  AwayShirtColorPrimary?: string;
}

export interface ApiEvent {
  /** ID único del evento en el sportsbook */
  _id: string;
  /** "Local vs Visitante"  e.g. "México vs Sudáfrica" */
  EventName: string;
  /** ISO 8601 UTC  e.g. "2026-06-11T19:00:00.000Z" */
  StartEventDate: string;
  LeagueName: string;
  IsLive: boolean;
  IsSuspended: boolean;
  SportName: string;
  RegionName: string;
  Metadata: ApiEventMetadata;
}

export interface ApiScheduleResponse {
  Events: ApiEvent[];
  TotalCount: number;
}
