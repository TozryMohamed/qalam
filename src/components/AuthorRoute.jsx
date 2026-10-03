import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthorRoute({ children }) {
  const { user, profile, loading } = useAuth();

  // 1. Si la session est en cours de chargement
  if (loading) {
    return <div className="p-10 text-center text-muted">Chargement…</div>;
  }

  // 2. Si pas connecté → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si le profil n'est pas encore chargé, on attend
  if (!profile) {
    return <div className="p-10 text-center text-muted">Chargement du profil…</div>;
  }

  // 4. Si le rôle n'est ni author ni admin → home
  if (profile.role !== 'author' && profile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 5. OK, on affiche
  return children;
}