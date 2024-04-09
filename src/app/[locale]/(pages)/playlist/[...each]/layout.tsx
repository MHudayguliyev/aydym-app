import type { Metadata } from 'next'
//api
import {GetPlaylistById} from '@api/Queries/Getters'
import { setMetaValues } from '@lang/app/[locale]/utils/helpers'
import { getTranslations } from 'next-intl/server';
 
export async function generateMetadata({params}: {params: {each: any}}): Promise<Metadata> {
  let response;
  const t = await getTranslations()
  try {
    response = await GetPlaylistById(params.each?.[0])
  } catch (error) {
    console.log('error', error)
  }

    return setMetaValues({
      title: `${response?.name} - Aydym.com | Diňläň, lezzet alyň`,
      description:`${t('meta.playlist.description', {0: 'Aydym.com', 1: response?.name })}`, 
      openGraph: {
        type:'article',
        url: `${response?.shareUrl}`,
        title: `${response?.name}`,
        images: [`${response?.imageUrl}`],
        description: `${response?.name}`
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