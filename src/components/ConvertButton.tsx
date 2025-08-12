// 转换按钮组件 - 处理实际的转换逻辑
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Zap, 
  Download, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  FileImage
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SVGConverter } from '../utils/svgConverter';

interface ConvertButtonProps {
  className?: string;
}

export const ConvertButton: React.FC<ConvertButtonProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { 
    mode, 
    files, 
    codeContent, 
    codeValidation,
    conversionOptions,
    isConverting,
    setConverting,
    updateFileStatus,
    addFiles
  } = useAppStore();
  
  const [conversionStats, setConversionStats] = useState({
    total: 0,
    completed: 0,
    failed: 0
  });
  
  // 检查是否可以转换
  const canConvert = () => {
    if (mode === 'code') {
      return codeContent && codeValidation.isValid;
    } else {
      return files.some(file => file.status === 'ready');
    }
  };
  
  // 转换单个SVG内容
  const convertSingleSVG = useCallback(async (
    svgContent: string, 
    filename: string = 'converted.svg'
  ) => {
    try {
      const result = await SVGConverter.convertSVGToPNG(svgContent, conversionOptions);
      
      if (result.success && result.blob) {
        // 自动下载
        const pngFilename = filename.replace(/\.svg$/i, '.png');
        SVGConverter.downloadPNG(result.blob, pngFilename);
        
        return { success: true, result };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: `Conversion failed: ${error}` };
    }
  }, [conversionOptions]);
  
  // 转换代码模式的SVG
  const convertCodeMode = useCallback(async () => {
    if (!codeContent || !codeValidation.isValid) return;
    
    setConverting(true);
    setConversionStats({ total: 1, completed: 0, failed: 0 });
    
    try {
      const result = await convertSingleSVG(codeContent, 'code-generated.svg');
      
      if (result.success) {
        setConversionStats({ total: 1, completed: 1, failed: 0 });
      } else {
        setConversionStats({ total: 1, completed: 0, failed: 1 });
        console.error('Conversion failed:', result.error);
      }
    } catch (error) {
      setConversionStats({ total: 1, completed: 0, failed: 1 });
      console.error('Conversion error:', error);
    } finally {
      setConverting(false);
    }
  }, [codeContent, codeValidation.isValid, convertSingleSVG, setConverting]);
  
  // 转换文件上传模式的SVG
  const convertFileMode = useCallback(async () => {
    const readyFiles = files.filter(file => file.status === 'ready');
    if (readyFiles.length === 0) return;
    
    setConverting(true);
    setConversionStats({ total: readyFiles.length, completed: 0, failed: 0 });
    
    const downloadFiles: Array<{ blob: Blob; filename: string }> = [];
    let completed = 0;
    let failed = 0;
    
    // 并发转换（限制并发数量以避免浏览器卡顿）
    const concurrency = 3;
    const chunks = [];
    
    for (let i = 0; i < readyFiles.length; i += concurrency) {
      chunks.push(readyFiles.slice(i, i + concurrency));
    }
    
    for (const chunk of chunks) {
      const promises = chunk.map(async (file) => {
        updateFileStatus(file.id, 'converting');
        
        try {
          const result = await SVGConverter.convertSVGToPNG(file.content, conversionOptions);
          
          if (result.success && result.blob) {
            updateFileStatus(file.id, 'completed', result);
            
            const filename = file.name.replace(/\.svg$/i, '.png');
            downloadFiles.push({ blob: result.blob, filename });
            
            completed++;
          } else {
            updateFileStatus(file.id, 'error', undefined, result.error);
            failed++;
          }
        } catch (error) {
          updateFileStatus(file.id, 'error', undefined, `Conversion failed: ${error}`);
          failed++;
        }
        
        setConversionStats({ total: readyFiles.length, completed, failed });
      });
      
      await Promise.all(promises);
    }
    
    // 批量下载转换成功的文件
    if (downloadFiles.length > 0) {
      try {
        await SVGConverter.downloadMultiplePNG(downloadFiles);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
    
    setConverting(false);
  }, [files, conversionOptions, setConverting, updateFileStatus]);
  
  // 主转换函数
  const handleConvert = useCallback(async () => {
    if (!canConvert() || isConverting) return;
    
    if (mode === 'code') {
      await convertCodeMode();
    } else {
      await convertFileMode();
    }
  }, [mode, canConvert, isConverting, convertCodeMode, convertFileMode]);
  
  // 获取按钮状态
  const getButtonState = () => {
    if (!canConvert()) {
      return {
        disabled: true,
        text: mode === 'code' ? t('buttons.enterValidSvg') : t('buttons.uploadSvgFiles'),
        icon: <FileImage className="w-5 h-5" />,
        className: 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
      };
    }
    
    if (isConverting) {
      return {
        disabled: true,
        text: `${t('status.converting')} (${conversionStats.completed}/${conversionStats.total})`,
        icon: <Loader2 className="w-5 h-5 animate-spin" />,
        className: 'bg-yellow-500 hover:bg-yellow-600 text-white cursor-wait'
      };
    }
    
    return {
      disabled: false,
      text: t('buttons.convert'),
      icon: <Zap className="w-5 h-5" />,
      className: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
    };
  };
  
  const buttonState = getButtonState();
  
  // 获取转换统计信息
  const getConversionInfo = () => {
    if (mode === 'code') {
      return codeContent ? t('status.oneSvgReady') : t('status.noSvgCode');
    } else {
      const readyCount = files.filter(f => f.status === 'ready').length;
      const completedCount = files.filter(f => f.status === 'completed').length;
      
      if (readyCount === 0 && completedCount === 0) {
        return t('status.noFilesUploaded');
      }
      
      return t('status.filesStatus', { ready: readyCount, completed: completedCount });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 主转换按钮 */}
      <button
        onClick={handleConvert}
        disabled={buttonState.disabled}
        className={`
          w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-lg font-medium text-lg transition-all duration-200
          ${buttonState.className}
        `}
      >
        {buttonState.icon}
        <span>{buttonState.text}</span>
      </button>
      
      {/* 转换信息 */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{getConversionInfo()}</span>
        
        {isConverting && (
          <div className="flex items-center space-x-4">
            {conversionStats.completed > 0 && (
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>{conversionStats.completed}</span>
              </div>
            )}
            
            {conversionStats.failed > 0 && (
              <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-4 h-4" />
                <span>{conversionStats.failed}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 转换完成后的统计 */}
      {!isConverting && conversionStats.total > 0 && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {t('status.conversionCompleted')}
            </span>
            
            <div className="flex items-center space-x-4">
              {conversionStats.completed > 0 && (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('status.successfulCount', { count: conversionStats.completed })}</span>
                </div>
              )}
              
              {conversionStats.failed > 0 && (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{t('status.failedCount', { count: conversionStats.failed })}</span>
                </div>
              )}
            </div>
          </div>
          
          {conversionStats.completed > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              💾 {t('status.filesDownloaded')}
            </p>
          )}
        </div>
      )}
      
      {/* 帮助提示 */}
      {!isConverting && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
          <p>💡 <strong>{t('buttons.tips.title')}</strong></p>
          <p>• {t('buttons.tips.browserProcessing')}</p>
          <p>• {t('buttons.tips.zipDownload')}</p>
          <p>• {t('buttons.tips.adjustSettings')}</p>
        </div>
      )}
    </div>
  );
};

export default ConvertButton;