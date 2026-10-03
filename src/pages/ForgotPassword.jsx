import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { resetPassword } from '../services/auth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title={t('auth.forgot')} />
      <section className="max-w-md mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl mb-6">{t('auth.forgot')}</h1>

        {sent ? (
          <div className="bg-surface border border-border rounded p-5">
            <p className="text-sm">
              Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
              Vérifie ta boîte de réception.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <p className="text-sm text-muted">
              Saisis ton email, nous t'enverrons un lien pour réinitialiser ton mot de passe.
            </p>
            <Input
              label={t('auth.email')} type="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '…' : 'Envoyer le lien'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-sm text-muted text-center">
          <Link to="/login" className="text-accent hover:underline">← {t('auth.login')}</Link>
        </p>
      </section>
    </>
  );
}