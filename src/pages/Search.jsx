import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import SEO from '../components/SEO';

export default function Search({ initialQuery = '' }) {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || initialQuery;

  // ✅ L'input démarre avec la valeur passée en prop (grâce au key du parent)
  const [input, setInput] = useState(initialQuery);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(Boolean(initialQuery));
  const [error, setError] = useState(false);

  useEffect(() => {
    const query = q.trim();
    if (!query) return;

    let cancelled = false;

    (async () => {
      try {
        const { data, error: supaError } = await supabase
          .from('posts')
          .select('*, author:profiles(name, photo_url)')
          .eq('published', true)
          .or(
            `title.ilike.%${query}%,excerpt.ilike.%${query}%,category.ilike.%${query}%`
          )
          .limit(30);

        if (cancelled) return;
        if (supaError) throw supaError;
        setResults(data || []);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [q]);

  const submit = (e) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (input.trim()) next.set('q', input.trim());
    setParams(next);
    // ✅ setState dans un event handler = autorisé
    setLoading(Boolean(input.trim()));
    setError(false);
    setResults([]);
  };

  return (
    <>
      <SEO title="Recherche" />
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl md:text-5xl mb-8">Rechercher</h1>

        <form onSubmit={submit} className="mb-10">
          <div className="relative">
            <SearchIcon
              size={18}
              className="absolute top-1/2 -translate-y-1/2 start-4 text-muted"
            />
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Titre, tag, catégorie…"
              className="w-full bg-surface border border-border rounded-lg ps-12 pe-4 py-4 text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>
        </form>

        {q && (
          <p className="text-sm text-muted mb-8">
            {loading
              ? 'Recherche…'
              : error
                ? 'Une erreur est survenue'
                : `${results.length} résultat${results.length > 1 ? 's' : ''} pour « ${q} »`}
          </p>
        )}

        {loading ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : q ? (
          <p className="text-muted">Aucun résultat.</p>
        ) : null}
      </section>
    </>
  );
}