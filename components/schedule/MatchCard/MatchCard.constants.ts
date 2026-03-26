export interface MarketBadge {
  label: string;
  /** Clave del módulo CSS para el color del badge */
  styleKey: 'iconBadgePa' | 'iconBadgeBb' | 'iconBadgeSc';
  /** Si true, el badge se oculta cuando el partido está en vivo */
  hideWhenLive?: boolean;
}

export const MARKET_BADGES: MarketBadge[] = [
  { label: 'PA', styleKey: 'iconBadgePa', hideWhenLive: true },
  { label: 'BB', styleKey: 'iconBadgeBb' },
  { label: 'SC', styleKey: 'iconBadgeSc' },
];
