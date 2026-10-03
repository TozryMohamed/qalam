import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const RTL_LANGS = new Set(['ar', 'he', 'fa', 'ur']);

export function useLang() {
  const { i18n } = useTranslation();

  const lang = (i18n.language || 'fr').slice(0, 2);
  const dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';
  const isRTL = dir === 'rtl';

  const changeLang = useCallback(
    (code) => {
      if (!code) return;
      i18n.changeLanguage(code);
    },
    [i18n]
  );

  return { lang, dir, isRTL, changeLang };
}