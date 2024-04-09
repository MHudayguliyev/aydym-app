import { AudioAdvStatistics } from "../../types";
import { ConfirmReturnType } from "../Types/queryReturnTypes/ConfirmReturnType";
import { RegisterReturnRype } from "../Types/queryReturnTypes/RegisterReturnType";
import { api } from "../service/api_helper";

interface MakePremiumReturnTypes {
    redirectUrl: string
    status: boolean
    text:string
    startingDate:string 
    endingDate:string 
}
export const registerUser = async (data: any): Promise<RegisterReturnRype> => {
    return api.post({
        url: '/profile/register',
        data
    })
}
export const confirmUser = async (data:any): Promise<ConfirmReturnType> => {
    return api.post({
        url: '/profile/confirm',
        data
    })
}
export const likeSong = async(id: number): Promise<{status: boolean}> => {
    return api.postPrivate({
        url:  `/liked/song/add/${id}`, data: {}
    })
}
export const likeDislike = async (id: number, apiPrefix: 'add' | 'remove'): Promise<{status: boolean}> => {
    return api.postPrivate({
        url: `/liked/song/${apiPrefix}/${id}`, data: {}
    })
}
export const likePlaylist = async (playlistId: number): Promise<{status: boolean}> => {
    return api.postPrivate({
        url: `/liked/playlist/add/${playlistId}`, 
        data: {}
    })
} 
export const addToPlaylist = async (data: {
    id: number
    [key: string]: any
    type: 'SONG'
}): Promise<{status: boolean}> => {
    return api.postPrivate({
        url: '/userPlaylist/songs/add', data
    })
}
export const renamePlaylist = async (playtlistId: number, data: {name: string}): Promise<{status: boolean}> => {
    return api.putPrivate({
        url: `/userPlaylist/${playtlistId}`, data
    })
}
export const likeOrDislikeVideo = async (id: number, type: 'LIKE' | 'DISLIKE'): Promise<{status: boolean}> => {
    return api.postPrivate({
        url: `/video/likeOrDislike/${id}`, 
        data: { type }
    })
}
export const faveVideo = async (id: number, apiPrefix: 'add' | 'remove'): Promise<{status: boolean}> => {
    return api.postPrivate({
        url: `/video/favorites/${apiPrefix}/${id}`, 
        data: {}
    })
}
export const makePremium = async (premiumType: string): Promise<MakePremiumReturnTypes> => {
    return api.postPrivate({
        url: `/profile/makePremium?appType=web&devId=*&accountType=${premiumType}`,
        data:  {}
    })
}
export const postAudioStats = async (data: string, isAdv = true): Promise<{status: boolean}> => {
    return api.postPrivate({
        url: `/app${isAdv ? '/adv' : ""}/stat`, 
        data, changeUrl: true
    })
}
export const postVideoStats = async (data: string): Promise<{status: boolean}> => {
    return api.postPrivate({
        url: `/app/video/stat`, 
        data, changeUrl: true
    })
}
export const sendActivationCode = async (data: {
    code: string
}): Promise<{
    status: boolean
    profileType: 'PREMIUM'
    startingDate: string 
    endingDate: string 
}>  => {
    return api.postPrivate({
        url: '/activationCode/activate', data
    })
}