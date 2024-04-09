import type { Metadata } from 'next'
//api
import {GetGenresById} from '@api/Queries/Getters'
import { setMetaValues } from '@lang/app/[locale]/utils/helpers';
import { getTranslations } from 'next-intl/server';
 
export async function generateMetadata({params}: {params: {each: any}}): Promise<Metadata> {
  let title = "Not found"
  const t  = await getTranslations()
  let response;
  try {
    response = await GetGenresById(params.each?.[0])
  } catch (error) {
    console.log('error', error)
  }

  title = response?.name + ' - Aydym.com | Diňläň, lezzet alyň'
    
    return setMetaValues({
      title,
      description:`${t('meta.genre.description', {0: 'Aydym.com', 1: response?.name})}`, 
      keywords: t('meta.genre.index.keywords'),
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