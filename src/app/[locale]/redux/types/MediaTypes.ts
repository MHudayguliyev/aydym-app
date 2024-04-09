import NewSongs from "@api/Types/queryReturnTypes/Songs"
import NewSong from '@api/Types/queryReturnTypes/Song'
import AudioBanners from "@api/Types/queryReturnTypes/AudioBanners"

export interface InitialState {
    songData: NewSongs['data']
    songIndex: number
    songId: number 
    isSongPlaying: boolean
    songObj: NewSong
    adv: AudioBanners
    showAdv: boolean
}