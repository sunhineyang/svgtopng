import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, Shield, Zap, Star } from 'lucide-react';

interface CTAProps {
  className?: string;
}

const CTA: React.FC<CTAProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-8 text-center border border-primary-200 dark:border-primary-700">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          
          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-brand hover:shadow-brand-lg transform hover:-translate-y-0.5"
          >
            <ArrowUp className="w-5 h-5" />
            <span>{t('cta.startConverting')}</span>
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">{t('cta.feature1')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">{t('cta.feature2')}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-primary-600 dark:text-primary-400">
              <Star className="w-5 h-5" />
              <span className="text-sm font-medium">{t('cta.feature3')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { CTA };
export default CTA;