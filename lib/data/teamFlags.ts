/**
 * Mapa de nombre de equipo (tal como viene en `EventName` del API)
 * hacia su id interno y emoji de bandera.
 *
 * Las banderas NO vienen del endpoint; se resuelven aquí localmente.
 * Añadir entradas cuando aparezcan equipos nuevos en el feed.
 */

export interface TeamInfo {
  id: string;
  flagEmoji: string;
}

export const TEAM_FLAG_MAP: Record<string, TeamInfo> = {
  // ── América del Norte / CONCACAF ─────────────────────────
  'México':             { id: 'mex', flagEmoji: '🇲🇽' },
  'Canadá':             { id: 'can', flagEmoji: '🇨🇦' },
  'EE.UU.':             { id: 'usa', flagEmoji: '🇺🇸' },
  'Estados Unidos':     { id: 'usa', flagEmoji: '🇺🇸' },
  'Costa Rica':         { id: 'crc', flagEmoji: '🇨🇷' },
  'Panamá':             { id: 'pan', flagEmoji: '🇵🇦' },
  'Honduras':           { id: 'hon', flagEmoji: '🇭🇳' },
  'Jamaica':            { id: 'jam', flagEmoji: '🇯🇲' },
  'Haití':              { id: 'hai', flagEmoji: '🇭🇹' },
  'Curazao':            { id: 'cuw', flagEmoji: '🇨🇼' },

  // ── América del Sur / CONMEBOL ────────────────────────────
  'Brasil':             { id: 'bra', flagEmoji: '🇧🇷' },
  'Argentina':          { id: 'arg', flagEmoji: '🇦🇷' },
  'Uruguay':            { id: 'uru', flagEmoji: '🇺🇾' },
  'Colombia':           { id: 'col', flagEmoji: '🇨🇴' },
  'Ecuador':            { id: 'ecu', flagEmoji: '🇪🇨' },
  'Paraguay':           { id: 'par', flagEmoji: '🇵🇾' },
  'Chile':              { id: 'chi', flagEmoji: '🇨🇱' },
  'Perú':               { id: 'per', flagEmoji: '🇵🇪' },
  'Bolivia':            { id: 'bol', flagEmoji: '🇧🇴' },
  'Venezuela':          { id: 'ven', flagEmoji: '🇻🇪' },

  // ── Europa / UEFA ─────────────────────────────────────────
  'España':             { id: 'esp', flagEmoji: '🇪🇸' },
  'Francia':            { id: 'fra', flagEmoji: '🇫🇷' },
  'Alemania':           { id: 'ger', flagEmoji: '🇩🇪' },
  'Inglaterra':         { id: 'eng', flagEmoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'Portugal':           { id: 'por', flagEmoji: '🇵🇹' },
  'Países Bajos':       { id: 'ned', flagEmoji: '🇳🇱' },
  'Bélgica':            { id: 'bel', flagEmoji: '🇧🇪' },
  'Italia':             { id: 'ita', flagEmoji: '🇮🇹' },
  'Croacia':            { id: 'cro', flagEmoji: '🇭🇷' },
  'Austria':            { id: 'aut', flagEmoji: '🇦🇹' },
  'Suiza':              { id: 'sui', flagEmoji: '🇨🇭' },
  'Dinamarca':          { id: 'den', flagEmoji: '🇩🇰' },
  'Escocia':            { id: 'sco', flagEmoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  'Gales':              { id: 'wal', flagEmoji: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  'Polonia':            { id: 'pol', flagEmoji: '🇵🇱' },
  'Serbia':             { id: 'srb', flagEmoji: '🇷🇸' },
  'Ucrania':            { id: 'ukr', flagEmoji: '🇺🇦' },
  'Turquía':            { id: 'tur', flagEmoji: '🇹🇷' },
  'Grecia':             { id: 'gre', flagEmoji: '🇬🇷' },
  'Hungría':            { id: 'hun', flagEmoji: '🇭🇺' },
  'República Checa':    { id: 'cze', flagEmoji: '🇨🇿' },
  'Rumanía':            { id: 'rou', flagEmoji: '🇷🇴' },
  'Eslovenia':          { id: 'svn', flagEmoji: '🇸🇮' },
  'Eslovaquia':         { id: 'svk', flagEmoji: '🇸🇰' },
  'Albania':            { id: 'alb', flagEmoji: '🇦🇱' },
  'Georgia':            { id: 'geo', flagEmoji: '🇬🇪' },

  // ── África / CAF ─────────────────────────────────────────
  'Marruecos':          { id: 'mar', flagEmoji: '🇲🇦' },
  'Senegal':            { id: 'sen', flagEmoji: '🇸🇳' },
  'Nigeria':            { id: 'nga', flagEmoji: '🇳🇬' },
  'Ghana':              { id: 'gha', flagEmoji: '🇬🇭' },
  'Costa de Marfil':    { id: 'civ', flagEmoji: '🇨🇮' },
  'Sudáfrica':          { id: 'rsa', flagEmoji: '🇿🇦' },
  'Egipto':             { id: 'egy', flagEmoji: '🇪🇬' },
  'Argelia':            { id: 'alg', flagEmoji: '🇩🇿' },
  'Túnez':              { id: 'tun', flagEmoji: '🇹🇳' },
  'Camerún':            { id: 'cmr', flagEmoji: '🇨🇲' },
  'Cabo Verde':         { id: 'cpv', flagEmoji: '🇨🇻' },
  'Mali':               { id: 'mli', flagEmoji: '🇲🇱' },
  'Tanzania':           { id: 'tan', flagEmoji: '🇹🇿' },
  'Angola':             { id: 'ang', flagEmoji: '🇦🇴' },

  // ── Asia / AFC ────────────────────────────────────────────
  'Japón':              { id: 'jpn', flagEmoji: '🇯🇵' },
  'República de Corea': { id: 'kor', flagEmoji: '🇰🇷' },
  'Arabia Saudita':     { id: 'ksa', flagEmoji: '🇸🇦' },
  'Irán':               { id: 'irn', flagEmoji: '🇮🇷' },
  'Australia':          { id: 'aus', flagEmoji: '🇦🇺' },
  'Catar':              { id: 'qat', flagEmoji: '🇶🇦' },
  'Uzbekistán':         { id: 'uzb', flagEmoji: '🇺🇿' },
  'Irak':               { id: 'irq', flagEmoji: '🇮🇶' },
  'Jordania':           { id: 'jor', flagEmoji: '🇯🇴' },
  'China':              { id: 'chn', flagEmoji: '🇨🇳' },
  'Tailandia':          { id: 'tha', flagEmoji: '🇹🇭' },

  // ── Oceanía / OFC ────────────────────────────────────────
  'Nueva Zelanda':      { id: 'nzl', flagEmoji: '🇳🇿' },
};
