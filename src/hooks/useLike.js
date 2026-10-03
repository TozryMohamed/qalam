import { useCallback, useEffect, useState } from 'react';
import { getLikesCount, hasLiked, toggleLike } from '../services/likes';
import { useAuth } from './useAuth';

export function useLike(postId) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;

    (async () => {
      try {
        const total = await getLikesCount(postId);
        const alreadyLiked = user ? await hasLiked(postId, user.id) : false;
        if (cancelled) return;
        setCount(total);
        setLiked(alreadyLiked);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [postId, user]);

  const toggle = useCallback(async () => {
    if (!user) return false;
    // Optimistic update
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount(prevCount + (prevLiked ? -1 : 1));

    try {
      const nowLiked = await toggleLike(postId, user.id);
      setLiked(nowLiked);
      return nowLiked;
    } catch {
      // rollback
      setLiked(prevLiked);
      setCount(prevCount);
      return prevLiked;
    }
  }, [postId, user, liked, count]);

  return { count, liked, loading, toggle };
}