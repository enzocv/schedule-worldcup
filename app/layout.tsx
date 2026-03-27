import '@/styles/tokens.css';
import './globals.css';
import StoreProvider from '@/lib/store/StoreProvider';

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
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
