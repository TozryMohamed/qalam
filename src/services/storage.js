import { supabase } from '../lib/supabase';

export const uploadImage = async (file, bucket = 'posts', folder = '') => {
  if (!file) throw new Error('Aucun fichier');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    throw new Error('Format non supporté');
  if (file.size > 5 * 1024 * 1024) throw new Error('Fichier trop volumineux (max 5Mo)');

  const ext = file.name.split('.').pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};