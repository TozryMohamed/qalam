import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { signOut } from '../services/auth';
import { uploadImage } from '../services/storage';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import SEO from '../components/SEO';
import { formatDate } from '../utils/slugify';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const nav = useNavigate();
  const { user, profile, loading } = useAuth();

  const [uploading, setUploading] = useState(false);

  const changeAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'avatars', user.id);
      const { error } = await supabase
        .from('profiles')
        .update({ photo_url: url })
        .eq('id', user.id);
      if (error) throw error;
      toast.success('Avatar mis à jour');
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const logout = async () => {
    await signOut();
    nav('/');
  };

  if (loading) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 space-y-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-64" />
      </section>
    );
  }

  return (
    <>
      <SEO title={t('nav.profile')} />
      <section className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl mb-10">{t('nav.profile')}</h1>

        <div className="flex items-center gap-6 mb-10">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-border">
            {profile?.photo_url ? (
              <img
                src={profile.photo_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-serif">
                {profile?.name?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase()}
              </div>
            )}
            <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center cursor-pointer text-white">
              <Upload size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={changeAvatar}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <div className="font-serif text-2xl">{profile?.name || '—'}</div>
            <div className="text-sm text-muted">{user?.email}</div>
            <div className="text-xs text-muted mt-1">
              Membre depuis{' '}
              {formatDate(
                profile?.created_at || user?.created_at,
                i18n.language?.slice(0, 2)
              )}
            </div>
          </div>
        </div>

        {/* ✅ Sous-composant avec key : pas de useEffect de synchronisation */}
        {profile?.id && (
          <ProfileNameForm
            key={profile.id}
            userId={profile.id}
            initialName={profile.name || ''}
            t={t}
          />
        )}

        <div className="border-t border-border pt-6 mt-10">
          <Button variant="outline" onClick={logout} className="w-full">
            <LogOut size={16} /> {t('nav.logout')}
          </Button>
        </div>
      </section>
    </>
  );
}

function ProfileNameForm({ userId, initialName, t }) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  const saveName = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', userId);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success('Nom mis à jour');
  };

  return (
    <form onSubmit={saveName} className="space-y-4">
      <Input
        label={t('auth.name')}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        type="submit"
        disabled={saving || !name.trim() || name === initialName}
      >
        {saving ? '…' : 'Enregistrer'}
      </Button>
    </form>
  );
}