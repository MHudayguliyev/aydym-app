/* eslint-disable react/display-name */
import React, {  useState, useRef } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from "next/navigation";
//styles
import classNames from 'classnames/bind';
import styles from './SongList.module.scss';
//redux 
import { useAppDispatch, useAppSelector } from '@hooks/redux_hooks';
import { setCurrentSong } from '@redux/reducers/MediaReducer'
//types
import SongsType from '@api/Types/queryReturnTypes/Songs'
import SongType from '@api/Types/queryReturnTypes/Song'
import { DropdownType } from '../../types';
import VideosType from '@api/Types/queryReturnTypes/Videos';
//icons 
import play from '@app/assets/icons/play.svg'
import pause from '@app/assets/icons/pause.svg'
import ListIcons from '../icons/list_icons/icon';
import musicI from '@app/assets/icons/music.svg';
//comps
import SongDetails from '../SongDetails/SongDetails';
//hooks
import useClickOutside from '@hooks/useOutClick';
//utils
import { CheckObjOrArrForNull, copyLink, isUndefined } from '@utils/helpers';
//libs 
import Preloader from '@compLibrary/Preloader';

interface SongListProps {
    data: SongsType['data'] | VideosType['data'] | any
    fetchStatuses: {
        isLoading: boolean
        isError: boolean
    }
    detailsData?: DropdownType
    /** @defaultValue false */
    hideDuration?: boolean
    /** @defaultValue false */
    video?: boolean
    /** @defaultValue false */
    isPlaylist?: boolean
    onLike?: (song: SongType) => void
    onPlay: (index: number) =>  void
    onRemove?: (song: SongType) => void
    onAddToPlaylist?: (song: SongType) => void
    goInfo?: (song: SongType) => void
    onLinkTouch?: () => void
}

const cn = classNames.bind(styles)
const SongList = React.forwardRef<HTMLDivElement, SongListProps>((props, ref): JSX.Element => {
    const {
        data, 
        fetchStatuses, 
        detailsData, 
        hideDuration = false,
        video= false, 
        isPlaylist = false, 
        onLike, 
        onPlay, 
        onRemove,
        onAddToPlaylist, 
        goInfo,
        onLinkTouch
    } = props
    
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    
    const listRef:any = useRef(null)
    const contentRef:any = useRef(null)
    const toggleRef:any = useRef(null)
    const [show, setShow] = useClickOutside(contentRef, toggleRef, 'click')
    const [songId, setSongId] = useState<number>(-1)
    //states
    const songsData = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)

    return (
        <div className={styles.section} ref={ref}>
            <div className={styles.custom_list}>
                {
                    fetchStatuses.isLoading  ? 
                    <span className={styles.loader}>
                        <Preloader size='md'/>
                    </span> : 
                    fetchStatuses.isError || !CheckObjOrArrForNull(data) ? (
                        <div className={styles.notFound_wrapper}>
                            <Image src={musicI} alt='musicI'/>
                            <p>
                                No songs, album or playlist found.
                            </p>
                        </div>
                    ) : (
                        data?.map((song:any, i:number) => {
                            return (
                                <div 
                                    ref={listRef} 
                                    key={song.id} 
                                    onClick={() => {
                                        onPlay(i)
                                        if(show) setShow(false)
                                    }}
                                    itemScope
                                    itemType="http://schema.org/MusicRecording"
                                    itemProp="track"
                                >

                                    <meta content={song.name} itemProp='name'/>
                                    <meta content={song.artist} itemProp='byArtist'/>

                                    <div className={cn({
                                        custom_list_item: true, 
                                        applyBg: (songsData[songIndex]?.id === song.id)
                                    })}>
            
                                    <div className={styles.list_cover}>
                                        {!video &&
                                            <Image 
                                            src={
                                                isPlaying && songsData[songIndex]?.id === song.id ? pause : play
                                            } 
                                            alt='play/pause' 
                                            className={cn({
                                                playPause: true, 
                                                playing: (songsData[songIndex]?.id == song.id), 
                                                notPlaying: (songsData[songIndex]?.id !== song.id),
                                            })}
                                            />
                                        }
                                        <Image itemType='image' src={song.cover_art_url ? song.cover_art_url : song.coverUrl} alt='song' width='400' height='400'/>
                                    </div>
            
                                    <div className={cn({
                                        list_content: true, 
                                        playlist_content: isPlaylist
                                    })}>
                                        <p className={styles.songName} itemProp='name'>
                                            <Link 
                                                title={song.name}
                                                href={`/${video ? 'videoplay' : 'song'}/${song.id}${!isUndefined(song?.slug) ? `/${song.slug}` : ''}`} 
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    if(onLinkTouch)
                                                    onLinkTouch()
                                                }} 
                                                itemProp='url'
                                            >
                                                {song.name}
                                            </Link>
                                        </p>
                                        <p className={styles.artistName} itemProp='byArtist'>
                                            <Link
                                                title={song.artist}
                                                href={`/artist/${song.artistId}${!isUndefined(song?.slug) ? `/${song.slug}` : ''}`} 
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    if(onLinkTouch)
                                                    onLinkTouch()
                                                }}
                                                itemProp='url'
                                            >
                                                {song.artist}
                                            </Link>
                                        </p>
                                    </div>
            
                                    <div className={styles.list_option}>
                                        {!video  &&
                                            <ListIcons 
                                                iType='like' 
                                                liked={song.favorite}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if(onLike)
                                                    onLike(song)
                                                }}
                                            />
                                        }
                                        {
                                            !hideDuration && <span>{song.duration}</span>
                                        }
                                        {
                                            CheckObjOrArrForNull(detailsData) && (
                                                <ListIcons 
                                                    iType='more' 
                                                    onClick={(e) => 
                                                    {
                                                        e.stopPropagation()
                                                        setSongId(song.id)
                                                        if(songId === song.id)
                                                            setShow(!show)
                                                        else setShow(true)
                                                    }
                                                    } 
                                                    ref={toggleRef}
                                                />
                                            )
                                        }
                                    </div>
            
                                    </div>
                                    
                                    {
                                        CheckObjOrArrForNull(detailsData) && (
            
                                             <SongDetails 
                                                ref={contentRef}
                                                data={detailsData!}
                                                id={song.id}
                                                open={show && songId === song.id}
                                                style={{inset: '-40px 45px auto auto'}}
                                                onClick={(e, value) => {
                                                    e.stopPropagation()
                                                    if(value === 'play')
                                                    dispatch(setCurrentSong({
                                                        id: song.id, data, 
                                                        index: i
                                                    }))
                                                    else if(value === 'remove' && onRemove) onRemove(song)
                                                    else if(value === 'info' && goInfo) goInfo(song)
                                                    else if(value === 'playlist' && onAddToPlaylist) onAddToPlaylist(song)
                                                    else if(value === 'addToFavorites' && onLike) onLike(song);
                                                    else if(value === 'share') copyLink(`https://aydym.com${pathname}`)
                                                    setShow(false)
                                                }}
                                            />
                                        )
                                    }
                                </div>
                            )
                        }) 
                    )
                }
            </div>
        </div>
    )
    
})

export default SongList


