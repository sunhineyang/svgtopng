// FAQ组件 - 常见问题解答
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

// FAQ数据
const faqData = [
  {
    id: 1,
    questionKey: 'faq.questions.q1.question',
    question: 'What is SVG to PNG conversion?',
    answerKey: 'faq.questions.q1.answer',
    answer: 'SVG to PNG conversion transforms vector-based SVG (Scalable Vector Graphics) files into raster-based PNG (Portable Network Graphics) images. This process converts mathematical shapes and paths into pixel-based images, making them compatible with more applications and platforms that may not support SVG format.'
  },
  {
    id: 2,
    questionKey: 'faq.questions.q2.question',
    question: 'What is SVG?',
    answerKey: 'faq.questions.q2.answer',
    answer: 'SVG stands for Scalable Vector Graphics. It is an industry-standard format for vector graphics, making it popular for technical drawings, charts, logos, and illustrations. SVG files are composed of mathematical nodes, lines, shapes, and curves rather than pixels. Since vector images are drawn from coordinates rather than millions of individual pixels, file sizes are usually smaller, and they can be scaled to any size without quality loss.'
  },
  {
    id: 3,
    questionKey: 'faq.questions.q3.question',
    question: 'What is PNG?',
    answerKey: 'faq.questions.q3.answer',
    answer: 'PNG stands for Portable Network Graphics. Unlike JPEG, PNG uses lossless compression and supports transparency, making it ideal for images that need crisp edges and transparent backgrounds. However, because of lossless compression, PNG file sizes tend to be larger than JPEG. PNGs are perfect for website imagery, logos, and graphics but not optimal for high-resolution photos due to their larger file sizes.'
  },
  {
    id: 4,
    questionKey: 'faq.questions.q4.question',
    question: 'Why convert SVG to PNG?',
    answerKey: 'faq.questions.q4.answer',
    answer: 'Converting SVG to PNG is useful in many scenarios: 1) Compatibility - PNG is supported by virtually all image viewers and web browsers, while SVG support may be limited in some applications. 2) Email attachments - Many email clients display PNG images directly but may not render SVG files. 3) Social media - Most social platforms prefer PNG/JPEG for image uploads. 4) Print materials - PNG provides consistent output for printing, while SVG rendering may vary between applications.'
  },
  {
    id: 5,
    questionKey: 'faq.questions.q5.question',
    question: 'How does SVG to PNG conversion work?',
    answerKey: 'faq.questions.q5.answer',
    answer: 'Our SVG to PNG converter works entirely in your browser using HTML5 Canvas technology. The process involves: 1) Loading your SVG file or code, 2) Rendering the SVG graphics onto a canvas element, 3) Converting the canvas content to PNG format, 4) Providing the PNG file for download. This method ensures high-quality output while keeping your files secure since no data is uploaded to external servers.'
  },
  {
    id: 6,
    questionKey: 'faq.questions.q6.question',
    question: 'Is the conversion quality good?',
    answerKey: 'faq.questions.q6.answer',
    answer: 'Yes! Our converter produces high-quality PNG images from SVG files. You can customize the output resolution to achieve the desired quality level. Higher resolutions result in sharper images but larger file sizes. The conversion preserves colors, transparency, and visual details from the original SVG, ensuring professional results suitable for web use, presentations, and print materials.'
  },
  {
    id: 7,
    questionKey: 'faq.questions.q7.question',
    question: 'Can I convert multiple SVG files at once?',
    answerKey: 'faq.questions.q7.answer',
    answer: 'Absolutely! Our tool supports batch conversion, allowing you to upload and convert multiple SVG files to PNG format simultaneously. You can upload up to 20 SVG files at once, each with a maximum size of 10MB. After conversion, all PNG files are packaged into a convenient ZIP archive for easy download.'
  },
  {
    id: 8,
    questionKey: 'faq.questions.q8.question',
    question: 'Is my data safe during conversion?',
    answerKey: 'faq.questions.q8.answer',
    answer: 'Yes, your data is completely safe. Our SVG to PNG converter operates entirely within your browser - no files are uploaded to our servers. All conversion processing happens locally on your device using client-side JavaScript. This means your SVG files never leave your computer, ensuring complete privacy and security of your graphics and designs.'
  },
  {
    id: 9,
    questionKey: 'faq.questions.q9.question',
    question: 'What SVG features are supported?',
    answerKey: 'faq.questions.q9.answer',
    answer: 'Our converter supports most standard SVG features including: basic shapes (rectangles, circles, paths), text elements, gradients, patterns, transformations, and transparency. Complex features like animations, interactive elements, and external references may not be preserved in the PNG output since PNG is a static image format.'
  },
  {
    id: 10,
    questionKey: 'faq.questions.q10.question',
    question: 'Can I customize the PNG output settings?',
    answerKey: 'faq.questions.q10.answer',
    answer: 'Yes! You can customize several aspects of the PNG output: 1) Resolution/Size - Set custom width and height for the output PNG, 2) Quality - Choose the level of compression vs. quality, 3) Background - Keep transparency or set a solid background color, 4) Scale - Maintain aspect ratio or stretch to fit specified dimensions. These options give you full control over the final PNG result.'
  }
];

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <HelpCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('faq.subtitle', 'Everything you need to know about SVG to PNG conversion')}
        </p>
      </div>

      <div className="space-y-3">
        {faqData.map((item) => (
          <div 
            key={item.id} 
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-200"
            >
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50 pr-4">
                {t(item.questionKey, item.question)}
              </span>
              <div className="flex-shrink-0">
                {openItems.has(item.id) ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                )}
              </div>
            </button>
            
            {openItems.has(item.id) && (
              <div className="px-4 pb-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="pt-3">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {t(item.answerKey, item.answer)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>



      {/* 底部联系信息 */}
      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-primary-900 dark:text-primary-100 mb-2">
            {t('faq.stillHaveQuestions', 'Still have questions?')}
          </h3>
          <p className="text-xs text-primary-700 dark:text-primary-300 mb-3">
            {t('faq.contactDescription', 'If you need additional help with SVG to PNG conversion or have specific questions about our tool, feel free to reach out.')}
          </p>
          <a 
            href="mailto:0992sunshine@gmail.com?subject=SVG to PNG Converter - Question&body=Hello,%0A%0AI have a question about the SVG to PNG converter:%0A%0A[Please describe your question here]%0A%0AThank you!"
            className="inline-flex items-center space-x-2 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t('faq.contactUs', 'Contact Support')}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;