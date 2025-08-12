// Gallery组件 - 展示SVG到PNG转换示例
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Code, Image, Download } from 'lucide-react';

// 示例SVG数据
const galleryExamples = [
  {
    id: 1,
    nameKey: 'gallery.examples.simpleIcon.name',
    name: 'Simple Icon',
    svgCode: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#4b9ee4" stroke="#2563eb" stroke-width="3"/>
  <path d="M35 45 L45 55 L65 35" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    descriptionKey: 'gallery.examples.simpleIcon.description',
    description: 'A simple check icon with blue circle background',
    sizeKey: 'gallery.examples.simpleIcon.size',
    size: '100x100',
    formatKey: 'gallery.examples.format',
    format: 'SVG → PNG'
  },
  {
    id: 2,
    nameKey: 'gallery.examples.logoDesign.name',
    name: 'Logo Design',
    svgCode: `<svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="20" width="100" height="40" rx="20" fill="#328976"/>
  <text x="60" y="45" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">LOGO</text>
  <circle cx="25" cy="40" r="8" fill="#4b9ee4"/>
</svg>`,
    descriptionKey: 'gallery.examples.logoDesign.description',
    description: 'Brand logo with rounded rectangle and accent circle',
    sizeKey: 'gallery.examples.logoDesign.size',
    size: '120x80',
    formatKey: 'gallery.examples.format',
    format: 'SVG → PNG'
  },
  {
    id: 3,
    nameKey: 'gallery.examples.chartElement.name',
    name: 'Chart Element',
    svgCode: `<svg width="150" height="100" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="60" width="15" height="30" fill="#4b9ee4"/>
  <rect x="45" y="40" width="15" height="50" fill="#328976"/>
  <rect x="70" y="20" width="15" height="70" fill="#2563eb"/>
  <rect x="95" y="50" width="15" height="40" fill="#4b9ee4"/>
  <rect x="120" y="30" width="15" height="60" fill="#328976"/>
</svg>`,
    descriptionKey: 'gallery.examples.chartElement.description',
    description: 'Bar chart visualization with multiple data points',
    sizeKey: 'gallery.examples.chartElement.size',
    size: '150x100',
    formatKey: 'gallery.examples.format',
    format: 'SVG → PNG'
  }
];

const Gallery: React.FC = () => {
  const { t } = useTranslation();
  const [activeViews, setActiveViews] = useState<{[key: number]: 'preview' | 'code'}>(
    galleryExamples.reduce((acc, example) => ({ ...acc, [example.id]: 'code' }), {})
  );

  const toggleView = (id: number) => {
    setActiveViews(prev => ({
      ...prev,
      [id]: prev[id] === 'preview' ? 'code' : 'preview'
    }));
  };

  // 滚动到页面顶部的工具区域
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const convertToDataUrl = (svgCode: string): string => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  };

  const generatePngPreview = (svgCode: string): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        canvas.width = img.width * 2; // 2x for better quality
        canvas.height = img.height * 2;
        ctx?.scale(2, 2);
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      
      const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      img.src = url;
    });
  };

  return (
    <section className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
          {t('gallery.title', 'SVG to PNG Conversion Gallery')}
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('gallery.subtitle', 'See how different SVG graphics convert to high-quality PNG images. Click "Code" to view the SVG source.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {galleryExamples.map((example) => (
          <div 
            key={example.id} 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={scrollToTop}
          >
            {/* 卡片头部 */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  {t(example.nameKey, example.name)}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleView(example.id);
                    }}
                    className={`
                      flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition-colors duration-200
                      ${activeViews[example.id] === 'code'
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }
                    `}
                  >
                    {activeViews[example.id] === 'code' ? (
                      <><Image size={12} /><span>{t('gallery.buttons.preview', 'Preview')}</span></>
                    ) : (
                      <><Code size={12} /><span>{t('gallery.buttons.code', 'Code')}</span></>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>{t(example.sizeKey, example.size)}</span>
                <span className="bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 px-2 py-1 rounded">
                  {t(example.formatKey, example.format)}
                </span>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-4" onClick={(e) => e.stopPropagation()}>
              {activeViews[example.id] === 'preview' ? (
                /* 预览模式 */
                <div className="space-y-4">
                  {/* SVG预览 */}
                  <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-4">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{t('gallery.labels.svgOriginal', 'SVG Original:')}</div>
                    <div 
                      className="flex items-center justify-center h-[120px]"
                      dangerouslySetInnerHTML={{ __html: example.svgCode }}
                    />
                  </div>
                  
                  {/* PNG预览 */}
                  <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-4">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{t('gallery.labels.pngResult', 'PNG Result:')}</div>
                    <div className="flex items-center justify-center h-[120px]">
                      <img 
                        src={convertToDataUrl(example.svgCode)}
                        alt={`PNG version of ${example.name}`}
                        className="max-w-full h-auto"
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* 代码模式 */
                <div className="space-y-4">
                  {/* SVG代码 */}
                  <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-4">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{t('gallery.labels.svgOriginal', 'SVG Original:')}</div>
                    <div className="h-[120px] overflow-auto">
                      <pre className="bg-neutral-900 dark:bg-neutral-950 text-green-400 text-xs p-3 rounded overflow-x-auto border">
                        <code>{example.svgCode}</code>
                      </pre>
                    </div>
                  </div>
                  
                  {/* PNG预览 */}
                  <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded p-4">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{t('gallery.labels.pngResult', 'PNG Result:')}</div>
                    <div className="flex items-center justify-center h-[120px]">
                      <img 
                        src={convertToDataUrl(example.svgCode)}
                        alt={`PNG version of ${example.name}`}
                        className="max-w-full h-auto"
                        style={{ imageRendering: 'crisp-edges' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* 描述 */}
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {t(example.descriptionKey, example.description)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部说明 */}
      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <div 
          className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200"
          onClick={scrollToTop}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Download className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-1">
                {t('gallery.tryItOut', 'Try It Yourself!')}
              </h4>
              <p className="text-xs text-primary-700 dark:text-primary-300">
                {t('gallery.tryDescription', 'Upload your own SVG files or paste SVG code above to convert them to high-quality PNG images with the same precision and clarity.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;