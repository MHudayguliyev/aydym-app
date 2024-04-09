'use client';
import React, {useState, useEffect, useMemo} from 'react'
import { useSearchParams } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroller';
//styles
import styles from './page.module.scss';
//api
import { GetSongs } from '@app/api/Queries/Getters';
//libs
import Divider from '@app/compLibrary/Divider';
import Dropdown from '@app/compLibrary/Dropdown';
import Preloader from '@compLibrary/Preloader';
//types
import { DropdownType } from '@app/types';
import NewSongs from '@api/Types/queryReturnTypes/Songs';
//comps
import SongList from '@components/SongList/SongList';
//utils
import { CheckObjOrArrForNull, faveAdder } from '@utils/helpers';
//api
import { likeDislike } from '@api/Queries/Post';
//redux 
import { useAppDispatch } from '@hooks/redux_hooks';
import { setLikeSong,setCurrentSong } from '@redux/reducers/MediaReducer'
import { togglePlaylistModal } from '@redux/reducers/TopnavbarReducer'

const Songs = () => {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const songTypeId = useMemo(() => parseInt(searchParams?.get('songTypeId')!) ,[searchParams])
  //states
  const [offset, setOffset] = useState<number>(0)
  const [songsList, setSongsList] = useState<NewSongs['data']>([])
  const [sort, setSort] = useState<'sortingDate' | 'popular'>('sortingDate')
  const [isSortMode, setIsSortMode] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)

  useEffect(() => {
    setOffset(0)
    fetchSongs()
    // console.log("songTypeId", songTypeId)
  }, [sort, songTypeId, searchParams])

  const fetchSongs = async () => {
    console.log("searchParams", searchParams.get('songTypeId'))
    const response = await GetSongs({
      offset, sort, songTypeId, 
      trandSongs: searchParams?.get('songTypeId') === 'trand'
    })
    console.log('response', response)
    if(CheckObjOrArrForNull(response)) {
      if(isSortMode){
        setSongsList(faveAdder(response, false))
        setIsSortMode(false)
      }else {
        setSongsList([...songsList, ...faveAdder(response, false)])
      }
      setOffset(offset + response.length);
      setHasMore(true)
      
    }else setHasMore(false)
  } 

  const dropdownData: DropdownType = [
    {
      value: 'sortingDate', label: {
        tk: 'Default', ru: "Default"
      }
    }, 
    {
      value: 'popular', label: {
        tk: 'Popular', ru: "Popular"
      }
    }
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
    },     {
      value: 'play', label: {tk: 'Play', ru: 'Play'}, 
    }
  ]

  return (
    <>
      <div className={styles.hero}></div>
      
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.small_header}>Aydymlar</h1>
          <div className={styles.sortion}>
            <label>Tertipleme: </label>
            <Dropdown 
              data={dropdownData} 
              onChange={value => {
                setIsSortMode(true)
                setSort(value)
                setOffset(0)
              }}
            />
          </div>
        </div>
        <Divider styles={{marginBottom: '1rem'}}/>

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
              // console.log('song', song)
              dispatch(togglePlaylistModal({
                id: song.id, 
                state: true
              }))
            }}
          />   
        </InfiniteScroll>
      </div>
    </>
  )
}

export default Songs
