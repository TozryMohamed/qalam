// import { supabase } from '../lib/supabase';

// export const getPublishedPosts = async ({ page = 0, limit = 9, category, search }) => {
//   let query = supabase
//     .from('posts')
//     .select('*, author:profiles(name, photo_url)', { count: 'exact' })
//     .eq('published', true)
//     .order('created_at', { ascending: false })
//     .range(page * limit, page * limit + limit - 1);

//   if (category) query = query.eq('category', category);
//   if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);

//   const { data, error, count } = await query;
//   if (error) throw error;
//   return { data, count };
// };

// export const getPostBySlug = async (slug) => {
//   const { data, error } = await supabase
//     .from('posts')
//     .select('*, author:profiles(name, photo_url)')
//     .eq('slug', slug)
//     .single();
//   if (error) throw error;
//   return data;
// };

// export const createPost = async (post) => {
//   const { data, error } = await supabase.from('posts').insert(post).select().single();
//   if (error) throw error;
//   return data;
// };



import { supabase } from './supabase';

/**
 * Récupère les articles publiés avec filtres
 * @param {object} options
 * @param {number} [options.page=0]
 * @param {number} [options.limit=9]
 * @param {string} [options.category]
 * @param {string} [options.search]
 * @param {string} [options.authorId]      — filtre : articles d'un auteur
 * @param {string} [options.excludeAuthorId] — filtre : articles SAUF ceux d'un auteur
 */
export const getPublishedPosts = async ({
  page = 0,
  limit = 9,
  category,
  search,
  authorId,
  excludeAuthorId,
} = {}) => {
  let query = supabase
    .from('posts')
    .select('*, author:profiles(name, photo_url)', { count: 'exact' })
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (category) query = query.eq('category', category);
  if (authorId) query = query.eq('author_id', authorId);
  if (excludeAuthorId) query = query.neq('author_id', excludeAuthorId);

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,excerpt.ilike.%${search}%,category.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
};

export const getPostBySlug = async (slug) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*, author:profiles(name, photo_url)')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
};

export const createPost = async (post) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();
  if (error) throw error;
  return data;
};