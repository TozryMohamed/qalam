import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, FileText, MessageSquare } from 'lucide-react';
import { supabase } from '../../services/supabase';
import SEO from '../../components/SEO';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ users: 0, posts: 0, comments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [u, p, c] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('posts').select('*', { count: 'exact', head: true }),
          supabase.from('comments').select('*', { count: 'exact', head: true }),
        ]);
        if (cancelled) return;
        setStats({
          users: u.count || 0,
          posts: p.count || 0,
          comments: c.count || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <SEO title={t('admin.dashboardTitle', 'Administration')} />
      <div className="max-w-5xl">
        <h1 className="font-serif text-3xl mb-8">
          {t('admin.dashboardTitle', 'Administration')}
        </h1>

        {loading ? (
          <p className="text-muted">{t('common.loading', 'Chargement…')}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              label={t('admin.statUsers', 'Utilisateurs')}
              value={stats.users}
              to="/admin/users"
              icon={Users}
            />
            <StatCard
              label={t('admin.statPosts', 'Articles')}
              value={stats.posts}
              to="/admin/posts"
              icon={FileText}
            />
            <StatCard
              label={t('admin.statComments', 'Commentaires')}
              value={stats.comments}
              to="/admin/comments"
              icon={MessageSquare}
            />
          </div>
        )}
      </div>
    </>
  );
}

function StatCard({ label, value, to, icon: Icon }) {
  return (
    <Link
      to={to}
      className="bg-surface border border-border rounded-lg p-6 hover:border-accent transition block"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted">{label}</div>
        {Icon && <Icon size={18} className="text-muted" />}
      </div>
      <div className="font-serif text-4xl mt-2 text-ink">{value}</div>
    </Link>
  );
}