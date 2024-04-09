'use client';
import React from 'react'
import Image from 'next/image';
//router 
import { useRouter } from 'next/navigation';
//libs
import Divider from '@compLibrary/Divider';
import Preloader from '@compLibrary/Preloader';
//react-query
import { useQuery } from 'react-query';
//styles
import styles from './page.module.scss';
//api
import { GetUserPlaylist } from '@api/Queries/Getters';
import SongCard from '../../components/SongCard/SongCard';
//icons 
import musicI from '@app/assets/icons/music.svg';
//middleware
import AuthMiddleware from '@components/AuthMiddleware';

const UserPlaylist = () => {
    const router = useRouter()
    const {
        data: playlists, 
        isLoading, 
        isError
    } = useQuery("GetUserPlaylist", () => GetUserPlaylist(), {
        refetchOnWindowFocus: false
    })

  return (
    <>
        <div className={styles.hero}></div>
        <div className={styles.wrapper}>
            <h1 className={styles.small_header}>Meniň Playlistlerim</h1>   
            <Divider />
            {
                isLoading ? <span className={styles.loader}><Preloader size='md'/></span> : 
                isError ? (
                    <div className={styles.error}>
                        <Image src={musicI} alt='musicI'/>
                        <p>
                            No songs, album or playlist found.
                        </p>
                    </div>
                ) : 
                <div className={styles.grid}>
                    {
                        playlists?.map(playlist => (
                            <SongCard 
                                key={playlist.id}
                                id={playlist.id}
                                image={playlist.imageUrl} 
                                name={playlist.name}
                                playlistCard
                                onClick={() => router.push(`/userPlaylist/${playlist.id}`)}
                            />
                        ))
                    }
                </div>
            }

        </div>

    </>
  )
}

export default AuthMiddleware(UserPlaylist)
