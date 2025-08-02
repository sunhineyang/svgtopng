// 文件上传组件 - 支持拖拽和点击上传
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface FileUploadProps {
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { addFiles } = useAppStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // 处理文件选择
  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      await addFiles(fileArray);
    } catch (error) {
      console.error('Error adding files:', error);
    } finally {
      setIsUploading(false);
    }
  }, [addFiles]);

  // 拖拽事件处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  // 点击上传
  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg,image/svg+xml';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFiles(target.files);
    };
    input.click();
  }, [handleFiles]);

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
        ${isDragOver 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }
        ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {/* 上传图标 */}
      <div className="flex flex-col items-center space-y-4">
        <div className={`
          p-4 rounded-full transition-colors
          ${isDragOver 
            ? 'bg-blue-100 dark:bg-blue-800' 
            : 'bg-gray-100 dark:bg-gray-700'
          }
        `}>
          {isUploading ? (
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
          ) : (
            <Upload className={`w-8 h-8 ${
              isDragOver ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
            }`} />
          )}
        </div>
        
        {/* 上传文本 */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isUploading ? t('status.validating') : t('upload.dragDrop')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('upload.clickSelect')}
          </p>
        </div>
        
        {/* 支持格式说明 */}
        <div className="space-y-1 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center justify-center space-x-1">
            <FileText className="w-3 h-3" />
            <span>{t('upload.supportedFormats')}</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <AlertCircle className="w-3 h-3" />
            <span>{t('upload.maxFiles')}</span>
          </div>
        </div>
      </div>
      
      {/* 拖拽覆盖层 */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg flex items-center justify-center">
          <div className="text-blue-600 dark:text-blue-400 font-medium">
            {t('upload.dragDrop')}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;