import type { Metadata } from 'next'
//api
import { GetSong } from '@api/Queries/Getters';
//translations 
import {getTranslations} from 'next-intl/server';
import { getYear, setMetaValues } from '@lang/app/[locale]/utils/helpers';
 
export async function generateMetadata({params}: {params: {each: string}}): Promise<Metadata> {
  const t = await getTranslations()
  let response;
  let title = "Not found" 
  try {
    response = await GetSong(params?.each?.[0])
    title = response?.artist + " - " + response?.name + ' - Aydym.com | Diňläň, lezzet alyň'
  } catch (error) {
    console.log('error', error)
  }

  const metaTitle =  `${response?.artist} - ${response?.name}`;
  return setMetaValues({
    title, 
    description: t('meta.song.index.description'), 
    openGraph: {
      type: "article", 
      url: `${response?.shareUrl}`, 
      title: metaTitle, 
      description: `${getYear(response?.date!)} ${metaTitle} ${response?.duration ?? ""} ${response?.fileSize ?? ""} ${response?.bitRate ?? ""}`,
      images: [`${response?.cover_art_url}`]
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
