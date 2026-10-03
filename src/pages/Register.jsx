import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { signUp } from '../services/auth';
import toast from 'react-hot-toast';

export default function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm)
      return toast.error('Les mots de passe ne correspondent pas');
    if (form.password.length < 6)
      return toast.error('Mot de passe trop court (min 6)');

    try {
      setLoading(true);
      await signUp(form);
      toast.success('Compte créé ! Vérifie ton email.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-serif mb-6">{t('auth.register')}</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          required placeholder={t('auth.name')}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-border bg-surface px-3 py-2 rounded"
        />
        <input
          required type="email" placeholder={t('auth.email')}
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-border bg-surface px-3 py-2 rounded"
        />
        <input
          required type="password" placeholder={t('auth.password')}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-border bg-surface px-3 py-2 rounded"
        />
        <input
          required type="password" placeholder={t('auth.confirmPassword')}
          value={form.confirm}
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          className="w-full border border-border bg-surface px-3 py-2 rounded"
        />
        <button
          disabled={loading}
          className="w-full bg-accent text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {loading ? '…' : t('auth.register')}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted">
        {t('auth.hasAccount')}{' '}
        <Link to="/login" className="text-accent">{t('auth.login')}</Link>
      </p>
    </section>
  );
}