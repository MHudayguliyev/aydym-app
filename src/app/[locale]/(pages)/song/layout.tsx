import type { Metadata } from 'next'
import Script from 'next/script';
//routes 
import sidebar_routes from '@app/assets/json-data/sidebar_routes'
//translations 
import {getTranslations} from 'next-intl/server';
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl';
import { setMetaValues } from '@utils/helpers';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  const locale = useLocale()
  const route = sidebar_routes[1]
  //@ts-ignore
  const title = route.display_name[locale] + ' - Aydym.com | Diňläň, lezzet alyň'
  return setMetaValues({
    title,
    description: t('meta.song.index.description'), 
    keywords: t('meta.song.index.keywords'), 
    icons: ['https://aydym.com/assets/logos/logo_aydym_white-befbac3bd03c0fd5fa7a4f491aec9959.webp'], 
    openGraph: {
      type: "website",
      url: 'Aydym.com/song', 
      title: t('menu.music')
    }
  })
}

export default function Layout({
    children, 
  }: {
    children: React.ReactNode, 
  }) {
    const t = useTranslations('menu')
    return (
      <>
        {children}
        
        <Script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [{
                "@type": "ListItem",
                "position": 1,
                "item": {
                   "@id": "https://aydym.com",
                   "name": "Aydym.com"
                }
              },{
                "@type": "ListItem",
                "position": 2,
                "item": {
                   "name": t('music')
                }
              }]
           
            })
          }}
          strategy='beforeInteractive'
        />

      </>
    )
    
}