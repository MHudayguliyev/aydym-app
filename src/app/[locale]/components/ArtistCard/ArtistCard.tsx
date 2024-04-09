import Link from 'next/link'
import React from 'react'
import styles from './ArtistCard.module.scss'
import Image, { StaticImageData } from 'next/image'
import playBackground from '@app/assets/images/play-background.png'
import artistBg from '@app/assets/images/artist-bg.jpg'

interface IProps {
    id?: number;
    imageUrl?: StaticImageData;
    name?: string;
    path?: string;
    artist?: string;
    genre?: string
    videoCard?: boolean;
    albumCard?: boolean;
    genreCard?: boolean;
}

export default function ArtistCard(props : IProps) {

  const {
    id,
    imageUrl,
    name,
    artist,
    genre,
    path,
    videoCard = false,
    albumCard = false,
    genreCard = false,
  } = props;
    
  return (
    <div className={`${styles.card} ${styles.col__6} ${styles.col__xl__2} ${styles.col__md__3} ${styles.col__sm__4}`}>
      <Link href={`${path}/${id}/`}>
        <div className={styles.cardImage}>
          <Image src={imageUrl ?? artistBg} alt='image' width={400} height={400}/>
          {videoCard && (
            <div className={styles.videoplay}>
              <Image src={playBackground} alt='play icon' />
            </div>
          )}
          {genreCard && (
            <div className={styles.genre}>
              <p>{genre}</p>
            </div>
          )}
        </div>
        <span>{name}</span>
      </Link>
      {albumCard && (
        <Link href={''}>{artist}</Link>
      )}
    </div>     
  )
}
