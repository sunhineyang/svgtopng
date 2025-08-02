/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // 品牌主色系 - 基于Logo分析
        primary: {
          50: '#f0f6ff',   // 极浅蓝
          100: '#e0edff',  // 浅蓝
          200: '#c7ddff',  // 淡蓝
          300: '#a5c8ff',  // 中浅蓝
          400: '#7fb0ff',  // 中蓝
          500: '#4b9ee4',  // 主品牌色 - 明亮蓝
          600: '#2563eb',  // 深蓝
          700: '#1d4ed8',  // 更深蓝
          800: '#1e40af',  // 深蓝色
          900: '#1e3a8a',  // 最深蓝
        },
        // 辅助色系 - 青绿色
        secondary: {
          50: '#f0fdfa',   // 极浅青
          100: '#ccfbf1',  // 浅青
          200: '#99f6e4',  // 淡青
          300: '#5eead4',  // 中浅青
          400: '#2dd4bf',  // 中青
          500: '#328976',  // 主辅助色 - 深青绿
          600: '#0d9488',  // 深青
          700: '#0f766e',  // 更深青
          800: '#115e59',  // 深青绿
          900: '#134e4a',  // 最深青
        },
        // 中性色系 - 灰色调
        neutral: {
          50: '#f8fafc',   // 极浅灰
          100: '#f1f5f9',  // 浅灰
          200: '#e2e8f0',  // 淡灰
          300: '#cbd5e1',  // 中浅灰
          400: '#94a3b8',  // 中灰
          500: '#64748b',  // 主中性色
          600: '#475569',  // 深灰
          700: '#334155',  // 更深灰
          800: '#1e293b',  // 深色文字
          900: '#0f172a',  // 最深灰
        },
        // 状态色系
        success: '#10b981',  // 成功绿
        warning: '#f59e0b',  // 警告橙
        error: '#ef4444',    // 错误红
        info: '#3b82f6',     // 信息蓝
      },
      // 自定义字体
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Noto Sans"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      // 自定义间距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      // 自定义圆角
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      // 自定义阴影
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(75, 158, 228, 0.15)',
        'brand-lg': '0 10px 25px -3px rgba(75, 158, 228, 0.1), 0 4px 6px -2px rgba(75, 158, 228, 0.05)',
      },
    },
  },
  plugins: [],
};
