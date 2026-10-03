import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { getPublishedPosts } from '../services/posts';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';

export default function Home() {
  const { t } = useTranslation();
  const [featured, setFeatured] = useState(null);
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getPublishedPosts({ page: 0, limit: 7 });
        setFeatured(data?.[0] || null);
        setLatest(data?.slice(1) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <SEO
        title={t('home.title')}
        description={t('home.subtitle')}
      />

      {/* HERO éditorial */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24 border-b border-border">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-accent">
              {t('home.featured')}
            </span>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink">
              {t('home.title')}
            </h1>
            <p className="mt-6 text-lg text-muted max-w-lg">
              {t('home.subtitle')}
            </p>
            <div className="mt-8">
              <Button as={Link} to="/blog" size="lg">
                {t('home.cta')} <ArrowRight size={16} />
              </Button>
            </div>
          </div>

          {featured && (
            <Link to={`/blog/${featured.slug}`} className="group block">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-border">
                {featured.image_url && (
                  <img
                    src={featured.image_url}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                )}
              </div>
              <div className="mt-4">
                <span className="text-xs uppercase tracking-wider text-accent">
                  {featured.category}
                </span>
                <h2 className="mt-2 font-serif text-2xl group-hover:text-accent transition">
                  {featured.title}
                </h2>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* LATEST */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-serif text-3xl">{t('home.latest')}</h2>
          <Link to="/blog" className="text-sm text-accent hover:underline">
            {t('common.seeAll', 'Tout voir')} →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : latest.length === 0 ? (
          <p className="text-muted">{t('common.empty')}</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </>
  );
}