import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { formatDate } from '../../utils/formatDate';
import SEO from '../../components/SEO';

export default function AdminPosts() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, slug, published, created_at, author:profiles(name)')
        .order('created_at', { ascending: false });

      if (cancelled) return;
      setPosts(data || []);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const remove = async (id) => {
    if (!confirm(t('postEditor.deleteConfirm', 'Supprimer cet article ?'))) return;

    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) return toast.error(error.message);

    setPosts((p) => p.filter((x) => x.id !== id));
    toast.success(t('postEditor.deleted', 'Article supprimé'));
  };

  return (
    <>
      <SEO title={t('admin.postsTitle', 'Tous les articles')} />
      <div className="max-w-5xl">
        <h1 className="font-serif text-3xl mb-8">
          {t('admin.postsTitle', 'Tous les articles')}
        </h1>

        {loading ? (
          <p className="text-muted">{t('common.loading', 'Chargement…')}</p>
        ) : posts.length === 0 ? (
          <p className="text-muted">{t('common.empty')}</p>
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
                    {p.author?.name || '—'} —{' '}
                    {formatDate(p.created_at, i18n.language?.slice(0, 2))} —{' '}
                    <span className={p.published ? 'text-accent2' : 'text-muted'}>
                      {p.published
                        ? t('post.published', 'Publié')
                        : t('post.draft', 'Brouillon')}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/blog/${p.slug}`}
                  target="_blank"
                  className="p-2 text-muted hover:text-accent"
                  title={t('postEditor.viewArticle', "Voir l'article")}
                >
                  <ExternalLink size={16} />
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