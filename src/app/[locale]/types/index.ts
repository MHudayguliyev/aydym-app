import { StaticImageData } from "next/image"

export type SidebarIconTypes = "home" | "music" | "video" | "genre" | "liked" | "tag" | "artist"
export type ProfileIconTypes = 'profile' | 'favorites' | 'settings' | 'plan' | 'credit'
export type VideoIconsTypes = 'like' | 'dislike' | 'favorites' | 'share'

export type TabTypes = 'song' | 'video' | 'album'
export type ProfileTypes = 'STANDARD' | 'PREMIUM'
export type BannerTypes = 'WEB_LINK' | 'WEBVIEW_DETAIL' | 'VIDEO_DETAIL'

export type Localization = {
    ru: string
    tk:string
}


export interface GlobalHead<T> {
    title:T 
    image: StaticImageData,
    likeCount: T;
    starRate: T;
    date: T;
}
export interface IArtistPageData<T> extends GlobalHead<T> {
    description: T;
    songsCount: T;
    albumCount: T;
}

export interface ISongPageData<T>  extends GlobalHead<T> {
    genre: T;
    duration: T;
    producers: T;
    composeBy: T;
    lyricsBy: T;
    musicDirector: T;
    listenCount: T;
    downloadCount: T;
}

export interface IAlbumPageData<T>  extends GlobalHead<T> {
    duration: T;
    songsCount: T;
    producers: T;
    composeBy: T;
    downloadCount: T;
}
export interface SongStatistics {
    type: 'song'
    listens: {
        [milli: string]: {
            [songId: string]: {
                c: number
                a?: {
                    [albumId: string]: number
                }[]
                p?: {
                    [playlistId:string]: number
                }[]
            }
        }[]
    }[]
}
export interface AudioAdvStatistics {
    type: 'audioAdv'
    stats: {
        audioAdvId:number 
        listens: {
            [milli:number]: number
        }[]
    }[]
}

export interface BannerAdvStatistics {
    type: 'banner'
    stats: {
        bannerId:number 
        views: {
            [key:number]: number
        }[]
        clicks: {
            [key:number]: number
        }[]
    }[]
}

export interface VideoStatistics {
    type: 'videoFile'
    
    listens: {
        [key:number]: {
            [key:number]: {
                c: number
            }
        }[]
    }[]
  
}

export type DropdownType = {
    label: Localization
    value: string 
}[]

export interface MetaValuesType {
    title: string 
    description?: string
    keywords?: string
    /** @defaultValue ['https://aydym.com/assets/logos/logo_aydym-e089d8e15a67f8d488947599eb133f07.webp'] */ 
    icons?: string[]
    openGraph: {
        type: "music.song" | "music.album" | "music.playlist" | "video.movie" | "video.episode" | "video.tv_show" | "article" | "profile" | "website"
        title: string 
        url: string 
        description?: string
        /** @defaultValue ["https://aydym.com/assets/logo_v_1.jpg"] */ 
        images?: string[]
    }
}
export interface MetaReturnType extends MetaValuesType {
    authors: {
        name: string 
        url?: string 
    }[]
}
