import en from './en';
import so from './so';
import es from './es';

export const translations = {
  en,
  so,
  es,
};

export type TranslationKey = keyof typeof en;