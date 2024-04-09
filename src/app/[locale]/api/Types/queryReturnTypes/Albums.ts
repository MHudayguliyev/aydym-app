import { StaticImageData } from "next/image"

interface Albums {
    data: {
        id:number 
        name:string
        imageUrl:StaticImageData
        artistName:string 
        artistId:number
        songCount:number
        duration:string 
        shareUrl:string 
        slug: string
    }[]
    total: number
}
export default Albums
