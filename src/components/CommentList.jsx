import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';
import Skeleton from './ui/Skeleton';
import { formatDate } from '../utils/formatDate';

export default function CommentList({ postId }) {
  const { t, i18n } = useTranslation();
  const { user, profile } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ déjà true au premier render
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  // ✅ Chargement initial — AUCUN setState synchrone
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*, user:profiles(name, photo_url)')
          .eq('post_id', postId)
          .eq('status', 'visible')
          .order('created_at', { ascending: false });

        if (cancelled) return;
        if (!error) setComments(data || []);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  // ✅ Fonction de rechargement appelée UNIQUEMENT depuis un event handler
  const reload = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:profiles(name, photo_url)')
      .eq('post_id', postId)
      .eq('status', 'visible')
      .order('created_at', { ascending: false });

    if (!error) setComments(data || []);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Connecte-toi pour commenter');
    if (!content.trim()) return;

    setSending(true);
    const { error } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: user.id, content: content.trim() });
    setSending(false);

    if (error) return toast.error(error.message);
    setContent('');
    toast.success('Commentaire ajouté');
    await reload();
  };

  const remove = async (id) => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) return toast.error(error.message);
    setComments((c) => c.filter((x) => x.id !== id));
  };

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl mb-6">
        {t('comments.title', 'Commentaires')} ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={submit} className="mb-8 flex gap-3">
          <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-sm font-medium shrink-0">
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('comments.placeholder', 'Écrire un commentaire…')}
              rows={3}
              className="w-full bg-surface border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <div className="mt-2 flex justify-end">
              <button
                disabled={sending || !content.trim()}
                className="inline-flex items-center gap-2 bg-accent text-white text-sm px-4 py-2 rounded hover:bg-accent/90 disabled:opacity-50"
              >
                <Send size={14} /> {t('comments.send', 'Envoyer')}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="mb-8 text-sm text-muted">
          <a href="/login" className="text-accent underline">
            {t('auth.login')}
          </a>{' '}
          {t('comments.loginRequired', 'pour commenter.')}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted text-sm">{t('common.empty')}</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-border overflow-hidden shrink-0">
                {c.user?.photo_url ? (
                  <img
                    src={c.user.photo_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm">
                    {c.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">
                    {c.user?.name || 'Utilisateur'}
                  </span>
                  <span className="text-muted text-xs">
                    {formatDate(c.created_at, i18n.language?.slice(0, 2))}
                  </span>
                  {user?.id === c.user_id && (
                    <button
                      onClick={() => remove(c.id)}
                      className="ml-auto text-muted hover:text-red-600"
                      aria-label="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink whitespace-pre-line">
                  {c.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}