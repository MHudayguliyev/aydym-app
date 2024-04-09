import { StaticImageData } from "next/image";
import artist from '@app/assets/images/3.jpg';

interface PageData<T> {
    title: T;

    albumCount: T;
    
    duration: T;
    date: T;
    producers: T;

    description: T;

    composeBy: T;
    lyricsBy: T;
    mDirector: T;

    listenCount: T;
    likeCount: T;
    downloadCount: T;
    starRate: T;
}

export interface ArtistPageData<T> {
    title: T;
    image: StaticImageData,
    description: T;
    likeCount: T;
    starRate: T;
    date: T;
    songsCount: T,
    albumCount: T;
  }

export interface SongPageData<T> {
    image: StaticImageData;
    title: T;
    
    genre: T;
    duration: T;
    date: T;
    producers: T;

    composeBy: T;
    lyricsBy: T;
    musicDirector: T;

    listenCount: T;
    likeCount: T;
    downloadCount: T;
    starRate: T;
}

export const songPage: SongPageData<string> = {
        image: artist,
        title: 'Electric wave',
        genre: 'Pop',
        duration: '1:23',
        date: 'Apr 14, 2019',
        producers: 'Travers Music Company',
        composeBy: 'Lenisa Gory',
        lyricsBy: 'Gerrina Linda',
        musicDirector: 'Nutty Nina',
        listenCount: '348',
        likeCount: '121',
        downloadCount: '24',
        starRate: '4.5',
}
