// import { NavLink, Outlet } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { useRole } from '../hooks/useRole';

// export default function DashboardLayout() {
//   const { t } = useTranslation();
//   const { isAdmin } = useRole();

//   const links = [
//     { to: '/author', label: t('dashboard.myPosts', 'Mes articles'), end: true },
//     { to: '/author/new', label: t('dashboard.newPost', 'Nouvel article') },
//     ...(isAdmin
//       ? [
//           { to: '/admin', label: t('dashboard.admin', 'Admin'), end: true },
//           { to: '/admin/users', label: t('dashboard.users', 'Utilisateurs') },
//           { to: '/admin/posts', label: t('dashboard.allPosts', 'Tous les articles') },
//           { to: '/admin/comments', label: t('dashboard.comments', 'Commentaires') },
//         ]
//       : []),
//   ];

//   return (
//     <div className="min-h-screen flex bg-bg">
//       <aside className="w-60 border-e border-border p-6 hidden md:block">
//         <h2 className="font-serif text-xl mb-6">Dashboard</h2>
//         <nav className="space-y-2">
//           {links.map((l) => (
//             <NavLink
//               key={l.to}
//               to={l.to}
//               end={l.end}
//               className={({ isActive }) =>
//                 `block px-3 py-2 rounded text-sm ${
//                   isActive
//                     ? 'bg-accent text-white'
//                     : 'text-ink hover:bg-border/40'
//                 }`
//               }
//             >
//               {l.label}
//             </NavLink>
//           ))}
//         </nav>
//       </aside>
//       <main className="flex-1 p-6">
//         <Outlet />
//       </main>
//     </div>
//   );
// }



import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Plus,
  Users,
  FileText,
  MessageSquare,
  Home,
} from 'lucide-react';
import { useRole } from '../hooks/useRole';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DashboardLayout() {
  const { t } = useTranslation();
  const { isAdmin } = useRole();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
      isActive ? 'bg-accent text-white' : 'text-ink hover:bg-border/40'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />

      <div className="flex-1 flex">
        <aside className="w-64 border-e border-border p-6 hidden md:flex flex-col bg-bg">
          <h2 className="font-serif text-xl mb-6">
            {t('dashboard.title', 'Dashboard')}
          </h2>

          <nav className="space-y-1 flex-1">
            <div className="text-xs uppercase text-muted mb-2 px-3">
              {t('dashboard.authorSection', 'Auteur')}
            </div>
            <NavLink to="/author" end className={linkClass}>
              <LayoutDashboard size={16} />
              {t('dashboard.myPosts', 'Mes articles')}
            </NavLink>
            <NavLink to="/author/new" className={linkClass}>
              <Plus size={16} />
              {t('dashboard.newPost', 'Nouvel article')}
            </NavLink>

            {isAdmin && (
              <>
                <div className="pt-4 mt-4 border-t border-border">
                  <div className="text-xs uppercase text-muted mb-2 px-3">
                    {t('dashboard.adminSection', 'Admin')}
                  </div>
                </div>
                <NavLink to="/admin" end className={linkClass}>
                  <LayoutDashboard size={16} />
                  {t('dashboard.overview', "Vue d'ensemble")}
                </NavLink>
                <NavLink to="/admin/users" className={linkClass}>
                  <Users size={16} />
                  {t('dashboard.users', 'Utilisateurs')}
                </NavLink>
                <NavLink to="/admin/posts" className={linkClass}>
                  <FileText size={16} />
                  {t('dashboard.allPosts', 'Tous les articles')}
                </NavLink>
                <NavLink to="/admin/comments" className={linkClass}>
                  <MessageSquare size={16} />
                  {t('dashboard.comments', 'Commentaires')}
                </NavLink>
              </>
            )}
          </nav>

          <NavLink
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-muted hover:text-accent mt-4 border-t border-border pt-4"
          >
            <Home size={16} />
            {t('dashboard.backToSite', 'Retour au site')}
          </NavLink>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}