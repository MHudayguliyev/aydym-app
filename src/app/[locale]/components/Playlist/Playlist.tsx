import React, {useState, useEffect} from 'react'
import { Link } from '@lang/navigation';
//styles
import classNames from 'classnames/bind';
import styles from './Playlist.module.scss';
//types 
import SongsType from '@api/Types/queryReturnTypes/Songs'
//comps 
import SongList from '../SongList/SongList';
//redux
import { useAppDispatch } from '@hooks/redux_hooks';
import { setCurrentSong } from '@redux/reducers/MediaReducer';

interface PlaylistProps {
    data: SongsType['data']
    open: boolean
}

const cn = classNames.bind(styles)
const Playlist = React.forwardRef<HTMLDivElement,PlaylistProps>((props, ref): JSX.Element => {
    const dispatch = useAppDispatch()

    const {
        data, 
        open
    } = props

    return (
        <div className={cn({
            wrapper: true,  
        })} ref={ref}>
            <div className={cn({
                playlist_menu: true, 
                open: open
            })}>

                <div className={styles.header}>
                    <h6>Next Lineup</h6>
                    <Link href=''>Clear</Link>
                </div>

                <div className={styles.playlist}>
                    <SongList 
                        data={data}
                        onLike={(song) => {}}
                        onPlay={index => dispatch(setCurrentSong({
                            data: data, index, 
                            id: data[index]?.id
                        }))}
                        hideDuration
                        isPlaylist
                        fetchStatuses={{
                            isLoading: false, 
                            isError: false
                        }}
                    />
                </div>

            </div>
        </div>
      )
}) 

export default Playlist
