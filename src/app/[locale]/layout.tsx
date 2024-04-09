import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import {notFound} from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
  // for notification
import { Toaster } from 'react-hot-toast';

//porviders
import {Providers} from "@redux/provider";
const QueryProvider = dynamic(() => import('@app/api/provider'))
const ProfileMiddleware = dynamic(() => import('@components/ProfileMiddleware'))
const SettingsChangedMiddleware = dynamic(() => import('@components/SettingsChangedMiddleware'))
const AdvStatisticsMiddleware= dynamic(() => import('@components/AudioStatisticsMiddleware'))
const SongStatisticsMiddleware = dynamic(() => import('@components/SongStatisticsMiddleware'))
const VideoStatisticsProvider = dynamic(() => import('@components/VideoStatisticsProvider'))

//styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '@app/styles/themes.scss';
import '@app/styles/global.scss';

export const metadata: Metadata = {
  title: 'Aydym.com | Diňläň, lezzet alyň',
}
// Can be imported from a shared config
const locales = ['tk', 'ru'];

export default function RootLayout({
  children, 
  params: {locale}
}: {
  children: React.ReactNode, 
  params: {locale: string}
}) {

  if (!locales.includes(locale)) notFound();
  const messages = useMessages();



  return (
    <html lang={locale}>

      <body>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <QueryProvider>
              <ProfileMiddleware>
                <SongStatisticsMiddleware>
                  <SettingsChangedMiddleware>
                    <AdvStatisticsMiddleware>
                      <VideoStatisticsProvider>
                      <Toaster
                          position="top-center"
                          reverseOrder={false}
                        />
                        {children}
                      </VideoStatisticsProvider>
                  </AdvStatisticsMiddleware>
                  </SettingsChangedMiddleware>
                </SongStatisticsMiddleware>
              </ProfileMiddleware>
            </QueryProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
