// 转换设置组件 - 配置输出参数
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface ConversionSettingsProps {
  className?: string;
}

// 预设尺寸选项
const getPresetSizes = (t: any) => [
  { name: t('settings.presets.original'), width: undefined, height: undefined, icon: Settings },
  { name: t('settings.presets.small'), width: 256, height: 256, icon: Smartphone },
  { name: t('settings.presets.medium'), width: 512, height: 512, icon: Tablet },
  { name: t('settings.presets.large'), width: 1024, height: 1024, icon: Monitor },
  { name: t('settings.presets.hd'), width: 1920, height: 1080, icon: Monitor },
  { name: t('settings.presets.fourK'), width: 3840, height: 2160, icon: Monitor },
];

// 质量预设
const getQualityPresets = (t: any) => [
  { name: t('settings.quality.low'), value: 0.6 },
  { name: t('settings.quality.medium'), value: 0.8 },
  { name: t('settings.quality.high'), value: 0.9 },
  { name: t('settings.quality.best'), value: 1.0 },
];

export const ConversionSettings: React.FC<ConversionSettingsProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { conversionOptions, updateConversionOptions } = useAppStore();
  
  // 获取本地化的预设选项
  const PRESET_SIZES = getPresetSizes(t);
  const QUALITY_PRESETS = getQualityPresets(t);
  
  // 更新设置
  const handleOptionChange = useCallback((key: string, value: any) => {
    updateConversionOptions({ [key]: value });
  }, [updateConversionOptions]);
  
  // 应用预设尺寸
  const applyPresetSize = useCallback((preset: typeof PRESET_SIZES[0]) => {
    updateConversionOptions({
      width: preset.width,
      height: preset.height,
    });
  }, [updateConversionOptions]);
  
  // 应用质量预设
  const applyQualityPreset = useCallback((quality: number) => {
    updateConversionOptions({ quality });
  }, [updateConversionOptions]);
  
  // 切换纵横比锁定
  const toggleAspectRatio = useCallback(() => {
    handleOptionChange('maintainAspectRatio', !conversionOptions.maintainAspectRatio);
  }, [conversionOptions.maintainAspectRatio, handleOptionChange]);

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center space-x-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          {t('settings.title')}
        </h3>
      </div>
      
      <div className="space-y-6">
        {/* 尺寸预设 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('settings.sizePresets')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_SIZES.map((preset) => {
              const Icon = preset.icon;
              const isActive = conversionOptions.width === preset.width && 
                             conversionOptions.height === preset.height;
              
              return (
                <button
                  key={preset.name}
                  onClick={() => applyPresetSize(preset)}
                  className={`
                    p-3 rounded-lg border text-sm font-medium transition-all
                    ${isActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <Icon className="w-4 h-4" />
                    <span>{preset.name}</span>
                    {preset.width && (
                      <span className="text-xs opacity-75">
                        {preset.width}×{preset.height}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* 自定义尺寸 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.width')} (px)
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={conversionOptions.width || ''}
              onChange={(e) => handleOptionChange('width', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('settings.auto')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('settings.height')} (px)
            </label>
            <input
              type="number"
              min="1"
              max="10000"
              value={conversionOptions.height || ''}
              onChange={(e) => handleOptionChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('settings.auto')}
            />
          </div>
        </div>
        
        {/* 纵横比锁定 */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="maintainRatio"
            checked={conversionOptions.maintainAspectRatio}
            onChange={toggleAspectRatio}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="maintainRatio" className="text-sm text-gray-700 dark:text-gray-300">
            {t('settings.maintainRatio')}
          </label>
        </div>
        
        {/* 质量设置 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            {t('settings.qualityLabel')}
          </label>
          
          {/* 质量预设按钮 */}
          <div className="flex space-x-2 mb-3">
            {QUALITY_PRESETS.map((preset) => {
              const isActive = Math.abs((conversionOptions.quality || 1) - preset.value) < 0.01;
              
              return (
                <button
                  key={preset.name}
                  onClick={() => applyQualityPreset(preset.value)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-md transition-all
                    ${isActive 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
          
          {/* 质量滑块 */}
          <div className="space-y-2">
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={conversionOptions.quality || 1}
              onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{t('settings.quality.lowLabel')}</span>
              <span className="font-medium">
                {Math.round((conversionOptions.quality || 1) * 100)}%
              </span>
              <span>{t('settings.quality.bestLabel')}</span>
            </div>
          </div>
        </div>
        
        {/* 缩放设置 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('settings.scaleFactor')}
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0.5"
              max="4"
              step="0.5"
              value={conversionOptions.scale || 1}
              onChange={(e) => handleOptionChange('scale', parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
              {conversionOptions.scale || 1}×
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0.5×</span>
            <span>4×</span>
          </div>
        </div>
        
        {/* 背景设置 */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="transparentBg"
            checked={conversionOptions.transparentBackground}
            onChange={(e) => handleOptionChange('transparentBackground', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="transparentBg" className="text-sm text-gray-700 dark:text-gray-300">
            {t('settings.transparentBg')}
          </label>
        </div>
        
        {/* 设置说明 */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
          <p className="mb-1">💡 <strong>{t('settings.tips.title')}</strong></p>
          <ul className="space-y-1 ml-4">
            <li>• {t('settings.tips.dimensions')}</li>
            <li>• {t('settings.tips.quality')}</li>
            <li>• {t('settings.tips.scale')}</li>
            <li>• {t('settings.tips.transparency')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConversionSettings;