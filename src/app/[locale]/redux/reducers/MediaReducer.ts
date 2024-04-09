import { createSlice } from '@reduxjs/toolkit';
import { InitialState } from '../types/MediaTypes';
import { CheckObjOrArrForNull, faveAdder, getAudioAdv, isUndefined, parse, stringify } from '@utils/helpers';
import { getFromStorage, setToStorage } from '@utils/storage';

const initialState: InitialState = {
    songData: [], 
    songIndex: -1, 
    songId: -1, 
    isSongPlaying: false, 
    showAdv: false, 
    songObj: {
        id: -1,
        playlistId: -1, 
        albumId: -1, 
        name: "",
        duration: "",
        artist: "",  
        artistCode:"", 
        artistId: -1, 
        url:"",  
        dPath:"",  
        cover_art_url: "",  
        imageUrl: "", 
        favorite: false, 
        date: "",  
        fileSize: -1,
        bitRate: -1,
        lCount:"",  
        dCount: "",  
        shareUrl:"",  
        artistUrl:"",  
        slug: "", 
        videoFileId: -1, 
        lyrics: null
    }, 
    adv: {
        id: -1, 
        s: -1,
        adCount: -1,
        name: "", 
        img: "",
        url: "",  
    }
}

const MediaReducer = createSlice({
    name: 'MediaReducer', 
    initialState: initialState, 
    reducers: {
        setCurrentSong: (state, action) => {
            const {
                data, 
                index, 
                id, 
            } = action.payload

            state.isSongPlaying = !state.showAdv ? (
                state.songData?.[state.songIndex]?.id === id ? !state.isSongPlaying : true
            ) : false
            state.songData = [...faveAdder(data, false)]
            state.songIndex = index
            state.songObj = {
                id: -1,
                playlistId: -1, 
                albumId: -1, 
                name: "",
                duration: "",
                artist: "",  
                artistCode:"", 
                artistId: -1, 
                url:"",  
                dPath:"",  
                cover_art_url: "",  
                imageUrl: "", 
                favorite: false, 
                date: "",  
                fileSize: -1,
                bitRate: -1,
                lCount:"",  
                dCount: "",  
                shareUrl:"",  
                artistUrl:"",  
                slug: "", 
                videoFileId: -1, 
                lyrics: null
            } 
        }, 
        setSongObj: (state, action) => {
            const objId = state.songObj?.id
            state.songObj = {...action.payload}
            state.isSongPlaying = action.payload.id === objId ? !state.isSongPlaying : true
            state.songData = []
            state.songIndex = -1
            state.songId = -1
        }, 
        shuffleSongs: (state, action) => {
            state.isSongPlaying = true
            state.songIndex = action.payload === state.songIndex ? action.payload + 1 : action.payload
        }, 
        setSongIndex: (state, action) => {
            state.songIndex = action.payload
        }, 
        setIsSongPlaying: (state, action) => {
            state.isSongPlaying = !state.showAdv ? action.payload : false
        }, 
        setLikeSong: (state, action) => {
            state.songData = [
                ...state.songData.map(song => song.id === action.payload ? {...song, favorite: !song.favorite} : song)
            ]
        }, 
        continueListening: (state) => {
            state.showAdv = false
            state.isSongPlaying = true
            state.adv = {
                id: -1, 
                s: -1,
                adCount: -1,
                name: "", 
                img: "",
                url: "" 
            }
        }, 
        stopListeningOnGetPremium: (state) => {
            state.showAdv = false
            state.adv = {
                id: -1, 
                s: -1,
                adCount: -1,
                name: "", 
                img: "",
                url: "" 
            }
        }, 
        checkToOpenAdv: (state) => {
            const currentPos = parse(getFromStorage('currentPos'))
            const audioFreq = parse(getFromStorage('audioFreq')) ?? 5
            if(!isUndefined(currentPos) && !isNaN(currentPos)){
              const audioAdv = getAudioAdv()
              if(currentPos >= audioFreq && CheckObjOrArrForNull(audioAdv)){
                console.log("audioAdv", audioAdv)
                state.isSongPlaying = false
                state.showAdv = true
                state.adv = {...audioAdv}
                setToStorage('currentPos', stringify(0))
              }
            }
        }
    }
})

export const {
    setCurrentSong,
    setSongObj,  
    shuffleSongs, 
    setSongIndex, 
    setIsSongPlaying, 
    setLikeSong,
    continueListening, 
    stopListeningOnGetPremium, 
    checkToOpenAdv
} = MediaReducer.actions
export default MediaReducer.reducer