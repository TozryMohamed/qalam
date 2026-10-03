// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
// import { Search as SearchIcon } from 'lucide-react';
// import { getPublishedPosts } from '../services/posts';
// import PostCard from '../components/PostCard';
// import { PostCardSkeleton } from '../components/ui/Skeleton';
// import SEO from '../components/SEO';
// import Button from '../components/ui/Button';

// const LIMIT = 9;

// export default function Blog() {
//   const { t } = useTranslation();
//   const [params, setParams] = useSearchParams();
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [count, setCount] = useState(0);

//   const page = parseInt(params.get('page') || '0', 10);
//   const category = params.get('category') || '';
//   const search = params.get('q') || '';

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const { data, count } = await getPublishedPosts({
//           page, limit: LIMIT, category, search,
//         });
//         setPosts(data || []);
//         setCount(count || 0);
//       } catch (e) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [page, category, search]);

//   const updateParam = (key, value) => {
//     const next = new URLSearchParams(params);
//     if (value) next.set(key, value); else next.delete(key);
//     if (key !== 'page') next.delete('page');
//     setParams(next);
//   };

//   const totalPages = Math.ceil(count / LIMIT);

//   return (
//     <>
//       <SEO title={t('nav.blog')} description={t('home.subtitle')} />

//       <section className="max-w-6xl mx-auto px-4 py-12">
//         <header className="mb-10">
//           <h1 className="font-serif text-4xl md:text-5xl">{t('nav.blog')}</h1>
//           <p className="mt-2 text-muted">{count} article{count > 1 ? 's' : ''}</p>
//         </header>

//         {/* Filtres */}
//         <div className="flex flex-col md:flex-row gap-3 mb-10">
//           <div className="relative flex-1">
//             <SearchIcon size={16} className="absolute top-1/2 -translate-y-1/2 start-3 text-muted" />
//             <input
//               type="search"
//               placeholder={t('common.search')}
//               value={search}
//               onChange={(e) => updateParam('q', e.target.value)}
//               className="w-full bg-surface border border-border rounded ps-9 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
//             />
//           </div>
//         </div>

//         {/* États */}
//         {loading ? (
//           <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
//             {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
//           </div>
//         ) : error ? (
//           <div className="text-center py-20">
//             <p className="text-red-600 mb-4">{t('common.error')}</p>
//             <Button onClick={() => window.location.reload()}>{t('common.retry', 'Réessayer')}</Button>
//           </div>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-20 text-muted">
//             <p className="text-lg">{t('common.empty')}</p>
//           </div>
//         ) : (
//           <>
//             <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
//               {posts.map((p) => <PostCard key={p.id} post={p} />)}
//             </div>

//             {totalPages > 1 && (
//               <div className="mt-16 flex justify-center items-center gap-2">
//                 <Button
//                   variant="outline"
//                   disabled={page === 0}
//                   onClick={() => updateParam('page', String(page - 1))}
//                 >
//                   ←
//                 </Button>
//                 <span className="text-sm text-muted">
//                   {page + 1} / {totalPages}
//                 </span>
//                 <Button
//                   variant="outline"
//                   disabled={page >= totalPages - 1}
//                   onClick={() => updateParam('page', String(page + 1))}
//                 >
//                   →
//                 </Button>
//               </div>
//             )}
//           </>
//         )}
//       </section>
//     </>
//   );
// }




import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, User, Users, FileText } from 'lucide-react';
import { getPublishedPosts } from '../services/posts';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';

const LIMIT = 9;

export default function Blog() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const { isAuthor } = useRole();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  const page = parseInt(params.get('page') || '0', 10);
  const category = params.get('category') || '';
  const search = params.get('q') || '';
  const filter = params.get('filter') || 'all'; // 'all' | 'mine' | 'others'

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const queryParams = {
          page,
          limit: LIMIT,
          category,
          search,
        };

        // Filtrage par auteur
        if (filter === 'mine' && user?.id) {
          queryParams.authorId = user.id;
        } else if (filter === 'others' && user?.id) {
          queryParams.excludeAuthorId = user.id;
        }

        const { data, count: total } = await getPublishedPosts(queryParams);

        if (cancelled) return;
        setPosts(data || []);
        setCount(total || 0);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, category, search, filter, user]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  const totalPages = Math.ceil(count / LIMIT);

  // Onglets disponibles
  const tabs = [
    { id: 'all', label: t('blog.filter.all', 'Tous'), icon: FileText },
    ...(isAuthor
      ? [
          { id: 'mine', label: t('blog.filter.mine', 'Mes articles'), icon: User },
          { id: 'others', label: t('blog.filter.others', 'Autres'), icon: Users },
        ]
      : []),
  ];

  return (
    <>
      <SEO title={t('nav.blog')} description={t('home.subtitle')} />

      <section className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="font-serif text-4xl md:text-5xl">
            {t('nav.blog', 'Articles')}
          </h1>
          <p className="mt-2 text-muted">
            {count} article{count > 1 ? 's' : ''}
          </p>
        </header>

        {/* Filtres : recherche + onglets */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          {/* Recherche */}
          <div className="relative flex-1">
            <SearchIcon
              size={16}
              className="absolute top-1/2 -translate-y-1/2 start-3 text-muted"
            />
            <input
              type="search"
              placeholder={t('common.search', 'Rechercher')}
              value={search}
              onChange={(e) => updateParam('q', e.target.value)}
              className="w-full bg-surface border border-border rounded ps-9 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
          </div>

          {/* Onglets (uniquement si author/admin) */}
          {isAuthor && (
            <div className="flex gap-1 bg-surface border border-border rounded p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => updateParam('filter', tab.id === 'all' ? '' : tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition ${
                      isActive
                        ? 'bg-accent text-white'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* États */}
        {loading ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{t('common.error')}</p>
            <Button onClick={() => window.location.reload()}>
              {t('common.retry', 'Réessayer')}
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="text-lg">
              {filter === 'mine'
                ? t('blog.emptyMine', 'Tu n\'as pas encore publié d\'articles.')
                : t('common.empty', 'Aucun article.')}
            </p>
            {filter === 'mine' && (
              <Button as="a" href="/author/new" className="mt-4">
                {t('blog.createFirst', 'Créer mon premier article')}
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => updateParam('page', String(page - 1))}
                >
                  ←
                </Button>
                <span className="text-sm text-muted">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= totalPages - 1}
                  onClick={() => updateParam('page', String(page + 1))}
                >
                  →
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}