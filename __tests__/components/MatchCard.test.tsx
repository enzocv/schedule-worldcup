import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchCard from '@/components/schedule/MatchCard/MatchCard';
import { renderWithStore } from '../utils/renderWithStore';
import { matchBase, matchWithOdds, matchLive, selectionMexico } from '../fixtures/matches';

// Vista compacta

describe('MatchCard — vista compacta', () => {
  it('muestra equipos, fase, hora y competición', () => {
    renderWithStore(<MatchCard match={matchBase} compact />);
    expect(screen.getByText('México vs Sudáfrica')).toBeInTheDocument();
    expect(screen.getByText('Grupo A')).toBeInTheDocument();
    expect(screen.getByText('14:00')).toBeInTheDocument();
    expect(screen.getByText('Copa Mundial 2026')).toBeInTheDocument();
  });

  it('no tiene ningún botón interactivo', () => {
    renderWithStore(<MatchCard match={matchBase} compact />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

// Vista agenda — colapsado / expandido

describe('MatchCard — vista agenda (por defecto)', () => {
  it('muestra la cabecera con role="button" y aria-expanded="false"', () => {
    renderWithStore(<MatchCard match={matchBase} />);
    const header = screen.getByRole('button');
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  it('el cuerpo del partido NO se muestra cuando está colapsado', () => {
    renderWithStore(<MatchCard match={matchBase} />);
    expect(screen.queryByText('Cuotas no disponibles aún')).not.toBeInTheDocument();
  });

  it('expande el cuerpo al hacer clic', async () => {
    const user = userEvent.setup();
    renderWithStore(<MatchCard match={matchBase} />);
    const header = screen.getByRole('button');
    await user.click(header);
    expect(screen.getByText('Cuotas no disponibles aún')).toBeInTheDocument();
    expect(header).toHaveAttribute('aria-expanded', 'true');
  });

  it('colapsa el cuerpo al hacer clic por segunda vez', async () => {
    const user = userEvent.setup();
    renderWithStore(<MatchCard match={matchBase} />);
    const header = screen.getByRole('button');
    await user.click(header);
    await user.click(header);
    expect(screen.queryByText('Cuotas no disponibles aún')).not.toBeInTheDocument();
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  it('arranca expandido si isToday=true', () => {
    renderWithStore(<MatchCard match={matchBase} isToday />);
    expect(screen.getByText('Cuotas no disponibles aún')).toBeInTheDocument();
  });

  it('arranca expandido si el partido está en vivo', () => {
    renderWithStore(<MatchCard match={matchLive} />);
    // live match uses matchLive which has odds, so body is visible
    expect(screen.getByRole('button', { name: 'México 1.45' })).toBeInTheDocument();
  });
});

// Cuotas

describe('MatchCard — cuotas', () => {
  it('muestra "Cuotas no disponibles aún" cuando no hay odds', () => {
    renderWithStore(<MatchCard match={matchBase} isToday />);
    expect(screen.getByText('Cuotas no disponibles aún')).toBeInTheDocument();
  });

  it('renderiza 3 botones de cuotas con aria-labels correctos', () => {
    renderWithStore(<MatchCard match={matchWithOdds} isToday />);
    expect(screen.getByRole('button', { name: 'México 1.45' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Empate 2.00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sudáfrica 2.25' })).toBeInTheDocument();
  });

  it('los botones de cuota arrancan con aria-pressed="false"', () => {
    renderWithStore(<MatchCard match={matchWithOdds} isToday />);
    const btn = screen.getByRole('button', { name: 'México 1.45' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('una cuota preexistente en el store arranca con aria-pressed="true"', () => {
    renderWithStore(<MatchCard match={matchWithOdds} isToday />, {
      preloadedSelections: [selectionMexico],
    });
    expect(screen.getByRole('button', { name: 'México 1.45' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Empate 2.00' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('al hacer clic en una cuota se marca como seleccionada', async () => {
    const user = userEvent.setup();
    renderWithStore(<MatchCard match={matchWithOdds} isToday />);
    const btn = screen.getByRole('button', { name: 'México 1.45' });
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('al hacer clic dos veces en la misma cuota se deselecciona', async () => {
    const user = userEvent.setup();
    renderWithStore(<MatchCard match={matchWithOdds} isToday />);
    const btn = screen.getByRole('button', { name: 'México 1.45' });
    await user.click(btn);
    await user.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'false');
  });

  it('al hacer clic en otra cuota del mismo partido, la anterior se deselecciona', async () => {
    const user = userEvent.setup();
    renderWithStore(<MatchCard match={matchWithOdds} isToday />);
    const btnMexico = screen.getByRole('button', { name: 'México 1.45' });
    const btnEmpate = screen.getByRole('button', { name: 'Empate 2.00' });
    await user.click(btnMexico);
    await user.click(btnEmpate);
    expect(btnMexico).toHaveAttribute('aria-pressed', 'false');
    expect(btnEmpate).toHaveAttribute('aria-pressed', 'true');
  });
});

// Siempre expandido

describe('MatchCard — alwaysExpanded', () => {
  it('muestra el cuerpo del partido sin necesidad de clic', () => {
    renderWithStore(<MatchCard match={matchWithOdds} alwaysExpanded />);
    expect(screen.getByRole('button', { name: 'México 1.45' })).toBeInTheDocument();
  });

  it('el header NO tiene role="button" y no tiene aria-expanded', () => {
    renderWithStore(<MatchCard match={matchWithOdds} alwaysExpanded />);
    // Todos los role=button presentes son los de las cuotas, no el header
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).not.toHaveAttribute('aria-expanded');
    });
  });
});

// Botón cerrar (modal)

describe('MatchCard — botón cerrar', () => {
  it('muestra el botón cerrar cuando se pasa onClose', () => {
    renderWithStore(<MatchCard match={matchWithOdds} alwaysExpanded onClose={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  it('NO muestra el botón cerrar cuando no se pasa onClose', () => {
    renderWithStore(<MatchCard match={matchWithOdds} alwaysExpanded />);
    expect(screen.queryByRole('button', { name: 'Cerrar' })).not.toBeInTheDocument();
  });

  it('llama a onClose al hacer clic en el botón cerrar', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithStore(<MatchCard match={matchWithOdds} alwaysExpanded onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// Partido en vivo

describe('MatchCard — partido en vivo', () => {
  it('muestra la etiqueta de transmisión en vivo', () => {
    renderWithStore(<MatchCard match={matchLive} />);
    expect(screen.getByText('Mira aquí la transmisión con Jorge Luna')).toBeInTheDocument();
  });

  it('el partido en vivo arranca expandido automáticamente', () => {
    renderWithStore(<MatchCard match={matchLive} />);
    expect(screen.getByRole('button', { name: 'México 1.45' })).toBeInTheDocument();
  });
});
