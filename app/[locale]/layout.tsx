import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

import "../globals.css";
import { Providers } from "../providers";
import ThemeRegistry from "../ThemeRegistry";
import IntlProvider from "./IntlProvider";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  // 👇 Cargamos los mensajes del idioma para el provider cliente
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <Providers>
      <ThemeRegistry>
        <IntlProvider locale={locale} messages={messages}>
          {children}
        </IntlProvider>
      </ThemeRegistry>
    </Providers>
  );
}
