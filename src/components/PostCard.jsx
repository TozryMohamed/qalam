import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, User } from 'lucide-react';
import { readingTime, formatDate } from '../utils/slugify';

export default function PostCard({ post, featured = false }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || 'fr';

  return (
    <article className={`group ${featured ? 'md:col-span-2' : ''}`}>
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative overflow-hidden rounded-lg aspect-[16/10] bg-border">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              {post.title?.[0] || '?'}
            </div>
          )}
        </div>

        <div className="mt-4">
          <span className="inline-block text-xs uppercase tracking-wider text-accent font-medium">
            {post.category || 'Général'}
          </span>
          <h3 className={`mt-2 font-serif leading-tight text-ink group-hover:text-accent transition ${featured ? 'text-3xl' : 'text-xl'}`}>
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-muted line-clamp-2">
            {post.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <User size={12} /> {post.author?.name || 'Anonyme'}
            </span>
            <span>{formatDate(post.created_at, lang)}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} /> {readingTime(post.content)} min
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}