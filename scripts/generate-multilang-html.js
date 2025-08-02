#!/usr/bin/env node

/**
 * 多语言HTML生成脚本
 * 为每种支持的语言生成独立的HTML文件，包含对应的SEO meta标签
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 支持的语言配置
const languages = {
  en: {
    title: 'Convert SVG to PNG Online - Fast & High Quality & No Uploads',
    description: 'Paste SVG code or upload files to convert to PNG instantly. Our tool handles batch processing and creates high-resolution PNGs right in your browser.',
    keywords: 'svg to png, svg converter, svg code to png, online svg converter, batch svg convert, no upload svg converter',
    ogTitle: 'Convert SVG to PNG Online - Fast & High Quality & No Uploads',
    ogDescription: 'Paste SVG code or upload files to convert to PNG instantly. Our tool handles batch processing and creates high-resolution PNGs right in your browser.',
    twitterTitle: 'Convert SVG to PNG Online - Fast & High Quality & No Uploads',
    twitterDescription: 'Paste SVG code or upload files to convert to PNG instantly. Our tool handles batch processing and creates high-resolution PNGs right in your browser.'
  },
  ko: {
    title: 'SVG를 PNG로 온라인 변환 - 빠르고 고품질 & 업로드 없음',
    description: 'SVG 코드를 붙여넣거나 파일을 업로드하여 즉시 PNG로 변환하세요. 우리 도구는 일괄 처리를 지원하며 브라우저에서 바로 고해상도 PNG를 생성합니다.',
    keywords: 'svg png 변환, svg 변환기, svg 코드 png, 온라인 svg 변환, 일괄 svg 변환, 업로드 없는 svg 변환기',
    ogTitle: 'SVG를 PNG로 온라인 변환 - 빠르고 고품질 & 업로드 없음',
    ogDescription: 'SVG 코드를 붙여넣거나 파일을 업로드하여 즉시 PNG로 변환하세요. 우리 도구는 일괄 처리를 지원하며 브라우저에서 바로 고해상도 PNG를 생성합니다.',
    twitterTitle: 'SVG를 PNG로 온라인 변환 - 빠르고 고품질 & 업로드 없음',
    twitterDescription: 'SVG 코드를 붙여넣거나 파일을 업로드하여 즉시 PNG로 변환하세요. 우리 도구는 일괄 처리를 지원하며 브라우저에서 바로 고해상도 PNG를 생성합니다.'
  },
  ja: {
    title: 'SVGをPNGにオンライン変換 - 高速・高品質・アップロード不要',
    description: 'SVGコードを貼り付けるかファイルをアップロードして、即座にPNGに変換できます。当ツールはバッチ処理に対応し、ブラウザで直接高解像度PNGを作成します。',
    keywords: 'svg png 変換, svg コンバーター, svg コード png, オンライン svg 変換, バッチ svg 変換, アップロード不要 svg 変換器',
    ogTitle: 'SVGをPNGにオンライン変換 - 高速・高品質・アップロード不要',
    ogDescription: 'SVGコードを貼り付けるかファイルをアップロードして、即座にPNGに変換できます。当ツールはバッチ処理に対応し、ブラウザで直接高解像度PNGを作成します。',
    twitterTitle: 'SVGをPNGにオンライン変換 - 高速・高品質・アップロード不要',
    twitterDescription: 'SVGコードを貼り付けるかファイルをアップロードして、即座にPNGに変換できます。当ツールはバッチ処理に対応し、ブラウザで直接高解像度PNGを作成します。'
  },
  ru: {
    title: 'Конвертация SVG в PNG онлайн - Быстро, качественно и без загрузок',
    description: 'Вставьте SVG код или загрузите файлы для мгновенной конвертации в PNG. Наш инструмент поддерживает пакетную обработку и создает PNG высокого разрешения прямо в вашем браузере.',
    keywords: 'svg в png, svg конвертер, svg код в png, онлайн svg конвертер, пакетная svg конвертация, конвертер svg без загрузки',
    ogTitle: 'Конвертация SVG в PNG онлайн - Быстро, качественно и без загрузок',
    ogDescription: 'Вставьте SVG код или загрузите файлы для мгновенной конвертации в PNG. Наш инструмент поддерживает пакетную обработку и создает PNG высокого разрешения прямо в вашем браузере.',
    twitterTitle: 'Конвертация SVG в PNG онлайн - Быстро, качественно и без загрузок',
    twitterDescription: 'Вставьте SVG код или загрузите файлы для мгновенной конвертации в PNG. Наш инструмент поддерживает пакетную обработку и создает PNG высокого разрешения прямо в вашем браузере.'
  }
};

// 网站基础URL（部署时需要修改）
const baseUrl = 'https://svgtopng.vercel.app';

// 读取原始HTML模板
function readTemplate() {
  const templatePath = path.join(__dirname, '../index.html');
  return fs.readFileSync(templatePath, 'utf8');
}

// 生成hreflang标签
function generateHreflangTags() {
  const hreflangTags = [];
  
  // 为每种语言添加hreflang标签
  Object.keys(languages).forEach(lang => {
    const url = lang === 'en' ? baseUrl : `${baseUrl}/${lang}`;
    hreflangTags.push(`    <link rel="alternate" hreflang="${lang}" href="${url}/" />`);
  });
  
  // 添加默认语言标签
  hreflangTags.push(`    <link rel="alternate" hreflang="x-default" href="${baseUrl}/" />`);
  
  return hreflangTags.join('\n');
}

// 为指定语言生成HTML内容
function generateHtmlForLanguage(template, lang) {
  const langData = languages[lang];
  const hreflangTags = generateHreflangTags();
  
  // 替换HTML中的meta标签
  let html = template
    // 更新lang属性
    .replace('<html lang="en">', `<html lang="${lang}">`)
    // 更新title
    .replace(/<title>.*?<\/title>/, `<title>${langData.title}</title>`)
    // 更新description
    .replace(/(<meta name="description" content=").*?(" \/>)/, `$1${langData.description}$2`)
    // 更新keywords
    .replace(/(<meta name="keywords" content=").*?(" \/>)/, `$1${langData.keywords}$2`)
    // 更新og:title
    .replace(/(<meta property="og:title" content=").*?(" \/>)/, `$1${langData.ogTitle}$2`)
    // 更新og:description
    .replace(/(<meta property="og:description" content=").*?(" \/>)/, `$1${langData.ogDescription}$2`)
    // 更新twitter:title
    .replace(/(<meta name="twitter:title" content=").*?(" \/>)/, `$1${langData.twitterTitle}$2`)
    // 更新twitter:description
    .replace(/(<meta name="twitter:description" content=").*?(" \/>)/, `$1${langData.twitterDescription}$2`);
  
  // 在</head>前插入hreflang标签
  html = html.replace('</head>', `${hreflangTags}\n  </head>`);
  
  // 添加语言检测脚本
  const languageScript = `
    <script>
      // 设置当前页面语言
      window.__INITIAL_LANGUAGE__ = '${lang}';
      
      // 语言检测和重定向逻辑
      (function() {
        const currentPath = window.location.pathname;
        const expectedPath = '${lang === 'en' ? '' : '/' + lang}';
        
        // 如果URL路径与当前语言不匹配，进行重定向
        if (currentPath !== expectedPath && currentPath !== expectedPath + '/') {
          const newUrl = '${lang === 'en' ? baseUrl : baseUrl + '/' + lang}';
          if (window.location.href !== newUrl && window.location.href !== newUrl + '/') {
            // 只在必要时重定向，避免无限循环
            console.log('Language mismatch detected, redirecting to:', newUrl);
          }
        }
      })();
    </script>`;
  
  html = html.replace('</head>', `${languageScript}\n  </head>`);
  
  return html;
}

// 创建目录（如果不存在）
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 主函数：生成所有语言的HTML文件
function generateMultiLanguageHtml() {
  console.log('🌍 开始生成多语言HTML文件...');
  
  const template = readTemplate();
  const distDir = path.join(__dirname, '../dist');
  
  // 确保dist目录存在
  ensureDirectoryExists(distDir);
  
  // 为每种语言生成HTML文件
  Object.keys(languages).forEach(lang => {
    console.log(`📝 生成 ${lang} 语言版本...`);
    
    const html = generateHtmlForLanguage(template, lang);
    
    if (lang === 'en') {
      // 英文版本作为默认首页
      fs.writeFileSync(path.join(distDir, 'index.html'), html);
      console.log(`✅ 已生成: /index.html (${lang})`);
    } else {
      // 其他语言创建子目录
      const langDir = path.join(distDir, lang);
      ensureDirectoryExists(langDir);
      fs.writeFileSync(path.join(langDir, 'index.html'), html);
      console.log(`✅ 已生成: /${lang}/index.html`);
    }
  });
  
  console.log('🎉 多语言HTML文件生成完成！');
  console.log('\n📋 生成的文件列表:');
  console.log('  - /index.html (英文默认)');
  Object.keys(languages).filter(lang => lang !== 'en').forEach(lang => {
    console.log(`  - /${lang}/index.html`);
  });
  
  console.log('\n🔗 访问URL:');
  console.log(`  - ${baseUrl}/ (英文)`);
  Object.keys(languages).filter(lang => lang !== 'en').forEach(lang => {
    console.log(`  - ${baseUrl}/${lang}/ (${lang})`);
  });
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  generateMultiLanguageHtml();
}

export {
  generateMultiLanguageHtml,
  languages
};