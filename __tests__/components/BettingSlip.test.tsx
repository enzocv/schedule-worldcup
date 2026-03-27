import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BettingSlip from '@/components/schedule/BettingSlip/BettingSlip';
import { renderWithStore } from '../utils/renderWithStore';
import { selectionMexico, selectionSuecia } from '../fixtures/matches';

// ─── Cerrado ──────────────────────────────────────────────────

describe('BettingSlip — cerrado', () => {
  it('no renderiza nada cuando isOpen=false', () => {
    const { container } = renderWithStore(
      <BettingSlip isOpen={false} onClose={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });
});

// ─── Abierto y vacío ──────────────────────────────────────────

describe('BettingSlip — abierto y vacío', () => {
  it('muestra el diálogo con rol correcto', () => {
    renderWithStore(<BettingSlip isOpen onClose={jest.fn()} />);
    expect(screen.getByRole('dialog', { name: 'Cupón de apuestas' })).toBeInTheDocument();
  });

  it('muestra el mensaje de cupón vacío', () => {
    renderWithStore(<BettingSlip isOpen onClose={jest.fn()} />);
    expect(screen.getByText('Tu cupón está vacío')).toBeInTheDocument();
  });

  it('no muestra el botón "Realizar apuesta" cuando no hay selecciones', () => {
    renderWithStore(<BettingSlip isOpen onClose={jest.fn()} />);
    expect(screen.queryByRole('button', { name: 'Realizar apuesta' })).not.toBeInTheDocument();
  });

  it('no muestra el botón "Borrar todo" cuando no hay selecciones', () => {
    renderWithStore(<BettingSlip isOpen onClose={jest.fn()} />);
    expect(screen.queryByLabelText('Borrar todas las selecciones')).not.toBeInTheDocument();
  });
});

// ─── Abierto con selecciones ──────────────────────────────────

describe('BettingSlip — abierto con selecciones', () => {
  it('muestra el partido de la selección', () => {
    renderWithStore(
      <BettingSlip isOpen onClose={jest.fn()} />,
      { preloadedSelections: [selectionMexico] },
    );
    expect(screen.getByText('México vs Sudáfrica')).toBeInTheDocument();
  });

  it('muestra la cuota total correcta (cuota única)', () => {
    renderWithStore(
      <BettingSlip isOpen onClose={jest.fn()} />,
      { preloadedSelections: [selectionMexico] },
    );
    // 1.45 appears both in the selection row and in the total row
    const label = screen.getByText('Cuota total');
    expect(label.nextElementSibling?.textContent).toBe('1.45');
  });

  it('muestra la cuota total acumulada (1.45 × 1.80 = 2.61)', () => {
    renderWithStore(
      <BettingSlip isOpen onClose={jest.fn()} />,
      { preloadedSelections: [selectionMexico, selectionSuecia] },
    );
    expect(screen.getByText('2.61')).toBeInTheDocument();
  });

  it('muestra el botón "Realizar apuesta"', () => {
    renderWithStore(
      <BettingSlip isOpen onClose={jest.fn()} />,
      { preloadedSelections: [selectionMexico] },
    );
    expect(screen.getByRole('button', { name: 'Realizar apuesta' })).toBeInTheDocument();
  });

  it('muestra el botón "Borrar todo"', () => {
    renderWithStore(
      <BettingSlip isOpen onClose={jest.fn()} />,
      { preloadedSelections: [selectionMexico] },
    );
    expect(screen.getByLabelText('Borrar todas las selecciones')).toBeInTheDocument();
  });
});

// ─── Campo de monto y ganancia potencial ─────────────────────

describe('BettingSlip — monto y ganancia potencial', () => {
  it('la ganancia potencial muestra "—" cuando el monto está vacío', () => {
    renderWithStore(
      <BettingSlip isOpen onClose={jest.fn()} />,
      { preloadedSelections: [selectionMexico] },
    );
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('calcular ganancia potencial al escribir el monto (100 × 1.45 = 145.00)', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <BettingSlip isOpen onClose={jest.fn()} />,
      { preloadedSelections: [selectionMexico] },
    );
    const input = screen.getByRole('spinbutton');
    await user.type(input, '100');
    expect(screen.getByText('S/ 145.00')).toBeInTheDocument();
  });
});

// ─── Cierre del panel ─────────────────────────────────────────

describe('BettingSlip — cerrar panel', () => {
  it('llama a onClose al presionar la tecla Escape', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithStore(<BettingSlip isOpen onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('llama a onClose al hacer clic en el botón "Cerrar cupón"', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithStore(<BettingSlip isOpen onClose={onClose} />);
    await user.click(screen.getByLabelText('Cerrar cupón'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('llama a onClose al hacer clic en el overlay', async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    renderWithStore(<BettingSlip isOpen onClose={onClose} />);
    // The overlay has aria-hidden=true so we query by class via the DOM
    const overlay = document.querySelector('[aria-hidden="true"]') as HTMLElement;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

// ─── Gestión de selecciones ───────────────────────────────────

describe('BettingSlip — gestión de selecciones', () => {
  it('"Borrar todo" elimina todas las selecciones de la vista', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <BettingSlip isOpen onClose={jest.fn()} />,
      { preloadedSelections: [selectionMexico] },
    );
    await user.click(screen.getByLabelText('Borrar todas las selecciones'));
    expect(screen.queryByText('México vs Sudáfrica')).not.toBeInTheDocument();
    expect(screen.getByText('Tu cupón está vacío')).toBeInTheDocument();
  });

  it('el botón de quitar elimina solo esa selección', async () => {
    const user = userEvent.setup();
    renderWithStore(
      <BettingSlip isOpen onClose={jest.fn()} />,
      { preloadedSelections: [selectionMexico, selectionSuecia] },
    );
    await user.click(screen.getByLabelText('Quitar México vs Sudáfrica'));
    expect(screen.queryByText('México vs Sudáfrica')).not.toBeInTheDocument();
    expect(screen.getByText('Suecia vs Nigeria')).toBeInTheDocument();
  });
});

// ─── Flujo de apuesta ─────────────────────────────────────────

describe('BettingSlip — flujo de apuesta', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => { jest.runOnlyPendingTimers(); });
    jest.useRealTimers();
  });

  it('muestra el mensaje de éxito al realizar la apuesta', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClose = jest.fn();
    renderWithStore(
      <BettingSlip isOpen onClose={onClose} />,
      { preloadedSelections: [selectionMexico] },
    );
    await user.click(screen.getByRole('button', { name: 'Realizar apuesta' }));
    expect(screen.getByText('¡Apuesta realizada con éxito!')).toBeInTheDocument();
  });

  it('llama a onClose después del tiempo de confirmación (1200ms)', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClose = jest.fn();
    renderWithStore(
      <BettingSlip isOpen onClose={onClose} />,
      { preloadedSelections: [selectionMexico] },
    );
    await user.click(screen.getByRole('button', { name: 'Realizar apuesta' }));
    expect(onClose).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(1300); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
