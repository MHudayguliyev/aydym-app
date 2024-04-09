import type { Metadata } from 'next'
import { useLocale, useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
//routes 
import sidebar_routes from '@app/assets/json-data/sidebar_routes'
import Script from 'next/script'
import { setMetaValues } from '../../utils/helpers'
 
export async function generateMetadata(): Promise<Metadata> {
    const locale = useLocale()
    const route = sidebar_routes[3]
    const t = await getTranslations()
    // @ts-ignore
    const title = route.display_name[locale] + ' - Aydym.com | Diňläň, lezzet alyň'
   
    return setMetaValues({
      title,
      description:`${t('meta.video.index.description', {0: 'Aydym.com'})}`, 
      keywords: t('meta.video.index.keywords'),
      icons: ['https://aydym.com/assets/logos/logo_aydym_white-befbac3bd03c0fd5fa7a4f491aec9959.webp'], 
      openGraph: {
        type:'article',
        url: 'https://aydym.com/video/index',
        title: t('menu.video'),
        images:['https://aydym.com/assets/logo_v_1.jpg'],
        description: ''
      }
    })
}

export default function Layout({
    children, 
  }: {
    children: React.ReactNode, 
  }) {
    const t = useTranslations()
    return(
      <>
        {children}
        <Script type="text/javascript" src={`//imasdk.googleapis.com/js/sdkloader/ima3.js`} strategy='beforeInteractive' />

        <Script type='application/ld+json' dangerouslySetInnerHTML={{
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
                "name": `${t('menu.video')}`
              }
            }]
          })
        }} 
        strategy='beforeInteractive'
        />

    
      </>
    ) 
}