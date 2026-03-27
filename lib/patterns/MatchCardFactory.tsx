'use client';

import React from 'react';
import { SportMatch } from '../types/schedule.types';
import MatchCard from '@/components/schedule/MatchCard/MatchCard';

// ─── Variants ─────────────────────────────────────────────────
//
// Each variant maps to a distinct visual mode of MatchCard:
// - agenda   : collapsible card in the list view
// - compact  : minimal single-line card for 3-days view
// - modal    : fully expanded with a close (×) button for overlay context
// - sheet    : fully expanded without close button for the overflow bottom sheet

export type MatchCardVariant = 'agenda' | 'compact' | 'modal' | 'sheet';

export interface MatchCardFactoryOptions {
  match: SportMatch;
  isToday?: boolean;
  onClose?: () => void;
}

// ─── Factory ──────────────────────────────────────────────────
//
// Centralizes all card-creation decisions. Callers only need to
// declare intent ("create me a modal card") — prop details are
// an implementation concern of the factory, not the consumer.

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
