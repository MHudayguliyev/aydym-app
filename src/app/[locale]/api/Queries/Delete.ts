import { api } from '../service/api_helper'

export const removePlaylist = async (playlistId: string): Promise<{status: boolean}> => {
    return api.deletePrivate<{status: boolean}>({
        url: `/userPlaylist/${playlistId}`
    })
} 
export const removeSongFromPlaylist = async (playlistId: string, songId: string): Promise<{status: boolean}> => {
    return api.deletePrivate<{status: boolean}>({
        url: `/userPlaylist/${playlistId}/songs/${songId}`
    })
}