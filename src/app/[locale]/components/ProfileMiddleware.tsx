'use client'
import React, {useEffect} from 'react'
import { useLocale } from 'next-intl'
import { useQuery } from 'react-query'
//api
import { GetPremiumData } from '@api/Queries/Getters'
//redux
import { useAppDispatch } from '@hooks/redux_hooks'
import { setProfile } from '@redux/reducers/ProfileReducer'

const ProfileMiddleware = ({children}: {children: React.ReactNode}) => {
    const dispatch = useAppDispatch()
    const locale = useLocale()
    const {
        data, 
        isLoading, 
        isError
    } = useQuery('premiumData', () => GetPremiumData(locale), {
        enabled: !!locale
    })

    useEffect(() => {
        if(!isLoading && !isError){
            if(data?.profileType === 'PREMIUM')
            dispatch(setProfile(true))
        }
    }, [data])

    return <>{children}</>
}

export default ProfileMiddleware
