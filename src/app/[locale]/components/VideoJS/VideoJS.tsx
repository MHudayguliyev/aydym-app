// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-ima/src/css/videojs.ima.css'
import './VideoJS.styles.scss'
import { useRouter } from 'next/navigation';
// videojs plugins
import 'videojs-contrib-quality-levels';
import hlsQualitySelector from "videojs-hls-quality-selector";
import 'videojs-ima';
import 'videojs-contrib-ads';
//types
import Player from 'video.js/dist/types/player';
//redux
import { setIsSongPlaying } from '@redux/reducers/MediaReducer';
import { useDispatch } from 'react-redux';
import { CheckObjOrArrForNull, getMillis, getVideoStatistics, isUndefined, stringify, parse } from '@utils/helpers';
import { useAppSelector } from '@hooks/redux_hooks';
import { setToStorage } from '../../utils/storage';

interface Props {
  videoOptions: any
  videoId?: number;
  /**@default false */
  onReady?: (player: Player) => void
  onClick?: () => void
  fetchStatuses: {
    isLoading: boolean,
    isError: boolean
  }
}

const VideoJS = (props:Props) => {

  const videoRef = useRef<any>(null);
  const playerRef = useRef<Player | any>(null);

  const dispatch = useDispatch();
  const isPremium = useAppSelector(state => state.profileReducer.isPremium)
  
  // console.log('isPremium', isPremium)

  const route = useRouter();

  const {
    videoOptions, 
    videoId,  
    onReady, 
    onClick, 
    fetchStatuses 
  } = props;
  
  // states 
  const [currentVideoPlayedTimes, setCurrentVideoPlayedTimes] = useState<number[]>([])
  // const [currentSongPlayedTimes, setCurrentSongPlayedTimes] = useState<CurrentSongPlayedData>({
  //   ids: [], times: []
  // })
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [statSaved, setStatSaved] = useState(false);

  useEffect(() => {
    if (!playerRef.current && !fetchStatuses.isLoading) {
      
      // created video-js element and append it our videoRef element
      const videoElement = document.createElement('video-js');
      videoRef.current.appendChild(videoElement);

      // created videojs
      const player = playerRef.current = videojs(videoElement, videoOptions, () => {
        onReady && onReady(player);
      });
      videojs.registerPlugin("hlsQualitySelector", hlsQualitySelector);
      
      player.hlsQualitySelector({
        displayCurrentQuality: true,
        vjsIconClass: 'vjs-icon-hd',
      });
    
      player.on('ready', () => {
        
        let adType = 'NON_LINEAR_ADS';
        if (localStorage.watchedTime == null || (new Date() - Number(localStorage.watchedTime))/1000/60 > 15 ) {
          adType = 'LINEAR_ADS'
        }

        const imaOptions = {
          id: 'video-js',
          adLabel: 'Mahabat',
          adsRenderingSettings: {
            useStyledNonLinearAds: true,
            playAdsAfterTime: 15
          },
          adTagUrl: 'https://aydym.com/api/v1/videoAdv/vast?devId=' + localStorage.u_id + '&adType=' + adType + '&appType=web&videoId=' + videoId,
          adsManagerLoadedCallback: function () {
            player.ima.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, function () {
              console.log('ALL_ADS_COMPLETED');
              if (adType === 'LINEAR_ADS') {
                localStorage.setItem('watchedTime', new Date().getTime().toFixed());
              }
            });
          }
        };
  
        if(!isPremium){
          player.ima(imaOptions)
        }
      })
      
      player.on('play', () => {
        dispatch(setIsSongPlaying(false))
      })
      
      player.on('ended', () => {
        route.push(`/videoplay/8033`)
      })

      // get big play button
      player.getChild('BigPlayButton')
      player.on('click', () => {
        onClick && onClick()
      })
      
      // added class for giving my own styles to videoplayer
      player.addClass('vjs-matrix') 

      // added for videoplayer bottom background shadow
      player.addChild('Component', {className: 'vjs-background-bar'}) 
      player.addChild('Component', {className: 'vjs-bacground'})
      
      // added for adding settings to videoplayer's control bar
      // const menuButton = player.controlBar?.addChild('ClickableComponent', {
      //   className: 'vjs-icon-cog',
      //   controlText: 'Settings',
      // });

      // insert settings button before picture in picture button
      // player.controlBar.el().insertBefore(
      //   menuButton.el(),
      //   player.controlBar.getChild('pictureInPictureToggle').el()
      // )

      // for control videoplayer using keyboard
      player.on("keydown", (e) => {
        const playerVolume = player.volume();
        const playerCurrentTime = player.currentTime();
        switch (e.code) {
          case "Space":
            if (player.paused()) {
              player.play();
            } else {
              player.pause();
            }
            break;
          case "ArrowRight":
            player.currentTime(playerCurrentTime + 10);
            break;
          case "ArrowLeft":
            player.currentTime(playerCurrentTime - 10);
            break;
          case "ArrowUp":
            player.volume(playerVolume + 0.1);
            break;
          case "ArrowDown":
            player.volume(playerVolume - 0.1);
            break;
          case "KeyM":
            player.volume(0);
            break;
          default:
            return;
        }
      });

      player.on('timeupdate', () => {
        setTimeProgress(player.currentTime())
        setDuration(player.duration())
      });
    }
   
    // clean after ends
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    }
  }, [ videoOptions, route, isPremium, onReady]);

  useEffect(() => {
   
    const percentagePlayed = Math.ceil((timeProgress / duration) * 100)
    const numberExist = currentVideoPlayedTimes.some(number => number === percentagePlayed)

    if( !isNaN(percentagePlayed) && !numberExist && !statSaved){
      setCurrentVideoPlayedTimes(prev => [...prev, percentagePlayed])
      // console.log('currentVideoPlayedTimes',currentVideoPlayedTimes)
    }
    
    if(!statSaved){
      putVideoListenStat(videoId, currentVideoPlayedTimes.length, () => {
        setStatSaved(true)
      })
    }
    
  }, [duration, timeProgress, currentVideoPlayedTimes])

  useEffect(() => {
    console.log('statSaved', statSaved)
  }, [statSaved])

  // useEffect(() => {
   
  //   if(!isNaN(timeProgress) && !isNaN(duration)){
  //     const percentagePlayed = Math.ceil((timeProgress / duration) * 100)
    
  //     const numberExist = currentSongPlayedTimes.times?.some(number => number === percentagePlayed)
  //     if(!isNaN(percentagePlayed) && !numberExist){
  //       setCurrentSongPlayedTimes({
  //         // @ts-ignore
  //         times:[...currentSongPlayedTimes.times, percentagePlayed], 
  //         ids: [...currentSongPlayedTimes?.ids ?? []]
  //       })
  //     }
  //   }
    
  // }, [timeProgress, duration])

//   useEffect(() => {
//     // @ts-ignore
//     if(currentSongPlayedTimes.times.length >= 10){
  
//       const found = currentSongPlayedTimes.ids?.some(id => id === videoId)

//       if(!found){     
//         setCurrentSongPlayedTimes({
//           ids: [videoId], 
//           times: []
//         })
//       }else setCurrentSongPlayedTimes({
//         times: [], 
//         ids: [...currentSongPlayedTimes?.ids ?? []]
//       })
//       if(!statSaved){
//         putVideoListenStat(videoId, currentSongPlayedTimes.times.length, () => {
//           setStatSaved(true)
//         })
//       }
//     }
//     console.log('currentSongPlayedTimes', currentSongPlayedTimes)
// }, [currentSongPlayedTimes])


  
 
  return (
    <>
      {fetchStatuses.isLoading ?
        <video controls/>
      :
        <div data-vjs-player className='videojs'>
          <>
              {/* <div className='quality-menu vjs-hidden'>
                <ul>
                  <li className='settings-back'>Quality</li>
                  <li>1080p<i className='vjs-hd-icon'>FullHD</i></li>
                  <li>720p<i className='vjs-hd-icon'>HD</i></li>
                  <li>480p</li>
                  <li>360p</li>
                  <li>240p</li>
                  <li>144p</li>
                  <li>Auto<i className='autores'>360p</i></li>
                </ul>
              </div> */}
              <div ref={videoRef} />
          </>
        </div> 
      }
    </>
  );
};

export default VideoJS;


function putVideoListenStat(videoId:number, listenPercentage:number, statSavedCallback: () => void) {
  if(listenPercentage > 10){
    const statObjects = getVideoStatistics()
    const existVideoTypeObject = [...statObjects].find(stat => stat.type === 'videoFile')
    
    const millis = getMillis()
    const timeObj = {}
    timeObj[millis] = []

    console.log('existVideoTypeObject', existVideoTypeObject)

    const existTimeObject = [...existVideoTypeObject!?.listens].find(time => {
      const keys = Object.keys(time)
      return  keys.some(key => parseInt(key) === millis)
    })
    
    console.log('existTimeObject', existTimeObject)

    if( isUndefined(existTimeObject)){

      const videoObj = {}
      videoObj[videoId] = {c: 1}

      timeObj[millis].push(videoObj)
      existVideoTypeObject?.listens.push(timeObj)

    }else {

      const existVideoObject = existTimeObject[millis].find(video => {
        return Object.keys(video).some(key => parseInt(key) === videoId);
      })

      console.log('existVideoObject', existVideoObject)

      if(isUndefined(existVideoObject)){

        const videoObj = {}
        videoObj[videoId] = {c: 1}

        existTimeObject[millis].push(videoObj);

      }else {

        if(CheckObjOrArrForNull(existVideoObject[videoId])){
          existVideoObject[videoId].c += 1;
        }else {
          existVideoObject[videoId] += 1;
        }

      }
    }

    setToStorage('video_stats', stringify(statObjects))

    if (statSavedCallback!==undefined && statSavedCallback!==null) {
      statSavedCallback();
    }

  }
}