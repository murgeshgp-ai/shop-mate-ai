import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  product,
}) => {
  const { t } = useTranslation();
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900">{t('deleteTitle')}</h3>
        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
          {t('deleteConfirmText', { name: product.name })}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors cursor-pointer"
          >
            {t('deleteBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
