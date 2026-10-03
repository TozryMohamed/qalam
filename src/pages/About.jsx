import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('nav.about')} />
      <section className="max-w-3xl mx-auto px-4 py-20">
        <span className="text-xs uppercase tracking-[0.2em] text-accent">
          {t('nav.about')}
        </span>
        <h1 className="mt-3 font-serif text-5xl leading-tight">
          Un magazine numérique, entre encre et pixels.
        </h1>
        <div className="mt-10 space-y-6 text-lg text-muted leading-relaxed">
          <p>
            Le Journal est un blog éditorial indépendant qui explore la
            technologie, le design et la culture numérique avec le soin
            d'un magazine imprimé.
          </p>
          <p>
            Chaque article est pensé comme une lecture lente : typographie
            soignée, texte respirant, images choisies. Loin du bruit des
            flux infinis.
          </p>
          <p>
            Nous croyons qu'un bon texte mérite une bonne mise en page.
            C'est pourquoi le projet est construit avec React, Supabase et
            un design éditorial inspiré du papier.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
          <div>
            <div className="font-serif text-3xl text-accent">3</div>
            <div className="text-sm text-muted mt-1">Langues</div>
          </div>
          <div>
            <div className="font-serif text-3xl text-accent">∞</div>
            <div className="text-sm text-muted mt-1">Articles</div>
          </div>
          <div>
            <div className="font-serif text-3xl text-accent">100%</div>
            <div className="text-sm text-muted mt-1">Fait main</div>
          </div>
        </div>
      </section>
    </>
  );
}