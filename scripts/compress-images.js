// 图片压缩脚本
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 需要压缩的图片文件
const imagesToCompress = [
  {
    input: 'public/logo.png',
    output: 'public/logo-optimized.png',
    maxWidth: 200,
    quality: 85
  },
  {
    input: 'public/android-chrome-192x192.png',
    output: 'public/android-chrome-192x192-optimized.png',
    maxWidth: 192,
    quality: 85
  },
  {
    input: 'public/android-chrome-512x512.png',
    output: 'public/android-chrome-512x512-optimized.png',
    maxWidth: 512,
    quality: 85
  }
];

async function compressImage(inputPath, outputPath, maxWidth, quality) {
  try {
    const fullInputPath = path.join(__dirname, '..', inputPath);
    const fullOutputPath = path.join(__dirname, '..', outputPath);
    
    // 检查输入文件是否存在
    if (!fs.existsSync(fullInputPath)) {
      console.log(`❌ 文件不存在: ${inputPath}`);
      return;
    }
    
    // 获取原始文件大小
    const originalStats = fs.statSync(fullInputPath);
    const originalSize = originalStats.size;
    
    // 压缩图片
    await sharp(fullInputPath)
      .resize(maxWidth, maxWidth, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .png({
        quality: quality,
        compressionLevel: 9,
        progressive: true
      })
      .toFile(fullOutputPath);
    
    // 获取压缩后文件大小
    const compressedStats = fs.statSync(fullOutputPath);
    const compressedSize = compressedStats.size;
    
    // 计算压缩比例
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${inputPath}:`);
    console.log(`   原始大小: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`   压缩后: ${(compressedSize / 1024).toFixed(1)} KB`);
    console.log(`   压缩比例: ${compressionRatio}%`);
    console.log('');
    
  } catch (error) {
    console.error(`❌ 压缩失败 ${inputPath}:`, error.message);
  }
}

async function compressAllImages() {
  console.log('🚀 开始压缩图片文件...');
  console.log('');
  
  for (const image of imagesToCompress) {
    await compressImage(image.input, image.output, image.maxWidth, image.quality);
  }
  
  console.log('✨ 图片压缩完成！');
  console.log('');
  console.log('📝 建议操作:');
  console.log('1. 检查压缩后的图片质量');
  console.log('2. 如果满意，可以替换原始文件');
  console.log('3. 更新相关引用路径');
}

// 执行压缩
compressAllImages().catch(console.error);