import type { Metadata } from 'next'
//api
import { GetVideoById } from '@app/api/Queries/Getters'
import { getTranslations } from 'next-intl/server'
import { getYear, setMetaValues } from '@lang/app/[locale]/utils/helpers';
export async function generateMetadata({params}: {params: {each: any}}): Promise<Metadata> {
  
  let title = "Not found" 
  let response;

  const t = await getTranslations()

  try {
    response = await GetVideoById(params.each)
    title = response.name + ' - Aydym.com | Diňläň, lezzet alyň'
  } catch (error) {
    console.log('error', error)
  }
 
  return setMetaValues({
    title: `${response?.name}`,
    description: t('meta.video.description', {0: 'Aydym.com', 1: response?.name}),
    openGraph: {
      type: 'article',
      url: `${response?.shareUrl}`,
      title: t('menu.video'),
      images:[`${response?.coverUrl}`],
      description: `${t('meta.video.ogdescription', {0:'Aydym.com', 1:getYear(response?.date!), 2: response?.name})}`
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