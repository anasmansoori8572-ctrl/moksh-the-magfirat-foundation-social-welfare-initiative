import React, { useState } from 'react';
import { Languages, Loader2, X } from 'lucide-react';
import { translateText } from '../services/geminiService';

interface TranslateTextProps {
  originalText: string;
  className?: string;
}

const LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'ur', name: 'Urdu' },
  { code: 'bn', name: 'Bengali' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
];

const TranslateText: React.FC<TranslateTextProps> = ({ originalText, className = "" }) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentLang, setCurrentLang] = useState<string | null>(null);

  const handleTranslate = async (langName: string) => {
    setIsLoading(true);
    setShowOptions(false);
    setCurrentLang(langName);
    try {
      const result = await translateText(originalText, langName);
      setTranslatedText(result);
    } catch (error) {
      console.error("Translation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetTranslation = () => {
    setTranslatedText(null);
    setCurrentLang(null);
  };

  return (
    <div className={`mt-4 ${className}`}>
      {!translatedText && !isLoading && (
        <div className="relative inline-block">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center text-primary font-bold text-sm hover:opacity-80 transition-opacity p-3 -m-3 md:p-0 md:m-0"
            aria-label="Select language for translation"
          >
            <Languages size={18} className="mr-2" />
            <span>See translation</span>
          </button>

          {showOptions && (
            <div className="absolute left-0 bottom-full mb-2 w-48 max-h-60 overflow-y-auto bg-[#F5F5F0]/70 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 scrollbar-thin scrollbar-thumb-stone-200">
              <div className="sticky top-0 p-2 border-b border-white/10 bg-white/10 text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                Select Language
              </div>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleTranslate(lang.name)}
                  className="w-full text-left px-4 py-3 text-sm text-stone-700 hover:bg-primary/10 hover:text-primary transition-colors border-b border-stone-50 last:border-0"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center text-stone-500 text-sm italic">
          <Loader2 size={16} className="animate-spin mr-2" />
          Translating to {currentLang}...
        </div>
      )}

      {translatedText && !isLoading && (
        <div className="bg-secondary/20 p-6 rounded-2xl border border-secondary/30 relative group">
          <button
            onClick={resetTranslation}
            className="absolute top-2 right-2 p-1 text-stone-400 hover:text-stone-600 transition-colors"
            title="Show Original"
          >
            <X size={16} />
          </button>
          <div className="text-[10px] uppercase font-bold text-primary mb-2 tracking-widest">
            Translated to {currentLang}
          </div>
          <p className="text-stone-700 leading-relaxed italic">
            {translatedText}
          </p>
        </div>
      )}
    </div>
  );
};

export default TranslateText;
