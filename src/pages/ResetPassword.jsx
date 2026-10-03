import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabase';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ResetPassword() {
  const nav = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error('Les mots de passe ne correspondent pas');
    if (password.length < 6) return toast.error('Mot de passe trop court');

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) return toast.error(error.message);
    toast.success('Mot de passe mis à jour');
    nav('/login');
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-serif text-3xl mb-8">Nouveau mot de passe</h1>
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirmer"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? '…' : 'Valider'}
        </Button>
      </form>
    </section>
  );
}