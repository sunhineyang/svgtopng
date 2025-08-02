# SVG to PNG Converter

🚀 A modern, privacy-first SVG to PNG conversion tool that runs entirely in your browser.

## ✨ Features

### 🔒 Privacy First
- **100% Client-side Processing** - No files uploaded to servers
- **Complete Privacy** - All conversion happens locally in your browser
- **Offline Capable** - Works without internet connection after initial load

### 🎯 Dual Input Modes
- **File Upload Mode** - Drag & drop or browse SVG files
- **Code Editor Mode** - Paste or write SVG code directly with syntax highlighting

### ⚡ Powerful Features
- **Batch Conversion** - Convert up to 20 files simultaneously
- **Custom Settings** - Adjust size, quality, scale, and background
- **Real-time Preview** - See original and converted images side by side
- **Auto Download** - Single files download directly, multiple files as ZIP
- **High Quality Output** - Configurable quality from 60% to 100%

### 🌍 User Experience
- **Multi-language Support** - English, Korean, Japanese, Russian
- **Dark/Light Theme** - Automatic system theme detection
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: Zustand for lightweight state management
- **Code Editor**: Monaco Editor (VS Code editor)
- **Icons**: Lucide React for beautiful, consistent icons
- **Internationalization**: react-i18next for multi-language support
- **File Processing**: HTML5 Canvas API, File API, Blob API
- **Downloads**: file-saver and JSZip for file downloads

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm (or npm)
- Modern browser with Canvas 2D support

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd svgtopng

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Navigation with theme/language switcher
│   ├── FileUpload.tsx  # Drag & drop file upload
│   ├── CodeEditor.tsx  # Monaco code editor
│   ├── FileList.tsx    # File management and status
│   ├── ConversionSettings.tsx  # Output configuration
│   ├── PreviewPanel.tsx        # Side-by-side preview
│   ├── ConvertButton.tsx       # Conversion logic
│   └── Footer.tsx      # Privacy info and links
├── store/
│   └── useAppStore.ts  # Zustand state management
├── utils/
│   └── svgConverter.ts # Core SVG to PNG conversion
├── i18n/               # Internationalization
│   ├── index.ts        # i18n configuration
│   └── locales/        # Language files
│       ├── en.json     # English
│       ├── ko.json     # Korean
│       ├── ja.json     # Japanese
│       └── ru.json     # Russian
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🎮 Usage

### File Upload Mode
1. Switch to "File Upload" mode in the header
2. Drag & drop SVG files or click to browse
3. Configure conversion settings (size, quality, etc.)
4. Click "Convert to PNG" to process all files
5. Files download automatically (ZIP for multiple files)

### Code Editor Mode
1. Switch to "Code Editor" mode in the header
2. Paste your SVG code or click "Example" for sample code
3. Real-time validation shows any syntax errors
4. Configure output settings as needed
5. Click "Convert to PNG" to download the result

### Conversion Settings
- **Size Presets**: Original, Small (256px), Medium (512px), Large (1024px), HD, 4K
- **Custom Dimensions**: Set specific width/height in pixels
- **Quality**: Adjustable from 60% to 100% (affects file size)
- **Scale Factor**: Multiply output size by 0.5× to 4×
- **Background**: Keep transparent or add white background
- **Aspect Ratio**: Lock proportions when resizing

## 🔧 Core Technology

### SVG to PNG Conversion Process
1. **Validation**: Parse and validate SVG content using DOMParser
2. **Dimension Detection**: Extract size from width/height attributes or viewBox
3. **Canvas Rendering**: Create HTML5 Canvas with specified dimensions
4. **Image Loading**: Convert SVG to Image object via Blob URL
5. **Drawing**: Render image to canvas with quality settings
6. **Export**: Convert canvas to PNG Blob using toBlob() API
7. **Download**: Trigger download using file-saver library

### Browser Compatibility
- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (iOS 12+)
- **Mobile Browsers**: Supported with responsive design

### Required Browser APIs
- Canvas 2D Context
- File API (FileReader, Blob)
- URL.createObjectURL
- DOMParser
- HTML5 Download attribute

## 🌐 Internationalization

Supported languages:
- **English** (en) - Default
- **Korean** (ko) - 한국어
- **Japanese** (ja) - 日本語
- **Russian** (ru) - Русский

Language files are located in `src/i18n/locales/`. To add a new language:
1. Create a new JSON file (e.g., `fr.json`)
2. Copy the structure from `en.json`
3. Translate all values
4. Add the language to the import list in `src/i18n/index.ts`
5. Update the language selector in `Header.tsx`

## 🎨 Theming

The application supports three theme modes:
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes for low-light environments
- **System**: Automatically matches your OS preference

Themes are implemented using Tailwind CSS dark mode classes and persist in localStorage.

## 📱 Responsive Design

The interface adapts to different screen sizes:
- **Desktop** (1024px+): Full two-column layout with sidebar
- **Tablet** (768px-1023px): Stacked layout with collapsible sections
- **Mobile** (< 768px): Single column, touch-optimized interface

## 🔒 Security & Privacy

### Privacy Features
- **No Server Communication**: All processing happens in your browser
- **No Data Collection**: No analytics, tracking, or data storage
- **No File Uploads**: Files never leave your device
- **Local Storage Only**: Only theme and language preferences are saved

### Security Considerations
- **SVG Sanitization**: Input validation prevents malicious SVG content
- **Memory Management**: Automatic cleanup of Blob URLs and canvas contexts
- **Error Handling**: Graceful handling of invalid files and conversion errors

## 🚀 Performance

### Optimization Features
- **Lazy Loading**: Components load only when needed
- **Concurrent Processing**: Multiple files converted in parallel (limited to 3)
- **Memory Efficient**: Automatic cleanup of temporary objects
- **Progressive Enhancement**: Core functionality works without JavaScript

### File Limits
- **Maximum File Size**: 10MB per SVG file
- **Maximum Files**: 20 files per batch
- **Output Quality**: Configurable to balance quality vs. file size

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Conventional commits for clear history
- Component-based architecture

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vite** for lightning-fast development
- **Tailwind CSS** for utility-first styling
- **Monaco Editor** for VS Code-quality editing
- **Lucide** for beautiful icons
- **All Contributors** who help improve this tool

---

**Made with ❤️ for developers who value privacy and performance**

🔗 [Live Demo](https://your-domain.com) | 🐛 [Report Issues](https://github.com/your-repo/issues) | 💡 [Feature Requests](https://github.com/your-repo/discussions)