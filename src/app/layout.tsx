import type { Metadata, Viewport } from 'next';
import { Fraunces, Archivo, JetBrains_Mono } from 'next/font/google';
import './globals.css';

/* Fraunces nos títulos: é uma serifada com eixo de "soft" e de
   "wonk", e é a serifa que fica bonita GRANDE — o site inteiro
   depende de dois ou três títulos enormes. A curva dela lembra o
   traço da sobrancelha, que é o assunto da página. Archivo no
   corpo porque uma segunda serifada em 17px cansaria a leitura. */
const display = Fraunces({
  variable: '--fonte-display',
  subsets: ['latin'],
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

const corpo = Archivo({
  variable: '--fonte-corpo',
  subsets: ['latin'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  variable: '--fonte-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Arlecia Mota | Micropigmentação de lábios e sobrancelhas em BH',
  description:
    'Micropigmentação de sobrancelhas e lábios em Belo Horizonte: fio a fio, shadow lines, ombré e labial. Desenho aprovado por você, material descartável e retoque incluso.',
  applicationName: 'Arlecia Mota PMU',
  openGraph: {
    title: 'Arlecia Mota | Micropigmentação em Belo Horizonte',
    description:
      'Menos contorno, mais naturalidade. Sobrancelhas e lábios feitos traço a traço, no seu formato e no seu tom.',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#170f0d',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${corpo.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
