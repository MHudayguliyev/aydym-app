import { StaticImageData } from "next/image"

interface NewSong {
    id: number
    name: string
    duration: string
    artist: string 
    artistCode:string
    artistId:number
    url:string 
    dPath:string 
    cover_art_url:StaticImageData | any
    imageUrl?: StaticImageData | any
    favorite?: boolean /// provided in JUST CLIENT SIDE
    date: string 
    fileSize: number
    bitRate: number
    lCount:string 
    dCount: string 
    shareUrl:string 
    artistUrl:string 
    slug: string
    videoFileId:number 
    lyrics: null
    playlistId:number
    albumId: number
}
export default NewSong