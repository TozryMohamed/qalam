// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// // ✅ Vérification des variables d'environnement
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error(
//     '❌ Variables Supabase manquantes.\n' +
//     'Vérifie que le fichier .env est bien à la RACINE du projet (pas dans src/).\n' +
//     'Il doit contenir :\n' +
//     '  VITE_SUPABASE_URL=https://xqzxvwzbkrtrrmnylcjq.supabase.co\n' +
//     '  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxenh2d3pia3J0cnJtbnlsY2pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMjg1MzEsImV4cCI6MjEwNjYwNDUzMX0.XumJ3aUZ7SxPeGdemEjhJ0gR0l1XdA9tgSujO9S_mIA\n' +
//     'Puis redémarre Vite (npm run dev).'
//   );
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: true,
//     storage: window.localStorage,
//     storageKey: 'mon-blog-auth',
//   },
// });

// // 🐛 Log en développement uniquement
// if (import.meta.env.DEV) {
//   supabase.auth.onAuthStateChange((event, session) => {
//     console.log(
//       `🔐 [Supabase Auth] ${event}`,
//       session?.user?.email || '(pas de session)'
//     );
//   });
// }


// Réexport depuis services pour garantir UNE SEULE instance Supabase
export { supabase } from '../services/supabase';