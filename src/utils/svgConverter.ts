// SVG转PNG核心转换工具
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export interface ConversionOptions {
  width?: number;
  height?: number;
  quality?: number;
  transparentBackground?: boolean;
  scale?: number;
  maintainAspectRatio?: boolean;
}

export interface ConversionResult {
  success: boolean;
  dataUrl?: string;
  blob?: Blob;
  error?: string;
  originalSize?: { width: number; height: number };
  outputSize?: { width: number; height: number };
}

export class SVGConverter {
  /**
   * 验证SVG内容是否有效
   */
  static validateSVG(svgContent: string): boolean {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      
      if (parserError) {
        return false;
      }
      
      const svgElement = doc.querySelector('svg');
      return svgElement !== null;
    } catch {
      return false;
    }
  }

  /**
   * 获取SVG的原始尺寸
   */
  static getSVGDimensions(svgContent: string): { width: number; height: number } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');
    
    if (!svgElement) {
      return { width: 300, height: 300 }; // 默认尺寸
    }

    // 尝试从width/height属性获取
    const widthAttr = svgElement.getAttribute('width');
    const heightAttr = svgElement.getAttribute('height');
    
    if (widthAttr && heightAttr) {
      const width = parseFloat(widthAttr.replace(/[^0-9.]/g, ''));
      const height = parseFloat(heightAttr.replace(/[^0-9.]/g, ''));
      if (!isNaN(width) && !isNaN(height)) {
        return { width, height };
      }
    }

    // 尝试从viewBox获取
    const viewBox = svgElement.getAttribute('viewBox');
    if (viewBox) {
      const values = viewBox.split(/\s+|,/).map(v => parseFloat(v));
      if (values.length >= 4 && !isNaN(values[2]) && !isNaN(values[3])) {
        return { width: values[2], height: values[3] };
      }
    }

    return { width: 300, height: 300 }; // 默认尺寸
  }

  /**
   * 将SVG转换为PNG
   */
  static async convertSVGToPNG(
    svgContent: string,
    options: ConversionOptions = {}
  ): Promise<ConversionResult> {
    try {
      // 验证SVG
      if (!this.validateSVG(svgContent)) {
        return {
          success: false,
          error: 'Invalid SVG format'
        };
      }

      // 获取原始尺寸
      const originalSize = this.getSVGDimensions(svgContent);
      
      // 计算输出尺寸
      let outputWidth = options.width || originalSize.width;
      let outputHeight = options.height || originalSize.height;
      
      if (options.maintainAspectRatio && (options.width || options.height)) {
        const aspectRatio = originalSize.width / originalSize.height;
        if (options.width && !options.height) {
          outputHeight = options.width / aspectRatio;
        } else if (options.height && !options.width) {
          outputWidth = options.height * aspectRatio;
        }
      }

      // 应用缩放
      if (options.scale && options.scale !== 1) {
        outputWidth *= options.scale;
        outputHeight *= options.scale;
      }

      // 创建canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return {
          success: false,
          error: 'Canvas context not available'
        };
      }

      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // 设置背景
      if (!options.transparentBackground) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outputWidth, outputHeight);
      }

      // 创建SVG图像
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = () => {
          try {
            // 绘制到canvas
            ctx.drawImage(img, 0, 0, outputWidth, outputHeight);
            
            // 转换为blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const dataUrl = canvas.toDataURL('image/png', options.quality || 1);
                  resolve({
                    success: true,
                    dataUrl,
                    blob,
                    originalSize,
                    outputSize: { width: outputWidth, height: outputHeight }
                  });
                } else {
                  resolve({
                    success: false,
                    error: 'Failed to create blob'
                  });
                }
              },
              'image/png',
              options.quality || 1
            );
          } catch (error) {
            resolve({
              success: false,
              error: `Canvas drawing failed: ${error}`
            });
          }
        };

        img.onerror = () => {
          resolve({
            success: false,
            error: 'Failed to load SVG image'
          });
        };

        // 创建SVG数据URL
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        // 保存原始onload处理器
        const originalOnload = img.onload;
        
        img.onload = () => {
          URL.revokeObjectURL(svgUrl);
          if (originalOnload) {
            originalOnload.call(img, new Event('load'));
          }
        };
        
        img.src = svgUrl;
      });
    } catch (error) {
      return {
        success: false,
        error: `Conversion failed: ${error}`
      };
    }
  }

  /**
   * 下载单个PNG文件
   */
  static downloadPNG(blob: Blob, filename: string = 'converted.png'): void {
    saveAs(blob, filename);
  }

  /**
   * 批量下载PNG文件（打包为ZIP）
   */
  static async downloadMultiplePNG(
    files: Array<{ blob: Blob; filename: string }>
  ): Promise<void> {
    if (files.length === 0) return;
    
    if (files.length === 1) {
      this.downloadPNG(files[0].blob, files[0].filename);
      return;
    }

    const zip = new JSZip();
    
    files.forEach(({ blob, filename }) => {
      zip.file(filename, blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'converted-images.zip');
  }

  /**
   * 格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 生成示例SVG代码
   */
  static getExampleSVG(): string {
    return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4ecdc4;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="100" cy="100" r="80" fill="url(#grad1)" />
  
  <text x="100" y="110" font-family="Arial, sans-serif" font-size="24" 
        text-anchor="middle" fill="white" font-weight="bold">
    SVG
  </text>
  
  <path d="M60 60 L140 60 L140 140 L60 140 Z" 
        fill="none" stroke="white" stroke-width="2" 
        stroke-dasharray="5,5" opacity="0.7" />
</svg>`;
  }
}