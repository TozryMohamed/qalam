import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page introuvable" />
      <section className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-7xl text-accent mb-4">404</h1>
        <p className="text-muted mb-8">Cette page n'existe pas.</p>
        <Link to="/" className="text-accent underline">
          ← Retour à l'accueil
        </Link>
      </section>
    </>
  );
}