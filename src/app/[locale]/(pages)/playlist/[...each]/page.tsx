'use client'
import { useEffect, useMemo, useState } from 'react';
//styles
import styles from './page.module.scss';
//types
import { DropdownType } from '@app/types';
//hooks
import { useWindowHeight } from '@hooks/useWindowHeight';
//components
import ItemProfle from '@components/ItemProfile/ItemProfile';
import SongList from '@components/SongList/SongList';
//redux
import { useDispatch } from 'react-redux';
import { togglePlaylistModal } from '@redux/reducers/TopnavbarReducer';
import { setCurrentSong, setLikeSong } from '@redux/reducers/MediaReducer';
//utils
import { CheckObjOrArrForNull, faveAdder } from '@utils/helpers';
//api
import { useQuery } from 'react-query';
import { GetPlaylistById, GetPlaylistSongs } from '@api/Queries/Getters';
import { likeDislike, likePlaylist } from '@api/Queries/Post';
//react toast 
import toast from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroller';
import Preloader from '@compLibrary/Preloader';
import NewSongs from '@api/Types/queryReturnTypes/Songs';
import StatusList from '@components/StatusList/StatusList';

const PlaylistPage = ({params}:{params: {each: string}}) => {
    const dispatch = useDispatch();
    const [offset, setOffset] = useWindowHeight(20)
    const [hasMore, setHasMore] = useState<boolean>(false)
    const [songsList, setSongsList] = useState<NewSongs['data']>([])
    const playlistId = useMemo(() => params.each?.[0],[params.each])
    //query
    const {
        data: playlist,
        isLoading: isPlaylistLoading,
        isError: isPlaylistError
    } = useQuery(['GetPlaylist', playlistId], () => GetPlaylistById(playlistId), {
        refetchOnWindowFocus: false, enabled: !!playlistId
    })
    console.log('playlist', playlist)

    useEffect(() => {
      if(!isPlaylistLoading && !isPlaylistError) fetchSongs()
    }, [playlist])
  
    const fetchSongs = async () => {
      const response = await GetPlaylistSongs(playlistId, offset, playlist?.statShow)
      if(CheckObjOrArrForNull(response)) {
        setSongsList([...songsList, ...faveAdder(response, false)])
        
        setOffset(offset + response.length);
        setHasMore(true)
      }else setHasMore(false)
    }
    console.log("songsList", songsList)
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
    
  return (
    <>
      <div className={styles.hero}></div>
        <div className={styles.underHero}>
            <ItemProfle 
                data={playlist} 
                onPlay={() => {
                      dispatch(setCurrentSong({
                          index: 0, 
                          data: songsList, 
                          id: songsList?.[0]?.id
                      }))
                }}
                onPlaylistLike={async (id) => {
                  try {
                    const response = await likePlaylist(id)
                    // console.log('rsponse', response)
                    if(response.status) toast.success('Successfully added.')
                  } catch (error) {
                    console.log("add to playlist error ", error)
                  }
                }}
                fetchStatuses={{
                  isLoading: isPlaylistLoading, 
                  isError: isPlaylistError
                }}
                playlistCard
                detailsData={detailsData}
            />

            <div className={`${styles.section} ${styles.songs}`}>
              <div className={styles.head}>
                <h3><span>Aýdymlar</span></h3>
              </div>

              <InfiniteScroll
                loadMore={() => {
                  fetchSongs()
                }}
                hasMore={hasMore}
                loader={<span className={styles.loader}><Preloader size='md'/></span>}
              >
             
              {
                playlist?.statShow ? 
                 <StatusList 
                    data={songsList}
                    detailsData={detailsData}
                  /> : 
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
              }
              </InfiniteScroll>
            </div>
      </div>
    </>
  )
}

export default PlaylistPage