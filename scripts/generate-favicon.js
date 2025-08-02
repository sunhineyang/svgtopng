// 生成favicon脚本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// favicon尺寸配置
const faviconSizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 64, name: 'favicon-64x64.png' },
  { size: 96, name: 'favicon-96x96.png' },
  { size: 128, name: 'favicon-128x128.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
];

// 立即执行的async函数
(async () => {
  const inputPath = path.join(__dirname, '../public/SVGTOPNG .svg');
  const outputDir = path.join(__dirname, '../public');
  
  console.log('🚀 Starting favicon generation...');
  console.log('Input:', inputPath);
  console.log('Output directory:', outputDir);
  console.log('');
  
  // 检查canvas依赖并运行
  try {
    // 尝试动态导入canvas
    const canvas = await import('canvas');
    const { createCanvas, loadImage } = canvas;
    
    console.log('Loading source SVG:', inputPath);
    const sourceImage = await loadImage(inputPath);
    
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 为每个尺寸生成favicon
    for (const config of faviconSizes) {
      const canvas = createCanvas(config.size, config.size);
      const ctx = canvas.getContext('2d');
      
      // 设置高质量渲染
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // 绘制图像
      ctx.drawImage(sourceImage, 0, 0, config.size, config.size);
      
      // 保存文件
      const outputPath = path.join(outputDir, config.name);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`Generated: ${config.name} (${config.size}x${config.size})`);
    }
    
    // 生成ICO格式的favicon（简化版，使用32x32的PNG）
    const canvas32 = createCanvas(32, 32);
    const ctx32 = canvas32.getContext('2d');
    ctx32.imageSmoothingEnabled = true;
    ctx32.imageSmoothingQuality = 'high';
    ctx32.drawImage(sourceImage, 0, 0, 32, 32);
    
    const icoBuffer = canvas32.toBuffer('image/png');
    fs.writeFileSync(path.join(outputDir, 'favicon.ico'), icoBuffer);
    console.log('Generated: favicon.ico (32x32)');
    
    console.log('\n✅ All favicon files generated successfully!');
    console.log('\nGenerated files:');
    faviconSizes.forEach(config => {
      console.log(`  - ${config.name}`);
    });
    console.log('  - favicon.ico');
    
  } catch (error) {
    console.log('⚠️  Canvas dependency not found. Using simple copy method...');
    console.log('');
    
    // 简单的备用方案：复制现有的logo.png作为favicon
    const faviconPath = path.join(__dirname, '../public/favicon.ico');
    
    try {
      fs.copyFileSync(inputPath, faviconPath);
      console.log('✅ Basic favicon.ico created from logo.png');
    } catch (copyError) {
      console.error('❌ Failed to create basic favicon:', copyError);
    }
  }
  
  // 生成webmanifest文件
  const manifest = {
    "name": "Free SVG to PNG Converter - Batch Convert with High Quality",
    "short_name": "SVG2PNG",
    "description": "Convert SVG files or paste SVG code directly to PNG. Our tool supports batch conversion, high-resolution output, and processes everything in your browser for maximum speed and privacy—no uploads needed.",
    "icons": [
      {
        "src": "/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "theme_color": "#4b9ee4",
    "background_color": "#ffffff",
    "display": "standalone",
    "start_url": "/"
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../public/site.webmanifest'), 
    JSON.stringify(manifest, null, 2)
  );
  console.log('Generated: site.webmanifest');
})();