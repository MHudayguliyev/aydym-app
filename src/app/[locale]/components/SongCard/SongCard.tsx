import React, { useRef, useMemo }from 'react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useRouter } from '@lang/navigation'
//styles
import classNames from 'classnames/bind'
import styles from './SongCard.module.scss'
//icons 
import play from '@app/assets/icons/play.svg'
import pause from '@app/assets/icons/pause.svg'
import heart from '@app/assets/icons/heart.svg'
import MoreI from '../icons/more/icon'
import { vipCrown } from '@app/assets/icons'
//hooks
import useClickOutside from '@app/hooks/useOutClick'
//comp
import SongDetails from '../SongDetails/SongDetails'
//types
import { DropdownType } from '@app/types'
//redux
import { useAppSelector, useAppDispatch } from '@hooks/redux_hooks'
import { copyLink, isEmpty, isUndefined } from '../../utils/helpers'
import ListIcons from '../icons/list_icons/icon'
import { setCurrentSong } from '../../redux/reducers/MediaReducer'

interface SongCardProps {
    id: number 
    image?: StaticImageData 
    name?:string
    artist?: string 
    artistId?: number 
    slug?: string 
    /** @default false */
    liked?: boolean
    /** @default false */
    defaultCard?: boolean
    /** @default true */
    free?: boolean
    /** @default false */
    artistCardStandard?: boolean
    /** @default false */
    artistCardRounded?: boolean
    /** @default false */
    videoCard?:boolean
    /** @default false */
    playlistCard?: boolean
    /** @default false */
    albumCard?: boolean
    /** @default false */
    genresCard?: boolean
    /** @default false */
    genresCardSecond?: boolean
    /** @default false */
    loading?: boolean
    /** @default true */
    onClick?: () => void
    onLinkTouch?: () => void
    onLike?: () => void
    onAddPlaylist?: () => void
}

const cn = classNames.bind(styles)
const SongCard = (props: SongCardProps) => {
    const {
        id, 
        image , 
        name, 
        artist,
        artistId,  
        slug,  
        liked = false,
        free = true,
        defaultCard = false,
        artistCardStandard = false, 
        artistCardRounded = false, 
        videoCard = false, 
        genresCard = false,
        genresCardSecond = false,
        playlistCard = false,
        albumCard = false, 
        loading = false,
        onClick, 
        onLinkTouch,
        onLike, 
        onAddPlaylist, 
    } = props

    const toggleRef:any = useRef(null)
    const contentRef:any = useRef(null)
    const [show, setShow] = useClickOutside(contentRef, toggleRef, 'click')
    const song = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)
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
    const routeToGo = useMemo(() => {
        const route = 
        `/${(artistCardRounded || artistCardStandard) ? 'artist' : videoCard ? 'videoplay' : playlistCard ? 'playlist' : albumCard ? 'album' : (genresCard || genresCardSecond) ? 'genre' : ''}/${id}${!isUndefined(slug) ? `/${slug}` : ""}`
        return route
    }, [
        id, 
        artistCardStandard, 
        artistCardRounded, 
        videoCard,
        playlistCard, 
        genresCard, 
        genresCardSecond
    ])

    const links = useMemo(() => {
        const defaultCardSongRoute = defaultCard ? `/song/${id}/${!isUndefined(slug) ? `/${slug}` : ""}` : ""
        const defaultCardArtistRoute = defaultCard ? `/artist/${artistId}/${!isUndefined(slug) ? `/${slug}` : ""}` : ""

        return (
            <div className={styles.cover_foot}>
            {
                !genresCard && !genresCardSecond && 
                <Link href={!isEmpty(defaultCardSongRoute) ? defaultCardSongRoute : routeToGo} onClick={e => e.stopPropagation()}>
                    {name}
                </Link>
            }
            {
                !videoCard  &&  
                <Link href={!isEmpty(defaultCardArtistRoute) ? defaultCardArtistRoute : routeToGo}>
                    {artist}
                </Link>
            }
        </div>
        )
    }, [
        routeToGo,
        id,  
        artistId, 
        name, 
        artist, 
        genresCard, 
        genresCardSecond, 
        videoCard, 
        defaultCard
    ])

  return (
    <>

        {
            loading ? (
                <div className={cn({
                    skeleton_wrapper: true, 
                    centerThe_container: artistCardRounded
                })}>
                    <div className={cn({
                        skeleton_image: true, 
                        artist_skeleton_image: artistCardRounded
                    })}
                    />
                    <div className={cn({
                        skeleton_footer: true, 
                        sk_footer_for_art: artistCardRounded
                    })}>
                        <span className={styles.footer_span1} />
                        <span className={styles.footer_span2} />
                    </div>
                </div>
            ) 
            : (
                <>
                    <div onClick={onLinkTouch} className={cn({
                    card_container: true, 
                    centerThe_container: artistCardRounded,
                })}
                >
                    <SongDetails 
                        ref={contentRef}
                        data={detailsData}
                        open={show}
                        id={id}
                        onClick={(e, value) => {
                            e.stopPropagation()
                            console.log('value', value)

                            if(value === 'play' && onClick)onClick()
                            else if(value === 'addToFavorites' && onLike) onLike()
                            else if(value === 'playlist' && onAddPlaylist) onAddPlaylist()
                            else if(value === 'share') {
                                const link = `https://aydym.com/${defaultCard ? 'song' : (artistCardRounded || artistCardStandard) ? 'artist' : videoCard ? 'videoplay' :albumCard ? 'album' : (genresCard || genresCardSecond) ? 'genre' : ''}/${id}${!isUndefined(slug) ? `/${slug}` : ""}`
                                copyLink(link)
                                // console.log("lnik", link)
                            }
                            setShow(false)
                        }}
                    />
                    <div onClick={onClick} className={cn({
                        cover_image: !artistCardRounded, 
                        artistCardRounded: artistCardRounded, 
                    })}
                    >
                        <Image 
                            src={image ?? ''} 
                            alt='alternative' 
                            width='400' 
                            height='400' 
                            className={styles.main_img} 
                            blurDataURL="/8.jpg"
                            placeholder="blur"
                        />
                        {videoCard && <div className={styles.playBg}></div>}
                        {videoCard && !free && <Image src={vipCrown} alt='vip' width={25} height={25} className={styles.vip}/>}
                        {
                            !artistCardRounded && !artistCardStandard && !genresCard && !genresCardSecond && !playlistCard && !albumCard && (
                                <>
                                    {
                                        !videoCard && (
                                            <Image 
                                                src={
                                                    isSongPlaying && song[songIndex]?.id === id ? pause : play
                                                } 
                                                alt='play/pause' 
                                                className={cn({
                                                    playPause: true, 
                                                    opacitatePP: song[songIndex]?.id !== id, 
                                                    ppActive: isSongPlaying && song[songIndex]?.id === id
                                                })}
                                            />
                                        )
                                    }
                                    <MoreI 
                                        color='light'
                                        orientation='vertical'
                                        ref={toggleRef}
                                        className={styles.more}
                                        onClick={e => e.stopPropagation()}
                                    />
                                    {
                                        !videoCard && (
                                            <ListIcons 
                                                liked={liked}
                                                withBgActive
                                                iType='like'
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    if(onLike) onLike()
                                                }}
                                                className={styles.heart}
                                            />
                                        )
                                    }
                               </>
                            )
                        } 
                        {
                            genresCard && (
                                <Link href=''>
                                    {name}
                                </Link>
                            )
                        }
                        {
                            genresCardSecond && (
                                <div className={styles.content}>
                                    <span className={styles.title}>{name}</span>
                                </div>
                            )
                        }
                    </div>
                    
                    {links}
                </div>
                </>
            )



            
        }
    </>
  )
}

export default SongCard
