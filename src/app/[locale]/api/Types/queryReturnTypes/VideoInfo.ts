import { StaticImageData } from "next/image"

interface VideoInfo {
    id: number;
    name: string;
    contentType: string;
    fileSize: any;
    streamUrl: string;
    shareUrl: string;
    duration: any;
    format: any;
    date: string;
    coverUrl: StaticImageData | string;
    free: boolean;
    artistId: number;
    lCount: string;
    dCount: string;
    likeCount: string;
    dislikeCount: string;
    isFavorite: boolean;
    videoType: {
        id: number;
        code: string;
        name: string;
        nameRu: string;
    };
}
export default VideoInfo;