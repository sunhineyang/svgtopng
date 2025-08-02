// 应用状态管理 - 使用Zustand
import { create } from 'zustand';
import { ConversionOptions, ConversionResult } from '../utils/svgConverter';

export type Mode = 'upload' | 'code';
export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'ko' | 'ja' | 'ru';

export interface FileItem {
  id: string;
  name: string;
  content: string;
  size: number;
  status: 'ready' | 'converting' | 'completed' | 'error';
  result?: ConversionResult;
  error?: string;
}

interface AppState {
  // UI状态
  mode: Mode;
  theme: Theme;
  language: Language;
  
  // 文件管理
  files: FileItem[];
  
  // 代码编辑器
  codeContent: string;
  codeValidation: {
    isValid: boolean;
    error?: string;
  };
  
  // 转换设置
  conversionOptions: ConversionOptions;
  
  // 全局状态
  isConverting: boolean;
  
  // Actions
  setMode: (mode: Mode) => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  
  // 文件操作
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFileStatus: (id: string, status: FileItem['status'], result?: ConversionResult, error?: string) => void;
  
  // 代码编辑器操作
  setCodeContent: (content: string) => void;
  validateCode: () => void;
  clearCode: () => void;
  
  // 转换设置
  updateConversionOptions: (options: Partial<ConversionOptions>) => void;
  
  // 转换操作
  setConverting: (converting: boolean) => void;
}

// 生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 读取文件内容
const readFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

// 验证SVG内容
const validateSVGContent = (content: string): { isValid: boolean; error?: string } => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'image/svg+xml');
    const parserError = doc.querySelector('parsererror');
    
    if (parserError) {
      return {
        isValid: false,
        error: 'Invalid XML format'
      };
    }
    
    const svgElement = doc.querySelector('svg');
    if (!svgElement) {
      return {
        isValid: false,
        error: 'No SVG element found'
      };
    }
    
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: `Parse error: ${error}`
    };
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  // 初始状态
  mode: 'upload',
  theme: 'system',
  language: 'en',
  files: [],
  codeContent: '',
  codeValidation: { isValid: true },
  conversionOptions: {
    quality: 1,
    transparentBackground: true,
    scale: 1,
    maintainAspectRatio: true
  },
  isConverting: false,
  
  // UI Actions
  setMode: (mode) => set({ mode }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  
  // 文件操作
  addFiles: async (files) => {
    const currentFiles = get().files;
    const newFiles: FileItem[] = [];
    
    for (const file of files) {
      // 检查文件类型
      if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
        continue;
      }
      
      // 检查文件大小 (10MB限制)
      if (file.size > 10 * 1024 * 1024) {
        continue;
      }
      
      try {
        const content = await readFileContent(file);
        const validation = validateSVGContent(content);
        
        newFiles.push({
          id: generateId(),
          name: file.name,
          content,
          size: file.size,
          status: validation.isValid ? 'ready' : 'error',
          error: validation.error
        });
      } catch (error) {
        newFiles.push({
          id: generateId(),
          name: file.name,
          content: '',
          size: file.size,
          status: 'error',
          error: `Failed to read file: ${error}`
        });
      }
    }
    
    // 限制最大文件数量
    const totalFiles = [...currentFiles, ...newFiles];
    const limitedFiles = totalFiles.slice(0, 20);
    
    set({ files: limitedFiles });
  },
  
  removeFile: (id) => {
    const files = get().files.filter(file => file.id !== id);
    set({ files });
  },
  
  clearFiles: () => set({ files: [] }),
  
  updateFileStatus: (id, status, result, error) => {
    const files = get().files.map(file => 
      file.id === id 
        ? { ...file, status, result, error }
        : file
    );
    set({ files });
  },
  
  // 代码编辑器操作
  setCodeContent: (content) => {
    set({ codeContent: content });
    // 自动验证
    const validation = validateSVGContent(content);
    set({ codeValidation: validation });
  },
  
  validateCode: () => {
    const content = get().codeContent;
    const validation = validateSVGContent(content);
    set({ codeValidation: validation });
  },
  
  clearCode: () => {
    set({ 
      codeContent: '',
      codeValidation: { isValid: true }
    });
  },
  
  // 转换设置
  updateConversionOptions: (options) => {
    const currentOptions = get().conversionOptions;
    set({ 
      conversionOptions: { ...currentOptions, ...options }
    });
  },
  
  // 转换操作
  setConverting: (converting) => set({ isConverting: converting })
}));

// 持久化设置到localStorage
if (typeof window !== 'undefined') {
  // 加载保存的设置
  const savedTheme = localStorage.getItem('svg-converter-theme') as Theme;
  const savedLanguage = localStorage.getItem('svg-converter-language') as Language;
  
  if (savedTheme) {
    useAppStore.getState().setTheme(savedTheme);
  }
  
  if (savedLanguage) {
    useAppStore.getState().setLanguage(savedLanguage);
  }
  
  // 监听设置变化并保存
  useAppStore.subscribe((state, prevState) => {
    if (state.theme !== prevState.theme) {
      localStorage.setItem('svg-converter-theme', state.theme);
    }
    
    if (state.language !== prevState.language) {
      localStorage.setItem('svg-converter-language', state.language);
    }
  });
}