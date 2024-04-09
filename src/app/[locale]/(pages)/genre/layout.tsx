import type { Metadata } from 'next'
import sidebar_routes from '@app/assets/json-data/sidebar_routes'
import { useLocale } from 'next-intl'
import { setMetaValues } from '../../utils/helpers'
import { getTranslations } from 'next-intl/server'
 
export async function generateMetadata(): Promise<Metadata> {
    const locale = useLocale()
    const route = sidebar_routes[7]
    const t = await getTranslations()
    //@ts-ignore
    const title = route.display_name[locale] + ' - Aydym.com | Diňläň, lezzet alyň'


    // <meta property="title" content="${g.message(code: 'genres.title')}">

    return setMetaValues({
      title,
      description:`${t('meta.genre.index.description', {0: 'Aydym.com'})}`, 
      keywords: t('meta.genre.index.keywords'),
      icons: ['https://aydym.com/assets/logos/logo_aydym_white-befbac3bd03c0fd5fa7a4f491aec9959.webp'], 
      openGraph: {
        type:'website',
        url: 'https://aydym.com/genre/index',
        title: t('genres.title'),
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