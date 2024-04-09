import type { Metadata } from 'next'
import {getTranslations} from 'next-intl/server';
import { setMetaValues } from '../../utils/helpers';
 
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta')
  return setMetaValues({
    title: t('search.title'), 
    description: t('search.description'), 
    keywords: t('search.keywords'), 
    openGraph: {
      type: 'website',
      url: 'https://aydym.com',  
      title: t('search.title'), 
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