// Langues supportées par l'app
export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

// Catégories disponibles pour les articles
export const CATEGORIES = [
  'Tech',
  'Design',
  'Culture',
  'Business',
  'Voyage',
  'Opinion',
  'Sport',
  'Science',
  'Santé',
  'Éducation',
  'Politique',
  'Divertissement',
];

// Rôles utilisateurs
export const ROLES = {
  USER: 'user',
  AUTHOR: 'author',
  ADMIN: 'admin',
};

// Pagination
export const POSTS_PER_PAGE = 9;

// Upload d'images
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 Mo
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

// Codes de langue pour formatage
export const LOCALES = {
  fr: 'fr-FR',
  en: 'en-US',
  ar: 'ar-EG',
};

// Langues RTL
export const RTL_LANGS = ['ar', 'he', 'fa', 'ur'];

// Timeouts / durées
export const DEBOUNCE_DELAY = 400; // ms
export const TOAST_DURATION = 4000; // ms