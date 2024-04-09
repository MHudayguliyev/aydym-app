/// NOTE: THIS PAGE IS CREATED JUST FOR THE SEO OF HOME PAGE AS ITS LAYOUT USES CLIENT SIDE RENDERING
import type { Metadata } from 'next'
import Script from 'next/script';
import PageClient from "./page.client"; 
import { setMetaValues } from '@utils/helpers';
//translations
import {getTranslations} from 'next-intl/server';
import { useTranslations } from 'next-intl';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta.home')
  return setMetaValues({
    title: 'Aydym.com | Diňläň, lezzet alyň!', 
    description: t('description'), 
    keywords: t('keywords'), 
    openGraph: {
      type: 'website', 
      url: 'https://aydym.com', 
      title: t('title')
    }
  })
}

export default function Page() {
  const t = useTranslations('menu')
  return (
    <>
      <PageClient />
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
                  "name": t('home')
              }
            }]
          })
        }}
        strategy='beforeInteractive'
      />
    </>
  )
}