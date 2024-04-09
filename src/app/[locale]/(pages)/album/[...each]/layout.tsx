import type { Metadata } from 'next'
//api
import {GetAlbumById} from '@api/Queries/Getters'
import { setMetaValues } from '@lang/app/[locale]/utils/helpers'
import { getTranslations } from 'next-intl/server'
 
export async function generateMetadata({params}: {params: {each: any}}): Promise<Metadata> {
  let title = "Not found"
  let response;
  const t = await getTranslations()
  try {
    response = await GetAlbumById(params.each?.[0])
  } catch (error) {
    console.log('error', error)
  }

  title = response?.artistName + ' - ' + response?.name + ' - Aydym.com | Diňläň, lezzet alyň'

    return setMetaValues({
      title,
      description:`${t('meta.album.description', {0: 'Aydym.com', 1: response?.artistName + ' - ' + response?.name })}`, 
      keywords: t('meta.album.index.keywords'),
      openGraph: {
        type:'website',
        url: `https://aydym.com/album/${response?.id}`,
        title: `${response?.artistName} - ${response?.name}`,
        images: [`${response?.imageUrl}`],
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