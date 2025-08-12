// 预览组件 - 显示转换前后的对比
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Eye, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize2,
  Image as ImageIcon,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SVGConverter } from '../utils/svgConverter';

// SVG预处理函数 - 移除固定尺寸，确保自适应
const preprocessSVG = (svgContent: string): string => {
  // 创建一个临时的DOM解析器
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');
  
  if (!svgElement) return svgContent;
  
  // 获取原始尺寸用于设置viewBox（如果没有的话）
  const width = svgElement.getAttribute('width');
  const height = svgElement.getAttribute('height');
  const existingViewBox = svgElement.getAttribute('viewBox');
  
  // 如果没有viewBox但有width和height，则创建viewBox
  if (!existingViewBox && width && height) {
    const numWidth = parseFloat(width.replace(/[^0-9.]/g, ''));
    const numHeight = parseFloat(height.replace(/[^0-9.]/g, ''));
    if (!isNaN(numWidth) && !isNaN(numHeight)) {
      svgElement.setAttribute('viewBox', `0 0 ${numWidth} ${numHeight}`);
    }
  }
  
  // 移除固定的width和height属性，让CSS控制尺寸
  svgElement.removeAttribute('width');
  svgElement.removeAttribute('height');
  
  // 确保preserveAspectRatio设置正确
  if (!svgElement.getAttribute('preserveAspectRatio')) {
    svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  }
  
  // 返回处理后的SVG字符串
  return new XMLSerializer().serializeToString(svgElement);
};

// 添加SVG自适应样式 - 确保SVG能够完整显示在容器内
const svgStyles = `
  .svg-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  .svg-container svg {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`;

interface PreviewPanelProps {
  className?: string;
}

interface UnifiedPreviewProps {
  svgContent: string | null;
  pngContent: string | null;
  svgSize?: { width: number; height: number };
  pngSize?: { width: number; height: number };
  fileSize?: number;
  resultSize?: number;
}

// 统一预览组件 - 支持SVG和PNG切换
const UnifiedPreview: React.FC<UnifiedPreviewProps> = ({ 
  svgContent,
  pngContent,
  svgSize,
  pngSize,
  fileSize,
  resultSize
}) => {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'svg' | 'png'>(
    pngContent ? 'png' : 'svg'
  );
  const [backgroundColor, setBackgroundColor] = useState<'transparent' | 'white' | 'black'>('transparent');
  
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  }, []);
  
  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);
  
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'svg' ? 'png' : 'svg');
  }, []);

  // 获取当前显示的内容和信息
  const currentContent = viewMode === 'svg' ? svgContent : pngContent;
  const currentSize = viewMode === 'svg' ? svgSize : pngSize;
  const currentFileSize = viewMode === 'svg' ? fileSize : resultSize;
  const currentTitle = viewMode === 'svg' ? t('preview.original') : t('preview.converted');

  if (!svgContent) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No content to preview</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* 预览头部 */}
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {currentTitle}
                </h4>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {currentSize && (
                    <span>{currentSize.width} × {currentSize.height}</span>
                  )}
                  {currentFileSize && (
                    <span>{SVGConverter.formatFileSize(currentFileSize)}</span>
                  )}
                  <span>Zoom: {Math.round(zoom * 100)}%</span>
                </div>
              </div>
              
              {/* 背景色选择器 */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t('preview.background.label')}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setBackgroundColor('transparent')}
                    className={`w-6 h-6 rounded border-2 transition-colors ${
                      backgroundColor === 'transparent'
                        ? 'border-blue-500 dark:border-blue-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, #ccc 25%, transparent 25%), 
                        linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #ccc 75%), 
                        linear-gradient(-45deg, transparent 75%, #ccc 75%)
                      `,
                      backgroundSize: '8px 8px',
                      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                    }}
                    title={t('preview.background.transparent')}
                  />
                  <button
                    onClick={() => setBackgroundColor('white')}
                    className={`w-6 h-6 rounded border-2 bg-white transition-colors ${
                      backgroundColor === 'white'
                        ? 'border-blue-500 dark:border-blue-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    title={t('preview.background.white')}
                  />
                  <button
                    onClick={() => setBackgroundColor('black')}
                    className={`w-6 h-6 rounded border-2 bg-black transition-colors ${
                      backgroundColor === 'black'
                        ? 'border-blue-500 dark:border-blue-400'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    title={t('preview.background.black')}
                  />
                </div>
              </div>
              
              {/* 切换按钮 */}
              {pngContent && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {viewMode === 'svg' ? 'SVG' : 'PNG'}
                  </span>
                  <button
                    onClick={toggleViewMode}
                    className="p-1.5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title={`Switch to ${viewMode === 'svg' ? 'PNG' : 'SVG'}`}
                  >
                    {viewMode === 'svg' ? (
                      <ToggleLeft className="w-5 h-5" />
                    ) : (
                      <ToggleRight className="w-5 h-5" />
                    )}
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {viewMode === 'svg' ? 'PNG' : 'SVG'}
                  </span>
                </div>
              )}
            </div>
            
            {/* 预览控制按钮 */}
            <div className="flex items-center space-x-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleResetZoom}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleZoomIn}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <button
                onClick={toggleFullscreen}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* 预览内容 */}
        <div className={`h-96 overflow-auto relative ${
          backgroundColor === 'white' ? 'bg-white' :
          backgroundColor === 'black' ? 'bg-black' :
          'bg-white dark:bg-gray-900'
        }`}>
          {/* 棋盘背景（用于显示透明度） */}
          {backgroundColor === 'transparent' && (
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%), 
                  linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #ccc 75%), 
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            />
          )}
          
          <div className="relative flex items-center justify-center h-full p-4 overflow-hidden">
            {currentContent && (
              viewMode === 'svg' ? (
                <div 
                  className="transition-transform duration-200 flex items-center justify-center"
                  style={{ 
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center',
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                >
                  <div 
                     dangerouslySetInnerHTML={{ __html: preprocessSVG(currentContent) }}
                     className="svg-container"
                     style={{
                       width: '100%',
                       height: '100%',
                       maxWidth: '100%',
                       maxHeight: '100%'
                     }}
                   />
                </div>
              ) : (
                <div
                  className="transition-transform duration-200 flex items-center justify-center"
                  style={{ 
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <img
                    src={currentContent}
                    alt="SVG to PNG conversion preview - converted image from svg to png online"
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    style={{ 
                      display: 'block'
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* 全屏预览模态框 */}
      {isFullscreen && currentContent && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div 
              className={`relative ${
                backgroundColor === 'white' ? 'bg-white' :
                backgroundColor === 'black' ? 'bg-black' :
                'bg-transparent'
              }`}
              style={{
                width: '90vw',
                height: '90vh',
                maxWidth: '90vw',
                maxHeight: '90vh'
              }}
            >
              {/* 全屏棋盘背景 */}
              {backgroundColor === 'transparent' && (
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #ccc 25%, transparent 25%), 
                      linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #ccc 75%), 
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)
                    `,
                    backgroundSize: '30px 30px',
                    backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px'
                  }}
                />
              )}
              
              {viewMode === 'svg' ? (
                <div 
                  className="transition-transform duration-200 flex items-center justify-center relative z-10"
                  style={{ 
                    transform: `scale(${zoom})`,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <div 
                    dangerouslySetInnerHTML={{ __html: preprocessSVG(currentContent) }}
                    className="svg-container"
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                </div>
              ) : (
                <div
                  className="transition-transform duration-200 flex items-center justify-center relative z-10"
                  style={{ 
                    transform: `scale(${zoom})`,
                    width: '100%',
                    height: '100%'
                  }}
                >
                  <img
                    src={currentContent}
                    alt="SVG to PNG fullscreen preview - high quality svg to image conversion result"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { mode, files, codeContent, codeValidation } = useAppStore();
  
  // 注入SVG自适应样式
  React.useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = svgStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // 获取预览内容
  const getPreviewContent = () => {
    if (mode === 'code') {
      if (!codeContent || !codeValidation.isValid) {
        return {
          svgContent: null,
          pngContent: null,
          svgSize: undefined,
          pngSize: undefined
        };
      }
      
      const svgSize = SVGConverter.getSVGDimensions(codeContent);
      
      return {
        svgContent: codeContent,
        pngContent: null, // 需要转换后才有
        svgSize,
        pngSize: undefined
      };
    } else {
      // 文件上传模式 - 显示第一个有效文件
      const validFile = files.find(f => f.status === 'ready' || f.status === 'completed');
      
      if (!validFile) {
        return {
          svgContent: null,
          pngContent: null,
          svgSize: undefined,
          pngSize: undefined
        };
      }
      
      const svgSize = SVGConverter.getSVGDimensions(validFile.content);
      
      return {
        svgContent: validFile.content,
        pngContent: validFile.result?.dataUrl || null,
        svgSize,
        pngSize: validFile.result?.outputSize,
        fileSize: validFile.size,
        resultSize: validFile.result?.blob?.size
      };
    }
  };
  
  const { svgContent, pngContent, svgSize, pngSize, fileSize, resultSize } = getPreviewContent();
  
  // 如果没有内容可预览
  if (!svgContent) {
    return (
      <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">{t('preview.title')}</h3>
          <p className="text-sm">
            {mode === 'code' 
              ? 'Enter valid SVG code to see preview' 
              : 'Upload SVG files to see preview'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {/* 预览头部 */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {t('preview.title')}
            </h3>
          </div>
          
          {pngContent && (
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = pngContent;
                link.download = 'converted.png';
                link.click();
              }}
              className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>{t('buttons.download')}</span>
            </button>
          )}
        </div>
      </div>
      
      {/* 预览内容 */}
      <div className="p-6">
        {/* 统一预览区域 */}
        <UnifiedPreview
          svgContent={svgContent}
          pngContent={pngContent}
          svgSize={svgSize}
          pngSize={pngSize}
          fileSize={fileSize}
          resultSize={resultSize}
        />
        
        {/* 转换提示和帮助信息 */}
        {svgContent && !pngContent && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              💡 {t('preview.convertHint', 'Click "Convert to PNG" to see the converted result')}
            </p>
          </div>
        )}
        
        {/* 功能说明 */}
        {svgContent && (
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
            <p>🔍 Use zoom controls to inspect details</p>
            <p>🖼️ Click fullscreen for better viewing</p>
            <p>📏 File dimensions and sizes are shown above</p>
            {pngContent && (
              <p>🔄 Use the toggle button to switch between SVG and PNG views</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;