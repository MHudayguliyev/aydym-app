import Albums from "./Albums"
import Artists from "./Artists"
import Playlists from "./Playlists"
import NewSongs from "./Songs"
import VideosType from "./Videos"

interface SearchType {
    albums: {
        data: Albums[]
        total: number
    }
    artists: {
        data: Artists[]
        total: number
    }
    genres: {
        data: Artists[]
        total: number
    }
    playlists: {
        data: Playlists[]
        total: number
    }
    songs: {
        data: NewSongs['data']
        total: number
    }
    videos: {
        data: VideosType['data']
        total: number
    }
}

export default SearchType