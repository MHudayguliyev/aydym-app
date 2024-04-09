'use client'
import React, { useEffect, useState, ReactNode } from 'react'
//utils
import { CheckObjOrArrForNull, isUndefined, parse, stringify, uuidv4 } from '@utils/helpers'
import { getFromStorage, setToStorage } from '@utils/storage'
//api
import { GetAppSettings, GetSettingsChanged } from '@api/Queries/Getters'
//types
import AppSettings from '@api/Types/queryReturnTypes/AppSettings'
//typed redux hooks
import { useAppSelector } from '../hooks/redux_hooks'

function replaceAudioBanners(banners: AppSettings['audioBanners']) {
    const audioBannersStr = 'audioBanners'
    const currentBanners = parse(getFromStorage(audioBannersStr))
    
    if(!isUndefined(currentBanners) && CheckObjOrArrForNull(currentBanners)){
        const resultArr: AppSettings['audioBanners'] = []
        for(let i = 0; i < banners.length; i++){
            const banner = banners[i]
            const storageBanner = currentBanners[i]
            if(banner.id === storageBanner.id){
                banner.s = storageBanner.s
                resultArr.push({...banner})
            }else {
                banner.s = 0
                resultArr.push({...banner})
            }
        }

        console.log('resilt arr', resultArr)
        setToStorage(audioBannersStr, stringify(resultArr))
    }else {
        for(let i = 0; i < banners.length; i++){
            banners[i].s = 0
        }
        console.log('banners', banners)
        setToStorage(audioBannersStr, stringify(banners))
    }
}

const SettingsChangedMiddleware = ({children}: {children: ReactNode}) => {
    const isPremium = useAppSelector(state => state.profileReducer.isPremium)
    const [settingsChangedState, setSettingsChangedState] = useState<boolean>(false)

    let uid = getFromStorage('u_id')
    const settingsChangedStr = 'settingsChanged'
    const settingsLastChangedStr = 'settingsLastChanged'
    const settingsLastChangedTimeStr = 'settingsLastChangedTime'
    
    async function updateSettingsChanged(){
        
        if(!isUndefined(uid)){
            const storageSettingsChanged = parse(getFromStorage(settingsChangedStr)) as boolean
            let settingsChanged = false

            if(isUndefined(storageSettingsChanged)){
                settingsChanged = true
                setToStorage(settingsChangedStr, stringify(settingsChanged))
            }else settingsChanged = storageSettingsChanged
            setSettingsChangedState(settingsChanged) // NOTE: do this to go to 2nd step
            console.log('settingsChanged', settingsChanged)

            if(!settingsChanged){
                const lastChangedTime = getFromStorage(settingsLastChangedTimeStr)
                const numberOfMilliseconds = (new Date()).getTime();
                if(isUndefined(lastChangedTime)){
                    try {
                        const response = await GetSettingsChanged(uid as string, getFromStorage(settingsLastChangedStr))
                        console.log('response', response)
                        if(!isUndefined(response?.changed)) 
                            setToStorage(settingsChangedStr, stringify(response.changed))
                        if(!isUndefined(response?.lastChnaged))
                            setToStorage(settingsLastChangedStr, stringify(response.lastChnaged))
                        setToStorage(settingsLastChangedTimeStr, stringify(numberOfMilliseconds))
                    } catch (error) {
                        console.log('get settings change error', error)
                    }
                }
            }
        }
    }

    useEffect(() => {
        const time = 1800000 // 30min
        if(isUndefined(getFromStorage('u_id')))
        setToStorage('u_id', 'web-' + uuidv4())
        if(isUndefined(getFromStorage('currentPos')))
        setToStorage('currentPos', stringify(0))

        const timer = setInterval(updateSettingsChanged, time)    
        return () => clearInterval(timer)
    }, [])


    useEffect(() => {
        const getTemporaryId = async(uid:string) => {
            try {
                const response = await GetAppSettings(uid)
                console.log("app settings response", response)
                if(response.status){
                    setToStorage(settingsChangedStr, stringify(false))
                    setToStorage('audioFreq', stringify(response.audioFreq))
                    replaceAudioBanners(response.audioBanners)
                    setSettingsChangedState(false)
                }
            } catch (error) {   
                console.log('ERROR get app settings..',error)
            }
        }
        if(settingsChangedState){
            if(isUndefined(uid))
            uid = 'web-' + uuidv4()
            getTemporaryId(uid)
        }
    }, [settingsChangedState]);

  return <>{children}</>
}

export default SettingsChangedMiddleware