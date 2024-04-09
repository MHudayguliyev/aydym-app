import type { Metadata } from 'next'
import { setMetaValues } from '../../utils/helpers'
import { getTranslations } from 'next-intl/server'
 
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations()

    return setMetaValues({
      title: `${t('playlists.title')} - Aydym.com | Diňläň, lezzet alyň!`,
      description:`${t('meta.playlist.index.description', {0: 'Aydym.com'})}`, 
      keywords: t('meta.playlist.index.keywords'),
      openGraph: {
        type:'website',
        url: 'https://aydym.com/playlist/index',
        title: t('playlists.title'),
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