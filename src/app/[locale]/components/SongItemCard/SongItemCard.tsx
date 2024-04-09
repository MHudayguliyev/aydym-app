// styles
import styles from './SongItemCard.module.scss'
//components
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import Dropdown from '../Dropdown/Dropdown';
// types
import { Localization } from '@app/types';
// assets
import { heartLine, play, vipCrown } from '@app/assets/icons';
import img from '@app/assets/images/3.jpg'

interface ISong { 
    name: string
    duration: string
    artist: string
    url: string
    cover_art_url: StaticImageData
    shareUrl: string
    artistUrl: string 
}

interface IPropsData {
    data: ISong
    isVip?: boolean
}

const SongItemCard = (props: IPropsData) => {

    const {
        name,
        duration,
        artist,
        url,
        cover_art_url = img,
        shareUrl,
        artistUrl
    } = props.data
    const {isVip = false} = props;

    const dropdownData: Localization[] = [
        {tm: 'Add to playlist', ru: 'Add to playlist'}, 
        {tm: 'Add to queue', ru: 'Add to queue'},
        {tm: 'Next to play', ru: 'Next to play'},
        {tm: 'Share', ru: 'Share'},
        {tm: 'Play', ru: 'Play'}
    ]

  return (
        <div className={styles.list__item}>
            <div className={styles.list__cover}>
                <Image src={cover_art_url} alt={name} />
                <button className={`${styles.btn} ${styles.btn__play} ${styles.btn__sm} ${styles.btn__default} ${styles.btn__icon} ${styles.rounded__pill}`}>
                    <Image src={play} alt='play icon' className={styles.icon__hover}/>
                    {/* pause icon */}
                </button>
            </div>
            <div className={styles.list__content}>
                <Link href={''} className={styles.list__title}>{name}</Link>
                <p className={styles.list__subtitle}>
                    <Link href={artistUrl}>{artist}</Link>
                </p>
            </div>
            <ul className={styles.list__option}>
                {isVip && (
                    <li>
                        <span className={styles.crown}>
                            <Image src={vipCrown} alt='vip icon' />
                        </span>
                    </li>
                )}
                <li>
                    <span>
                        <Image src={heartLine} alt='heart icon' />
                    </span>
                </li>
                <li>{duration}</li>
                <li>
                    <Dropdown data={dropdownData} orientation='horizontal'/>
                </li>
            </ul>
        </div>
  )
}

export default SongItemCard;