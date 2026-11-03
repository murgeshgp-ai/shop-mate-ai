import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { Language } from '../types';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, supportedLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Change Application Language / ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ"
      >
        <Globe className="h-4 w-4 text-blue-600 shrink-0" />
        <span className="font-semibold text-slate-900">{currentLang.nativeName}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Select Language / ಭಾಷೆ
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold leading-tight">{lang.nativeName}</span>
                    <span className="text-[11px] text-slate-400 leading-tight">{lang.name}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
