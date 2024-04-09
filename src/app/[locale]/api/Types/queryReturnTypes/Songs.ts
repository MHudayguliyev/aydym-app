import { StaticImageData } from "next/image"

interface NewSongs {
    data: {
        id: number
        name: string
        duration: string
        artist: string 
        artistCode:string
        artistId:number
        url:string 
        dPath:string 
        cover_art_url:StaticImageData 
        imageUrl?: StaticImageData
        favorite?: boolean /// provided in JUST CLIENT SIDE
        date: string 
        fileSize: number
        bitRate: number
        lCount:string 
        dCount: string 
        shareUrl:string 
        artistUrl:string 
        playlistId:number
        videoFileId:number 
        albumId:number
        lyrics: null
        slug: string
    }[]
    total: number
}
export default NewSongs