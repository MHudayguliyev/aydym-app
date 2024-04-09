import { api } from "../service/api_helper"
//types
import Albums from "../Types/queryReturnTypes/Albums"
import Artists from "../Types/queryReturnTypes/Artists"
import Playlists from "../Types/queryReturnTypes/Playlists"
import SearchType from "../Types/queryReturnTypes/SearchType"
import Songs from "../Types/queryReturnTypes/Songs"
import Song from "../Types/queryReturnTypes/Song"
import VideosType from "../Types/queryReturnTypes/Videos"
import Genres from "../Types/queryReturnTypes/Genres"
import PremiumTypes from "../Types/queryReturnTypes/PremiumTypes"
import PremiumDataType from "../Types/queryReturnTypes/PremiumData"
import SettingsChanged from "../Types/queryReturnTypes/SettingsChanged"
import AppSettings from "../Types/queryReturnTypes/AppSettings"
import Banners from "../Types/queryReturnTypes/Banners"
import HomeSettings from "../Types/queryReturnTypes/HomeSettings"
import VideoInfo from "../Types/queryReturnTypes/VideoInfo"
import axios from "axios"
import UserPlaylists from "../Types/queryReturnTypes/UserPlaylists"
import UserEachPlaylist from "../Types/queryReturnTypes/UserEachPlaylist"
import { isEmpty, isUndefined } from "@utils/helpers"

export const GetHomeSettings = async (): Promise<HomeSettings[]> => {
    return api.get<HomeSettings[]>({
        url: '/app/home/settings', 
        homeItems: true
    })
}
export const GetBanners = async (bannerId: number): Promise<Banners[]> => {
    return api.get<Banners[]>({
        url: `/banner/${bannerId}`, 
    })
}
export const GetSongs = async ({
    offset, sort, max = 40, songTypeId, trandSongs = false
}:{
    offset: number 
    sort: 'sortingDate' | 'popular'
    songTypeId: number
    max?: number
    trandSongs?: boolean
}): Promise<Songs['data']> => {
    console.log('trandSongs', trandSongs)
    return api.get<Songs['data']>({
        url: trandSongs ? `/song?sort=${sort}&order=desc&artistId=47%2C48%2C106%2C102%2C17%2C44%2C37%2C70%2C8%2C49%2C57%2C4%2C35%2C38%2C46%2C53%2C16%2C51%2C52%2C24%2C15%2C127%2C460%2C790%2C104%2C354%2C55&offset=${offset}&max=${max}` : 
        `/song?max=${max}&offset=${offset}&songTypeIdExclude=2&sort=${sort}&order=desc${!isNaN(songTypeId) ? `&songTypeId=${songTypeId}` : ""}`
    })
}
export const GetSong = async (id: string): Promise<Song> => {
    return api.get<Song>({
        url: `/song/${id}`
    })
}
export const GetLikedSongs = async (): Promise<Songs['data']> => {
    return api.getPrivate<Songs['data']>({
        url: 'liked/song'
    })
}
export const GetNewSongs = async (): Promise<Songs['data']> => {
    return api.get<Songs['data']>({
        url: '/song?sort=date&order=desc&max=10'
    })
}
export const GetTrandSongs = async (): Promise<Songs['data']> => {
    return api.get<Songs['data']>({
        url: '/song?sort=date&order=desc&max=10&artistId=47%2C48%2C106%2C102%2C17%2C44%2C37%2C70%2C8%2C49%2C57%2C4%2C35%2C38%2C46%2C53%2C16%2C51%2C55%2C52%2C61%2C24%2C15%2C127%2C460%2C790%2C104'
    })
}
export const GetClips = async (): Promise<VideosType['data']> => {
    return api.get<VideosType['data']>({
        url: '/video?sort=date&order=desc&videoTypeId=1'
    })
}
export const GetKaraoke = async (): Promise<VideosType['data']> => {
    return api.get<VideosType['data']>({
        url: '/video?videoTypeId=10'
    })
}
export const GetConcerts = async(): Promise<VideosType['data']> => {
    return api.get<VideosType['data']>({
        url: '/video?videoTypeId=9'
    })
}
export const GetShows = async(): Promise<VideosType['data']> => {
    return api.get<VideosType['data']>({
        url: '/video?videoTypeId=7'
    })
}
export const GetAmazes = async (): Promise<VideosType['data']> => {
    return api.get<VideosType['data']>({
        url: '/video?sort=date&order=desc&videoTypeId=8'
    })
}
export const GetGyzyklyja = async(): Promise<Songs['data']> => {
    return api.get<Songs['data']>({
        url: '/song?songTypeId=7'
    })
}
export const GetSports = async (): Promise<VideosType['data']> => {
    return api.get<VideosType['data']>({
        url: '/video?videoTypeId=5'
    })
}
export const GetPodcasts = async():Promise<Songs['data']> => {
    return api.get<Songs['data']>({
        url: '/song?songTypeId=5'
    })
}
export const GetForeignSongs = async(sort?: string): Promise<Albums['data']> => {   ///////////////////////////////////////
    return api.get<Albums['data']>({
        url: `/album?ids=449%2C46%2C47%2C51%2C50%2C49%2C48%2C&max=10${!isUndefined(sort) ? `&sort=${sort}` : ""}`
    })
}
export const GetForeignVideos = async(): Promise<VideosType['data']> => {
    return api.get<VideosType['data']>({
        url: '/video?videoTypeId=2'
    })
}
export const GetTopWeekend = async(): Promise<Songs['data']> => {
    return api.get<Songs['data']>({
        url: '/song?playlistId=71633&max=10&sort=date&order=desc'
    })
}
export const GetTop100 = async(): Promise<Songs['data']> => {
    return api.get<Songs['data']>({
        url: '/song?playlistId=17601'
    })
}
export const GetPlaylists = async(): Promise<Playlists[]> => {
    return api.get<Playlists[]>({
        url: '/playlist?max=8'
    })
}
export const GetTaleLegends = async (): Promise<Songs['data']> => {
    return api.get<Songs['data']>({
        url: '/song?songTypeId=4'
    })
}
export const GetForChildren = async(): Promise<VideosType['data']> => {
    return api.get<VideosType['data']>({
        url: '/video?videoTypeId=3'
    })
}
export const GetOldSchool = async(): Promise<Songs['data']> => {
    return api.get<Songs['data']>({
        url: '/song?genreId=11&sort=date&order=desc&max=10'
    })
}
export const GetAlbums = async (): Promise<Albums['data']> => {
    return api.get<Albums['data']>({
        url: '/album?max=8&excludeId=51%2C50%2C49%2C48%2C47%2C46%2C449'
    })
}
export const GetFeaturedArtists = async (): Promise<Artists[]> => {
    return api.get<Artists[]>({
        url: '/artist?max=8&sort=featured'
    })
}
export const GetNewArtists = async (): Promise<Artists[]> => {
    return api.get<Artists[]>({
        url: '/artist?sort=ids&ids=1096%2C1081%2C1018%2C1077%2C471%2C805%2C1045%2C859%2C1104%2C852%2C875%2C865%2C489%2C421%2C490%2C448%2C459%2C454%2C455%2C451%2C450%2C449%2C438%2C428%2C425%2C414%2C411%2C402%2C400%2C398%2C375%2C373%2C368%2C365'
    })
}
export const GetGenres = async (): Promise<Artists[]> => {
    return api.get<Artists[]>({
        url: '/genre?max=6'
    })
}

// Get Artists
export const GetArtists = async (offset: number, artistTypeId:string, featuredSort?: string | null): Promise<Artists[]> => {
    return api.get<Artists[]>({
        url: `/artist?offset=${offset}&max=60&artistTypeId=${artistTypeId}${(!isUndefined(featuredSort) && featuredSort === 'featured') ? `&sort=${featuredSort}` : ""}`
    }) 
}
export const GetArtistById = async (id: string): Promise<Artists> => {
    return api.get<Artists>({
        url: `/artist/${id}`
    })
}

// Get artist's songs

export const GetArtistSongs = async (id: number, offset?: number): Promise<Songs['data']> => {
    return api.get<Songs['data']>({
        url: `/song?artistId=${id}&max=20${!isUndefined(offset) ? `&offset=${offset}` : ""}`
    })
}
export const GetArtistAlbums = async (id: string): Promise<Albums[]> => {
    return api.get<Albums[]>({
        url: `/album?artistId=${id}`
    })
}

export const GetArtistData = async (apiPrefix: 'song' | 'video' | 'album', offset: number,  sort = 'date', id: string): Promise<any> => {
    return api.get<any>({
        url: `/${apiPrefix}?offset=${offset}&max=20&sort=${sort}&artistId=${id}`, 
        withTotal: true
    })
}

// Get Videos
export const GetVideos = async (offset:number, videoTypeId:string): Promise<VideosType['data']> => {
    // console.log('videoTypeId in api', videoTypeId)
    return api.get<VideosType['data']>({
        url: `/video?offset=${offset}&max=42${(!isUndefined(videoTypeId) && !isEmpty(videoTypeId)) ? `&videoTypeId=${videoTypeId}` : ""}`
    }) 
}
export const GetVideoById = async (id:number): Promise<VideoInfo> => {
    return api.get<VideoInfo>({
        url: `/video/${id}`
    }) 
}
export const GetRecommendedVideos = async (videoTypeId:number): Promise<VideosType['data']> => {
    return api.get<VideosType['data']>({
        url: `/video?max=6&videoTypeId=${videoTypeId}`
    }) 
}
export const GetFavoriteVideos = async (): Promise<VideosType['data']> => {
    return api.getPrivate<VideosType['data']>({
        url: `/video/favorites`
    }) 
}
// Get Albums
export const GetAlbumsData = async (offset:number, sort:string): Promise<Albums['data']> => {  ///////////////////////////////
    return api.get<Albums['data']>({
        url: `/album?offset=${offset}&max=24&sort=${sort}`
    })
}
export const GetAlbumById = async (id: string): Promise<Albums> => {
    return api.get<Albums>({
        url: `/album/${id}`
    })
}
export const GetAlbumSongs = async (id: string, offset = 0, sort: string): Promise<Songs> => {
    return api.get<Songs>({
        url: `/song?offset=${offset}&max=50&sort=${sort}&order=asc&albumId=${id}`, 
        withTotal: true
    })
}

// Get Playlists
export const GetPlaylistsData = async(offset:number, categoryId:string): Promise<Playlists[]> => {
    return api.get<Playlists[]>({
        url: `/playlist?offset=${offset}&max=24${!isUndefined(categoryId) && !isEmpty(categoryId) ? `&categoryId=${categoryId}` : ""}`
    })
}
export const GetPlaylistById = async(id:string): Promise<Playlists> => {
    return api.get<Playlists>({
        url: `/playlist/${id}`
    })
}
export const GetPlaylistSongs = async(id:string, offset = 0, withStat = false): Promise<Songs['data']> => { ///////////////
    console.log('withStat', withStat)
    return api.get<Songs['data']>({
        url: `/song?statShow=${withStat}&offset=${offset}&max=100&playlistId=${id}`
    })
}
export const GetUserPlaylist = async(): Promise<UserPlaylists[]> => {
    return api.getPrivate<UserPlaylists[]>({
        url: '/userPlaylist', 
    })
}
export const GetEachPlaylistData = async (playlistId: string): Promise<UserEachPlaylist> => {
    return api.getPrivate<UserEachPlaylist>({
        url: `/userPlaylist/${playlistId}`
    })
}
export const GetPersonalPlaylist = async (): Promise<UserPlaylists[]> => {
    return api.getPrivate<UserPlaylists[]>({
        url: '/userPlaylist?type=PERSONAL&offset=0&max=50'
    })
}
// Get Genres
export const GetGenresData = async(offset:number): Promise<Genres[]> => {
    return api.get<Genres[]>({
        url: `/genre?offset=${offset}&max=24`
    })
}
export const GetGenresById= async(id:string): Promise<Genres> => {
    return api.get<Genres>({
        url: `/genre/${id}`
    })
}
export const GetGenreSongs = async (id: string, offset=0, sort: string): Promise<Songs> => {
    return api.get<Songs>({
        url: `/song?offset=${offset}&max=20&sort=${sort}&genreId=${id}`,
        withTotal: true
    })
}
//SEARCH 
export const GetSearchData = async (value: string): Promise<SearchType> => {
    return api.get<SearchType>({
        url: `/search?mask=${value}`
    })
}
export const GetWithSearchType = async (type: string, mask: string): Promise<SearchType> => {
    return api.get<SearchType>({
        url: `/search?mask=${mask}${!isUndefined(type) ? `&type=${type}` : ""}`
    })
}
// PREMIUM
export const GetPremiumTypes  = async (locale: string): Promise<PremiumTypes> => {
    return api.get<PremiumTypes>({
        url: `/profile/accountTypes?devId=*&appType=web&lang=${locale}`
    })
}
export const GetPremiumData = async (locale: string): Promise<PremiumDataType> => {
    return api.getPrivate<PremiumDataType>({
        url: `/profile?devId=*&appType=web&lang=${locale}`
    })
}
//settings changed 
export const GetSettingsChanged = async (devId: string, lastChanged?: string): Promise<SettingsChanged> => {
    return api.get<SettingsChanged>({
        url: `/app/settings/changed?devId=${devId ?? "*"}&appType=web${!isEmpty(lastChanged as string) ? `&lastChanged=${lastChanged}` : ""}`
    })
}
export const GetAppSettings = async (devId: string): Promise<AppSettings> => {
    return api.get<AppSettings>({
        url: `/app/settings?devId=${devId ?? "*"}&appType=web`
    })
}

// Video ADS
export const GetVideoAds = async ( videoId: number, ) => {
    return api.get({
        url: `/videoAdv/vast?devId=*&adType=LINEAR_ADS&appType=web&videoId=8787`
    })
}
export const GetHtml = async (url: string) => {
    return axios.get(url).then(response => {
        return response.data
    })
}