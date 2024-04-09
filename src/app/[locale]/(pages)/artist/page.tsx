/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import InfiniteScroll from 'react-infinite-scroller';
// styles
import styles from './page.module.scss'
// hooks
import { useEffect,useMemo,useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
// components
import Sort from '@compLibrary/Sort/Sort';
import SongCard from '@components/SongCard/SongCard';
//swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation, Autoplay} from 'swiper/modules'
// api
import { useQuery } from 'react-query';
//api
import Artists from '@api/Types/queryReturnTypes/Artists';
import { GetArtists, GetFeaturedArtists, GetNewArtists } from '@app/api/Queries/Getters';
//utils
import {  isUndefined,CheckObjOrArrForNull, isEmpty } from '@utils/helpers';
//libs
import Preloader from '@compLibrary/Preloader';

export default function Artist(){
  const router = useRouter()
  const searchParams = useSearchParams()
  const sortType = useMemo(() => searchParams?.get('sort'),[searchParams])
  // states
  const [selectedSort, setSelectedSort] = useState<string>('1')
  const [offset, setOffset] = useState<number>(0)
  const [artistsList, setArtistsList] = useState<Artists[]>([])
  const [isSortMode, setIsSortMode] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(false)

  function loaderSwiper(type:'artist') { 
    const arr = [1,2,3,4,5,6,7,]
    return (
      arr.map((i) => (
        <SwiperSlide key={i}>
          <SongCard id={-1} loading artistCardRounded={type === 'artist' ? true : false} />
        </SwiperSlide> 
      ))
    )
  }
  
  // Sort component information
  const sortOptions = [
    {
      value: '1',
      option: { tk: 'Ýerli Aýdymçylar', ru: 'Ýerli Aýdymçylar'}, 
    },
    {
      value: '2',
      option: { tk: 'Daşary Ýurt Aýdymçylar', ru: 'Daşary Ýurt Aýdymçylar'}, 
    },
  ] 

  const {
    data: featuredArtistsData, 
    isLoading: isFeaturedArtistsLoading, 
    isError:  isFeaturedArtistsError
  } = useQuery('GetFeaturedArtists', () => GetFeaturedArtists(), {
    refetchOnWindowFocus: false, enabled: isUndefined(sortType) || isEmpty(sortType)  // RUN ONLY WHEN THERE IS NO sort type in search params
  }) 

  useEffect(() => {
    setOffset(0)
    fetchArtists()
  }, [selectedSort])


  const fetchArtists = async () => {
    let response;
    const isNewArtists = sortType === 'newArtists'
    if(isNewArtists) response = await GetNewArtists()
    else response = await GetArtists(offset, selectedSort, sortType)
    // console.log("response", response)
    if(CheckObjOrArrForNull(response)) {
      if(isSortMode){
        setArtistsList(response)
        setIsSortMode(false)
      }else {
        setArtistsList([...artistsList, ...response])
      }
      
      if(isNewArtists) {
        setOffset(0);
        setHasMore(false)
      }
      else {
        setOffset(offset + response.length);
        setHasMore(true)
      }
      
    }else setHasMore(false)
  }
  // Swiper breakpoints 
  const globalBreakpoints = {
    768: {
      slidesPerView: 3,
    },
    1140: {
      slidesPerView: 5,
    },
    1200: {
      slidesPerView: 6,
    }
  } 
  
  return (
    <>
      <div className={styles.hero}></div>
      <div className={styles.underHero}>

        {
          (!isUndefined(sortType) || sortType === 'featured') ? "" : 
          <div className={styles.section}>
            <div className={styles.head}>
              <h3>Featured <span>Artists</span></h3>
            </div>
            <Swiper 
              modules={[Navigation, Autoplay]}
              slidesPerView={2}
              breakpoints={globalBreakpoints}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4500
              }}
            >
              {
                isFeaturedArtistsLoading ? loaderSwiper('artist')
                : 
                featuredArtistsData?.map((artist, idx) => (
                <SwiperSlide key={idx}>
                  <SongCard 
                    id={artist.id}
                    image={artist.imageUrl}
                    name={artist.name}
                    slug={artist.slug}
                    onClick={() => router.push(`/artist/${artist.id}${!isUndefined(artist?.slug) ? `/${artist?.slug}` : ""}`)} 
                    artistCardRounded
                  />
                </SwiperSlide>
                ))   
              }
            </Swiper>
          </div>
        }


        <div className={styles.section}>
          <div className={styles.head}>
            <h3>Top <span>Artists</span></h3>
            <Sort 
              data={sortOptions} 
              selectedValue={selectedSort} 
              onChange={(value) => {
                setSelectedSort(value)
                setIsSortMode(true)
                setOffset(0)
              }}/>
          </div>
        </div>

        <InfiniteScroll
          loadMore={() => {
            fetchArtists()
          }}
          hasMore={hasMore}
          loader={<span className={styles.loader}><Preloader size='md'/></span>}
        >
          <div className={styles.grid}>
          {
            artistsList && artistsList?.map((artist, idx) => (
              <SongCard 
                key={idx} 
                id={artist.id} 
                image={artist.imageUrl} 
                name={artist.name} 
                onClick={() => router.push(`/artist/${artist.id}`)} 
                artistCardStandard
              />
            ))
          }
          </div>
        </InfiniteScroll>




      </div>
    </>
  )
}
 

