import { useTranslation } from 'react-i18next';

const langs = [
  { code: 'fr', label: '🇫🇷 Français' },
  { code: 'en', label: '🇬🇧 English' },
  { code: 'ar', label: 'ع العربية' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.language?.slice(0, 2)}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="bg-transparent border border-border rounded px-2 py-1 text-sm"
      aria-label="Changer la langue"
    >
      {langs.map((l) => (
        <option key={l.code} value={l.code}>{l.label}</option>
      ))}
    </select>
  );
}