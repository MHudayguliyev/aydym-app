'use client'
// styles
import styles from './page.module.scss'
// hooks
import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckObjOrArrForNull, isUndefined } from '@utils/helpers';
import { useWindowHeight } from '@hooks/useWindowHeight';
//components
import SongCard from '@components/SongCard/SongCard';
import Sort from '@compLibrary/Sort/Sort';
// api
import { GetAlbumsData, GetForeignSongs} from '@api/Queries/Getters';
//types
import AlbumsType from '@api/Types/queryReturnTypes/Albums';
import { getFromSession, setToSession } from '@utils/storage';
import InfiniteScroll from 'react-infinite-scroller';
import Preloader from '../../compLibrary/Preloader';

const Albums = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const albumType = useMemo(() => searchParams?.get('albumType'),[searchParams])
  // states
  const sessionSortValue = getFromSession('albumSort')
  const [selectedSort, setSelectedSort] = useState<string>(sessionSortValue ? sessionSortValue : '');
  const [offset, setOffset] = useWindowHeight(24);
  const [albumsList, setAlbumsList] = useState<AlbumsType['data']>([]);
  const [isSortMode, setIsSortMode] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false)

  // Sort component information
  const sortOptions = [
    {
      value: '',
      option: { tk: 'Default', ru: 'Default'}, 
    },
    {
      value: 'popular',
      option: { tk: 'Popular', ru: 'Popular'}, 
    },
    {
      value: 'az',
      option: { tk: 'A-Z', ru: 'A-Z'}, 
    },
    {
      value: 'za',
      option: { tk: 'Z-A', ru: 'Z-A'}, 
    },
  ]
  useEffect(() => {
    console.log("searchParams", searchParams)
  }, [])
  useEffect(() => {
    setToSession('albumSort', selectedSort)
    setOffset(0)
    fetchArtists()
  }, [selectedSort, searchParams])


  const fetchArtists = async () => {
    let response;
    const isHomeItem = albumType === 'homeItem'
    if(albumType === 'homeItem') response = await GetForeignSongs(selectedSort)
    else response = await GetAlbumsData(offset, selectedSort)
    if(CheckObjOrArrForNull(response)) {
      if(isSortMode){
        setAlbumsList(response)
        setIsSortMode(false)
      }else {
        
        setAlbumsList([...albumsList, ...response])
      }
      if(isHomeItem){
        setOffset(0);
        setHasMore(false)
      }else {
        setOffset(offset + response.length);
        setHasMore(true)
      }
      
    }else setHasMore(false)
  }

  return (
    <>
      <div className={styles.hero}></div>
      <div className={styles.underHero}>
        <div className={styles.head}>
          <h3>Albomlar</h3>
          <Sort 
            data={sortOptions} 
            selectedValue={selectedSort} 
            onChange={(value) => {
              setSelectedSort(value)
              setOffset(0)
              setIsSortMode(true)
            }}/>
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
            albumsList && albumsList?.map((album) => (
              <SongCard 
                key={album.id}
                id={album.id} 
                image={album.imageUrl} 
                name={album.name}
                artist={album.artistName}
                onClick={() => router.push(`/album/${album.id}${!isUndefined(album?.slug) ? `/${album?.slug}` : ""}`)} 
                albumCard
            />
            ))
          }
          </div>
        </InfiniteScroll>
  
      </div>
    </>
  )
}

export default Albums;