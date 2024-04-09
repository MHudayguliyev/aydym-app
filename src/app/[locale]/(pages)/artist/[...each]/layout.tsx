import type { Metadata } from 'next'
//api
import {GetArtistById} from '@api/Queries/Getters'
//utils
import { setMetaValues } from '@utils/helpers'
//translations
import { getTranslations } from 'next-intl/server'
 
export async function generateMetadata({params}: {params: {each: any}}): Promise<Metadata> {
    const t = await getTranslations('meta.artist')
    let response; 
    try {
      response = await GetArtistById(params.each?.[0])
    } catch (error) {
      console.log('error', error)
    }
    return setMetaValues({
      title: `${response?.name ?? ""} - Aydym.com | Diňläň, lezzet alyň`,
      description: t('description', {0: response?.name ?? "", 1: 'Aydym.com'}), 
      openGraph: {
        type: 'article', 
        url: response?.shareUrl ?? "", 
        title: response?.name ?? "", 
        description:  t('description', {0: response?.name ?? "", 1: 'Aydym.com'}), 
        images: [response?.imageUrl as any ?? ""]
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