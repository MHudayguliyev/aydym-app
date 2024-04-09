'use client'
import ItemProfle from '@components/ItemProfile/ItemProfile'
import styles from './page.module.scss'
import { useQuery } from 'react-query'
import { GetGenreSongs, GetGenresById } from '@api/Queries/Getters'
import SongList from '@components/SongList/SongList'
import { DropdownType } from '@app/types'
import { useDispatch } from 'react-redux'
import { setCurrentSong, setLikeSong } from '@redux/reducers/MediaReducer'
import { useEffect, useState } from 'react'
import { CheckObjOrArrForNull, faveAdder } from '@utils/helpers'
import { likeDislike } from '@api/Queries/Post'
import { useWindowHeight } from '@hooks/useWindowHeight'
import Sort from '@compLibrary/Sort/Sort'
import NewSongs from '@api/Types/queryReturnTypes/Songs'
import Divider from '@compLibrary/Divider'
import { togglePlaylistModal } from '@redux/reducers/TopnavbarReducer'
import InfiniteScroll from 'react-infinite-scroller'
import Preloader from '@lang/app/[locale]/compLibrary/Preloader'

const GenrePage = ({params}: {params: {each: any}}) => {
  const dispatch = useDispatch();

  const [offset, setOffset] = useWindowHeight(20)
  const [isSortMode, setIsSortMode] = useState<boolean>(false)
  const [selectedSort, setSelectedSort] = useState<string>('date')
  const [songsList, setSongsList] = useState<NewSongs['data']>([])
  const [totalSongs, setTotalSongs] = useState<NewSongs['total']>()
  const [hasMore, setHasMore] = useState<boolean>(false)

  const sortOptions = [
    {
      value: 'date',
      option: { tk: 'Default', ru: 'Default'}, 
    },
    {
      value: 'popular',
      option: { tk: 'Popular', ru: 'Popular'}, 
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
    },     
    {
      value: 'play', label: {tk: 'Play', ru: 'Play'}, 
    }
  ]

  const {
    data: genre, 
    isLoading: isGenreLoading, 
    isError: isGenreError
  } = useQuery(['GetGenreById', params.each], () => GetGenresById(params.each?.[0]), {
    refetchOnWindowFocus: false, 
    enabled: !!params.each
  })

  useEffect(() => {
    setOffset(0)
    fetchSongs()
  }, [selectedSort])

  const fetchSongs = async () => {
    const response = await GetGenreSongs(params.each?.[0], offset, selectedSort)
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

  return (
    <div>
      <div className={styles.hero}></div>
      <div className={styles.underHero}>
       
        <ItemProfle 
          data={genre} 
          albumCard 
          fetchStatuses={{
            isLoading: isGenreLoading, 
            isError: isGenreError
          }}
          onPlay={() => {
            const index = 0
            dispatch(setCurrentSong({
              data: songsList, index, 
              id: songsList?.[index]?.id
            }))
          }}
          detailsData={detailsData} 
          genreCard
        />
        
        <div className={`${styles.section} ${styles.songs}`}>
          <div className={styles.head}>
            <h3> 
              <span> Aýdymlar</span>
            </h3>
          </div>
          <div className={styles.sort}>
            <span>
              Tracks: {totalSongs}
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
                console.log('song', song)
                dispatch(togglePlaylistModal({
                  id: song.id, 
                  state: true
                }))
              }}
            />   
          </InfiniteScroll>
        </div>
      </div>
    </div>
  )
}

export default GenrePage