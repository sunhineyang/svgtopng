// 代码编辑器组件 - 使用Monaco Editor
import React, { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import { Code, Check, X, RotateCcw, FileText } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { SVGConverter } from '../utils/svgConverter';

interface CodeEditorProps {
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { 
    codeContent, 
    codeValidation, 
    theme,
    setCodeContent, 
    validateCode, 
    clearCode 
  } = useAppStore();
  
  const editorRef = useRef<any>(null);

  // 编辑器挂载时的回调
  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor;
    
    // 设置编辑器选项
    editor.updateOptions({
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
    });
  }, []);

  // 内容变化处理
  const handleEditorChange = useCallback((value: string | undefined) => {
    setCodeContent(value || '');
  }, [setCodeContent]);

  // 插入示例代码
  const insertExample = useCallback(() => {
    const exampleCode = SVGConverter.getExampleSVG();
    setCodeContent(exampleCode);
    
    // 聚焦编辑器
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [setCodeContent]);

  // 格式化代码
  const formatCode = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  }, []);

  // 获取编辑器主题
  const getEditorTheme = () => {
    if (theme === 'dark') return 'vs-dark';
    if (theme === 'light') return 'light';
    
    // 系统主题检测
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'light';
    }
    
    return 'light';
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
            {t('codeEditor.title')}
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* 验证状态 */}
          <div className="flex items-center space-x-1">
            {codeContent && (
              codeValidation.isValid ? (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">{t('status.ready')}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                  <X className="w-4 h-4" />
                  <span className="text-sm">{t('status.error')}</span>
                </div>
              )
            )}
          </div>
          
          {/* 操作按钮 */}
          <button
            onClick={insertExample}
            className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors flex items-center space-x-1"
          >
            <FileText className="w-4 h-4" />
            <span>{t('codeEditor.example')}</span>
          </button>
          
          <button
            onClick={formatCode}
            disabled={!codeContent}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={t('codeEditor.formatTitle', 'Format Code (Shift+Alt+F)')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={clearCode}
            disabled={!codeContent}
            className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('codeEditor.clear')}
          </button>
        </div>
      </div>
      
      {/* 编辑器容器 */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <Editor
          height="400px"
          language="xml"
          theme={getEditorTheme()}
          value={codeContent}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
      
      {/* 错误信息 */}
      {!codeValidation.isValid && codeValidation.error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex items-start space-x-2">
            <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {t('errors.invalidSvg')}
              </p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                {codeValidation.error}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 帮助信息 */}
      {!codeContent && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {t('codeEditor.placeholder')}
          </p>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 text-center">
            {t('codeEditor.helpText', '💡 Click "{{exampleText}}" to see a sample SVG code', { exampleText: t('codeEditor.example') })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;