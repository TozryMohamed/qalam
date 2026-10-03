/**
 * Traduit les erreurs Supabase / Firebase en messages utilisateur clairs
 */
const ERROR_MESSAGES = {
  // Auth
  'Invalid login credentials': 'Email ou mot de passe incorrect',
  'Email not confirmed': 'Vérifie ton email avant de te connecter',
  'User already registered': 'Cet email est déjà utilisé',
  'User already exists': 'Cet email est déjà utilisé',
  'Password should be at least 6 characters':
    'Le mot de passe doit contenir au moins 6 caractères',
  'Unable to validate email address: invalid format': 'Format d\'email invalide',
  'Email rate limit exceeded': 'Trop de tentatives, réessaie dans quelques minutes',
  'For security purposes, you can only request this once every 60 seconds':
    'Patiente 60 secondes avant de réessayer',
  'Auth session missing!': 'Session expirée, reconnecte-toi',
  'New password should be different from the old password':
    'Le nouveau mot de passe doit être différent',

  // Database
  'duplicate key value violates unique constraint':
    'Cet élément existe déjà',
  'permission denied for table': 'Tu n\'as pas la permission pour cette action',
  'row-level security policy':
    'Tu n\'as pas la permission pour cette action',

  // Storage
  'The resource already exists': 'Le fichier existe déjà',
  'Payload too large': 'Fichier trop volumineux (max 5 Mo)',
  'mime type': 'Format de fichier non supporté',

  // Network
  'Failed to fetch': 'Connexion impossible, vérifie ton réseau',
  'NetworkError': 'Connexion impossible, vérifie ton réseau',
};

/**
 * @param {Error|string} err
 * @returns {string}
 */
export const translateError = (err) => {
  const raw = typeof err === 'string' ? err : err?.message || '';

  // Recherche exacte
  if (ERROR_MESSAGES[raw]) return ERROR_MESSAGES[raw];

  // Recherche partielle (includes)
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (raw.toLowerCase().includes(key.toLowerCase())) return value;
  }

  // Fallback : message brut ou générique
  return raw || 'Une erreur est survenue';
};

/**
 * Vérifie si une erreur est liée à une session expirée
 */
export const isSessionError = (err) => {
  const msg = typeof err === 'string' ? err : err?.message || '';
  return msg.includes('session') || msg.includes('JWT');
};