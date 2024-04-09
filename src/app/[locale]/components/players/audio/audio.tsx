import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react'
import Image from 'next/image'
import Link from 'next/link'
//styles
import classNames from 'classnames/bind'
import styles from './audio.module.scss'
//redux 
import { useAppDispatch, useAppSelector } from '@hooks/redux_hooks'
import { togglePlaylistModal } from '@redux/reducers/TopnavbarReducer';
// hooks
import useClickOutside from '@hooks/useOutClick'
//types
import { DropdownType } from '@app/types'
//img
import leftSideImg from '@app/assets/images/8.jpg'
//icons 
import MoreI from '@components/icons/more/icon'
import SongDetails from '@components/SongDetails/SongDetails'
import RepeatI from '@components/icons/repeat/icon'
import ShuffleI from '@components/icons/shuffle/icon'
import SkipI from '@components/icons/skip/icon'
import PlayPauseI from '@components/icons/playpause/icon'
import PlayListI from '@components/icons/playlist/icon'
import VolumeI from '@components/icons/volume/icon'
//libs
import Input from '@compLibrary/Input'
import { checkToOpenAdv, setIsSongPlaying, setSongIndex, shuffleSongs } from '@redux/reducers/MediaReducer'
//utils
import { CheckObjOrArrForNull, findByKeyName, getMillis, getSongStatistics, isEmpty, isNull, isUndefined, parse, randomize, stringify } from '@utils/helpers'
import { getFromStorage, setToStorage } from '@utils/storage'
//relatives
import Playlist from '../../Playlist/Playlist'
import Hls from 'hls.js'
//api
import { likeSong } from '@api/Queries/Post';
//react hot toast
import toast from 'react-hot-toast';

function handleBufferProgress(e: any) {
  const audio = e.currentTarget;
  const dur = audio.duration;
  if (dur > 0) {
    for (let i = 0; i < audio.buffered.length; i++) {
      if (
        audio.buffered.start(audio.buffered.length - 1 - i) < audio.currentTime
      ) {
        const bufferedLength = audio.buffered.end(
          audio.buffered.length - 1 - i,
        );
        return bufferedLength;
      }
    }
  }
};

function formatDurationDisplay(duration: number) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);
  const formatted = [min, sec].map((n) => (n < 10 ? "0" + n : n)).join(":"); // format - mm:ss
  if(formatted === 'NaN:NaN')
    return "00:00"
  return formatted;
}


interface CurrentSongPlayedData {
  ids:number[]
  times: number[] 
}

const cn = classNames.bind(styles)
const AudioPlayer = () => {
  const dispatch = useAppDispatch()
  //references
  const audioRef:any = useRef(null)
  const progressBarRef:any = useRef(null)
  const volumeRef:any = useRef(null)
  const toggleRef:any = useRef(null)
  const dropdownRef:any = useRef(null)

  const volumeToggleRef:any = useRef(null)
  const volumeContentRef:any = useRef(null)

  const playlistToggleRef:any = useRef(null)
  const playlistContentRef: any = useRef(null)

  //STATES
  const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)
  const song = useAppSelector(state => state.mediaReducer.songData)
  const songObj = useAppSelector(state => state.mediaReducer.songObj)
  const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
  const isPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)
  const isPremium = useAppSelector(state => state.profileReducer.isPremium)
  const showAdv = useAppSelector(state => state.mediaReducer.showAdv)

  const [show, setShowDetails] = useClickOutside(dropdownRef, toggleRef, 'mousedown')
  const [showVolume, setShowVolume] = useClickOutside(volumeContentRef, volumeToggleRef, 'click')
  const [showPlaylist, setShowPlaylist] = useClickOutside(playlistContentRef, playlistToggleRef, 'click')

  const [currentSongPlayedTimes, setCurrentSongPlayedTimes] = useState<CurrentSongPlayedData>({
    ids: [], times: []
  })
  const [volume, setVolume] = useState<number>(50);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [progressPlayed, setProgressPlayed] = useState<string>('0');
  const [progressBuffered, setProgressBuffered] = useState<string>('0');
  const [isRepeat, setIsRepeat] = useState<boolean>(false)
  const [resetOnEnd, setResetOnEnd] = useState<boolean>(false)
  const [isShuffle, setIsShuffle] = useState<boolean>(false)
  const [isSongLoading, setIsSongLoading] = useState<boolean>(false)
  const [isHlsSupported, setIsHlsSupported] = useState(false);

  const songData = useMemo(() => {
    return song[songIndex]
  }, [song, songIndex])

  const putSongListenStat = useCallback(() => {
    interface SongObjType {
      [id: string]: {
        c: number
        p?:{[playlistId: string]: number}[]
        a?:{[albumId: string]: number}[]
      }
    }
    interface TempObjType {
      [id: string]: number
    }

    let songClone = {
      id: -1, 
      playlistId: -1, 
      albumId: -1
    }
    const stats = getSongStatistics()
    const existSongType = [...stats].find(stat => stat.type === 'song')
    const millis =  getMillis()
    const timeObj = {}
    // @ts-ignore
    timeObj[millis] = []

    if(CheckObjOrArrForNull(songData)) {
      songClone = {
        id: songData.id,
        playlistId: songData.playlistId, 
        albumId: songData.albumId
      }
    }else if(CheckObjOrArrForNull(songObj)){
      songClone = {
        id: songObj.id,
        playlistId: songObj.playlistId, 
        albumId: songObj.albumId
      }
    } 
    
    if(!isUndefined(songClone.id) && !isNull(songClone.id)){
      console.log('stats', stats)
      const {
        id, playlistId, albumId
      } = songClone
      console.log("songClone", songClone)
      // @ts-ignore
      const existTimeObj = findByKeyName([...existSongType?.listens], millis)
      console.log('existTimeObj songObj', existTimeObj)

         
      if(!CheckObjOrArrForNull(existTimeObj)){ 
        const songObj: SongObjType = {};
        songObj[id] = {c: 1};
        
        if(!isUndefined(playlistId)){
          const pObj: TempObjType = {};
          pObj[playlistId] = 1;
          songObj[id].p = []
          songObj[id].p!.push(pObj)
        }
        if(!isUndefined(albumId)){
          const pObj: TempObjType = {};
          pObj[albumId] = 1;
          songObj[id].a =[]
          songObj[id].a!.push(pObj)
        }
        // @ts-ignore
        timeObj[millis].push(songObj);
        // @ts-ignore
        existSongType.listens.push(timeObj)
        console.log('existSongType', existSongType)
      }else {

        const existSongObj = findByKeyName([...existTimeObj[millis]], id)
        console.log('existSongObj afterwards', existSongObj)

        if(!CheckObjOrArrForNull(existSongObj)){ 
          const songObj:SongObjType = {};
          songObj[id] = {c: 1};

          if(!isUndefined(playlistId)){
            const pObj: TempObjType = {};
            pObj[playlistId] = 1;
            songObj[id].p =[]
            songObj[id].p!.push(pObj)
          }
          if(!isUndefined(albumId)){
            const pObj: TempObjType = {};
            pObj[albumId] = 1;
            songObj[id].a =[]
            songObj[id].a!.push(pObj)
          }

          existTimeObj[millis].push({...songObj})

        }else {

          if(existSongObj[id] instanceof Object){
            existSongObj[id].c += 1
            if(!isUndefined(playlistId)){
              const pObj = existSongObj[id].p;
              if(!CheckObjOrArrForNull(pObj)){
                const pObj: TempObjType = {};
                pObj[playlistId] = 1;
                existSongObj[id].p = [];
                existSongObj[id].p.push(pObj);
              }else if(pObj instanceof Array){
                const existPlObj = findByKeyName(pObj, playlistId)
                if(CheckObjOrArrForNull(existPlObj)){
                  existPlObj[playlistId] += 1;
                }else {
                  const pObj: TempObjType = {}
                  pObj[playlistId] = 1
                  existSongObj[id].p.push(pObj)
                }
              }
            }


            if(!isUndefined(albumId)){
              console.log('albumId', albumId)
              const aObj = existSongObj[id].a;
              console.log('aObj', aObj)
              if(!CheckObjOrArrForNull(aObj)){ //undefined
                const aObj: TempObjType = {};
                aObj[albumId] = 1;
                existSongObj[id].a = [];
                existSongObj[id].a.push(aObj);
              }else if(aObj instanceof Array){
                const existAObj = findByKeyName(aObj, albumId)
                console.log("existAlObj", existAObj)
                if(CheckObjOrArrForNull(existAObj)){
                  existAObj[albumId] += 1;
                }else {
                  const aObj: TempObjType = {}
                  aObj[albumId] = 1
                  existSongObj[id].a.push(aObj)
                }
              }
            }

            console.log('existSongObj last version', existSongObj)

          } else {
            existSongObj[id] += 1
          }
      }}}
    setToStorage('song_stats', stringify(stats))
  }, [songData, songObj])

  useEffect(() => {
    setProgressPlayed((timeProgress / duration).toString());
    setProgressBuffered(((isNaN(buffered / duration) ? 0 : buffered / duration)).toString());
  }, [duration, buffered, timeProgress])

  useEffect(() => {
    setCurrentSongPlayedTimes({times: [], ids: []})
    if(resetOnEnd) setResetOnEnd(false)
  }, [
    song, 
    songIndex, 
    songObj, 
    resetOnEnd
  ])

  useEffect(() => {
    if (isPlaying) {
      audioRef?.current?.play();
    } else {
      audioRef?.current?.pause();
    }
  }, [audioRef, songData, isPlaying]);

  useEffect(() => {
    if (!isUndefined(audioRef?.current)) changeAudioVolume()
  }, [volume, audioRef])
 
  useEffect(() => {
    if(show && showVolume){
      setShowVolume(false)
    }
  }, [show, showVolume])

  useEffect(() => {
    if(!isNaN(timeProgress) && !isNaN(duration)){
      const percentagePlayed = timeProgress / duration * 100
      const fixed = parseInt(percentagePlayed.toFixed(0))
      const numberExist = currentSongPlayedTimes.times?.some(number => number === fixed)
      if(!isNaN(fixed) && !numberExist){
        setCurrentSongPlayedTimes({
          // @ts-ignore
          times:[...currentSongPlayedTimes.times, fixed], 
          ids: [...currentSongPlayedTimes.ids]
        })
      }
    }
  }, [timeProgress, duration])

  useEffect(() => {
      // @ts-ignore
      if(currentSongPlayedTimes.times.length >= 20){ //20%
        const currentPos = parse(getFromStorage('currentPos'))
        const sameSongFound = currentSongPlayedTimes.ids.some(id => id === songData?.id)
  
        if(!sameSongFound){ 
          if(!isPremium){
            if(!isUndefined(currentPos) && !isNaN(currentPos)){
              console.log("currentPost", currentPos)
              setToStorage('currentPos', stringify(currentPos + 1))
            }else setToStorage('currentPos', stringify(1))
          }
          
          setCurrentSongPlayedTimes({
            ids: [songData?.id], 
            times: []
          })
          putSongListenStat()

        }else setCurrentSongPlayedTimes({
          times: [], 
          ids: [...currentSongPlayedTimes.ids]
        })
      }
  }, [currentSongPlayedTimes])

  useEffect(() => {
    if(!isUndefined(volumeRef?.current)){
      volumeRef.current?.style?.setProperty(
        '--volume-progress', 
        `${volume}%`
      );
    }
  }, [volume, isPlaying])

  useEffect(() => {
    if(showPlaylist && showVolume)
    setShowVolume(false)
    else if(showPlaylist && show)
    setShowDetails(false)
  }, [showPlaylist])
  useEffect(() => {
    if(showVolume && showPlaylist)
    setShowPlaylist(false)
  }, [showVolume])
  useEffect(() => {
    if(show && showPlaylist)
    setShowPlaylist(false)
    else if(show && showVolume)
    setShowVolume(false)
  }, [show])

  const handlePrevious = useCallback(() => {
    if(!isUndefined(audioRef?.current)){
      if (songIndex === 0) {
        const lastTrackIndex = song.length - 1;
        dispatch(setSongIndex(lastTrackIndex))
        if(!isPremium) dispatch(checkToOpenAdv())
      } else {
        dispatch(setSongIndex(songIndex - 1))
        if(!isPremium) dispatch(checkToOpenAdv())
      }
    }
  }, [
    audioRef, 
    song, 
    songIndex, 
    isPremium
  ])

  const handleNext = useCallback(() => {
    if(!isUndefined(audioRef?.current)){
      if(isRepeat){
        audioRef?.current?.play()
        if(!isPremium) {
          setResetOnEnd(true)
          dispatch(checkToOpenAdv())
        }
      }else if(isShuffle){
        if(!isEmpty(songObj?.url)){
          dispatch(setIsSongPlaying(false))
          if(!isPremium) dispatch(checkToOpenAdv())
          
        }
        else if(songIndex >= song.length - 1){
          dispatch(setSongIndex(0))
          if(!isPremium) dispatch(checkToOpenAdv())

        }else {
          dispatch(shuffleSongs(randomize(song?.length)))
          if(!isPremium) dispatch(checkToOpenAdv())

        }
      }else if(!isEmpty(songObj?.url)){
        dispatch(setIsSongPlaying(false))
        if(!isPremium) dispatch(checkToOpenAdv())

      }else if(songIndex >= song.length - 1) {
        dispatch(setSongIndex(0))
        if(!isPremium) dispatch(checkToOpenAdv())

      } else {
        dispatch(setSongIndex(songIndex + 1))
        if(!isPremium) dispatch(checkToOpenAdv())
      }
    }
  }, [
    audioRef, 
    song,
    songIndex, 
    songObj, 
    isPremium,
    isRepeat, 
    isShuffle
  ])

  const handleLoadedMetadata = useCallback(() => {
    if(!isUndefined(audioRef?.current)){
      const audio = audioRef?.current
      const seconds = audio?.duration
      progressBarRef.current.max = seconds
      setDuration(seconds)
      changeAudioVolume()
    }
  }, [audioRef, progressBarRef])

  const handleProgressChange = useCallback(() => {
    if (!isUndefined(audioRef?.current))
    audioRef.current.currentTime = progressBarRef.current.value
    setTimeProgress(progressBarRef.current.value);
  }, [audioRef, progressBarRef])

  const changeAudioVolume = useCallback(() => {
    audioRef.current.volume = volume / 100
  }, [audioRef, volume])

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

  return (
    <>
      {
        !isUndefined(songData?.url) || !isEmpty(songObj?.url) ? (
          <div className={cn({
            player: true, 
            sidebarFolded: sidebarFolded
          })}>
            <div className={styles.wrapper}>
              {
                <audio 
                  ref={audioRef}
                  src={songData?.url ?? songObj?.url}
                  preload="metadata"
                  onLoadStart={() => setIsSongLoading(true)}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={e => {
                    setTimeProgress(e.currentTarget.currentTime);
                    setBuffered(handleBufferProgress(e))
                  }}
                  onProgress={e => setBuffered(handleBufferProgress(e))}
                  onEnded={() =>handleNext()}
                  onCanPlay={(e) => {
                    setIsSongLoading(false);
                  }}
                /> 
              }
    
              <div className={styles.progress_wrapper}>
                <Input 
                  ref={progressBarRef}
                  type='range'
                  removeTheForm
                  value={timeProgress}
                  onChange={handleProgressChange}
                  className={styles.progress_range}
                />
                <progress className={styles.buffered_progress} value={progressBuffered}></progress>
                <progress className={styles.song_played_progress} value={progressPlayed}></progress>
              </div>
    
              <div className={styles.theLeft}>
                <div className={styles.cover_image}>
                  <Image 
                    src={
                      songData?.cover_art_url ? 
                        songData?.cover_art_url : 
                      songData?.imageUrl ? 
                        songData?.imageUrl : 
                      songObj?.cover_art_url ? 
                        songObj?.cover_art_url : 
                      songObj?.imageUrl ?  
                        songObj?.imageUrl : leftSideImg
                    } 
                    alt='left side image'
                    width='400'
                    height='400'
                  />
                </div>
    
                <div className={styles.cover_content}>
                  <Link href={`${songData ? `/song/${songData.id}/${songData?.slug}` : "/"}`}>{songData ? songData?.name : !isEmpty(songObj?.name) ? songObj?.name : "Adym.com"}</Link>
                  <Link href={`/artist/${songData?.artistId}`}>{songData ? songData?.artist : !isEmpty(songObj?.artist) ? songObj?.artist : "Adym.com"}</Link>
                </div>
              </div>
    
              <div className={styles.playerControl}>
                <RepeatI 
                  active={isRepeat}
                  onClick={() => setIsRepeat(!isRepeat)} 
                  className={styles.repeatI}
                />
                <SkipI 
                  direction='back' 
                  onClick={handlePrevious}
                  style={{
                    pointerEvents: songObj?.url ? 'none' : 'auto' 
                  }}
                />
                <PlayPauseI 
                  status={{
                    isLoading: isSongLoading, isPlaying
                  }}
                  onClick={() => {
                    if(!showAdv) 
                    dispatch(setIsSongPlaying(!isPlaying))
                  }}
                /> 
                <SkipI 
                  direction='forward' 
                  onClick={() => {
                    if(songIndex >= song.length - 1) dispatch(setSongIndex(0))
                    else dispatch(setSongIndex(songIndex + 1))
                    handleNext()
                  }}
                  style={{
                    pointerEvents: !isEmpty(songObj?.url) ? 'none' : 'auto' 
                  }}
                />
                <ShuffleI 
                  active={isShuffle}
                  onClick={() => setIsShuffle(!isShuffle)} 
                  className={styles.shuffleI}
                />
              </div>
    
              <div className={styles.theRight}>
    
                <div className={styles.duration}>
                  <span className={styles.current_minutes}>{formatDurationDisplay(timeProgress)}  / </span>
                  <span className={styles.current_seconds}>
                    {
                      songData ? songData?.duration : 
                      songObj?.duration ? songObj?.duration : "00:00"
                    }
                  </span>  
                </div>
    
                <div className={styles.volume_wrapper}>
                  <VolumeI 
                    volume={
                      volume >= 70 ? 'up' : 
                      volume > 0 ? 'down' : 'mute'
                    }
                    className={styles.volumeI}
                    ref={volumeToggleRef}
                  />
    
                  <div ref={volumeContentRef} className={cn({
                    vol_dropdown_menu: true, 
                    open: showVolume
                  })}>
                    <Input 
                      type='range'
                      removeTheForm
                      ref={volumeRef}
                      step={0.05}
                      max={100}
                      value={volume}
                      onChange={(e) => {
                        setVolume(e.currentTarget.valueAsNumber)
                      }}
                    />
                  </div>
                </div>
    
    
                <MoreI
                  ref={toggleRef}
                  color='theme' 
                  orientation='vertical' 
                  className={styles.moreI}
                />
                <PlayListI 
                  ref={playlistToggleRef}
                  onClick={() => setShowPlaylist(!showPlaylist)}
                />
    
                <SongDetails 
                  data={detailsData}
                  id={song && songData?.id}
                  open={show}
                  ref={dropdownRef}
                  transformOrigin='bottomRight'
                  style={{
                    top: '-12rem', 
                    right: '4.3rem'
                  }}
                  onClick={async (e, value) => {
                    e.stopPropagation()
                    setShowDetails(false)
                    if(value === 'play' && !showAdv && !isUndefined(audioRef?.current)) dispatch(setIsSongPlaying(!isPlaying))
                    else if(value === 'share') "" //later 
                    else if(value === 'addToFavorites') {
                      try {
                        const response = await likeSong(songData?.id)
                        console.log('response', response)
                        if(response.status)
                        toast.success('Halanlaryma gosuldy.')
                      } catch (error) {
                        console.log("Like song error ", error)
                      }
                    }
                    else if(value === 'playlist') {
                      dispatch(togglePlaylistModal({
                        id: songData?.id, 
                        state: true
                      }))
                    }
                  }}
                />
    
                <Playlist 
                  data={song}
                  ref={playlistContentRef}
                  open={showPlaylist}
                />
              </div>
    
            </div>
    
          </div>
        ) : ""
      }
    </>
  )
}

export default AudioPlayer