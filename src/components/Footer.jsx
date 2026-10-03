import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-xl mb-3">Le Journal</h3>
          <p className="text-sm text-muted">
            {t('home.subtitle')}
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-3">{t('nav.blog')}</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/blog" className="hover:text-accent">{t('nav.blog')}</Link></li>
            <li><Link to="/categories" className="hover:text-accent">{t('nav.categories')}</Link></li>
            <li><Link to="/search" className="hover:text-accent">{t('common.search')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-3">{t('nav.about')}</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/about" className="hover:text-accent">{t('nav.about')}</Link></li>
            <li><Link to="/login" className="hover:text-accent">{t('nav.login')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Le Journal — Tous droits réservés.
      </div>
    </footer>
  );
}