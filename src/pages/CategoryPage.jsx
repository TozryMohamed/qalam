import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublishedPosts } from '../services/posts';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import SEO from '../components/SEO';

export default function CategoryPage() {
  const { category } = useParams();
  const decoded = decodeURIComponent(category);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getPublishedPosts({ category: decoded, limit: 20 });
      setPosts(data || []);
      setLoading(false);
    })();
  }, [decoded]);

  return (
    <>
      <SEO title={`Catégorie : ${decoded}`} />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">Catégorie</span>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl mb-12">{decoded}</h1>

        {loading ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-muted">Aucun article dans cette catégorie.</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
    </>
  );
}