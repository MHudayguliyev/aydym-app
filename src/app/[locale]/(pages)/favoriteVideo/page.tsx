'use client'
import Divider from '../../compLibrary/Divider'
import { DropdownType } from '../../types'
import styles from './page.module.scss'
import { useQuery } from 'react-query'
import { GetFavoriteVideos } from '../../api/Queries/Getters'
import SongList from '../../components/SongList/SongList'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckObjOrArrForNull } from '../../utils/helpers'
import { faveVideo } from '../../api/Queries/Post'
import toast from 'react-hot-toast'
import AuthMiddleware from '../../components/AuthMiddleware'

const FavoriteVideos = () => {
  const router = useRouter();
  const detailsData: DropdownType = [
    {
      value: 'remove', label: {tk: 'Halanlarymdan aýyr', ru: 'Halanlarymdan aýyr'}, 
    }, 
    {
      value: 'info', label: {tk: 'Video hakynda', ru: 'Video hakynda'}, 
    },
  ]

  const {
    data: favoriteVideos,
    isLoading,
    isError
  } = useQuery('GetFavoriteVideos', () => GetFavoriteVideos(), {
    refetchOnWindowFocus: false
  })
  const [videoList, setVideoList] = useState(favoriteVideos ?? [])
  useEffect(() => {
    if(CheckObjOrArrForNull(favoriteVideos))
      setVideoList(favoriteVideos!)
  }, [favoriteVideos])
  const commonStyle = {
    marginBottom: '1rem'
  }
  
  return (
    <>
      <div className={styles.hero}></div>
      <div className={styles.underHero}>
        <div className={styles.header}>
          <h3>Halanlarym</h3>
        </div>
        <Divider styles={commonStyle}/>
        <SongList 
          data={videoList}
          onPlay={index => router.push(`/videoplay/${favoriteVideos![index]?.id}`)}
          onRemove={async (data) => {
            const response = await faveVideo(data.id, 'remove')
            if(response.status)
              setVideoList(vl => vl.filter(vl_item => vl_item.id !== data.id)) 
              toast.success('Successfully removed.')
          }}
          goInfo={(data) => router.push(`/videoplay/${data.id}`)}
          fetchStatuses={{
            isLoading, isError
          }}
          detailsData={detailsData!}
          hideDuration
          video
        />
        <Divider styles={commonStyle}/>
      </div>
    </>
  )
}

export default AuthMiddleware(FavoriteVideos)