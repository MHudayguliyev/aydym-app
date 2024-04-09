import type { Metadata } from 'next'
import sidebar_routes from '@app/assets/json-data/sidebar_routes'
import { useLocale } from 'next-intl'
import { setMetaValues } from '../../utils/helpers'
import { getTranslations } from 'next-intl/server'
 
export async function generateMetadata():Promise<Metadata> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const locale = useLocale()
    const route = sidebar_routes[5]
    const t = await getTranslations()
    //@ts-ignore
    const title = route.display_name[locale] + ' - Aydym.com | Diňläň, lezzet alyň'
  
    return setMetaValues({
      title,
      description:`${t('meta.album.index.description', {0: 'Aydym.com'})}`, 
      keywords: t('meta.album.index.keywords'),
      icons: ['https://aydym.com/assets/logos/logo_aydym_white-befbac3bd03c0fd5fa7a4f491aec9959.webp'], 
      openGraph: {
        type:'website',
        url: 'https://aydym.com/album/index',
        title: t('albums.title'),
        images: [],
        description: ''
      }
    }) 
}

export default function Layout({
    children, 
  }: {
    children: React.ReactNode, 
  }) {
    return <>{children}</>
}