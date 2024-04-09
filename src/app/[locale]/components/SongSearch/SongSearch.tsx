'use client';
import React, {useState, useEffect} from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from '@lang/navigation';
//styles
import styles from './SongSearch.module.scss'
//types
import SearchType from '@api/Types/queryReturnTypes/SearchType';
//rels
import SongCard from '../SongCard/SongCard';
//utils
import { CheckObjOrArrForNull, isUndefined } from '@utils/helpers';
//translations
import { useTranslations } from 'next-intl';

interface SongSearchProps {
    searchData: SearchType
    fetchStatus: {isLoading: boolean, isError: boolean}
    mask: string 
    onLinkTouch?: () => void
}
const SongSearch = (props: SongSearchProps) => {
    const {
        searchData, 
        fetchStatus, 
        mask, 
        onLinkTouch
    } = props

    const router = useRouter()
    const t = useTranslations();
    const [artists, setArtists] = useState(searchData?.artists?.data)
    const [songs, setSongs] = useState(searchData?.songs?.data)
    const [videos, setVideos] = useState(searchData?.videos?.data)
    const [playlists, setPlaylists] = useState(searchData?.playlists?.data)

    useEffect(() => {
        if(!isUndefined(searchData)){
            setArtists(searchData?.artists?.data)
            setSongs(searchData?.songs?.data)
            setVideos(searchData?.videos?.data)
            setPlaylists(searchData?.playlists?.data)
        }
    }, [searchData])

    const loadingElement = (
        [1,2,3,4,5,6].map(item => (
          <div className={styles.skeleton} key={item}>
            <div className={styles.skeleton_image}></div>
            <div className={styles.skeleton_content}>
              <div></div>
              <div></div>
            </div>
          </div>
        ))
    )

    return (
        <>
        
            <div className={styles.section}>
                {
                    CheckObjOrArrForNull(artists) && 
                    <div className={styles.header}>
                        <div>Artists</div>
                        {
                            searchData.artists.total > 6 ? 
                            <Link href={`/search?type=artists&mask=${mask}`} onClick={() => onLinkTouch && onLinkTouch()}>
                                {t('viewAll')} ({searchData.artists.total})
                            </Link> : ""
                        }
                    </div>
                }

                <div className={styles.grid_wrapper}>
                    {
                    fetchStatus.isLoading ? (
                        [1,2,3,4,5,6].map(item => (
                        <SongCard id={item} loading/>
                        ))
                    ) 
                    : CheckObjOrArrForNull(artists) ? (
                        artists?.map(artist => (
                        <div className={styles.artist} key={artist.id}>
                            <SongCard 
                                id={artist.id}
                                image={artist.imageUrl}
                                artist={artist.name}
                                artistCardStandard
                                onClick={() => {
                                    router.push(`/artist/${artist.id}${!isUndefined(artist?.slug) ? `/${artist.slug}` : ""}`)
                                    if(onLinkTouch)
                                    onLinkTouch()
                                }}
                            />
                        </div>
                        ))
                    ) : ""
                    }
                </div>
            </div>

            <div className={styles.section}>
            {
                CheckObjOrArrForNull(songs) && 
                <div className={styles.header}>
                <div>Songs</div>
                {
                    searchData.songs.total > 6 ? 
                    <Link href={`/search?type=songs&mask=${mask}`} onClick={() => onLinkTouch && onLinkTouch()}>
                        {t('viewAll')} ({searchData.songs.total})
                    </Link> : ""
                }
            </div>
            }

            <div className={styles.grid_list_wrapper}>
                {
                fetchStatus.isLoading ? (
                    loadingElement
                ) : CheckObjOrArrForNull(songs) ? (
                        songs?.map(song => (
                        <Link href={`/song/${song.id}${!isUndefined(song?.slug) ? `/${song.slug}` : ""}`} className={styles.media} key={song.id} onClick={() => onLinkTouch && onLinkTouch()}>
                            <Image src={song.cover_art_url ? song.cover_art_url : ""} alt='image' width='400' height='400' className={styles.cover_image}/>
                            <div className={styles.cover_content}>
                            <p>{song.name}</p>
                            <p>{song.artist}</p>
                            </div>
                        </Link>
                        ))
                    ) : ""
                }
            </div>
            </div>
        

            <div className={styles.section}>
                {
                    CheckObjOrArrForNull(videos) && 
                    <div className={styles.header}>
                        <div>Videos</div>
                        {
                            searchData.videos.total > 6 ? 
                            <Link href={`/search?type=videos&mask=${mask}`} onClick={() => onLinkTouch && onLinkTouch()}>
                                {t('viewAll')} ({searchData.videos.total})
                            </Link> : ""
                        }
                    </div>
                }

                <div className={styles.grid_list_wrapper}>
                    {
                    fetchStatus.isLoading ? (loadingElement) : 
                    CheckObjOrArrForNull(videos) ? (
                        videos?.map(video => (
                        <Link href={`/videoplay/${video.id}${!isUndefined(video?.slug) ? `/${video.slug}` : ""}`} className={styles.media} key={video.id} onClick={() => onLinkTouch && onLinkTouch()}>
                            <Image src={video.coverUrl ? video.coverUrl : ""} alt='image' width='400' height='400' className={styles.cover_image}/>
                            <div className={styles.cover_content}>
                            <p>{video.name}</p>
                            </div>
                        </Link>
                        ))
                    ) : ""
                    }
                </div>
            </div>

            <div className={styles.section}>
                {
                    CheckObjOrArrForNull(playlists) && 
                    <div className={styles.header}>
                        <div>Playlists</div>
                        {
                            searchData.playlists.total > 6 ? 
                            <Link href={`/search?type=playlists&mask=${mask}`} onClick={() => onLinkTouch && onLinkTouch()}>
                                {t('viewAll')} ({searchData.playlists.total})
                            </Link> : ""
                        }
                    </div>
                }

                <div className={styles.grid_list_wrapper}>
                    {
                    fetchStatus.isLoading ? (loadingElement) : 
                    CheckObjOrArrForNull(playlists) ? (
                        playlists?.map(playlist => (
                        <Link href={`/playlist/${playlist.id}${!isUndefined(playlist?.slug) ? `/${playlist.slug}` : ""}`} className={styles.media} key={playlist.id} onClick={() => onLinkTouch && onLinkTouch()}>
                            <Image src={playlist.imageUrl ? playlist.imageUrl : ""} alt='image' width='400' height='400' className={styles.cover_image}/>
                            <div className={styles.cover_content}>
                            <p>{playlist.name}</p>
                            </div>
                        </Link>
                        ))
                    ) : ""
                    }
                </div>
            </div>

        </>
    )
}

export default SongSearch
