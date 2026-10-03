/**
 * Détecte si un texte contient majoritairement des caractères arabes/hébreux
 * @param {string} text
 * @returns {boolean}
 */
export const isRTLText = (text = '') => {
  if (!text || !text.trim()) return false;

  // Caractères arabes + hébreux
  const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/g;

  // Caractères latins
  const ltrRegex = /[A-Za-zÀ-ÖØ-öø-ÿ]/g;

  const rtlCount = (text.match(rtlRegex) || []).length;
  const ltrCount = (text.match(ltrRegex) || []).length;

  // Il faut avoir suffisamment de caractères RTL
  // et plus de RTL que de caractères latins.
  return rtlCount > 5 && rtlCount > ltrCount;
};

/**
 * Retourne 'rtl' ou 'ltr' selon le texte
 */
export const getTextDirection = (text = '') => {
  return isRTLText(text) ? 'rtl' : 'ltr';
};