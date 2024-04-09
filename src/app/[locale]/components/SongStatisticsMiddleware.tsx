'use client'
import React, {useEffect} from 'react'
import { postAudioStats } from '@api/Queries/Post'
import { getSongStatistics, isUndefined, stringify, uuidv4 } from '@utils/helpers'
import { getFromStorage, removeFromStorage } from '@utils/storage'

const SongStatisticsMiddleware = ({children}: {children: React.ReactNode}) => {
  useEffect(() => {
    const time = 1200000 //20min
    const timer = setInterval(async () => {
      let uid:string = getFromStorage('u_id')
      if(!isUndefined(uid))
      uid = 'web-' + uuidv4()
      try {
        const response = await postAudioStats(stringify({
          appType: 'web', 
          devId: uid, 
          stats: getSongStatistics()
        }), false)
        console.log('post songs response', response)
        if(response.status) removeFromStorage('song_stats')
      } catch (error) {
        console.log('POST song stats error..',error)
      }
    }, time)

    return () => clearInterval(timer)
  }, [])

  return (<>{children}</>)
}

export default SongStatisticsMiddleware
