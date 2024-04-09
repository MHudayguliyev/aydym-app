import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
//styles
import styles from './StatusList.module.scss';
import classNames from 'classnames/bind';
//libs
import Divider from '../../compLibrary/Divider';
import Status from '../Status/Status';
import SongDetails from '../SongDetails/SongDetails';
//hook
import useClickOutside from '../../hooks/useOutClick';
//icons
import ListIcons from '../icons/list_icons/icon';
//utils
import { CheckObjOrArrForNull, isUndefined } from '@utils/helpers';
//redux 
import { useAppDispatch, useAppSelector } from '@hooks/redux_hooks';
import {setCurrentSong} from '@redux/reducers/MediaReducer'

interface StatusListProps {
    data: any
    detailsData?: any
}
const cn = classNames.bind(styles)
const StatusList = (props: StatusListProps) => {
    const {
        data, 
        detailsData
    } = props

    const dispatch = useAppDispatch()
    const contentRef:any = useRef(null)
    const toggleRef:any = useRef(null)
    const [show, setShow] = useClickOutside(contentRef, toggleRef, 'click')
    const [songId, setSongId] = useState<number>(-1)
    const songsData = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)


  return (
    <div className={styles.statusWrapper}>
        <div className={styles.head}>
            <span>Şu wagtky ýeri</span>
            <span>Geçen hepde</span>
            <span>Iň ýokary</span>
            <span>Näçe gün durdy</span>
        </div>

        <Divider />

        <div className={styles.songs}>
            {
                data?.map((song: any, index: number) => (
                    <div className={cn({
                        song: true, 
                        applyBg: (songsData[songIndex]?.id === song.id)
                    })} key={song.id} onClick={() => {
                        dispatch(setCurrentSong({
                            data, index, 
                            id: song?.id
                        }))
                    }}>

                        <div className={styles.currentPosition}>
                            <Image src={song.cover_art_url} alt='song_img' width='400' height='400'/>
                            <span className={styles.index}>{index + 1}</span>
                            <Status statusType={
                                !isUndefined(song?.sortOrder) ? (
                                    song.sortOrder > song.preDateOrder ? 'down' : 
                                    song.sortOrder < song.preDateOrder ? 'up' : "equal"
                                ) : "equal"
                            }/>

                            <div className={styles.songContent}>
                                <p className={styles.songName}>
                                    <Link href={`/song/${song.id}/${song.slug}`} onClick={e => e.stopPropagation()}>
                                        {song.name}
                                    </Link>
                                </p>
                                <p className={styles.artist}>
                                    <Link href={`/artist/${song.artistId}`} onClick={e => e.stopPropagation()}>
                                        {song.artist}
                                    </Link>
                                </p>
                            </div>
                        </div>

                        <div className={styles.lastWeek}>{song.preDateOrder}</div>
                        <div className={styles.topNotch}>{song.peekPos}</div>
                        <div className={styles.presentFrom}>{song.daysOnChart}</div>

                        <div className={styles.list_option}>
                            <div className={styles.duration}>{song.duration}</div>
                            <ListIcons 
                                iType='more'
                                ref={toggleRef}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSongId(song.id)
                                    if(songId === song.id)
                                    setShow(!show)
                                    else setShow(true)
                                }}
                            />
                        </div>
                        {
                            CheckObjOrArrForNull(detailsData) && (
                                <SongDetails 
                                    ref={contentRef}
                                    data={detailsData}
                                    id={song.id}
                                    open={show && songId === song.id}
                                    style={{inset: '-10px 25px auto auto'}}

                                />
                            )
                        }
                    </div>
                ))
            }           
        </div>

    </div>
  )
}

export default StatusList
