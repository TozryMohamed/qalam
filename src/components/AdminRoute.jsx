import { Navigate } from 'react-router-dom';
import { useRole } from '../hooks/useRole';

export default function AdminRoute({ children }) {
  const { isAdmin, loading } = useRole();
  if (loading) return <div className="p-10 text-center">Chargement…</div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}