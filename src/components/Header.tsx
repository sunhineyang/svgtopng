// 头部导航组件 - 包含模式切换、语言选择和主题切换
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Upload, 
  Code, 
  Sun, 
  Moon, 
  Monitor, 
  Globe,
  Zap
} from 'lucide-react';
import { useAppStore, Mode, Theme, Language } from '../store/useAppStore';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { t, i18n } = useTranslation();
  const { mode, theme, language, setMode, setTheme, setLanguage } = useAppStore();
  
  // 应用主题
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // 系统主题
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };
    
    applyTheme();
    
    // 监听系统主题变化
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      
      return () => {
        mediaQuery.removeEventListener('change', applyTheme);
      };
    }
  }, [theme]);
  
  // 切换模式
  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, [setMode]);
  
  // 切换主题
  const handleThemeChange = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, [setTheme]);
  
  // 切换语言
  const handleLanguageChange = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    
    // 同步更新URL
    const newPath = newLanguage === 'en' ? '/' : `/${newLanguage}`;
    window.history.pushState(null, '', newPath);
  }, [setLanguage, i18n]);
  
  // 获取主题图标
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <header className={`bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo和标题 */}
          <div className="flex items-center space-x-3">
            <img 
              src="/logo.png" 
              alt="SVG to PNG Converter Logo" 
              className="w-10 h-10 rounded-lg object-contain shadow-brand"
            />
            <div>
              <div className="text-xl font-bold text-neutral-800 dark:text-white">
                {t('title')}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
                {t('subtitle')}
              </p>
            </div>
          </div>
          
          {/* 中间：模式切换 */}
          <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button
              onClick={() => handleModeChange('upload')}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${mode === 'upload'
                  ? 'bg-primary-500 text-white shadow-brand'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                }
              `}
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">{t('modes.upload')}</span>
            </button>
            
            <button
              onClick={() => handleModeChange('code')}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${mode === 'code'
                  ? 'bg-primary-500 text-white shadow-brand'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                }
              `}
            >
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">{t('modes.code')}</span>
            </button>
          </div>
          
          {/* 右侧：设置和链接 */}
          <div className="flex items-center space-x-2">
            {/* 语言选择 */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  {t(`languages.${language}`)}
                </span>
              </button>
              
              {/* 语言下拉菜单 */}
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-brand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {(['en', 'ko', 'ja', 'ru'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`
                      w-full text-left px-3 py-2 text-sm transition-colors duration-200
                      ${language === lang
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400'
                      }
                    `}
                  >
                    {t(`languages.${lang}`)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 主题切换 */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-200 rounded-md hover:bg-primary-50 dark:hover:bg-primary-900/20">
                {getThemeIcon()}
                <span className="text-sm font-medium hidden sm:inline">
                  {t(`theme.${theme}`)}
                </span>
              </button>
              
              {/* 主题下拉菜单 */}
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-brand opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => {
                  const icons = {
                    light: <Sun className="w-4 h-4" />,
                    dark: <Moon className="w-4 h-4" />,
                    system: <Monitor className="w-4 h-4" />
                  };
                  
                  return (
                    <button
                      key={themeOption}
                      onClick={() => handleThemeChange(themeOption)}
                      className={`
                        w-full text-left px-3 py-2 text-sm transition-colors duration-200 flex items-center space-x-2
                        ${theme === themeOption
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400'
                        }
                      `}
                    >
                      {icons[themeOption]}
                      <span>{t(`theme.${themeOption}`)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;