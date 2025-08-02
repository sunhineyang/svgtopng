// 页脚组件 - 显示隐私信息和链接
import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, 
  Github, 
  Heart, 
  Lock,
  Zap,
  Globe
} from 'lucide-react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 主要内容 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 隐私保护 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
              <h2 className="text-base font-semibold text-neutral-800 dark:text-white">
                Privacy First SVG to PNG Converter
              </h2>
            </div>
            
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start space-x-2">
                <Lock className="w-4 h-4 mt-0.5 text-secondary-500 flex-shrink-0" />
                <p>Secure svg to png conversion with complete privacy</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <Zap className="w-4 h-4 mt-0.5 text-primary-500 flex-shrink-0" />
                <p>No file uploads - svg to png online processing locally</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <Globe className="w-4 h-4 mt-0.5 text-primary-600 flex-shrink-0" />
                <p>Offline svg converter works without internet</p>
              </div>
            </div>
          </div>
          
          {/* 用户反馈和信息 */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-neutral-800 dark:text-white">
              Contact & Support
            </h2>
            
            <div className="space-y-2">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p className="font-medium mb-2">Have questions or suggestions?</p>
                <a
                   href="mailto:0992sunshine@gmail.com?subject=SVG to PNG Converter - User Feedback"
                   className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200 shadow-brand"
                 >
                   <span>📧</span>
                   <span>Contact Us</span>
                 </a>
              </div>
              
              <div className="text-xs text-neutral-500 dark:text-neutral-500">
                <p>Built with React for fast svg to png conversion</p>
                <p>Powered by HTML5 Canvas API for svg to image processing</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* 分隔线 */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* 版权信息 */}
            <div className="flex items-center space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
              <p>© {currentYear} SVG to PNG Converter - Free Online Tool</p>
              <span className="hidden sm:inline">•</span>
              <p className="hidden sm:inline">Made with ❤️ for svg to image conversion</p>
            </div>
            
            {/* 技术栈标签 */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs">
                <Zap className="w-3 h-3" />
                <span>Client-side</span>
              </div>
              
              <div className="flex items-center space-x-1 px-2 py-1 bg-secondary-100 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300 rounded-full text-xs">
                <Shield className="w-3 h-3" />
                <span>Privacy-first</span>
              </div>
              
              <div className="flex items-center space-x-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-xs">
                <Globe className="w-3 h-3" />
                <span>No servers</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 额外说明 */}
        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-primary-900 dark:text-primary-100 mb-1">
                🔒 Your Privacy is Protected During SVG to PNG Conversion
              </p>
              <p className="text-primary-700 dark:text-primary-300">
                This svg to png online tool runs entirely in your browser using modern web technologies. 
                No SVG files or converted PNG images are ever sent to any server. 
                All svg to image processing happens locally on your device, ensuring complete privacy and security for your svg converter needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;