import { StaticImageData } from "next/image"

interface UserEachPlaylist {
    code: string 
    id: number 
    playlistId: number 
    imageUrl: StaticImageData
    name: string 
    description: string 
    type: 'PUBLIC' | 'PERSONAL'
}
export default UserEachPlaylist