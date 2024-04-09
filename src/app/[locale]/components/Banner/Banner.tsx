import React, {useEffect} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from '@lang/navigation'
//styles
import classNames from 'classnames/bind'
import styles from './Banners.module.scss'
//types
import { BannerTypes } from '../../types'

interface BannerProps {
    bannerUrl: string 
    id:number 
    title: string 
    titleRu: string 
    type: BannerTypes   
    url: string 
    onClick: () => void
}

const cn = classNames.bind(styles)
const Banner = (props: BannerProps) => {
    const router = useRouter()
    const {
        id, 
        bannerUrl, 
        title, 
        titleRu, 
        type, 
        url,
        onClick, 
    } = props

  return (
    <div className={styles.banner} onClick={onClick}>
      <Image src={bannerUrl} alt='banner' width='400' height='400'/>
      <div className={styles.content}>
        <Link href={url ?? ""}>
          <h6>{title}</h6>
        </Link>
      </div>
    </div>
  )
}

export default Banner
