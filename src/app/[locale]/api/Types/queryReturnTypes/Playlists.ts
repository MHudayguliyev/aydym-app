import { StaticImageData } from "next/image"

interface Playlists {
    id:number 
    code:string 
    name:string 
    imageUrl:StaticImageData 
    songCount: number 
    duration:string 
    shareUrl:string 
    statShow: boolean
    slug: string
}
export default Playlists