import { StaticImageData } from "next/image"

interface UserPlaylists {
    code: string 
    id: number 
    playlistId: number 
    imageUrl: StaticImageData 
    name: string 
    type: 'PUBLIC' | 'PERSONAL'
}
export default UserPlaylists