'use client'
import React, {useEffect, useMemo, useState} from 'react'
import { useQuery } from 'react-query';
//styles
import styles from './page.module.scss';
//api
import { GetLikedSongs } from '@api/Queries/Getters';
import { likeDislike } from '@api/Queries/Post';
//libs
import Divider from '@compLibrary/Divider';
//comps
import SongList from '@components/SongList/SongList';
//types
import { DropdownType } from '../../types';
import NewSongs from '@api/Types/queryReturnTypes/Songs';
//utils
import {  faveAdder } from '@utils/helpers';
//react toast
import toast from 'react-hot-toast';
//auth middleware 
import AuthMiddleware from '@components/AuthMiddleware';
//redux
import { useAppDispatch } from '@hooks/redux_hooks';
import { setCurrentSong } from '@redux/reducers/MediaReducer';
import { togglePlaylistModal } from '../../redux/reducers/TopnavbarReducer';



const LikedSongs = () => {
    const dispatch = useAppDispatch()

    const {
        data: likedSongs,
        isLoading, 
        isError, 
        refetch
    } = useQuery('GetLikedSongs', () => GetLikedSongs(), {
        refetchOnWindowFocus: false
    })

    const [likedSongsList, setLikedSongsList] = useState<NewSongs['data']>([])
    const dropdownData: DropdownType = [
        {
          value: 'playlist', label: {tm: 'Add to playlist', ru: 'Add to playlist'}, 
        }, 
        {
          value: 'queue', label: {tm: 'Add to queue', ru: 'Add to queue'}, 
        },     {
          value: 'Next', label: {tm: 'Next to play', ru: 'Next to play'}, 
        }, 
        {
          value: 'share', label: {tm: 'Share', ru: 'Share'}, 
        },     {
          value: 'play', label: {tm: 'Play', ru: 'Play'}, 
        }
    ]

    useEffect(() => {
      setLikedSongsList(faveAdder(likedSongs!, true))
    }, [likedSongs])

  return (
    <>
      <div className={styles.hero}></div>
      <div className={styles.wrapper}>
        <h1 className={styles.small_header}>Aydymlar</h1>
        <Divider />
        <SongList 
          fetchStatuses={{
              isLoading, isError
          }}
          data={likedSongsList}
          detailsData={dropdownData}
          onPlay={index => {
            dispatch(setCurrentSong({
              data: likedSongsList, index, 
              id: likedSongsList[index]?.id
            }))
          }}
          onLike={async (song) => {
            console.log("song", song)
            // console.log('likedSongsList', likedSongsList)
              const response = await likeDislike(song.id, 'remove')
              console.log('resoibse', response)
              if(response.status){
                setLikedSongsList(lk => lk.filter(lk_item => lk_item.id !== song.id))
                toast.success('Successfully removed')
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
      </div>
    </>
  )
}

export default AuthMiddleware(LikedSongs)
