// src/utils/slugify.js

/* -------------------------------------------------------------------------- */
/*  Slug                                                                      */
/* -------------------------------------------------------------------------- */

export function slugify(text = '') {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/* -------------------------------------------------------------------------- */
/*  Formatage de date (Africa/Tunis)                                          */
/* -------------------------------------------------------------------------- */

export function formatDate(iso, lang = 'fr', withTime = true) {
  if (!iso) return '';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';

  const localeMap = { fr: 'fr-FR', en: 'en-US', ar: 'ar-TN' };
  const locale = localeMap[lang] || 'fr-FR';

  const options = {
    timeZone: 'Africa/Tunis',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(withTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
  };

  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return date.toISOString();
  }
}

/* -------------------------------------------------------------------------- */
/*  Temps de lecture                                                          */
/* -------------------------------------------------------------------------- */

export function readingTimeLabel(content = '', lang = 'fr') {
  if (!content || !content.trim()) return '';

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const wpm = lang === 'ar' ? 150 : 200;
  const minutes = Math.max(1, Math.ceil(words / wpm));

  if (lang === 'ar') {
    const n = new Intl.NumberFormat('ar-TN').format(minutes);
    return `${n} دقيقة قراءة`;
  }

  const labels = {
    fr: `${minutes} min de lecture`,
    en: `${minutes} min read`,
  };
  return labels[lang] || labels.fr;
}

// Alias rétro-compatible
export const readingTime = readingTimeLabel;


export function makeSlug(text = '') {
  return slugify(text);
}