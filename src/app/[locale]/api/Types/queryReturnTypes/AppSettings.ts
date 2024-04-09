import AudioBanners from "./AudioBanners"

interface AppSettings {
    status: boolean
    premiumEnabled: boolean
    audioFreq: number
    extraUrlList: string[]
    advList: {
        listType: 'MAIN_BOTTOM' | 'MAIN_PLAYER'
        items: string[]
    }[]
    audioBanners: AudioBanners[]
}
export default AppSettings