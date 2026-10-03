import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { signIn, signInWithGoogle } from '../services/auth';
import { supabase } from '../services/supabase';  // ← AJOUT
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

export default function Login() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(form);

      // ✅ ATTENDRE que la session soit active côté Supabase
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('✅ Session après login:', sessionData.session?.user?.email);

      if (!sessionData.session) {
        throw new Error('Session non établie');
      }

      toast.success('Connecté !');

      // ✅ Attendre un tick pour que AuthProvider traite l'événement
      await new Promise((r) => setTimeout(r, 100));

      nav('/profile');
    } catch (err) {
      console.error('❌ Erreur login:', err);
      const msg = err.message?.includes('Invalid login')
        ? 'Email ou mot de passe incorrect'
        : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <SEO title={t('auth.login')} />
      <section className="max-w-md mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl mb-8">{t('auth.login')}</h1>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label={t('auth.email')}
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label={t('auth.password')}
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-accent hover:underline"
            >
              {t('auth.forgot')}
            </Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '…' : t('auth.login')}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted">
          <div className="flex-1 h-px bg-border" />
          <span>ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button variant="outline" onClick={google} className="w-full">
          {t('auth.google')}
        </Button>

        <p className="mt-6 text-sm text-muted text-center">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-accent hover:underline">
            {t('auth.register')}
          </Link>
        </p>
      </section>
    </>
  );
}