import type { ReactNode } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col gap-16 bg-orange-50">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
