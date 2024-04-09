'use client'
// styles
import styles from './page.module.scss'
// components
import SongCard from '@components/SongCard/SongCard'
import Preloader from '../../compLibrary/Preloader'
import InfiniteScroll from 'react-infinite-scroller'
// hooks
import { useWindowHeight } from '@hooks/useWindowHeight'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
// utils
import { CheckObjOrArrForNull } from '@utils/helpers'
// api
import { GetGenresData } from '@api/Queries/Getters'
// types
import Genres from '@api/Types/queryReturnTypes/Genres'

const Genres = () => {

  const router = useRouter();
  const [offset, setOffset] = useWindowHeight(24);
  const [genresList, setGenresList] = useState<Genres[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false)
  const t = useTranslations('menu')

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    const response = await GetGenresData(offset)
    if(CheckObjOrArrForNull(response)) {
      
      setGenresList([...genresList, ...response])
      
      setOffset(offset + response.length);
      setHasMore(true)
      
    }else setHasMore(false)
  }
    
  return (
    <>
      <div className={styles.hero}></div>
      <div className={styles.underHero}>
        <div className={styles.head}>
          <h3>{t('genres')}</h3>
        </div>
        <InfiniteScroll
          loadMore={() => {
            fetchArtists()
          }}
          hasMore={hasMore}
          loader={<span className={styles.loader}><Preloader size='md'/></span>}
        >
          <div className={styles.grid}>
          {
            genresList && genresList?.map(genre => (
              <SongCard 
                key={genre.id}
                id={genre.id} 
                name={genre.name} 
                image={genre.imageUrl}
                onClick={() => router.push(`/genre/${genre.id}`)} 
                genresCardSecond 
              />
            ))
          }
          </div>
        </InfiniteScroll>
      </div>
    </>
  )
}

export default Genres