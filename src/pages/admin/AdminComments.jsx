
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { EyeOff, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { formatDate } from '../../utils/formatDate';
import SEO from '../../components/SEO';

export default function AdminComments() {
  const { t, i18n } = useTranslation();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  // =========================================================
  // FETCH COMMENTS
  // =========================================================
  const fetchComments = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:profiles(name), post:posts(title, slug)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchComments();

        if (cancelled) return;

        setComments(data);
      } catch (err) {
        if (cancelled) return;

        console.error(
          'Erreur chargement commentaires admin:',
          err
        );

        toast.error(
          err.message || 'Erreur de chargement'
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchComments]);

  // =========================================================
  // VERIFY ADMIN SESSION
  // =========================================================
  const ensureAdminSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast.error(
        t(
          'admin.notLoggedIn',
          'Vous devez être connecté.'
        )
      );

      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error(
        'Erreur récupération profil:',
        error
      );

      toast.error(
        error.message ||
          'Impossible de vérifier vos droits.'
      );

      return null;
    }

    if (!profile || profile.role !== 'admin') {
      toast.error(
        t(
          'admin.notAdmin',
          `Accès refusé. Rôle actuel : ${
            profile?.role ?? 'aucun'
          }`
        )
      );

      console.warn('Session info:', {
        uid: session.user.id,
        email: session.user.email,
        profile,
      });

      return null;
    }

    return session;
  };

  // =========================================================
  // UPDATE COMMENT STATUS
  // =========================================================
const updateStatus = async (id, newStatus) => {
  const session = await ensureAdminSession();

  if (!session) {
    return;
  }

  const {
    data: adminCheck,
    error: adminCheckError,
  } = await supabase.rpc('is_admin');

  console.log('ADMIN CHECK:', {
    sessionUserId: session?.user?.id,
    adminCheck,
    adminCheckType: typeof adminCheck,
    adminCheckError: adminCheckError
      ? {
          code: adminCheckError.code,
          message: adminCheckError.message,
          details: adminCheckError.details,
          hint: adminCheckError.hint,
        }
      : null,
  });

  if (adminCheckError) {
    console.error('Erreur RPC is_admin:', adminCheckError);

    toast.error(
      adminCheckError.message ||
        'Erreur lors de la vérification admin.'
    );

    return;
  }

  if (adminCheck !== true) {
    console.error(
      'is_admin() ne retourne pas true:',
      adminCheck
    );

    toast.error(
      'La base de données ne reconnaît pas cet utilisateur comme admin.'
    );

    return;
  }

  setBusyId(id);

  try {
    const { error } = await supabase.rpc(
      'admin_update_comment_status',
      {
        p_comment_id: id,
        p_status: newStatus,
      }
    );

    if (error) {
      console.error('Erreur RPC update status:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      toast.error(
        error.message ||
          'Erreur lors de la modification.'
      );

      return;
    }

    setComments((currentComments) =>
      currentComments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              status: newStatus,
            }
          : comment
      )
    );

    toast.success(
      newStatus === 'hidden'
        ? t(
            'admin.commentHidden',
            'Commentaire masqué'
          )
        : t(
            'admin.commentVisible',
            'Commentaire rendu visible'
          )
    );
  } catch (err) {
    console.error(
      'Erreur inattendue update status:',
      err
    );

    toast.error(
      err.message ||
        'Une erreur est survenue.'
    );
  } finally {
    setBusyId(null);
  }
};

  // =========================================================
  // HIDE
  // =========================================================
  const hide = (id) => {
    updateStatus(id, 'hidden');
  };

  // =========================================================
  // UNHIDE
  // =========================================================
  const unhide = (id) => {
    updateStatus(id, 'visible');
  };

  // =========================================================
  // DELETE COMMENT
  // =========================================================
  const remove = async (id) => {
    const confirmed = confirm(
      t(
        'comments.deleteConfirm',
        'Supprimer ce commentaire ?'
      )
    );

    if (!confirmed) {
      return;
    }

    const session = await ensureAdminSession();

    if (!session) {
      return;
    }

    setBusyId(id);

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(
          'Erreur delete:',
          {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          }
        );

        toast.error(
          error.message ||
            'Erreur lors de la suppression.'
        );

        return;
      }

      // Supprimer localement
      setComments((currentComments) =>
        currentComments.filter(
          (comment) => comment.id !== id
        )
      );

      toast.success(
        t(
          'admin.commentDeleted',
          'Commentaire supprimé'
        )
      );
    } catch (err) {
      console.error(
        'Erreur inattendue delete:',
        err
      );

      toast.error(
        err.message ||
          'Une erreur est survenue.'
      );
    } finally {
      setBusyId(null);
    }
  };

  // =========================================================
  // REFRESH COMMENTS


  // =========================================================
  // RENDER
  // =========================================================
  return (
    <>
      <SEO
        title={t(
          'admin.commentsTitle',
          'Commentaires'
        )}
      />

      <div className="max-w-4xl">

        {/* =============================================
            HEADER
        ============================================== */}
        <div className="flex items-center justify-between mb-8">

          <h1 className="font-serif text-3xl">
            {t(
              'admin.commentsTitle',
              'Commentaires'
            )}
          </h1>



        </div>

        {/* =============================================
            LOADING
        ============================================== */}
        {loading ? (
          <p className="text-muted">
            {t(
              'common.loading',
              'Chargement…'
            )}
          </p>
        ) : comments.length === 0 ? (

          /* ===========================================
             EMPTY
          ============================================ */
          <p className="text-muted">
            {t(
              'common.empty',
              'Aucun commentaire.'
            )}
          </p>

        ) : (

          /* ===========================================
             COMMENTS LIST
          ============================================ */
          <ul className="divide-y divide-border border border-border rounded-lg">

            {comments.map((comment) => {
              const isHidden =
                comment.status === 'hidden';

              const isBusy =
                busyId === comment.id;

              return (
                <li
                  key={comment.id}
                  className={`
                    p-4
                    ${
                      isHidden
                        ? 'opacity-60 bg-amber-50/40'
                        : ''
                    }
                    ${
                      isBusy
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }
                  `}
                >

                  {/* =================================
                      USER + POST
                  ================================== */}
                  <div className="flex items-center gap-2 text-sm">

                    <span className="font-medium">
                      {comment.user?.name || '—'}
                    </span>

                    <span className="text-muted">
                      {t(
                        'post.by',
                        'sur'
                      )}
                    </span>

                    <Link
                      to={`/blog/${comment.post?.slug}`}
                      className="text-accent hover:underline truncate"
                    >
                      {comment.post?.title || '—'}
                    </Link>

                  </div>

                  {/* =================================
                      COMMENT CONTENT
                  ================================== */}
                  <p className="mt-2 text-sm whitespace-pre-line">
                    {comment.content}
                  </p>

                  {/* =================================
                      FOOTER
                  ================================== */}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted">

                    {/* DATE */}
                    <span>
                      {formatDate(
                        comment.created_at,
                        i18n.language?.slice(0, 2)
                      )}
                    </span>

                    {/* STATUS */}
                    <span
                      className={
                        isHidden
                          ? 'text-amber-600 uppercase'
                          : 'text-accent2 uppercase'
                      }
                    >
                      {isHidden
                        ? t(
                            'admin.statusHidden',
                            'masqué'
                          )
                        : t(
                            'admin.statusVisible',
                            'visible'
                          )}
                    </span>

                    {/* =================================
                        HIDE / UNHIDE
                    ================================== */}
                    {isHidden ? (
                      <button
                        onClick={() =>
                          unhide(comment.id)
                        }
                        disabled={isBusy}
                        className="flex items-center gap-1 text-green-600 hover:underline disabled:opacity-50"
                      >
                        <Eye size={12} />

                        {t(
                          'admin.unhide',
                          'Démasquer'
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          hide(comment.id)
                        }
                        disabled={isBusy}
                        className="flex items-center gap-1 text-amber-600 hover:underline disabled:opacity-50"
                      >
                        <EyeOff size={12} />

                        {t(
                          'admin.hide',
                          'Masquer'
                        )}
                      </button>
                    )}

                    {/* =================================
                        DELETE
                    ================================== */}
                    <button
                      onClick={() =>
                        remove(comment.id)
                      }
                      disabled={isBusy}
                      className="flex items-center gap-1 text-red-600 hover:underline ml-auto disabled:opacity-50"
                    >
                      <Trash2 size={12} />

                      {t(
                        'common.delete',
                        'Supprimer'
                      )}
                    </button>

                  </div>
                </li>
              );
            })}

          </ul>
        )}
      </div>
    </>
  );
}
