// 文件列表组件 - 显示上传的文件和转换状态
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Eye,
  X
} from 'lucide-react';
import { useAppStore, FileItem } from '../store/useAppStore';
import { SVGConverter } from '../utils/svgConverter';

interface FileListProps {
  className?: string;
}

interface FileItemComponentProps {
  file: FileItem;
  onRemove: (id: string) => void;
  onDownload: (file: FileItem) => void;
  onPreview: (file: FileItem) => void;
}

// 单个文件项组件
const FileItemComponent: React.FC<FileItemComponentProps> = ({ 
  file, 
  onRemove, 
  onDownload, 
  onPreview 
}) => {
  const { t } = useTranslation();
  
  const getStatusIcon = () => {
    switch (file.status) {
      case 'ready':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'converting':
        return <Loader2 className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (file.status) {
      case 'ready':
        return t('status.ready');
      case 'converting':
        return t('status.converting');
      case 'completed':
        return t('status.completed');
      case 'error':
        return t('status.error');
      default:
        return '';
    }
  };
  
  const getStatusColor = () => {
    switch (file.status) {
      case 'ready':
        return 'text-blue-600 dark:text-blue-400';
      case 'converting':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'completed':
        return 'text-green-600 dark:text-green-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* 文件信息 */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {getStatusIcon()}
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {file.name}
          </p>
          
          <div className="flex items-center space-x-4 mt-1">
            <span className={`text-xs ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {SVGConverter.formatFileSize(file.size)}
            </span>
            
            {file.result?.outputSize && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {file.result.outputSize.width} × {file.result.outputSize.height}
              </span>
            )}
          </div>
          
          {/* 错误信息 */}
          {file.status === 'error' && file.error && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {file.error}
            </p>
          )}
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex items-center space-x-2 ml-4">
        {/* 预览按钮 */}
        {(file.status === 'ready' || file.status === 'completed') && (
          <button
            onClick={() => onPreview(file)}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            title={t('preview.title')}
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        
        {/* 下载按钮 */}
        {file.status === 'completed' && file.result?.blob && (
          <button
            onClick={() => onDownload(file)}
            className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
            title={t('buttons.download')}
          >
            <Download className="w-4 h-4" />
          </button>
        )}
        
        {/* 删除按钮 */}
        <button
          onClick={() => onRemove(file.id)}
          className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          title={t('buttons.clear')}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const FileList: React.FC<FileListProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { files, removeFile, clearFiles } = useAppStore();
  
  // 下载单个文件
  const handleDownload = useCallback((file: FileItem) => {
    if (file.result?.blob) {
      const filename = file.name.replace(/\.svg$/i, '.png');
      SVGConverter.downloadPNG(file.result.blob, filename);
    }
  }, []);
  
  // 批量下载
  const handleDownloadAll = useCallback(async () => {
    const completedFiles = files.filter(file => 
      file.status === 'completed' && file.result?.blob
    );
    
    if (completedFiles.length === 0) return;
    
    const downloadFiles = completedFiles.map(file => ({
      blob: file.result!.blob!,
      filename: file.name.replace(/\.svg$/i, '.png')
    }));
    
    await SVGConverter.downloadMultiplePNG(downloadFiles);
  }, [files]);
  
  // 预览文件
  const handlePreview = useCallback((file: FileItem) => {
    // 创建预览窗口
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${t('preview.title')} - ${file.name}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
              background: #f5f5f5;
            }
            .container {
              max-width: 100%;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #eee;
            }
            .preview {
              text-align: center;
              padding: 20px;
              border: 1px dashed #ddd;
              border-radius: 4px;
            }
            svg {
              max-width: 100%;
              max-height: 500px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${file.name}</h2>
              <p>${t('preview.size')}: ${SVGConverter.formatFileSize(file.size)}</p>
            </div>
            <div class="preview">
              ${file.content}
            </div>
          </div>
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  }, [t]);
  
  if (files.length === 0) {
    return null;
  }
  
  const completedCount = files.filter(f => f.status === 'completed').length;
  const errorCount = files.filter(f => f.status === 'error').length;
  const convertingCount = files.filter(f => f.status === 'converting').length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 统计信息和批量操作 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span>{t('preview.title')}: {files.length}</span>
          {completedCount > 0 && (
            <span className="text-green-600 dark:text-green-400">
              {t('status.completed')}: {completedCount}
            </span>
          )}
          {convertingCount > 0 && (
            <span className="text-yellow-600 dark:text-yellow-400">
              {t('status.converting')}: {convertingCount}
            </span>
          )}
          {errorCount > 0 && (
            <span className="text-red-600 dark:text-red-400">
              {t('status.error')}: {errorCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {completedCount > 1 && (
            <button
              onClick={handleDownloadAll}
              className="px-3 py-1.5 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>{t('buttons.downloadAll')}</span>
            </button>
          )}
          
          <button
            onClick={clearFiles}
            className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>{t('buttons.clear')}</span>
          </button>
        </div>
      </div>
      
      {/* 文件列表 */}
      <div className="space-y-2">
        {files.map(file => (
          <FileItemComponent
            key={file.id}
            file={file}
            onRemove={removeFile}
            onDownload={handleDownload}
            onPreview={handlePreview}
          />
        ))}
      </div>
    </div>
  );
};

export default FileList;