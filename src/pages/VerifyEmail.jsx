import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabase';
import Button from '../components/ui/Button';

export default function VerifyEmail() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user?.email) return toast.error('Connecte-toi d\'abord');
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: data.user.email,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success('Email renvoyé');
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="font-serif text-3xl mb-4">Vérifie ton email ✉️</h1>
      <p className="text-muted mb-6">
        Un lien de confirmation t'a été envoyé. Clique dessus pour activer ton compte.
      </p>
      {sent ? (
        <p className="text-sm text-accent">Email renvoyé ✅</p>
      ) : (
        <Button onClick={resend} disabled={loading}>
          {loading ? '…' : "Renvoyer l'email"}
        </Button>
      )}
    </section>
  );
}