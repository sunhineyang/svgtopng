// 主应用组件 - 整合所有功能模块
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from './store/useAppStore';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import CodeEditor from './components/CodeEditor';
import FileList from './components/FileList';
import ConversionSettings from './components/ConversionSettings';
import PreviewPanel from './components/PreviewPanel';
import ConvertButton from './components/ConvertButton';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import './i18n'; // 初始化国际化

// 语言配置映射
const languageConfig = {
  en: {
    title: 'Convert SVG to PNG Online - Fast & High Quality & No Uploads',
    description: 'Paste SVG code or upload files to convert to PNG instantly. Our tool handles batch processing and creates high-resolution PNGs right in your browser.'
  },
  ko: {
    title: 'SVG를 PNG로 온라인 변환 - 빠르고 고품질 & 업로드 없음',
    description: 'SVG 코드를 붙여넣거나 파일을 업로드하여 즉시 PNG로 변환하세요. 우리 도구는 일괄 처리를 지원하며 브라우저에서 바로 고해상도 PNG를 생성합니다.'
  },
  ja: {
    title: 'SVGをPNGにオンライン変換 - 高速・高品質・アップロード不要',
    description: 'SVGコードを貼り付けるかファイルをアップロードして、即座にPNGに変換できます。当ツールはバッチ処理に対応し、ブラウザで直接高解像度PNGを作成します。'
  },
  ru: {
    title: 'Конвертация SVG в PNG онлайн - Быстро, качественно и без загрузок',
    description: 'Вставьте SVG код или загрузите файлы для мгновенной конвертации в PNG. Наш инструмент поддерживает пакетную обработку и создает PNG высокого разрешения прямо в вашем браузере.'
  }
};

function App() {
  const { t, i18n } = useTranslation();
  const { mode } = useAppStore();
  
  // URL语言检测和同步
  const detectAndSetLanguageFromUrl = () => {
    const path = window.location.pathname;
    let detectedLang = 'en'; // 默认语言
    
    // 从URL路径检测语言
    if (path.startsWith('/ko')) {
      detectedLang = 'ko';
    } else if (path.startsWith('/ja')) {
      detectedLang = 'ja';
    } else if (path.startsWith('/ru')) {
      detectedLang = 'ru';
    }
    
    // 检查是否有预设的语言（从HTML脚本设置）
    if (window.__INITIAL_LANGUAGE__) {
      detectedLang = window.__INITIAL_LANGUAGE__;
    }
    
    // 如果检测到的语言与当前语言不同，则切换语言
    if (detectedLang !== i18n.language) {
      i18n.changeLanguage(detectedLang);
    }
    
    return detectedLang;
  };
  
  // 更新页面meta标签
  const updatePageMeta = (lang) => {
    const config = languageConfig[lang] || languageConfig.en;
    
    // 更新页面标题
    document.title = config.title;
    
    // 更新meta描述
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', config.description);
    }
    
    // 更新HTML lang属性
    document.documentElement.lang = lang;
  };
  
  // 初始化应用
  useEffect(() => {
    // 检查浏览器兼容性
    const checkBrowserSupport = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.warn('Canvas 2D context not supported');
        return false;
      }
      
      if (!window.FileReader) {
        console.warn('FileReader API not supported');
        return false;
      }
      
      if (!window.Blob) {
        console.warn('Blob API not supported');
        return false;
      }
      
      return true;
    };
    
    if (!checkBrowserSupport()) {
      alert('Your browser does not support all required features. Please use a modern browser.');
    }
    
    // 检测并设置语言
    const currentLang = detectAndSetLanguageFromUrl();
    updatePageMeta(currentLang);
    
    // 监听语言变化
    const handleLanguageChange = () => {
      updatePageMeta(i18n.language);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    
    // 清理事件监听器
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  // 监听语言变化，同步URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const currentLang = i18n.language;
    
    // 构建正确的URL路径
    let expectedPath = '/';
    if (currentLang !== 'en') {
      expectedPath = `/${currentLang}`;
    }
    
    // 如果当前路径与期望路径不匹配，更新浏览器历史记录（不刷新页面）
    if (currentPath !== expectedPath && currentPath !== expectedPath + '/') {
      // 使用 replaceState 避免在浏览器历史中创建新条目
      window.history.replaceState(null, '', expectedPath);
    }
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col">
      {/* 头部导航 */}
      <Header />
      
      {/* Hero 模块 - 简化版 */}
      <section className="bg-neutral-50 dark:bg-neutral-900 py-8 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Free SVG to PNG Converter
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-6">Drop your SVGs below and let the best online converter instantly turn them into crisp PNGs—no uploads, completely free.</p>
          
          {/* 三个卖点 - 简化为水平排列 */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <div className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400">
              <span className="w-5 h-5 bg-secondary-100 dark:bg-secondary-900/20 rounded-full flex items-center justify-center">
                <span className="text-xs">✓</span>
              </span>
              <span className="font-medium">Free Converter</span>
            </div>
            
            <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
              <span className="w-5 h-5 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <span className="text-xs">✓</span>
              </span>
              <span className="font-medium">No Ads</span>
            </div>
            
            <div className="flex items-center space-x-2 text-primary-700 dark:text-primary-300">
              <span className="w-5 h-5 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <span className="text-xs">✓</span>
              </span>
              <span className="font-medium">No Registration</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* 主要内容区域 */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 输入区域 */}
          <section className="space-y-6">
            {mode === 'upload' ? (
              <div className="space-y-6">
                {/* 文件上传 */}
                <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                  <div className="mb-4">
                    <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                      Upload SVG Files for PNG Conversion
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Drag and drop your SVG files for instant svg to png conversion. Support for multiple files.
                    </p>
                  </div>
                  <FileUpload />
                </div>
                
                {/* 文件列表 */}
                <FileList />
              </div>
            ) : (
              /* 代码编辑器 */
              <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                    SVG Code Editor for PNG Conversion
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Paste your SVG code directly for svg to png conversion. Real-time validation included.
                  </p>
                </div>
                <CodeEditor />
              </div>
            )}
          </section>
          
          {/* 设置和预览区域 */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 转换设置 */}
            <div className="space-y-6">
              <ConversionSettings />
              
              {/* 转换按钮 */}
              <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                    Convert SVG to PNG
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Click the button below to start the svg to png conversion process.
                  </p>
                </div>
                <ConvertButton />
                
                {/* 需要帮助按钮 */}
                <div className="mt-4 text-center">
                  <a 
                    href="mailto:0992sunshine@gmail.com?subject=SVG转PNG工具 - 需要帮助&body=您好，我在使用SVG转PNG工具时遇到了问题，希望能得到帮助。%0A%0A问题描述：%0A%0A谢谢！"
                    className="inline-flex items-center space-x-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                      <path d="M12 17h.01"/>
                    </svg>
                    <span>{t('help')}</span>
                  </a>
                </div>
              </div>
            </div>
            
            {/* 预览面板 */}
            <div>
              <PreviewPanel />
            </div>
          </section>
          
          {/* SVG to PNG Features */}
          <section className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              SVG to PNG Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
                <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">Batch SVG to PNG Support</h3>
                <div className="text-xs text-primary-700 dark:text-primary-300">Convert multiple SVG files to PNG format simultaneously for improved efficiency</div>
              </div>
              <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-lg border border-secondary-100 dark:border-secondary-800">
                <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">Custom PNG Size and Quality</h3>
                <div className="text-xs text-secondary-700 dark:text-secondary-300">Flexible settings for output PNG dimensions, quality, and transparency options</div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
                <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">Real-time SVG Preview</h3>
                <div className="text-xs text-primary-700 dark:text-primary-300">Preview SVG effects in real-time before conversion to ensure expected results</div>
              </div>
              <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-lg border border-secondary-100 dark:border-secondary-800">
                <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">SVG Code Editor</h3>
                <div className="text-xs text-secondary-700 dark:text-secondary-300">Built-in syntax-highlighted SVG code editor with direct editing support</div>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
                <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">Multi-language Support</h3>
                <div className="text-xs text-primary-700 dark:text-primary-300">Multiple language interface support for convenient conversion experience worldwide</div>
              </div>
              <div className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-lg border border-secondary-100 dark:border-secondary-800">
                <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">Dark/Light Theme</h3>
                <div className="text-xs text-secondary-700 dark:text-secondary-300">Support for dark and light theme switching to adapt to different environments</div>
              </div>
            </div>
          </section>
          
          {/* 使用说明 */}
          <section className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              How to Use Our SVG to PNG Converter
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 文件上传模式说明 */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-neutral-800 dark:text-neutral-200 flex items-center space-x-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm font-bold">
                    1
                  </span>
                  <span>SVG to PNG File Upload Mode</span>
                </h3>
                
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-8">
                  <li>• Drag & drop SVG files for instant svg to png conversion</li>
                  <li>• Convert multiple SVG files to PNG format (up to 20)</li>
                  <li>• Maximum file size: 10MB per SVG file</li>
                  <li>• Batch svg to image conversion and download as ZIP</li>
                </ul>
              </div>
              
              {/* 代码编辑器模式说明 */}
              <div className="space-y-3">
                <h3 className="text-md font-medium text-neutral-800 dark:text-neutral-200 flex items-center space-x-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-secondary-100 dark:bg-secondary-900 text-secondary-600 dark:text-secondary-400 rounded-full text-sm font-bold">
                    2
                  </span>
                  <span>SVG Code Editor for PNG Conversion</span>
                </h3>
                
                <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 ml-8">
                  <li>• Paste SVG code directly for svg to png online conversion</li>
                  <li>• Real-time SVG syntax highlighting and validation</li>
                  <li>• Live preview before converting from svg to png</li>
                  <li>• Built-in SVG converter with example templates</li>
                </ul>
              </div>
            </div>
            
            {/* 通用步骤 */}
            <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <h3 className="text-md font-medium text-neutral-800 dark:text-neutral-200 mb-3">
                SVG to PNG Conversion Steps
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                  <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Configure SVG Settings</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Set PNG size, quality, and conversion options</p>
                </div>
                
                <div className="text-center p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                  <div className="w-8 h-8 bg-secondary-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Preview & Convert SVG</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Check SVG preview and start svg to png conversion</p>
                </div>
                
                <div className="text-center p-4 bg-neutral-100 dark:bg-neutral-700 rounded-lg">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Download PNG Files</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">Converted PNG files download automatically</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Gallery */}
          <Gallery />
          
          {/* FAQ */}
          <FAQ />
          
          {/* CTA */}
          <CTA />
        </div>
      </main>
      
      {/* 页脚 */}
      <Footer />
    </div>
  );
}

export default App;