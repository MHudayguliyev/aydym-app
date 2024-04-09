'use client'
import { usePathname } from 'next/navigation';
// styles
import styles from './page.module.scss';
//components
import ItemProfle from '@components/ItemProfile/ItemProfile';
import SongList from '@components/SongList/SongList';
import Divider from '@compLibrary/Divider';
import Sort from '@compLibrary/Sort/Sort';
//types
import { DropdownType } from '@app/types';
//hooks
import { useEffect, useMemo, useState } from 'react';
//redux
import { useAppDispatch } from '@hooks/redux_hooks';
import { setCurrentSong, setLikeSong } from '@redux/reducers/MediaReducer'
import { togglePlaylistModal } from '@redux/reducers/TopnavbarReducer';
//api
import { useQuery } from 'react-query';
import { GetAlbumById, GetAlbumSongs } from '@api/Queries/Getters';
import { likeDislike } from '@api/Queries/Post';
//utils
import {  CheckObjOrArrForNull, copyLink, faveAdder } from '@utils/helpers';
import { useWindowHeight } from '@hooks/useWindowHeight';
import NewSongs from '@api/Types/queryReturnTypes/Songs';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import Preloader from '@compLibrary/Preloader';


const AlbumPage = ({params}:{params: {each: any}}) => {
  const idMem = useMemo(() => {
    return params.each
  }, [params.each])

  const dispatch = useAppDispatch()
  const pathname = usePathname()
  const t = useTranslation()

  //states
  const [offset, setOffset] = useWindowHeight(20)
  const [isSortMode, setIsSortMode] = useState<boolean>(false)
  const [selectedSort, setSelectedSort] = useState<string>('albumOrder')
  const [songsList, setSongsList] = useState<NewSongs['data']>([])
  const [hasMore, setHasMore] = useState<boolean>(false)
  const [totalSongs, setTotalSongs] = useState<NewSongs['total']>()

  const sortOptions = [
    {
      value: 'albumOrder',
      option: { tk: 'Default', ru: 'Default'}, 
    },
    {
      value: 'popular',
      option: { tk: 'Popular', ru: 'Popular'}, 
    },
    // {
    //   value: 'az',
    //   option: { tm: 'A-Z', ru: 'A-Z'}, 
    // },
    // {
    //   value: 'za',
    //   option: { tm: 'Z-A', ru: 'Z-A'}, 
    // },
  ]

  const detailsData: DropdownType = [
    {
      value: 'addToFavorites', label: {tk: 'Halanlaryma goş', ru: 'Избранное'}, 
    }, 
    {
      value: 'playlist', label: {tk: 'Playliste goş', ru: 'В плейлист'}, 
    }, 
    {
      value: 'share', label: {tk: 'Paýlaşmak', ru: 'Поделиться'}, 
    },     
    {
      value: 'play', label: {tk: 'Play', ru: 'Play'}, 
    }
  ]

  useEffect(() => {
    setOffset(0)
    fetchSongs()
  }, [selectedSort])

  const fetchSongs = async () => {
    const response = await GetAlbumSongs(idMem, offset, selectedSort)
    if(CheckObjOrArrForNull(response.data)) {
      if(isSortMode){
        setSongsList(faveAdder(response.data, false))
        setIsSortMode(false)
      }else {
        setSongsList([...songsList, ...faveAdder(response.data, false)])
      }
      setOffset(offset + response.data.length);
      setHasMore(true)
      setTotalSongs(response.total);
    }else setHasMore(false)
  }

  const playAll = () => {
    const index = 0
    dispatch(setCurrentSong({
      data: songsList, index, 
      id: songsList[index]?.id
    }))
  }

  //queries
    const {
        data: album,
        isLoading: isAlbumLoading,
        isError: isAlbumError
    } = useQuery(['GetAlbum', idMem], () => GetAlbumById(idMem), {
      refetchOnWindowFocus: false
    })

    return (
      <>
          <div className={styles.hero}></div>
          <div className={styles.underHero}>
              <ItemProfle 
                data={album} 
                albumCard
                onPlay={playAll}
                onDetailsClick={value => {
                  console.log('value', value)
                  if(value === 'play') playAll()
                  else if(value === 'share') 
                  copyLink(`https://aydym.com${pathname}`)
                }}
                fetchStatuses={{
                  isLoading: isAlbumLoading,
                  isError: isAlbumError
                }}
                detailsData={detailsData}
              />

            <div className={`${styles.section} ${styles.songs}`}>
                  <div className={styles.head}>
                    <h3> 
                      <span> Aýdymlar</span>
                    </h3>
                  </div>
                  <div className={styles.sort}>
                    <span>
                      {totalSongs} Track
                    </span>
                    <Sort 
                      data={sortOptions} 
                      selectedValue={selectedSort} 
                      onChange={(value) => {
                        setSelectedSort(value)
                        setOffset(0)
                        setIsSortMode(true)
                      }}/>
                  </div>
                <Divider />
                <InfiniteScroll
                  loadMore={() => {
                    fetchSongs()
                  }}
                  hasMore={hasMore}
                  loader={<span className={styles.loader}><Preloader size='md'/></span>}
                >
                  <SongList 
                    data={songsList!}
                    fetchStatuses={{
                      isLoading: false, isError: false
                    }}
                    detailsData={detailsData}
                    onPlay={(index) => 
                      dispatch(setCurrentSong({
                        data: songsList, index, 
                        id: songsList[index]?.id
                      }))
                    }
                    onLike={async (song) => {
                      console.log('song', song.name)
                      const apiPrefix: 'remove' | 'add' = song.favorite ? 'remove' : 'add'
                      const response = await likeDislike(song.id, apiPrefix)
                      if(response.status){
                        setSongsList(prev => prev?.map(item => item.id === song.id ? {...item, favorite: !item.favorite} : item))
                        dispatch(setLikeSong(song.id))
                      }
                    }}
                    onAddToPlaylist={song => {
                      dispatch(togglePlaylistModal({
                        id: song.id, 
                        state: true
                      }))
                    }}
                  />   
                </InfiniteScroll>
            </div>
          </div>
      </>
    )
}

export default AlbumPage