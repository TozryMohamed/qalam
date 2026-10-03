// src/services/likes.js
import { supabase } from '../lib/supabase';

/**
 * Récupère le nombre de likes d'un post
 */
export async function getLikesCount(postId) {
  const { count, error } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (error) throw error;
  return count || 0;
}

/**
 * Vérifie si l'utilisateur courant a déjà liké ce post
 */
export async function hasUserLiked(postId, userId) {
  if (!userId) return false;
  const { data, error } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

/**
 * Ajoute un like
 */
export async function likePost(postId, userId) {
  const { error } = await supabase
    .from('post_likes')
    .insert({ post_id: postId, user_id: userId });

  if (error) throw error;
}

/**
 * Retire un like
 */
export async function unlikePost(postId, userId) {
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);

  if (error) throw error;
}