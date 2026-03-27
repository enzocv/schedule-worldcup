import { SportMatch, MatchPhase } from '../types/schedule.types';
import { ApiEvent } from '../types/api.types';
import { adaptApiEvent } from '../utils/schedule.adapter';

// Eventos crudos tal como los devuelve el endpoint.
// Los campos pesados (Markets, MarketGroups, etc.) no se almacenan aquí;
// solo se guardan los campos que ApiEvent tipea.
const RAW_EVENTS: ApiEvent[] = [
  // Jun 11
  {
    _id: '784926067864698880',
    EventName: 'México vs Sudáfrica',
    StartEventDate: '2026-06-11T19:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#FFFF00' },
  },

  // Jun 12 (CDT) / Jun 13 (UTC)
  {
    _id: '784926067055177728',
    EventName: 'EE.UU. vs Paraguay',
    StartEventDate: '2026-06-13T01:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#FFFFFF' },
  },

  // Jun 13
  {
    _id: '784926068556738560',
    EventName: 'Catar vs Suiza',
    StartEventDate: '2026-06-13T19:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#FF0000' },
  },
  {
    _id: '784926066975498240',
    EventName: 'Brasil vs Marruecos',
    StartEventDate: '2026-06-13T22:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { HomeShirtColorPrimary: '#FFFF00' },
  },

  // Jun 13 (CDT) / Jun 14 (UTC)
  {
    _id: '784926067864678400',
    EventName: 'Haití vs Escocia',
    StartEventDate: '2026-06-14T01:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { HomeShirtColorPrimary: '#0000FF' },
  },

  // Jun 14
  {
    _id: '784926068300906496',
    EventName: 'Alemania vs Curazao',
    StartEventDate: '2026-06-14T17:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#8000FF' },
  },
  {
    _id: '784926068070199296',
    EventName: 'Países Bajos vs Japón',
    StartEventDate: '2026-06-14T20:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { HomeShirtColorPrimary: '#FF8000' },
  },

  // Jun 14 (CDT) / Jun 15 (UTC)
  {
    _id: '784920404715425792',
    EventName: 'Costa de Marfil vs Ecuador',
    StartEventDate: '2026-06-14T23:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { HomeShirtColorPrimary: '#FF8000' },
  },

  // Jun 15
  {
    _id: '784926068107968512',
    EventName: 'España vs Cabo Verde',
    StartEventDate: '2026-06-15T16:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#0000FF' },
  },
  {
    _id: '784926067675947008',
    EventName: 'Bélgica vs Egipto',
    StartEventDate: '2026-06-15T19:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#FFFFFF' },
  },
  {
    _id: '784926068082794496',
    EventName: 'Arabia Saudita vs Uruguay',
    StartEventDate: '2026-06-15T22:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#00FFFF' },
  },

  // Jun 15 (CDT) / Jun 16 (UTC)
  {
    _id: '784921640118308864',
    EventName: 'Irán vs Nueva Zelanda',
    StartEventDate: '2026-06-16T01:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#0000FF' },
  },

  // Jun 16
  {
    _id: '784926068753891328',
    EventName: 'Francia vs Senegal',
    StartEventDate: '2026-06-16T19:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { HomeShirtColorPrimary: '#FFFFFF' },
  },

  // Jun 16 (CDT) / Jun 17 (UTC)
  {
    _id: '784926068674199552',
    EventName: 'Argentina vs Argelia',
    StartEventDate: '2026-06-17T01:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#00FF00' },
  },
  {
    _id: '784926068837769216',
    EventName: 'Austria vs Jordania',
    StartEventDate: '2026-06-17T04:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#FF0000' },
  },

  // Jun 17
  {
    _id: '784926068997140480',
    EventName: 'Inglaterra vs Croacia',
    StartEventDate: '2026-06-17T20:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#FF0000' },
  },

  // Jun 17 (CDT) / Jun 18 (UTC)
  {
    _id: '784926069194293248',
    EventName: 'Ghana vs Panamá',
    StartEventDate: '2026-06-17T23:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { AwayShirtColorPrimary: '#0000FF' },
  },
  {
    _id: '784915745695125504',
    EventName: 'Uzbekistán vs Colombia',
    StartEventDate: '2026-06-18T02:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: { HomeShirtColorPrimary: '#0000FF' },
  },

  // Jun 18
  {
    _id: '802017753149210624',
    EventName: 'Canadá vs Catar',
    StartEventDate: '2026-06-18T22:00:00.000Z',
    LeagueName: 'Copa Mundial 2026',
    IsLive: false,
    IsSuspended: false,
    SportName: 'Fútbol',
    RegionName: 'Internacional',
    Metadata: {},
  },
];

// Fase por _id.
// La fase de grupo no viene en el endpoint; se mantiene como dato suplementario.
// Grupos aproximados según el sorteo; actualizar cuando el feed lo exponga.
const PHASE_MAP: Record<string, MatchPhase> = {
  // Grupo A
  '784926067864698880': 'Grupo A', // México vs Sudáfrica
  '784926068674199552': 'Grupo A', // Argentina vs Argelia
  // Grupo B
  '784926067055177728': 'Grupo B', // EE.UU. vs Paraguay
  '784926068837769216': 'Grupo B', // Austria vs Jordania
  // Grupo C
  '784926068556738560': 'Grupo C', // Catar vs Suiza
  '802017753149210624': 'Grupo C', // Canadá vs Catar
  '784926068997140480': 'Grupo C', // Inglaterra vs Croacia
  // Grupo D
  '784926066975498240': 'Grupo D', // Brasil vs Marruecos
  '784926067864678400': 'Grupo D', // Haití vs Escocia
  // Grupo E
  '784926068300906496': 'Grupo E', // Alemania vs Curazao
  '784926069194293248': 'Grupo E', // Ghana vs Panamá
  // Grupo F
  '784926068070199296': 'Grupo F', // Países Bajos vs Japón
  '784915745695125504': 'Grupo F', // Uzbekistán vs Colombia
  // Grupo G
  '784920404715425792': 'Grupo G', // Costa de Marfil vs Ecuador
  // Grupo H
  '784926068107968512': 'Grupo H', // España vs Cabo Verde
  // Grupo I
  '784926067675947008': 'Grupo I', // Bélgica vs Egipto
  // Grupo J
  '784926068082794496': 'Grupo J', // Arabia Saudita vs Uruguay
  // Grupo K
  '784921640118308864': 'Grupo K', // Irán vs Nueva Zelanda
  // Grupo L
  '784926068753891328': 'Grupo L', // Francia vs Senegal
};

// Overrides de demo.
// Datos que no vienen en el endpoint (cuotas en vivo, link de transmisión).
// Se mantienen solo para mostrar el componente completo en desarrollo.
const MATCH_OVERRIDES: Partial<Record<string, Partial<SportMatch>>> = {
  '784926067864698880': {
    isLive: true,
    liveStream: { label: 'Mira aquí la transmisión con Jorge Luna' },
    odds: {
      homeWin: { label: 'México', value: 1.45 },
      draw:    { label: 'Empate', value: 2.0  },
      awayWin: { label: 'Sudáfrica', value: 2.25 },
    },
  },
};

// Fase eliminatoria – se actualiza cuando el endpoint los exponga.
// Los equipos se marcan "Por definir" hasta que avance el torneo.
const KNOCKOUT_MATCHES: SportMatch[] = [
  // Ronda de 16
  { id: 'm101', homeTeam: { id: 'tbd10', name: 'Por definir' }, awayTeam: { id: 'tbd11', name: 'Por definir' }, date: '2026-06-28', time: '14:00', competition: 'Copa Mundial 2026', phase: '16vos' },
  { id: 'm102', homeTeam: { id: 'tbd12', name: 'Por definir' }, awayTeam: { id: 'tbd13', name: 'Por definir' }, date: '2026-06-29', time: '12:00', competition: 'Copa Mundial 2026', phase: '16vos' },
  { id: 'm103', homeTeam: { id: 'tbd14', name: 'Por definir' }, awayTeam: { id: 'tbd15', name: 'Por definir' }, date: '2026-06-29', time: '15:30', competition: 'Copa Mundial 2026', phase: '16vos' },
  { id: 'm104', homeTeam: { id: 'tbd16', name: 'Por definir' }, awayTeam: { id: 'tbd17', name: 'Por definir' }, date: '2026-06-29', time: '20:00', competition: 'Copa Mundial 2026', phase: '16vos' },
  { id: 'm105', homeTeam: { id: 'tbd18', name: 'Por definir' }, awayTeam: { id: 'tbd19', name: 'Por definir' }, date: '2026-06-30', time: '12:00', competition: 'Copa Mundial 2026', phase: '16vos' },
  { id: 'm106', homeTeam: { id: 'tbd20', name: 'Por definir' }, awayTeam: { id: 'tbd21', name: 'Por definir' }, date: '2026-06-30', time: '16:00', competition: 'Copa Mundial 2026', phase: '16vos' },
  { id: 'm107', homeTeam: { id: 'tbd22', name: 'Por definir' }, awayTeam: { id: 'tbd23', name: 'Por definir' }, date: '2026-06-30', time: '20:00', competition: 'Copa Mundial 2026', phase: '16vos' },
  { id: 'm108', homeTeam: { id: 'tbd24', name: 'Por definir' }, awayTeam: { id: 'tbd25', name: 'Por definir' }, date: '2026-07-01', time: '11:00', competition: 'Copa Mundial 2026', phase: '16vos' },
  { id: 'm109', homeTeam: { id: 'tbd26', name: 'Por definir' }, awayTeam: { id: 'tbd27', name: 'Por definir' }, date: '2026-07-01', time: '15:00', competition: 'Copa Mundial 2026', phase: '16vos' },

  // 8vos
  { id: 'm201', homeTeam: { id: 'tbd30', name: 'Por definir' }, awayTeam: { id: 'tbd31', name: 'Por definir' }, date: '2026-07-04', time: '15:00', competition: 'Copa Mundial 2026', phase: '8vos' },
  { id: 'm202', homeTeam: { id: 'tbd32', name: 'Por definir' }, awayTeam: { id: 'tbd33', name: 'Por definir' }, date: '2026-07-04', time: '20:00', competition: 'Copa Mundial 2026', phase: '8vos' },

  // 4tos
  { id: 'm301', homeTeam: { id: 'tbd50', name: 'Por definir' }, awayTeam: { id: 'tbd51', name: 'Por definir' }, date: '2026-07-10', time: '15:00', competition: 'Copa Mundial 2026', phase: '4tos' },
  { id: 'm302', homeTeam: { id: 'tbd52', name: 'Por definir' }, awayTeam: { id: 'tbd53', name: 'Por definir' }, date: '2026-07-10', time: '20:00', competition: 'Copa Mundial 2026', phase: '4tos' },

  // Semifinales
  { id: 'm401', homeTeam: { id: 'tbd60', name: 'Por definir' }, awayTeam: { id: 'tbd61', name: 'Por definir' }, date: '2026-07-14', time: '20:00', competition: 'Copa Mundial 2026', phase: 'Semi' },
  { id: 'm402', homeTeam: { id: 'tbd62', name: 'Por definir' }, awayTeam: { id: 'tbd63', name: 'Por definir' }, date: '2026-07-15', time: '20:00', competition: 'Copa Mundial 2026', phase: 'Semi' },

  // Tercer puesto
  { id: 'm501', homeTeam: { id: 'tbd70', name: 'Por definir' }, awayTeam: { id: 'tbd71', name: 'Por definir' }, date: '2026-07-18', time: '17:00', competition: 'Copa Mundial 2026', phase: '3er' },

  // Final
  { id: 'm601', homeTeam: { id: 'tbd80', name: 'Por definir' }, awayTeam: { id: 'tbd81', name: 'Por definir' }, date: '2026-07-19', time: '17:00', competition: 'Copa Mundial 2026', phase: 'Final' },
];

// Partidos extra de demo – escenarios variados para la vista semanal.
const DEMO_EXTRA_MATCHES: SportMatch[] = [

  // Jun 9 (Mar) – 1 evento solo + 1 por definir
  {
    id: 'demo-001',
    homeTeam: { id: 'por', name: 'Portugal', flagEmoji: '🇵🇹' },
    awayTeam: { id: 'zam', name: 'Zambia',   flagEmoji: '🇿🇲' },
    date: '2026-06-09',
    time: '18:00',
    competition: 'Copa Mundial 2026',
    phase: 'Grupo B',
    odds: {
      homeWin: { label: 'Portugal', value: 1.25 },
      draw:    { label: 'Empate',   value: 5.50 },
      awayWin: { label: 'Zambia',   value: 9.00 },
    },
  },
  {
    id: 'demo-tdb-001a',
    homeTeam: { id: 'aus', name: 'Australia', flagEmoji: '🇦🇺' },
    awayTeam: { id: 'tur', name: 'Turquía',   flagEmoji: '🇹🇷' },
    date: '2026-06-09',
    time: '18:00',
    competition: 'Copa Mundial 2026',
    phase: 'Grupo B',
    odds: {
      homeWin: { label: 'Australia', value: 1.25 },
      draw:    { label: 'Empate',   value: 5.50 },
      awayWin: { label: 'Turquía',   value: 9.00 },
    },
  },
  {
    id: 'demo-tdb-002b',
    homeTeam: { id: 'swe', name: 'Suecia',  flagEmoji: '🇸🇪' },
    awayTeam: { id: 'nga', name: 'Nigeria', flagEmoji: '🇳🇬' },
    date: '2026-06-09',
    time: '18:00',
    competition: 'Copa Mundial 2026',
    phase: 'Grupo B',
    odds: {
      homeWin: { label: 'Suecia', value: 1.25 },
      draw:    { label: 'Empate',   value: 5.50 },
      awayWin: { label: 'Nigeria',   value: 9.00 },
    },
  },
  // TBD ese mismo día – aún no se conocen los equipos
  {
    id: 'demo-tbd-001',
    homeTeam: { id: 'tbd-g1', name: 'Por definir' },
    awayTeam: { id: 'tbd-g2', name: 'Por definir' },
    date: '2026-06-09',
    time: '21:00',
    competition: 'Copa Mundial 2026',
    phase: 'Grupo G',
  },

  // Jun 10 (Mié) – 2 eventos a la misma hora (14:00) + 1 TBD
  {
    id: 'demo-002',
    homeTeam: { id: 'kor', name: 'Corea del Sur', flagEmoji: '🇰🇷' },
    awayTeam: { id: 'gre', name: 'Grecia',        flagEmoji: '🇬🇷' },
    date: '2026-06-10',
    time: '14:00',
    competition: 'Copa Mundial 2026',
    phase: 'Grupo C',
  },
  {
    id: 'demo-003',
    homeTeam: { id: 'aus', name: 'Australia', flagEmoji: '🇦🇺' },
    awayTeam: { id: 'tur', name: 'Turquía',   flagEmoji: '🇹🇷' },
    date: '2026-06-10',
    time: '14:40', // misma hora que Corea del Sur
    competition: 'Copa Mundial 2026',
    phase: 'Grupo D',
  },
  {
    id: 'demo-tbd-002',
    homeTeam: { id: 'tbd-g3', name: 'Por definir' },
    awayTeam: { id: 'tbd-g4', name: 'Por definir' },
    date: '2026-06-10',
    time: '21:00',
    competition: 'Copa Mundial 2026',
    phase: 'Grupo H',
  },

  // Jun 11 (Jue) – ya tiene México (14:00), sumar 2 más = 3 total → pill
  {
    id: 'demo-004',
    homeTeam: { id: 'swe', name: 'Suecia',  flagEmoji: '🇸🇪' },
    awayTeam: { id: 'nga', name: 'Nigeria', flagEmoji: '🇳🇬' },
    date: '2026-06-11',
    time: '14:00', // misma hora que México
    competition: 'Copa Mundial 2026',
    phase: 'Grupo E',
  },
  {
    id: 'demo-005',
    homeTeam: { id: 'jpn', name: 'Japón',   flagEmoji: '🇯🇵' },
    awayTeam: { id: 'cmr', name: 'Camerún', flagEmoji: '🇨🇲' },
    date: '2026-06-11',
    time: '17:00',
    competition: 'Copa Mundial 2026',
    phase: 'Grupo F',
    odds: {
      homeWin: { label: 'Japón',   value: 2.40 },
      draw:    { label: 'Empate',  value: 3.10 },
      awayWin: { label: 'Camerún', value: 2.90 },
    },
  },

  // Jun 12 (Vie) – EE.UU. (20:00) + 1 a la misma hora = 2 total (ambas se muestran)
  {
    id: 'demo-006',
    homeTeam: { id: 'mex2', name: 'México', flagEmoji: '🇲🇽' },
    awayTeam: { id: 'chi',  name: 'Chile',  flagEmoji: '🇨🇱' },
    date: '2026-06-12',
    time: '20:00', // misma hora que EE.UU.
    competition: 'Copa Mundial 2026',
    phase: 'Grupo A',
  },
];

// Export principal – mismo contrato que antes, sin cambios en los consumidores.
export const WORLDCUP_2026_MATCHES: SportMatch[] = [
  ...RAW_EVENTS.map((event) => {
    const base = adaptApiEvent(event, PHASE_MAP[event._id] ?? 'Grupo A');
    const override = MATCH_OVERRIDES[event._id];
    return override ? { ...base, ...override } : base;
  }),
  ...DEMO_EXTRA_MATCHES,
  ...KNOCKOUT_MATCHES,
];
