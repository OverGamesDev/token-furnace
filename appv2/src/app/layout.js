import './globals.css';
import "./assets/css/materialdesignicons.min.css";
import "./assets/css/tailwind.css";
import { Urbanist } from 'next/font/google'
import { AlephiumWalletProvider } from '@alephium/web3-react';
import Navbar from './components/navbar';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { getNetwork } from './services/utils';

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-urbanist",
 })

export const metadata = {
  title: 'Token Furnace',
  description: 'Token Furnace',
  openGraph: {
    title: 'Token Furnace',
    description: 'Token Furnace',
    images: [
      {
        url: 'https://furnace.notrustverify.ch/images/burnmeme.webp',
        width: 700,
        height: 400,
        alt: 'Token Furnace Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Token Furnace',
    description: 'Token Furnace',
    images: ['https://furnace.notrustverify.ch/images/burnmeme.webp'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${urbanist.variable}`}>

      <ThemeProvider>
        <LanguageProvider>
          <body className={`min-h-screen transition-colors duration-200 dark:bg-gray-900 bg-gray-50 font-urbanist ${urbanist.className}`}>
            <AlephiumWalletProvider theme="midnight" network={getNetwork()}>
              <div className="flex min-h-screen">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto md:ml-56 lg:ml-64 xl:ml-72 pb-16 md:pb-0 px-4 md:px-8">
                  <div className="max-w-[1920px] mx-auto pt-20 md:pt-6">
                    {children}
                  </div>
                </main>
              </div>
            </AlephiumWalletProvider>
          </body>
        </LanguageProvider>
      </ThemeProvider>
    </html>
  );
}
