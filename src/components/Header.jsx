// import { Link, NavLink } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { Search, User } from 'lucide-react';
// import LanguageSwitcher from './LanguageSwitcher';
// import { useAuth } from '../hooks/useAuth';
// export default function Header() {
//   const { t } = useTranslation();
//   const { user } = useAuth();

//   return (
//     <header className="border-b border-border bg-bg sticky top-0 z-40">
//       <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
//         <Link to="/" className="font-serif text-2xl font-bold text-ink">
//           Le Journal
//         </Link>

//         <nav className="hidden md:flex gap-6 text-sm">
//           <NavLink to="/" className="hover:text-accent">{t('nav.home')}</NavLink>
//           <NavLink to="/blog" className="hover:text-accent">{t('nav.blog')}</NavLink>
//           <NavLink to="/categories" className="hover:text-accent">{t('nav.categories')}</NavLink>
//           <NavLink to="/about" className="hover:text-accent">{t('nav.about')}</NavLink>
//         </nav>

//         <div className="flex items-center gap-3">
//           <Link to="/search" aria-label={t('common.search')}><Search size={18} /></Link>
//           <LanguageSwitcher />
//           <Link
//             to={user ? '/profile' : '/login'}
//             className="flex items-center gap-1 text-sm border border-border rounded px-3 py-1 hover:border-accent hover:text-accent"
//           >
//             <User size={16} />
//             {user ? t('nav.profile') : t('nav.login')}
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }





import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  User,
  Plus,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { signOut } from '../services/auth';

/* -------------------------------------------------------------------------- */
/*  Badge de rôle                                                             */
/* -------------------------------------------------------------------------- */
function RoleBadge({ role }) {
  const styles = {
    admin: 'bg-accent2 text-white',
    author: 'bg-accent text-white',
    user: 'bg-border text-ink',
  };
  const labels = { admin: 'Admin', author: 'Author', user: 'Membre' };
  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
        styles[role] || styles.user
      }`}
    >
      {labels[role] || role}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Menu utilisateur déroulant                                                */
/* -------------------------------------------------------------------------- */
function UserMenu({ user, role, isAuthor, isAdmin, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Ferme au clic extérieur
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const initials =
    user?.user_metadata?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    '?';

  const displayName =
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Utilisateur';

  return (
    <div className="relative" ref={ref}>
      {/* Bouton avatar */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 border border-border rounded-full ps-1 pe-3 py-1 hover:border-accent transition"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center text-xs font-semibold">
          {initials}
        </span>
        <span className="hidden md:inline max-w-[100px] truncate text-sm">
          {displayName}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menu déroulant */}
      {open && (
        <div className="absolute end-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-lg z-50 py-2">
          {/* En-tête */}
          <div className="px-4 py-2 border-b border-border">
            <div className="text-sm font-medium truncate">{displayName}</div>
            <div className="text-xs text-muted truncate">{user?.email}</div>
            <div className="mt-2">
              <RoleBadge role={role} />
            </div>
          </div>

          {/* Actions */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-border/40"
            >
              <User size={16} /> Mon profil
            </Link>

            {isAuthor && (
              <Link
                to={isAdmin ? '/admin' : '/author'}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-border/40"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            )}
          </div>

          {/* Déconnexion */}
          <div className="border-t border-border pt-1">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Header principal                                                          */
/* -------------------------------------------------------------------------- */
export default function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { role, isAuthor, isAdmin } = useRole();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = async () => {
    await signOut();
    nav('/');
  };

  const navLinks = [
    { to: '/', label: t('nav.home', 'Accueil') },
    { to: '/blog', label: t('nav.blog', 'Articles') },
    { to: '/categories', label: t('nav.categories', 'Catégories') },
    { to: '/about', label: t('nav.about', 'À propos') },
  ];

  return (
    <header className="border-b border-border bg-bg sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        {/* Ligne principale */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* GAUCHE : Logo + Nav desktop */}
          <div className="flex items-center gap-8">
            <Link to="/" className="font-serif text-2xl font-bold text-ink">
              Qalam
            </Link>

            <nav className="hidden md:flex gap-6 text-sm">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `py-1 border-b-2 transition ${
                      isActive
                        ? 'border-accent text-accent'
                        : 'border-transparent hover:text-accent'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* DROITE : Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search */}
            <Link
              to="/search"
              className="p-2 rounded hover:bg-border/40 transition"
              aria-label="Rechercher"
            >
              <Search size={18} />
            </Link>

            {/* Langue */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Publier — visible si author/admin */}
            {isAuthor && (
              <Link
                to="/author/new"
                className="hidden sm:flex items-center gap-1.5 bg-accent text-white text-sm px-3 py-1.5 rounded hover:bg-accent/90 transition font-medium"
              >
                <Plus size={14} />
                <span>Publier</span>
              </Link>
            )}

            {/* User connecté : menu déroulant */}
            {user ? (
              <UserMenu
                user={user}
                role={role}
                isAuthor={isAuthor}
                isAdmin={isAdmin}
                onLogout={logout}
              />
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 text-sm border border-border rounded px-3 py-1.5 hover:border-accent hover:text-accent transition"
              >
                <User size={16} />
                <span className="hidden sm:inline">Connexion</span>
              </Link>
            )}

            {/* Bouton hamburger mobile */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-border space-y-2">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded text-sm ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'hover:bg-border/40'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <div className="pt-2 border-t border-border sm:hidden">
              <LanguageSwitcher />
            </div>

            {isAuthor && (
              <Link
                to="/author/new"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 bg-accent text-white px-3 py-2 rounded text-sm mt-2"
              >
                <Plus size={16} /> Publier un article
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}