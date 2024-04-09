'use client'
import React, { ReactNode, useEffect } from 'react'
// utils
import { getVideoStatistics, isUndefined, stringify, uuidv4} from '@utils/helpers'
import { getFromStorage, removeFromStorage } from '@utils/storage'
// api
import { postVideoStats } from '@api/Queries/Post'

const VideoStatisticsProvider = ({children}: {children: ReactNode}) => {

    const saveVideoStats = async () => {
        let uid = getFromStorage('u_id')
        if(!isUndefined(uid))
        uid = 'web-' + uuidv4()

        try {
            const response = await postVideoStats(stringify({
                appType: 'web',
                devId: uid,
                stats: getVideoStatistics()
            }))
            console.log('response:', response)
            if(response.status) removeFromStorage('video_stats')
        }catch(error){
            console.log('error: ', error)
        }
    }
  
    useEffect(() => {
        const time = 600000 // 10min
        const timer = setInterval(saveVideoStats, time)
        return () => clearInterval(timer)
    },[])
  
    return <>{children}</>
}

export default VideoStatisticsProvider