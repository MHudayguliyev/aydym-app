'use client'
import { useMemo } from 'react'
// styles
import styles from './page.module.scss'
// compontents
import SongCard from '@components/SongCard/SongCard'
// queries
import { GetRecommendedVideos, GetVideoById } from '@app/api/Queries/Getters'
import {  useRouter } from 'next/navigation'
import { useQuery } from 'react-query'
import { faveVideo, likeOrDislikeVideo } from '@api/Queries/Post'
//assets
import VideoJSIcons from '@components/icons/video_icons/icon'
//swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Autoplay} from 'swiper/modules'
import VideoJS from '@components/VideoJS/VideoJS'
// hooks
import {useEffect, useState } from 'react'
import { useTranslations} from 'next-intl'
//types
import toast from 'react-hot-toast'
import authToken from '@api/service/auth_token'
import { isUndefined, setSeoScript } from '@utils/helpers'
import { setToStorage } from '@lang/app/[locale]/utils/storage'
import { useAppSelector } from '@lang/app/[locale]/hooks/redux_hooks'
import Button from '@lang/app/[locale]/compLibrary/Button'

const VideoPage = ({params}: {params: {each: any}}) => {

  const router = useRouter();
  const t = useTranslations()

  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [isDisLiked, setIsDisLiked] = useState<boolean>(false)
  const [isLikeSubmitting, setIsLikeSubmitting] = useState<boolean>(false)
  const [isDislikeSubmitting, setIsDislikeSubmitting] = useState<boolean>(false)

  const userToken = authToken();

  const isPremium = useAppSelector(state => state.profileReducer.isPremium)
  //queries
  const {
    data: videoData, 
    isLoading: isVideoLoading, 
    isError:  isVideoError
  } = useQuery(['GetVideoById', params.each], () => GetVideoById(params.each?.[0]), {
    refetchOnWindowFocus: false
  })

  const videoTypeId = videoData?.videoType!.id!

  const {
    data: recommenddedVideos, 
    isLoading: isVideosLoading, 
    isError: isVideosError
  } = useQuery(['GetVideosSlider', videoTypeId!], () => GetRecommendedVideos(videoTypeId!), {
    refetchOnWindowFocus: false
  })
  
  //states
  const [likeCount, setLikeCount] = useState<string>();

  useEffect(() => {
    if (!isUndefined(videoData?.likeCount)) {
      setLikeCount(videoData?.likeCount);
    }
  }, [videoData]);

  const videoOptions = {
    controls: true,
    fluid: true,
    sources: [
      {
        src: videoData?.streamUrl,
        type: 'application/x-mpegURL',
      },
    ],  
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true,
      },
    },
    controlBar: {
      volumePanel: {
        inline: false
      },
      
    },
    poster: videoData?.coverUrl,
  }

  const standartBreakpoints = {
    0: {
      slidesPerView: 1
    },
    460: {
      slidesPerView: 2
    }, 
    768: {
      slidesPerView: 3,
    },
    1140: {
      slidesPerView: 6,
    },
    1200: {
      slidesPerView: 6,
    }
  }

  useEffect(() => {
    if (!isVideoLoading && !isVideoError) {
      setSeoScript(
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                 "@id": 'https://aydym.com',
                 name: "Aydym.com"
              }
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                '@id': 'https://aydym.com/videoplay',
                name: `${t('menu.video')}`,
              },
            },
            {
              '@type': 'ListItem',
              position: 3,
              item: {
                name: `${videoData?.name}`,
              },
            },
          ],
        }
      )
    }
  }, [videoData]);




  const videoMem = useMemo(() => {
    return (
        <VideoJS 
          videoId={videoData?.id}
          videoOptions = {videoOptions}
          fetchStatuses={{
            isLoading: isVideoLoading,
            isError: isVideoError
          }}
        />
    )
  }, [videoData])

  return (
    <>
      <div className={styles.hero}></div>
      <div className={`${styles.underHero} ${styles.container}`}>
        
        <div className={styles.section}>
          <div className={styles.row}>
            <div className={`${styles.col__12} ${styles.col__lg__8} ${styles.col__xl__6}`}>
            {videoData?.free || isPremium
              ?
                videoMem
              :
              <VideoJS 
                videoOptions={{controls:true, poster: videoData?.coverUrl, fluid: true}}
                onClick = {() => {
                  toast('Sizde premium hasap ýok!',
                  {
                    icon: '⚠️'
                  })
                  // setToStorage('path', `/videoplay/${videoData?.id}`)
                  router.push(`/purchase`)
                }}
                fetchStatuses={{
                  isLoading: isVideoLoading,
                  isError: isVideoError
                }}
              />
            }
            </div>
            
          </div>
          <div className={`${styles.info} ${styles.col__12} ${styles.col__lg__8} ${styles.col__xl__6}`}>
            <div itemProp='VideoObject' itemScope itemType='http://schema.org/VideoObject'>
              <meta itemProp="uploadDate" content={videoData?.date}/>
              <meta itemProp="duration" content={videoData?.duration}/>
              <meta itemProp="thumbnailUrl" content={videoData?.coverUrl as string}></meta>
              <meta itemProp="contentUrl"
                    content="https://aydym.com/videoFiles/stream/2024/02/09/06/9810c4c9-078d-493a-99e5-5605201f2c30/playlist.m3u8"></meta>
              <meta itemProp="requiresSubscription" content={videoData?.free ? 'false' : 'true'}></meta>
              <meta content={t('meta.video.description', {0: 'Aydym.com', 1: `${videoData?.name}`})}
                    itemProp="description"/>
              <h1 itemProp="name">{videoData?.name}</h1>
              <ul itemScope itemType="https://schema.org/InteractionCounter">
                <li>
                  <meta itemProp="interactionType" content="https://schema.org/WatchAction"/>
                  <meta itemProp="userInteractionCount" content={`${videoData?.lCount || 0}`}/>
                  {t('song.listens')} {videoData?.lCount || 0} |
                </li>
                <li>
                {t('likeCount')}: <span className="likeCountNum">{likeCount || 0}</span>
                </li>
              </ul>
            </div>
            <div className={styles.buttons}>
              <Button
                color={isLiked? 'green' : 'light'}
                disabled={isLikeSubmitting}
                className={isLiked ? styles.likeActive : styles.like}
                onClick={async () => {
                  setIsLikeSubmitting(true)
                  if (!isUndefined(userToken)) {
                    const {status} = await likeOrDislikeVideo(videoData!.id, "LIKE");
                    if (status) {
                      if (!likeCount?.endsWith('+')){
                        setLikeCount(prev => (isLiked ? parseInt(prev!, 10) - 1 : parseInt(prev!, 10) + 1).toString());
                        setIsLiked(!isLiked)
                        setIsDisLiked(false)
                        setIsLikeSubmitting(false)
                      }
                  }
                }else {
                  setToStorage('path', `/videoplay/${videoData?.id}`)
                  router.push(`/register`)
                }
              }}
              >
                <VideoJSIcons iType='like' className={isLiked? styles.likeActive :styles.likeHover}/>
              </Button>
              <Button
                color={isDisLiked? 'red' : 'light'}
                disabled={isDislikeSubmitting}
                className={styles.dislike}
                onClick={async () => {
                  setIsDislikeSubmitting(true)
                  if(!isUndefined(userToken)){
                    const {status} = await likeOrDislikeVideo(videoData!.id, "DISLIKE");
                    if(status){
                      if(!likeCount?.endsWith('+')) {
                        setLikeCount(prev => (isLiked ? parseInt(prev!, 10) - 1 : prev!).toString());
                        setIsLiked(false)
                        setIsDisLiked(!isDisLiked)
                        setIsDislikeSubmitting(false)
                      }
                    }
                  }else {
                    setToStorage('path', `/videoplay/${videoData?.id}`)
                    router.push(`/register`)
                  }
                }}
              >
                <VideoJSIcons iType='dislike' className={styles.likeHover}/>
              </Button>
              <Button 
                color='red'
                className={styles.favorite}
                onClick={async () => {
                  if(!isUndefined(userToken)){
                    const apiPrefix: 'remove' | 'add' = videoData?.isFavorite ? 'remove' : 'add'
                    const {status} = await faveVideo(videoData!.id, apiPrefix)
                    if(status){
                      toast.success('Halanlaryma goşuldy!')
                    }
                  }else {
                    setToStorage('path', `/videoplay/${videoData?.id}`)
                    router.push(`/register`)
                  }
                }}
              >
                <VideoJSIcons iType='favorites'/>
              </Button>
              <Button color='violet' className={styles.share}>
              <VideoJSIcons iType='share'/>
              </Button>
            </div>
          </div>
        </div>

        <div className={`${styles.recommend}`}>
          <div className={styles.section__head}>
            <h3>{t('listenAlso')}</h3>
          </div>
          {/* Slider */}
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={25}
            slidesPerView={2}
            breakpoints={standartBreakpoints}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4500
            }}
          >
            {
              recommenddedVideos?.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <SongCard 
                    id={item?.id}
                    image={item?.coverUrl}
                    onClick={() => router.push(`/videoplay/${item?.id}`)}
                    name={item?.name}
                    videoCard
                  />
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default VideoPage;
