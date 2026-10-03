import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/ui/Button';
import SEO from '../../components/SEO';

export default function AuthorDashboard() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, published, created_at')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (cancelled) return;
      setPosts(data || []);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const remove = async (id) => {
    if (!confirm(t('postEditor.deleteConfirm', 'Supprimer cet article ?'))) return;

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) return toast.error(error.message);

    setPosts((p) => p.filter((x) => x.id !== id));
    toast.success(t('postEditor.deleted', 'Article supprimé'));
  };

  return (
    <>
      <SEO title={t('author.dashboardTitle', 'Mes articles')} />
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl">
            {t('author.dashboardTitle', 'Mes articles')}
          </h1>
          <Button as={Link} to="/author/new">
            <Plus size={16} /> {t('dashboard.newPost', 'Nouvel article')}
          </Button>
        </div>

        {loading ? (
          <p className="text-muted">{t('common.loading', 'Chargement…')}</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted mb-4">
              {t('author.empty', "Aucun article pour l'instant")}
            </p>
            <Button as={Link} to="/author/new">
              {t('author.createFirst', 'Créer mon premier article')}
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border border border-border rounded-lg">
            {posts.map((p) => (
              <li key={p.id} className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/blog/${p.slug}`}
                    className="font-medium hover:text-accent block truncate"
                  >
                    {p.title}
                  </Link>
                  <div className="text-xs text-muted mt-1">
                    {formatDate(p.created_at, i18n.language?.slice(0, 2))}
                    {' — '}
                    <span className={p.published ? 'text-accent2' : 'text-muted'}>
                      {p.published
                        ? t('author.published', 'Publié')
                        : t('author.draft', 'Brouillon')}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/author/${p.id}/edit`}
                  className="p-2 text-muted hover:text-accent"
                  title={t('common.edit', 'Modifier')}
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => remove(p.id)}
                  className="p-2 text-muted hover:text-red-600"
                  title={t('common.delete', 'Supprimer')}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}