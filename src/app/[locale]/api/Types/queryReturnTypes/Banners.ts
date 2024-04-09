import { BannerTypes } from "@lang/app/[locale]/types"

interface Banners {
    id: number
    itemId: number 
    bannerUrl: string 
    url: string
    gif: boolean
    title: string 
    titleRu: string 
    descTm: string 
    descRu: string 
    type: BannerTypes
}
export default Banners