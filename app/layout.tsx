import '@/styles/tokens.css';
import './globals.css';
import { EventsProvider } from '@/lib/context/EventsContext';

export const metadata = {
  title: 'Calendario de Eventos',
  description: 'Gestión de eventos con calendario interactivo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <EventsProvider>{children}</EventsProvider>
      </body>
    </html>
  );
}
