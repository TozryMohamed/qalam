// src/utils/formatDate.js

/**
 * Formate une date Supabase (timestamptz UTC) en heure locale Tunisie.
 *
 * @param {string} iso  - ex: "2026-10-03T15:43:57.904761+00:00"
 * @param {string} lang - 'fr' | 'en' | 'ar'
 * @param {boolean} withTime - true = affiche date + heure
 * @returns {string}
 */
export function formatDate(iso, lang = 'fr', withTime = true) {
  if (!iso) return '';

  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';

  const localeMap = {
    fr: 'fr-FR',
    en: 'en-US',
    ar: 'ar-TN',
  };
  const locale = localeMap[lang] || 'fr-FR';

  const options = {
    timeZone: 'Africa/Tunis',   // ✅ convertit UTC → Tunisie automatiquement
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