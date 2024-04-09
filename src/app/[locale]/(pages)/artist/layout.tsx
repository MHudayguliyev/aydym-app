import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { setMetaValues } from '@utils/helpers'
 
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('')
    return setMetaValues({
      title: `${t('menu.artists')} - Aydym.com`, 
      description: t('meta.artist.index.description', {0: 'Aydym.com'}), 
      keywords: t('meta.artist.index.keywords'), 
      openGraph: {
        type: 'website', 
        url: 'https://aydym.com/artist', 
        title: t('menu.artists')
      }
    })
}

export default function Layout({
    children, 
  }: {
    children: React.ReactNode, 
  }) {
    const t = useTranslations()
    return <>
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
                 "name": t('menu.artists')
              }
            }]
          })
        }}
        strategy='beforeInteractive'
      />
    </>
}