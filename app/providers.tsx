'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { I18nextProvider } from 'react-i18next';
import { getI18n } from '@/lib/i18n';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [i18n, setI18n] = useState<any>(null);

  useEffect(() => {
    const initI18n = async () => {
      const i18nInstance = await getI18n(
        localStorage.getItem('language') || 'en'
      );
      setI18n(i18nInstance);
    };

    initI18n();
  }, []);

  if (!i18n) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </I18nextProvider>
  );
} 