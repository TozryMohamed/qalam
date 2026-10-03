import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { supabase } from '../../services/supabase';
import { ROLES } from '../../utils/constants';
import SEO from '../../components/SEO';
import { formatDate } from '../../utils/formatDate';

export default function AdminUsers() {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (cancelled) return;
      setUsers(data || []);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const changeRole = async (id, role) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id);

    if (error) return toast.error(error.message);

    setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)));
    toast.success(t('admin.roleUpdated', 'Rôle mis à jour'));
  };

  return (
    <>
      <SEO title={t('admin.usersTitle', 'Utilisateurs')} />
      <div className="max-w-5xl">
        <h1 className="font-serif text-3xl mb-8">
          {t('admin.usersTitle', 'Utilisateurs')}
        </h1>

        {loading ? (
          <p className="text-muted">{t('common.loading', 'Chargement…')}</p>
        ) : users.length === 0 ? (
          <p className="text-muted">{t('common.empty', 'Aucun utilisateur')}</p>
        ) : (
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-border/40">
                <tr>
                  <th className="p-3 text-start font-medium">
                    {t('admin.userName', 'Nom')}
                  </th>
                  <th className="p-3 text-start font-medium">
                    {t('admin.userEmail', 'Email')}
                  </th>
                  <th className="p-3 text-start font-medium">
                    {t('admin.userRole', 'Rôle')}
                  </th>
                  <th className="p-3 text-start font-medium">
                    {t('admin.userJoined', 'Inscrit le')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-3">{u.name || '—'}</td>
                    <td className="p-3 text-muted">{u.email}</td>
                    <td className="p-3">
                      <select
                        value={u.role || 'user'}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="bg-surface border border-border rounded px-2 py-1 text-sm"
                      >
                        {Object.values(ROLES).map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-muted text-xs">
                      {formatDate(u.created_at, i18n.language?.slice(0, 2))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}