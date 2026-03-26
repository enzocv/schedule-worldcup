import { SportMatch, MatchPhase, Team } from '../types/schedule.types';
import { ApiEvent } from '../types/api.types';
import { TEAM_FLAG_MAP } from '../data/teamFlags';

function resolveTeam(name: string): Team {
  const info = TEAM_FLAG_MAP[name];
  return {
    id: info?.id ?? name.toLowerCase().replace(/[\s.]+/g, '_'),
    name,
    flagEmoji: info?.flagEmoji,
  };
}

/**
 * Convierte una fecha UTC a CDT (UTC-5, horario de verano de Norteamérica)
 * y devuelve date (YYYY-MM-DD) y time (HH:mm).
 *
 * Los partidos del Mundial 2026 se juegan en ciudades de EE.UU., Canadá y México,
 * todas bajo CDT en verano.
 */
function utcToCdt(utcIso: string): { date: string; time: string } {
  const d = new Date(utcIso);
  const cdt = new Date(d.getTime() - 5 * 60 * 60 * 1000);
  const year  = cdt.getUTCFullYear();
  const month = String(cdt.getUTCMonth() + 1).padStart(2, '0');
  const day   = String(cdt.getUTCDate()).padStart(2, '0');
  const hours = String(cdt.getUTCHours()).padStart(2, '0');
  const mins  = String(cdt.getUTCMinutes()).padStart(2, '0');
  return { date: `${year}-${month}-${day}`, time: `${hours}:${mins}` };
}

/**
 * Transforma un evento crudo del API en un SportMatch listo para renderizar.
 *
 * - `phase` no viene del endpoint y debe ser provista como dato suplementario.
 * - Las banderas se resuelven desde TEAM_FLAG_MAP usando el nombre del equipo.
 * - La hora se convierte de UTC a CDT.
 */
export function adaptApiEvent(event: ApiEvent, phase: MatchPhase): SportMatch {
  const separatorIdx = event.EventName.indexOf(' vs ');
  const homeName = event.EventName.slice(0, separatorIdx).trim();
  const awayName = event.EventName.slice(separatorIdx + 4).trim();
  const { date, time } = utcToCdt(event.StartEventDate);

  return {
    id: event._id,
    homeTeam: resolveTeam(homeName),
    awayTeam: resolveTeam(awayName),
    date,
    time,
    competition: event.LeagueName,
    phase,
    isLive: event.IsLive || undefined,
  };
}
