import { useEffect, useState } from 'react';
import { getPublishedPosts } from '../services/posts';

const DEFAULT_LIMIT = 9;

/**
 * @param {object} options
 * @param {number} [options.page=0]
 * @param {number} [options.limit=9]
 * @param {string} [options.category]
 * @param {string} [options.search]
 * @param {boolean} [options.enabled=true]
 */
export function usePosts({
  page = 0,
  limit = DEFAULT_LIMIT,
  category = '',
  search = '',
  enabled = true,
} = {}) {
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      try {
        const { data, count: total } = await getPublishedPosts({
          page,
          limit,
          category,
          search,
        });
        if (cancelled) return;
        setPosts(data || []);
        setCount(total || 0);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, limit, category, search, enabled]);

  const totalPages = Math.ceil(count / limit);

  return { posts, count, loading, error, totalPages };
}