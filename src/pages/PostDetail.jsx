import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Calendar, ArrowLeft, Pencil } from 'lucide-react';
import { getPostBySlug, getPublishedPosts } from '../services/posts';
import CommentList from '../components/CommentList';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/slugify';
import { getTextDirection } from '../utils/detectRTL';
import { useAuth } from '../hooks/useAuth';

export default function PostDetail() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const lang = i18n.language?.slice(0, 2) || 'fr';

  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getPostBySlug(slug);
        if (cancelled) return;
        setPost(data);

        if (data?.category) {
          const { data: rel } = await getPublishedPosts({
            category: data.category,
            limit: 4,
          });
          if (cancelled) return;
          setRelated((rel || []).filter((p) => p.id !== data.id).slice(0, 3));
        }
      } catch {
        if (!cancelled) setError('Article introuvable');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    window.scrollTo({ top: 0 });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="w-full aspect-[16/9]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl mb-4">
          {t('post.notFound', 'Article introuvable')}
        </h1>
        <Link to="/blog" className="text-accent underline">
          ← {t('nav.blog')}
        </Link>
      </div>
    );
  }

  const isMyPost = user && post.author_id === user.id;

  // ✅ Détection auto du RTL (basée uniquement sur le contenu)
  const isRTL = getTextDirection(post.content) === 'rtl';

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.image_url}
        url={window.location.href}
        type="article"
      />

      <article
        className="max-w-3xl mx-auto px-4 py-12"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Barre supérieure : retour + modifier */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent"
          >
            <ArrowLeft size={14} className={isRTL ? 'rotate-180' : ''} />
            {t('nav.blog', 'Articles')}
          </Link>

          {isMyPost && (
            <Link to={`/author/${post.id}/edit`}>
              <Button variant="outline" size="sm">
                <Pencil size={14} /> {t('post.edit', 'Modifier')}
              </Button>
            </Link>
          )}
        </div>

        {/* Catégorie */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <span className="text-xs uppercase tracking-[0.2em] text-accent">
            {t(`categories.${post.category}`, post.category) || 'Général'}
          </span>
        </div>

        {/* Titre */}
        <h1
          className={`mt-3 font-serif leading-tight text-ink ${
            isRTL
              ? 'text-4xl md:text-5xl text-right font-arabic'
              : 'text-4xl md:text-5xl text-left'
          }`}
          style={isRTL ? { lineHeight: 1.4 } : undefined}
        >
          {post.title}
        </h1>

        {/* Résumé */}
        {post.excerpt && (
          <p
            className={`mt-4 text-lg text-muted ${
              isRTL ? 'font-arabic text-right leading-relaxed' : 'text-left'
            }`}
            style={isRTL ? { lineHeight: 1.9 } : undefined}
          >
            {post.excerpt}
          </p>
        )}

        {/* Métadonnées : auteur + date (temps de lecture SUPPRIMÉ) */}
        <div
          className={`mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted border-y border-border py-4 ${
            isRTL ? 'flex-row-reverse justify-end' : ''
          }`}
        >
          <span className="flex items-center gap-1">
            <User size={14} />
            <span dir="auto">{post.author?.name || '—'}</span>
          </span>

          {post.created_at && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              <span dir="auto">
                {formatDate(post.created_at, lang, true)}
              </span>
            </span>
          )}

          {isMyPost && !post.published && (
            <span className="text-xs uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
              {t('post.draft', 'Brouillon')}
            </span>
          )}
        </div>

        {/* Image principale */}
        {post.image_url && (
          <div className="mt-8 aspect-[16/9] rounded-lg overflow-hidden bg-border">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Contenu */}
        <div
          className={`mt-10 max-w-none text-ink whitespace-pre-line ${
            isRTL
              ? 'font-arabic text-lg text-right'
              : 'prose prose-lg text-left'
          }`}
          style={
            isRTL
              ? {
                  lineHeight: 2,
                  fontSize: '1.125rem',
                  letterSpacing: '0.01em',
                }
              : undefined
          }
        >
          {post.content}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div
            className={`mt-10 flex flex-wrap gap-2 ${
              isRTL ? 'flex-row-reverse justify-end' : ''
            }`}
          >
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/search?q=${tag}`}
                className="text-xs px-3 py-1 border border-border rounded-full text-muted hover:border-accent hover:text-accent"
                dir="auto"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <CommentList postId={post.id} />
      </article>

      {related.length > 0 && (
        <section
          className="max-w-6xl mx-auto px-4 py-16 border-t border-border"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <h2
            className={`font-serif text-2xl mb-8 ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            {t('post.related', 'Articles similaires')}
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}