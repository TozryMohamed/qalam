import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 text-center text-muted text-sm">
        © {new Date().getFullYear()} Le Journal — Tous droits réservés.
      </footer>
    </div>
  );
}