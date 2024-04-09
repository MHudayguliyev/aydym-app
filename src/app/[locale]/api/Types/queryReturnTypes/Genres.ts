import { StaticImageData } from "next/image"

interface Genres {
    id: number
    code: string
    name: string
    imageUrl: StaticImageData
    shareUrl: string 
    slug: string
}

export default Genres;