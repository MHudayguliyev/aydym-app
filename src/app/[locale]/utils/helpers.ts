import { getFromStorage } from "./storage";
import { AudioAdvStatistics, BannerAdvStatistics, MetaReturnType, MetaValuesType, SongStatistics, VideoStatistics } from "../types";
import toast from "react-hot-toast";

export function capitalize(str: string) {
   return str.split(' ').map(item => item[0].toUpperCase() + item.substring(1, item.length)).join(' ')
}
export const toRem = (value: number): string => {
   return (value / 16) + 'rem';;
}
export const roundMinutes = (date: Date) => {
   date.setHours(date.getHours() + Math.floor(date.getMinutes() / 60))
   date.setMinutes(0, 0, 0)
   return date
}
export const getMillis = () => {
   return roundMinutes(new Date()).getTime()
}
export const randomize = (max: number) => {
   return Math.floor(Math.random() * max) 
}
export const getYear = (value: string) => {
   if(typeof value === 'string')
      return value.match(/\d{4}/)?.[0];
   const date = new Date()
   return date.getFullYear().toString()
}
export const copyLink = (link:string) => {
   navigator.clipboard.writeText(link)
       .then(() => {
           toast.success('Copied')
       })
       .catch(err => {
           toast.error('Something went wrong!')
   });
}
export function delay(ms: number) {
   return new Promise(resolve => setTimeout(resolve, ms))
}
export const CheckObjOrArrForNull = (obj_or_arr: any) =>  {
   if (obj_or_arr !== null && obj_or_arr !== undefined) {
     if (obj_or_arr instanceof Object && Object.keys(obj_or_arr).length !== 0)
       return true;
     else if (Array.isArray(obj_or_arr) && obj_or_arr.length !== 0) return true;
   }
   return false;
}
export const isUndefined = (data:any) => {
   return typeof data === 'undefined' || data === null
}
export const isEmpty = (value:string | null) => {
   if(typeof value === 'string') return !value.trim()
}
export const isNull = (value: number) => {
   return value === -1 || value === 0 || value === null
}
export const stringify = (data: any) => {
   return JSON.stringify(data)
} 
export const parse = (data: string) => {
   if(typeof data === 'string' && !isEmpty(data))
   return JSON.parse(data)
}
export const findIndex = (data: any, id:number): number => {
   return data.findIndex((item:any) => item.id === id)
}
export const findByKeyName = (data: any[], id: number) => {
   return  data.find(item => {
      const keys = Object.keys(item)
      return keys.some(key => parseInt(key) === id)
   })
}
export const faveAdder = (data: any, state: boolean) => { 
   if(CheckObjOrArrForNull(data)){
      const newArr = data?.map((song:any) => ({...song, favorite: state}))
      return newArr
   }
   return []
}
export const uuidv4 = () =>  {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
   });
}
export const getAudioAdv = () =>  {
   const banners = parse(getFromStorage('audioBanners'))
   if(CheckObjOrArrForNull(banners) && banners?.length > 0) return banners[0]
}
export const getSongStatistics= (): SongStatistics[]  => {
   const statistics = parse(getFromStorage('song_stats'))
   if(CheckObjOrArrForNull(statistics)) return statistics
   return [
       {
         type: 'song', listens: []
       }
   ]
}
export const getAudioAdvStatistics = (): AudioAdvStatistics[] => {
   const statistics = parse(getFromStorage('audio_adv_stats'))
   if(CheckObjOrArrForNull(statistics)) return statistics
   return [
       {
         type: 'audioAdv', stats: []
       }
   ]
}
export const getBannerAdvStatistics = (): BannerAdvStatistics[] => {
   const statistics = parse(getFromStorage('banner_adv_stats'))
   if(CheckObjOrArrForNull(statistics)) return statistics
   return [
       {
         type: 'banner', stats: []
       }
   ]
}

export const setMetaValues = (props: MetaValuesType): MetaReturnType  => {
   const {
      title, 
      description = "",
      keywords = "", 
      icons = ['https://aydym.com/assets/logos/logo_aydym-e089d8e15a67f8d488947599eb133f07.webp'], 
      openGraph
   } = props

   openGraph.description = openGraph.description ? openGraph.description : ""
   openGraph.images = openGraph.images ? openGraph.images : ["https://aydym.com/assets/logo_v_1.jpg"]
   return {
      title, description, keywords, 
      authors: [{name: 'Gerekli Hyzmat H/K'}],
      openGraph: {...openGraph},
      icons
   }
}
export const setSeoScript = <T>(data: T) => {
   const ldScript = document.getElementsByTagName('script')
   for(let i = 0; i < ldScript.length; i++){
      const sTag = ldScript[i]
      if(sTag.getAttribute('type') === "application/ld+json"){
         document.head.removeChild(sTag)
      }
   }

   const script = document.createElement('script');
   script.type = 'application/ld+json';
   script.innerHTML = JSON.stringify(data);
   document.head.appendChild(script);
   return () => {
     document.head.removeChild(script);
   };
}


export const getVideoStatistics = (): VideoStatistics[] => {
   const statistics = parse(getFromStorage('video_stats'))
   if(CheckObjOrArrForNull(statistics)) return statistics
   return [
       {
         type: 'videoFile', listens: []
       }
   ]
} 



