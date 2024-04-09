import { StaticImageData } from "next/image"

interface Artists {
    id:number 
    code:string 
    name:string 
    imageUrl: StaticImageData
    shareUrl:string 
    slug: string
}
export default Artists