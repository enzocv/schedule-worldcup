'use client';

import React from 'react';
import { SportMatch } from '../types/schedule.types';
import MatchCard from '@/components/schedule/MatchCard/MatchCard';

// Variantes disponibles para MatchCard:
// - agenda  : tarjeta plegable en la vista de lista
// - compact : tarjeta compacta de una línea para la vista de 3 días
// - modal   : expandida con botón de cierre (×) para overlay
// - sheet   : expandida sin botón de cierre para el bottom sheet

export type MatchCardVariant = 'agenda' | 'compact' | 'modal' | 'sheet';

export interface MatchCardFactoryOptions {
  match: SportMatch;
  isToday?: boolean;
  onClose?: () => void;
}

// Fábrica centralizada de tarjetas.
// El consumidor solo declara la variante; los props concretos son responsabilidad de la fábrica.

class MatchCardFactoryImpl {
  create(variant: MatchCardVariant, options: MatchCardFactoryOptions): React.ReactElement {
    const { match, isToday = false, onClose } = options;

    switch (variant) {
      case 'agenda':
        return <MatchCard key={match.id} match={match} isToday={isToday} />;

      case 'compact':
        return <MatchCard key={match.id} match={match} compact />;

      case 'modal':
        return (
          <MatchCard
            key={match.id}
            match={match}
            isToday={isToday}
            alwaysExpanded
            onClose={onClose}
          />
        );

      case 'sheet':
        return (
          <MatchCard
            key={match.id}
            match={match}
            isToday={isToday}
            alwaysExpanded
          />
        );
    }
  }
}

export const MatchCardFactory = new MatchCardFactoryImpl();
