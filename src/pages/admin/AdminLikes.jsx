// src/pages/admin/AdminLikes.jsx
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Heart,
  Trash2,
  ExternalLink,
  User,
  FileText,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import SEO from '../../components/SEO';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';

export default function AdminLikes() {
  const { t } = useTranslation();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloading, setReloading] = useState(false);

  // Fonction pure de fetch — aucun setState synchrone
  const fetchLikes = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('post_likes')
      .select(`
        id,
        created_at,
        post_id,
        user_id,
        post:posts ( id, title, slug ),
        profile:profiles ( id, name, email )
      `)
      .order('created_at', { ascending: false });

    if (err) throw err;
    return data || [];
  }, []);

  // Effet initial : setState uniquement APRÈS l'await
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchLikes();
        if (cancelled) return;
        setLikes(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error('Erreur chargement likes:', err);
        setError(err.message || 'Erreur de chargement');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchLikes]);

  // Rafraîchir — event handler, setState autorisé
  const handleRefresh = async () => {
    setReloading(true);
    try {
      const data = await fetchLikes();
      setLikes(data);
      setError(null);
    } catch (err) {
      console.error('Erreur refresh:', err);
      setError(err.message || 'Erreur de chargement');
    } finally {
      setReloading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.confirmDeleteLike', 'Supprimer ce like ?')))
      return;
    try {
      const { error: err } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', id);
      if (err) throw err;
      setLikes((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Erreur suppression like:', err);
      alert(err.message);
    }
  };

  return (
    <>
      <SEO title={t('admin.likesTitle', 'Likes')} />
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl flex items-center gap-2">
            <Heart className="text-red-500" size={28} />
            {t('admin.likesTitle', 'Likes')}
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={reloading}
          >
            <RefreshCw size={14} className={reloading ? 'animate-spin' : ''} />
            {t('common.refresh', 'Rafraîchir')}
          </Button>
        </div>

        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {error && !loading && (
          <p className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
            {error}
          </p>
        )}

        {!loading && !error && likes.length === 0 && (
          <p className="text-muted text-center py-12">
            {t('admin.noLikes', 'Aucun like pour le moment.')}
          </p>
        )}

        {!loading && !error && likes.length > 0 && (
          <>
            <p className="text-sm text-muted mb-4">
              {t('admin.totalLikes', 'Total')} : <strong>{likes.length}</strong>
            </p>
            <div className="border border-border rounded-lg divide-y divide-border bg-surface">
              {likes.map((like) => {
                const post = like.post;
                const profile = like.profile;
                return (
                  <div
                    key={like.id}
                    className="p-4 flex items-center gap-4 hover:bg-border/30"
                  >
                    <Heart size={18} className="text-red-500 shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText size={14} className="text-muted shrink-0" />
                        {post ? (
                          <Link
                            to={`/blog/${post.slug}`}
                            className="font-medium text-ink hover:text-accent truncate"
                          >
                            {post.title}
                          </Link>
                        ) : (
                          <span className="text-muted italic">
                            Article supprimé
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted mt-1">
                        <User size={12} className="shrink-0" />
                        <span>
                          {profile?.name ||
                            profile?.email ||
                            'Utilisateur inconnu'}
                        </span>
                        <span className="opacity-60">
                          · {new Date(like.created_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {post?.slug && (
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-muted hover:text-accent"
                        title="Voir l'article"
                      >
                        <ExternalLink size={16} />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(like.id)}
                      className="text-muted hover:text-red-600 p-2"
                      title={t('common.delete', 'Supprimer')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}