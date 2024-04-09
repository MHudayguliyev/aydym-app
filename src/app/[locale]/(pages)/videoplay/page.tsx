'use client'
// styles
import styles from './page.module.scss'
// components
import SongCard from '@app/components/SongCard/SongCard';
import Sort from '@compLibrary/Sort/Sort';
import Preloader from '@compLibrary/Preloader';
import toast from 'react-hot-toast';
// hooks
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useWindowHeight } from '@hooks/useWindowHeight';
import { useLocale } from 'next-intl';
// api
import { GetPremiumData, GetVideos } from '@app/api/Queries/Getters';
// types
import VideosType from '@api/Types/queryReturnTypes/Videos';
// utils
import { CheckObjOrArrForNull, isUndefined, isEmpty } from '@utils/helpers';
import authToken from '@api/service/auth_token';
//infinite scroller 
import InfiniteScroll from 'react-infinite-scroller';

const Videos = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vidoeTypeId = searchParams?.get('videoTypeId')
  const locale = useLocale()
  const userToken = authToken();

  // states
  const [isSortMode, setIsSortMode] = useState<boolean>(false);
  const [videoList, setVideoList] = useState<VideosType['data']>([]);
  const [offset, setOffset] = useWindowHeight(42);
  const [hasMore, setHasMore] = useState<boolean>(false)
  
  const {
    data: premiumData, 
    isLoading,
    isError
  } = useQuery(['GetPremiumData', locale], () => GetPremiumData(locale), {
    refetchOnWindowFocus: false
  })

  
  useEffect(() => {
    setOffset(0)
    fetchArtists()
  }, [vidoeTypeId])


  const fetchArtists = async () => {
    const response = await GetVideos(offset, vidoeTypeId!)
    if(CheckObjOrArrForNull(response)) {
      if(isSortMode){
        setVideoList(response)
        setIsSortMode(false)
      }else {
        setVideoList([...videoList, ...response])
      }
      setOffset(offset + response.length);
      setHasMore(true)
      
    }else {
      setHasMore(false)
    }
  }

  useEffect(() => {
    console.log('videoList', videoList)
  }, [videoList])

  // Sort component information
  const sortOptions = [
    {
      value: '',
      option: { tk: 'Şekilli aýdymlar', ru: 'Şekilli aýdymlar'}, 
    },
    {
      value: '1',
      option: { tk: 'Ýerli aýdymlar', ru: 'Ýerli aýdymlar'}, 
    },
    {
      value: '2',
      option: { tk: 'Daşary ýurt aýdymlar', ru: 'Daşary ýurt aýdymlar'}, 
    },
    {
      value: '3',
      option: { tk: 'Çagalar Üçin', ru: 'Çagalar Üçin'}, 
    },
    {
      value: '4',
      option: { tk: 'Ertekiler', ru: 'Ertekiler'}, 
    },
    {
      value: '5',
      option: { tk: 'Gepleşikler', ru: 'Gepleşikler'}, 
    },
    {
      value: '6',
      option: { tk: 'Degişmeler', ru: 'Degişmeler'}, 
    },
    {
      value: '7',
      option: { tk: 'Podkast', ru: 'Podkast'}, 
    },
    {
      value: '8',
      option: { tk: 'Beýlekiler', ru: 'Beýlekiler'}, 
    },
    {
      value: '9',
      option: { tk: 'Konsertler', ru: 'Konsertler'}, 
    },
    {
      value: '10',
      option: { tk: 'Karaoke', ru: 'Karaoke'}, 
    },
  ]
  return (
  <>
    <div className={styles.hero}></div>
    <div className={styles.underHero}>
      <div className={styles.head}>
        <h3>Şekilli<span>Aýdymlar</span></h3>
        <Sort 
          data={sortOptions} 
          selectedValue={vidoeTypeId!} 
          onChange={(value) => {
            setIsSortMode(true)
            setOffset(0)
            if(isEmpty(value)) router.push('/videoplay')
            else router.push(`/videoplay?videoTypeId=${value}`)
          }}
        />
      </div>
      
      {
        !CheckObjOrArrForNull(videoList) ? <h3>No data found</h3> : 
        (
          <InfiniteScroll
            loadMore={() => {
              fetchArtists()
            }}
            hasMore={hasMore}
            loader={<span className={styles.loader}><Preloader size='md'/></span>}
          >
            <div className={styles.grid}>
            {
              videoList?.map((video) => (
                <SongCard 
                  key={video.id}
                  id={video.id} 
                  image={video.coverUrl} 
                  name={video.name}
                  videoCard
                  onClick={() => {
                    if (!video.free) {
                      if (premiumData?.profileType !== 'PREMIUM' && !isUndefined(userToken)) {
                        toast('Sizde premium hasap ýok!', {
                          icon: '⚠️'
                        });
                        router.push(`/purchase`)
                        
                      } else if(premiumData?.profileType !== 'PREMIUM' && isUndefined(userToken)) {
                        toast('Sizde premium hasap ýok!', {
                          icon: '⚠️'
                        });
                        router.push(`/videoplay/${video.id}${!isUndefined(video?.slug) ? `/${video?.slug}` : ""}`)
                      }else {
                        router.push(`/videoplay/${video.id}${!isUndefined(video?.slug) ? `/${video?.slug}` : ""}`)
                      }
                    } else {
                      router.push(`/videoplay/${video.id}${!isUndefined(video?.slug) ? `/${video?.slug}` : ""}`)
                    }
                      
                  }}
                  free={video.free}
                />
              ))
            }
            </div>
          </InfiniteScroll>
        )
      }
    </div>
  </>
  )
}

export default Videos;