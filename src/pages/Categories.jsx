import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import Skeleton from '../components/ui/Skeleton';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('category')
        .eq('published', true);
      const counts = {};
      (data || []).forEach((r) => {
        if (r.category) counts[r.category] = (counts[r.category] || 0) + 1;
      });
      setCategories(Object.entries(counts).map(([name, count]) => ({ name, count })));
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <SEO title="Catégories" />
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="font-serif text-4xl md:text-5xl mb-10">Catégories</h1>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted">Aucune catégorie</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map(({ name, count }) => (
              <Link
                key={name}
                to={`/category/${encodeURIComponent(name)}`}
                className="flex items-center justify-between bg-surface border border-border rounded-lg p-5 hover:border-accent transition"
              >
                <span className="font-serif text-xl">{name}</span>
                <span className="text-sm text-muted">{count} article{count > 1 ? 's' : ''}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}