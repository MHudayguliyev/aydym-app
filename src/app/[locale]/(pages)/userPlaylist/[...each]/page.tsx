'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
//icons
import editIcon from '@assets/icons/edit.svg'
import trashIcon from '@assets/icons/trash.svg'
//react-query 
import { useQuery } from 'react-query';
//styles
import styles from './page.module.scss';
//api
import { GetEachPlaylistData, GetPlaylistSongs } from '@api/Queries/Getters';
//lib
import Divider from '@compLibrary/Divider';
import Button from '@compLibrary/Button';
//comps
import SongList from '@components/SongList/SongList';
import DeleteModal from '@components/Modals/DeleteModal/Modal';
//redux 
import { useAppDispatch } from '@hooks/redux_hooks';
import { setCurrentSong, setLikeSong } from '@redux/reducers/MediaReducer'
import { openEditMode } from '@redux/reducers/TopnavbarReducer';
//types
import { DropdownType } from '@app/types';
import { removePlaylist, removeSongFromPlaylist } from '@api/Queries/Delete';
//toast 
import toast from 'react-hot-toast';
//middleware
import AuthMiddleware from '@components/AuthMiddleware';
import { CheckObjOrArrForNull } from '@lang/app/[locale]/utils/helpers';
import { likeDislike } from '@lang/app/[locale]/api/Queries/Post';

const Playlist = ({params}: {params: {each: string}}) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const id = useMemo(() => params?.each?.[0],[params.each])

    //queries
    const {data: playlistData} = useQuery(['GetPlaylistData', id], () => GetEachPlaylistData(id), {
        refetchOnWindowFocus: false, 
        enabled: !!id
    })
    const playlistId = useMemo(() => playlistData?.playlistId ,[playlistData])
    const {
        data: playlistSongs, 
        isLoading, 
        isError 
    } = useQuery(['GetPlaylistSongs', playlistId], () => GetPlaylistSongs(playlistId!?.toString()), {
        refetchOnWindowFocus: false, 
        enabled: !!playlistId
    })
    //states
    const [playlistSongsList, setPlaylist] = useState(playlistSongs)
    const [openDeleteMd, setOpenDeleteMd] = useState<boolean>(false)

    const detailsData = useMemo(() => {
        const data: DropdownType = [
            {
              value: 'addToFavorites', label: {tm: 'Add to favorites', ru: 'Add to favorites'}, 
            }, 
            {
              value: 'info', label: {tm: 'Song info', ru: 'Song info'}, 
            },    
        ]

        if(CheckObjOrArrForNull(playlistData)){
            if(playlistData?.type === 'PERSONAL'){
                return  [...data, {value: 'remove', label: {tm: 'Remove', ru: 'Remove'}}] 
            }
            return data
        }
    }, [playlistData])
    const handleDelete = useCallback(async() => {
        try {
            const response = await removePlaylist(id)   
            console.log('response', response)
            if(response.status) {
                toast.success('Sucessfully deleted')
                router.replace('/userPlaylist')
            }

        } catch (error) {
            console.log("Remove playlist error", error)
        }
    }, [id])

    useEffect(() => {
        if(!isLoading && !isError)
        setPlaylist(playlistSongs)
    }, [playlistSongs])

  return (
    <>
        <DeleteModal 
            show={openDeleteMd}
            close={() => setOpenDeleteMd(false)}
            onAgree={handleDelete}
        />

      <div className={styles.hero}></div>
      <div className={styles.wrapper}>
        <div className={styles.header}>
            <h1 className={styles.small_header}>{playlistData?.name ?? ""}</h1>
            <div className={styles.actions}>
                {
                    playlistData?.type === 'PERSONAL' && (
                        <Button color='yellow' roundedLg onClick={() => dispatch(openEditMode({
                            id: id,
                            valueToEdit: playlistData?.name ?? ""
                        }))}>
                            <Image src={editIcon} alt='edit'/>
                        </Button>
                    )
                }
                <Button color='red' roundedLg onClick={() => setOpenDeleteMd(true)}>
                    <Image src={trashIcon} alt='trash' />        
                </Button>
            </div>
            </div>   
        <Divider styles={{marginBottom: '1rem'}}/>
        <SongList  
            data={playlistSongsList!}
            detailsData={detailsData}
            fetchStatuses={{
                isLoading, isError
            }}
            onPlay={(index) => 
                dispatch(setCurrentSong({
                  data: playlistSongsList, index, 
                  id: playlistSongsList![index]?.id
                }))
            }
            goInfo={(song) => {
                router.push(`/song/${song.id}`)
              }}
            onLike={async (song) => {
            // console.log('song', song.name)
            const apiPrefix: 'remove' | 'add' = song.favorite ? 'remove' : 'add'
            const response = await likeDislike(song.id, apiPrefix)
            if(response.status){
                setPlaylist(prev => prev?.map(item => item.id === song.id ? {...item, favorite: !item.favorite} : item))
                dispatch(setLikeSong(song.id))
            }
            }}
            onRemove={async (song) => {
                try {
                    const response = await removeSongFromPlaylist(id, song.id.toString())    
                    if(response.status){
                        console.log('respoinse', response)    
                        setPlaylist(playlists => playlists?.filter(playlist => playlist.id !== song.id))   
                        // dispatch()  //dispatch the player's playlists to update them all, if the song being deleted is on list there, update player songs list as well
                    }   
                } catch (error) {
                    console.log('Remove from playlist error', error)
                }
            }}
        />
      </div>
    </>
  )
}

export default AuthMiddleware(Playlist)
