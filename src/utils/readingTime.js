/**
 * Calcule le temps de lecture estimé d'un texte
 * Basé sur 200 mots/minute (vitesse moyenne de lecture)
 * @param {string} content
 * @returns {number} minutes (minimum 1)
 */
export const readingTime = (content = '') => {
  if (!content || typeof content !== 'string') return 1;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/**
 * Calcule le nombre de mots
 * @param {string} content
 * @returns {number}
 */
export const wordCount = (content = '') => {
  if (!content || typeof content !== 'string') return 0;
  return content.trim().split(/\s+/).filter(Boolean).length;
};

/**
 * Retourne un label lisible : "3 min de lecture"
 * @param {string} content
 * @param {string} lang
 * @returns {string}
 */
export const readingTimeLabel = (content, lang = 'fr') => {
  const minutes = readingTime(content);
  const labels = {
    fr: `${minutes} min de lecture`,
    en: `${minutes} min read`,
    ar: `${minutes} دقيقة قراءة`,
  };
  return labels[lang] || labels.fr;
};