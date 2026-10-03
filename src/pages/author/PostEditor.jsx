import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { supabase } from '../../services/supabase';
import { makeSlug } from '../../utils/slugify';
import { CATEGORIES } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import ImageUploader from '../../components/ImageUploader';
import SEO from '../../components/SEO';

export default function PostEditor() {
  const { id } = useParams();
  const nav = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    image_url: '',
    published: false,
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single();

        if (cancelled) return;

        if (error || !data) {
          toast.error(t('post.notFound', 'Article introuvable'));
          nav('/author');
          return;
        }

        if (user?.id && data.author_id !== user.id) {
          toast.error(t('postEditor.notOwner', 'Tu ne peux modifier que tes articles'));
          nav('/author');
          return;
        }

        setForm({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          category: data.category || '',
          tags: (data.tags || []).join(', '),
          image_url: data.image_url || '',
          published: Boolean(data.published),
        });
      } catch {
        if (!cancelled) toast.error(t('errors.generic'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, user, nav, t]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title.trim())
      return toast.error(t('postEditor.titleRequired', 'Titre requis'));
    if (!form.content.trim())
      return toast.error(t('postEditor.contentRequired', 'Contenu requis'));
    if (!form.category)
      return toast.error(t('postEditor.categoryRequired', 'Catégorie requise'));
    if (!user?.id) return toast.error(t('author.notConnected'));

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || makeSlug(form.title),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      image_url: form.image_url || null,
      published: form.published,
      author_id: user.id,
      updated_at: new Date().toISOString(),
    };

    setSaving(true);
    try {
      if (isEdit) {
        const { error } = await supabase
          .from('posts')
          .update(payload)
          .eq('id', id)
          .eq('author_id', user.id);
        if (error) throw error;
        toast.success(t('postEditor.updated', 'Article mis à jour'));
      } else {
        const { error } = await supabase.from('posts').insert(payload);
        if (error) {
          if (error.message.includes('duplicate key')) {
            throw new Error(t('postEditor.slugTaken'));
          }
          throw error;
        }
        toast.success(t('postEditor.created', 'Article créé'));
      }
      nav('/author');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="p-10 text-center text-muted">
        {t('common.loading', 'Chargement…')}
      </p>
    );
  }

  return (
    <>
      <SEO
        title={
          isEdit
            ? t('postEditor.editTitle', "Modifier l'article")
            : t('postEditor.newTitle', 'Nouvel article')
        }
      />

      <form onSubmit={submit} className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl">
            {isEdit
              ? t('postEditor.editTitle', "Modifier l'article")
              : t('postEditor.newTitle', 'Nouvel article')}
          </h1>
          {isEdit && form.slug && (
            <a
              href={`/blog/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              {t('postEditor.viewArticle', "Voir l'article")} →
            </a>
          )}
        </div>

        <Input
          label={t('postEditor.title', 'Titre')}
          required
          value={form.title}
          onChange={(e) => update({ title: e.target.value })}
        />

        <Input
          label={t('postEditor.slug', 'Slug (URL)')}
          value={form.slug}
          onChange={(e) => update({ slug: e.target.value })}
          placeholder={t('postEditor.slugPlaceholder')}
        />

        <Textarea
          label={t('postEditor.excerpt', 'Résumé')}
          value={form.excerpt}
          onChange={(e) => update({ excerpt: e.target.value })}
          rows={3}
        />

        <Textarea
          label={t('postEditor.content', 'Contenu')}
          value={form.content}
          onChange={(e) => update({ content: e.target.value })}
          rows={14}
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            {t('postEditor.category', 'Catégorie')}
          </label>
          <select
            value={form.category}
            onChange={(e) => update({ category: e.target.value })}
            className="w-full bg-surface border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">
              {t('postEditor.categoryPlaceholder', '— Choisir —')}
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`categories.${c}`, c)}
              </option>
            ))}
          </select>
        </div>

        <Input
          label={t('postEditor.tags', 'Tags (séparés par virgule)')}
          value={form.tags}
          onChange={(e) => update({ tags: e.target.value })}
          placeholder={t('postEditor.tagsPlaceholder')}
        />

        <ImageUploader
          bucket="posts"
          folder={user?.id || 'draft'}
          value={form.image_url}
          onChange={(url) => update({ image_url: url })}
          label={t('postEditor.image', 'Image principale')}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update({ published: e.target.checked })}
          />
          <span className="text-sm">
            {t('postEditor.publishNow', 'Publier immédiatement')}
          </span>
        </label>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button type="submit" disabled={saving}>
            {saving
              ? '…'
              : isEdit
                ? t('postEditor.update', 'Mettre à jour')
                : t('postEditor.create', "Créer l'article")}
          </Button>
          <Button type="button" variant="outline" onClick={() => nav('/author')}>
            {t('common.cancel', 'Annuler')}
          </Button>
        </div>
      </form>
    </>
  );
}