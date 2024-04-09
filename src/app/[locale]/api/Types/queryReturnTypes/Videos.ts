import { StaticImageData } from "next/image"

interface VideoType {
    id: number,
    code: number,
    name: string,
    nameRu: string,
}

interface VideosType {
    data: {
        id: number 
        name:string 
        contentType: string 
        fileSize: any 
        duration:string 
        format: string 
        date: string 
        coverUrl:StaticImageData 
        free: boolean
        dCount: string 
        dislikeCount:string
        isFavorite: boolean
        lCount: string 
        likeCount:string
        shareUrl: string 
        streamUrl: string 
        slug:string
    }[], 
    total: number 
}
export default VideosType