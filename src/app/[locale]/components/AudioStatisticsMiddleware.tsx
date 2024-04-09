'use client'
import React, {useEffect} from 'react'
//utils
import { getAudioAdvStatistics, getBannerAdvStatistics, isUndefined, stringify, uuidv4 } from '@utils/helpers'
import { getFromStorage, removeFromStorage } from '@utils/storage'
//api
import { postAudioStats } from '@api/Queries/Post'

const StatisticsMiddleware = ({children}: {children: React.ReactNode}) => {

    const saveAudioAdvStats = async () => {
        let uid:string = getFromStorage('u_id')
        if(!isUndefined(uid))
        uid = 'web-' + uuidv4()
        try {
            const response = await postAudioStats(stringify({
                appType: 'web', 
                devId: uid, 
                stats: getAudioAdvStatistics()
            }))       
            console.log('audio avd response', response)   
            if(response.status) removeFromStorage('audio_adv_stats')
        } catch (error) {
            console.log('error', error)
        }

    }

    const saveBannerStats = async () => {
        let uid:string = getFromStorage('u_id')
        if(!isUndefined(uid))
        uid = 'web-' + uuidv4()

        try {
            const response = await postAudioStats(stringify({
                appType: 'web', 
                devId: uid, 
                stats: getBannerAdvStatistics()
            }))       
            console.log('banner response', response)   
            if(response.status) removeFromStorage('banner_adv_stats')
        } catch (error) {
            console.log('error', error)
        }
    }

    useEffect(() => {
        const time = 300000 //5min
        const timer = setInterval(async () => {
            await saveAudioAdvStats()
            await saveBannerStats()
        }, time)
        return () => clearInterval(timer)
    }, []) 

    return <>{children}</>
}

export default StatisticsMiddleware
