"use client"
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import Link from 'next/link';
//styles
import styles from './page.module.scss';
import classNames from 'classnames/bind';
//api 
import { GetAlbums, GetAmazes, GetBanners, GetClips, GetConcerts, GetFeaturedArtists, GetForChildren, GetForeignSongs, GetForeignVideos, GetGenres, GetGyzyklyja, GetKaraoke, GetNewArtists, GetNewSongs, GetOldSchool, GetPlaylists, GetPodcasts, GetShows, GetSports, GetTaleLegends, GetTop100, GetTopWeekend, GetTrandSongs} from '@app/api/Queries/Getters';
//comps
import SongCard from '@app/components/SongCard/SongCard';
// import Swiper JS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation,Autoplay } from 'swiper/modules';
//translations 
import {useTranslations} from 'next-intl';
//redux 
import { useAppDispatch } from '@hooks/redux_hooks';
import { setCurrentSong } from '@redux/reducers/MediaReducer'
import useElementOnScreen from '../hooks/useElementOnScreen'
import Banner from '../components/Banner/Banner';
import BannerModal from '../components/Modals/BannerModal/Modal';
import Divider from '../compLibrary/Divider';
import { CheckObjOrArrForNull, faveAdder, getBannerAdvStatistics, getMillis, isNull, isUndefined, stringify } from '@utils/helpers';
import { setToStorage } from '@utils/storage';
import { likeDislike } from '../api/Queries/Post';
import NewSongs from '../api/Types/queryReturnTypes/Songs';
import NewSong from '../api/Types/queryReturnTypes/Song';
import { togglePlaylistModal } from '../redux/reducers/TopnavbarReducer';

function loader(type: 'standard' | 'artist') { // NOTE: should only be used inside Swiper wrapper
    return (
      [1,2,3,4,5,6].map((i) => (
        <SwiperSlide key={i}>
          <SongCard id={-1} loading artistCardRounded={type === 'artist' ? true : false} />
        </SwiperSlide>
      ))
    )
}
const cn = classNames.bind(styles)
export default function Home() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const t = useTranslations();
  const standardCardBreaksPoints = {
    0: {
      slidesPerView: 1
    }, 
    576: {
      slidesPerView: 2
    },
    768: {
      slidesPerView: 3
    }, 
    1200: {
      slidesPerView: 5
    }
  }
  const options = {
    root: null, 
    rootMargin: '0px', 
    threshold: 1.0
  }

  const [topBannersRef, topBannersVisible] = useElementOnScreen(options)
  const [clipsRef, clipsVisible] = useElementOnScreen(options)
  const [karaokeRef, karaokeVisible] = useElementOnScreen(options)
  const [concertsRef, concertsVisible] = useElementOnScreen(options)
  const [showRef, showsVisible] = useElementOnScreen(options)
  const [amazesRef, amazesVisible] = useElementOnScreen(options)
  const [interestingRef, interestingVisible] = useElementOnScreen(options)
  const [sportsRef, sportsVisible] = useElementOnScreen(options)
  const [podcastsRef, podcastsVisible] = useElementOnScreen(options)
  const [forSongsRef, forSongsVisible] = useElementOnScreen(options)
  const [forVideosRef, forVideosVisible] = useElementOnScreen(options)
  const [topWeekRef, topWeekVisible] = useElementOnScreen(options)
  const [top100Ref, top100RefVisible] = useElementOnScreen(options)
  const [playlistsRef, playlistsVisible] = useElementOnScreen(options)
  const [legendsRef, legendsVisible] = useElementOnScreen(options)
  const [childrenRef, childrenVisible] = useElementOnScreen(options)
  const [oldSongsRef, oldSongsVisible] = useElementOnScreen(options)
  const [albumsRef, albumVisible] = useElementOnScreen(options)
  const [featuredArtRef, featuredArtVisible] = useElementOnScreen(options)
  const [newArtRef, newArtRefVisible] = useElementOnScreen(options)
  const [genresRef, genresVisible] = useElementOnScreen(options)

  //states
  const [showBannerModal, setShowBannerModal] = useState<boolean>(false) 
  const [webViewUrl, setWebViewUrl] = useState<string>('')
  const [activeBanner, setActiveBanner] = useState<number>(0)
  const [bannerClicked, setBannerClicked] = useState<boolean>(false)
  const [newSongsList, setNewSongsList] = useState<NewSongs['data']>()
  const [trandSongList, setTrandSongList] = useState<NewSongs['data']>()
  const [interestingList, setInterestingList] = useState<NewSongs['data']>()
  const [podcastsList, setPodcastsList] = useState<NewSongs['data']>()
  const [foreignSongsList, setForeignSongsList] = useState<NewSongs['data']>()
  const [topWeekendList, setTopWeekendList] = useState<NewSongs['data']>()
  const [top100List, setTop100List] = useState<NewSongs['data']>()
  const [legendsList, setLegendsList] = useState<NewSongs['data']>()
  const [oldSchoolList, setOldSchoolList] = useState<NewSongs['data']>()

  const newsBannerId = 235945;
  const exclusiveBannerId = 314242;
  const advBannerId = 1885854;
  //queries 
  const {
    data: banners, 
    isLoading: isTopBannersLoading,
    isError: isTopBannersError
  } = useQuery(['GetNewsBanners',], () => GetBanners(newsBannerId),{
    refetchOnWindowFocus: false
  })
  const {
    data: exclusiveBanners, 
  } = useQuery(['GetExclusiveBanners', ], () => GetBanners(exclusiveBannerId),{
    refetchOnWindowFocus: false
  })
  const {
    data: advBanners, 
  } = useQuery(['GetAdvBanners',], () => GetBanners(advBannerId),{
    refetchOnWindowFocus: false
  })

  const {
    data: newSongsData, 
    isLoading: isNewSongsLoading, 
    isError: isNewSongsError
  } = useQuery('GetNewSongs', () => GetNewSongs(), {
    refetchOnWindowFocus: false, 
  })
  const {
    data: trandSongsData, 
    isLoading: isTrandSongsLoading, 
    isError: isTrandSongsError
  } = useQuery('GetTrandSongs', () => GetTrandSongs(), {
    refetchOnWindowFocus: false
  })
  const {
    data: clipsData, 
    isLoading: isClipsDataLoading, 
    isError: isClipsDataError
  } = useQuery(['GetClips', clipsVisible], () => GetClips(), {
    refetchOnWindowFocus: false, enabled: clipsVisible
  })
  const {
    data: karaokeData, 
    isLoading: isKaraokeDataLoading, 
    isError: isKaraokeDataError
  } = useQuery(['GetKaraoke', karaokeVisible], () => GetKaraoke(), {
    refetchOnWindowFocus: false, enabled: karaokeVisible
  })
  const {
    data: concertsData, 
    isLoading: isConcertsDataLoading, 
    isError: isConcertsDataError
  } = useQuery(['GetConcerts', concertsVisible], () => GetConcerts(), {
    refetchOnWindowFocus: false, enabled: concertsVisible

  })
  const {
    data: showsData, 
    isLoading: isShowsLoading, 
    isError: isShowsError
  } = useQuery(['GetShows', showsVisible], () => GetShows(), {
    refetchOnWindowFocus: false, enabled: showsVisible
  })
  const {
    data: amazesData, 
    isLoading: isAmazesLoading, 
    isError:  isAmazesError
  } = useQuery(['GetAmazes', amazesVisible], () => GetAmazes(), {
    refetchOnWindowFocus: false, enabled: amazesVisible
  })
  const {
    data: interestingData, 
    isLoading: isIntLoading, 
    isError:  isIntError
  } = useQuery(['GetInts', interestingVisible], () => GetGyzyklyja(), {
    refetchOnWindowFocus: false, enabled: interestingVisible

  })
  const {
    data: sportsData, 
    isLoading: isSportsLoading, 
    isError:  isSportsError
  } = useQuery(['GetSports', sportsVisible], () => GetSports(), {
    refetchOnWindowFocus: false, enabled: sportsVisible
  })
  const {
    data: podcastsData, 
    isLoading: isPodcastsLoading, 
    isError:  isPodcastsError
  } = useQuery(['GetPodcasts', podcastsVisible], () => GetPodcasts(), {
    refetchOnWindowFocus: false, enabled: podcastsVisible
  })
  const {
    data: foreignSongsData, 
    isLoading: isForeignSongsLoading, 
    isError:  isForeignSongsError
  } = useQuery(['GetForeignSongs', forSongsVisible], () => GetForeignSongs(), {
    refetchOnWindowFocus: false, enabled: forSongsVisible
  })
  const {
    data: foreignVideosData, 
    isLoading: isForeignVideosLoading, 
    isError:  isForeignVideosError
  } = useQuery(['GetForeignVideos', forVideosVisible], () => GetForeignVideos(), {
    refetchOnWindowFocus: false, enabled: forVideosVisible
  })
  const {
    data: topWeekendData, 
    isLoading: isTopWeekLoading, 
    isError:  isTopWeekError
  } = useQuery(['GetTopWeekend', topWeekVisible], () => GetTopWeekend(), {
    refetchOnWindowFocus: false, enabled: topWeekVisible
  })
  const {
    data: top100Data, 
    isLoading: isTop100Loading, 
    isError:  isTop100Error
  } = useQuery(['GetTop100', top100RefVisible], () => GetTop100(), {
    refetchOnWindowFocus: false, enabled: top100RefVisible
  })
  const {
    data: playlistsData, 
    isLoading: isPlaylistsLoading, 
    isError:  isPlaylistsError
  } = useQuery(['GetPlaylists', playlistsVisible], () => GetPlaylists(), {
    refetchOnWindowFocus: false, enabled: playlistsVisible
  })
  const {
    data: ledendsData, 
    isLoading: isLegendsLoading, 
    isError:  isLegendsError
  } = useQuery(['GetTaleLegends', legendsVisible], () => GetTaleLegends(), {
    refetchOnWindowFocus: false, enabled: legendsVisible
  })
  const {
    data: childrenData, 
    isLoading: isChildrenLoading, 
    isError:  isChildrenError
  } = useQuery(['GetForChildren', childrenVisible],() => GetForChildren(), {
    refetchOnWindowFocus: false, enabled: childrenVisible
  })
  const {
    data: oldSchoolData, 
    isLoading: isOldSchoolLoading, 
    isError:  isOldSchoolError
  } = useQuery(['GetOldSchool', oldSongsVisible], () => GetOldSchool(), {
    refetchOnWindowFocus: false,enabled: oldSongsVisible
  })
  const {
    data: albumsData, 
    isLoading: isAlbumsLoading, 
    isError:  isAlbumsError
  } = useQuery(['GetAlbums', albumVisible], () => GetAlbums(), {
    refetchOnWindowFocus: false, enabled: albumVisible
  })
  const {
    data: featuredArtistsData, 
    isLoading: isFeaturedArtistsLoading, 
    isError:  isFeaturedArtistsError
  } = useQuery(['GetFeaturedArtists', featuredArtVisible], () => GetFeaturedArtists(), {
    refetchOnWindowFocus: false, enabled: featuredArtVisible
  })
  const {
    data: newArtistsData, 
    isLoading: isNewArtistsLoading, 
    isError:  isNewArtistsError
  } = useQuery(['GetNewArtists', newArtRefVisible], () => GetNewArtists(), {
    refetchOnWindowFocus: false, enabled: newArtRefVisible
  })
  const {
    data: genresData, 
    isLoading: isGenresLoading, 
    isError:  isGenresError
  } = useQuery(['GetGenres', genresVisible], () => GetGenres(), {
    refetchOnWindowFocus: false, enabled: genresVisible
  })



  useEffect(() => {
    if(!isTopBannersLoading && !isTopBannersError)
    setActiveBanner(banners![0]?.id)
  }, [banners])

  useEffect(() => {
    if(topBannersVisible && !isNull(activeBanner)){
      const stat = getBannerAdvStatistics()
      const existBannerAdvType = [...stat].find(stat => stat.type === 'banner')
      const existBannerAdv = [...existBannerAdvType!.stats].find(stat => stat.bannerId === activeBanner)
      const millis = getMillis()

      if(CheckObjOrArrForNull(existBannerAdv)){
        
        if(bannerClicked){
            const existAudioAdvMillis = [...existBannerAdv!?.clicks].find(click => {
              const keys = Object.keys(click)
              return  keys.some(key => parseInt(key) === millis)
            })

            if(CheckObjOrArrForNull(existAudioAdvMillis)){
              existAudioAdvMillis![millis] += 1
            }else {
              const aObj: {[key:number]:number} = {}
              aObj[millis] = 1
              existBannerAdv?.clicks.push({...aObj})
            }

            setBannerClicked(false)

        }else {
          const existAudioAdvMillis = [...existBannerAdv!?.views].find(click => {
            const keys = Object.keys(click)
            return  keys.some(key => parseInt(key) === millis)
          })

          if(CheckObjOrArrForNull(existAudioAdvMillis)){
            existAudioAdvMillis![millis] += 1
          }else {
            const aObj: {[key:number]:number} = {}
            aObj[millis] = 1
            existBannerAdv?.views.push({...aObj})
          }
        }

      }else {

        if(bannerClicked){ 
          const aObj: {[key:number]:number} = {}
          aObj[millis] = 1
          const pObj = {
            bannerId: activeBanner, views: [], clicks: [aObj]
          }
          existBannerAdvType?.stats.push({...pObj})
          setBannerClicked(false)
        }else {
          const aObj: {[key:number]:number} = {}
          aObj[millis] = 1
          const pObj = {
            bannerId: activeBanner, views: [aObj], clicks: []
          }
          existBannerAdvType?.stats.push({...pObj})
        }
      }


      // console.log('stat', stat)
      setToStorage('banner_adv_stats', stringify(stat))
    }

  }, [topBannersVisible, activeBanner,  bannerClicked]) 

  useEffect(() => {
    if(!isNewSongsLoading && !isNewSongsError)
    setNewSongsList(faveAdder(newSongsData, false))
  }, [newSongsData])
  useEffect(() => {
    if(!isTrandSongsLoading && !isTrandSongsError)
    setTrandSongList(faveAdder(trandSongsData, false))
  }, [trandSongsData])
  useEffect(() => {
    if(!isIntLoading && !isIntError)
    setInterestingList(faveAdder(interestingData, false))
  }, [interestingData])
  useEffect(() => {
    if(!isPodcastsLoading  && !isPodcastsError)
    setPodcastsList(faveAdder(podcastsData, false))
  }, [podcastsData])
  useEffect(() => {
    if(!isForeignSongsLoading && !isForeignSongsError)
    setForeignSongsList(faveAdder(foreignSongsData, false))
  }, [foreignSongsData])
  useEffect(() => {
    if(!isTopWeekLoading && !isTopWeekError)
    setTopWeekendList(faveAdder(topWeekendData, false))
  }, [topWeekendData])
  useEffect(() => {
    if(!isTop100Loading && !isTop100Error)
    setTop100List(faveAdder(top100Data, false))
  }, [top100Data])
  useEffect(() => {
    if(!isLegendsLoading && !isLegendsError)
    setLegendsList(faveAdder(ledendsData, false))
  }, [ledendsData])
  useEffect(() => {
    if(!isOldSchoolLoading && !isOldSchoolError)
    setOldSchoolList(faveAdder(oldSchoolData, false))
  }, [oldSchoolData])

  const updateState = (state: NewSongs['data'], song: NewSong) => {
    const filtered = state.map(item => item.id === song.id ? {...item, favorite: !item.favorite} : item)
    return filtered
  }
  const likeSong = async (song: NewSong) => {
    const apiPrefix: 'remove' | 'add' = song.favorite ? 'remove' : 'add'
    const response = await likeDislike(song.id, apiPrefix)
    if(response.status){
      console.log('liked', response.status)
      // dispatch(setLikeSong(song.id)) // later 
    }
  }

  const openPlaylistModal = (song:any) => {
    dispatch(togglePlaylistModal({
      id: song.id, 
      state: true
    }))
  }
  
  const getSongSlug = useCallback((song: any) => { 
    if(!isUndefined(song.slug)) return `/${song.slug}`
    return ""
  }, [])

  return (
    <>

      <BannerModal 
        show={showBannerModal}
        close={() => setShowBannerModal(false)}
        url={webViewUrl}
      />
      <div className={styles.hero}></div>

      <div className={styles.under_hero_container}>

            <div className={styles.section}>
              
              <div ref={topBannersRef} className={styles.banners}>
                <Swiper
                  onRealIndexChange={value => setActiveBanner(banners![value.realIndex]?.id)}
                  slidesPerView={3}
                  spaceBetween={15}
                  navigation
                  modules={[ Navigation, Autoplay]}
                  loop
                  autoplay
                  breakpoints={{
                    0: {
                      slidesPerView: 1
                    }, 
                    576: {
                      slidesPerView: 1
                    },
                    768: {
                      slidesPerView: 2
                    }, 
                    1200: {
                      slidesPerView: 3
                    }
                  }}
                >
                  {
                    banners?.map((banner, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <Banner
                            id={banner.id}
                            bannerUrl={banner.bannerUrl}
                            url={banner.url}
                            title={banner.title}
                            titleRu={banner.titleRu}
                            type={banner.type}
                            onClick={() => {
                              const type = banner.type
                              if(type === 'WEB_LINK' || type === 'WEBVIEW_DETAIL'){
                                if(type === 'WEB_LINK'){
                                  window.open(banner.url)
                                }else if(type === 'WEBVIEW_DETAIL'){
                                  setWebViewUrl(banner.url)
                                  setShowBannerModal(true)
                                }
                                setBannerClicked(true)
                                setActiveBanner(banner.id)
                              }
                            }}
                          />
                        </SwiperSlide>
                      )
                    }
                    )
                  }
                </Swiper>
              </div>

              
              <div className={styles.section_header}>
                <h3>
                  Täze    
                  <span className={styles.text_primary}>aýdymlar</span>
                </h3>
                <Link href='/song'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(newSongsList) ? 
                  loader('standard')
                  : 
                    newSongsList?.map((song, i) => (
                      <SwiperSlide key={song.id}>
                        <SongCard 
                          id={song.id}
                          image={song.cover_art_url}
                          name={song.name}
                          artist={song.artist}
                          artistId={song.artistId}
                          liked={song.favorite}
                          defaultCard
                          onClick={() => dispatch(setCurrentSong({
                            data: newSongsList, 
                            index: i, 
                            id: song.id
                          }))}
                          onLike={async () => {
                            setNewSongsList(updateState(newSongsList, song))
                            await likeSong(song)
                          }}
                          onAddPlaylist={() => openPlaylistModal(song)}
                        />
                        </SwiperSlide>
                      ))
                }
                </Swiper>
              

              <div className={cn({
                banners: true, 
                reduceMarginTop: true
              })}>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={15}
                  navigation
                  modules={[ Navigation]}
                  autoplay
                  breakpoints={{
                    0: {
                      slidesPerView: 1
                    }, 
                    576: {
                      slidesPerView: 1
                    },
                    1200: {
                      slidesPerView: 3
                    }
                  }}
                >
                  {
                    exclusiveBanners?.map((banner, index) => (
                      <SwiperSlide key={index}>
                        <Banner
                          id={banner.id}
                          bannerUrl={banner.bannerUrl}
                          url={banner.url}
                          title={banner.title}
                          titleRu={banner.titleRu}
                          type={banner.type}
                          onClick={() => {
                            console.log('type', banner.type)
                            const type = banner.type
                            console.log('type', banner)
                            if(type === 'WEB_LINK'){
                              router.push(banner.url)
                            }else if(type === 'WEBVIEW_DETAIL') {
                              setWebViewUrl(banner.url)
                              setShowBannerModal(true)
                            }
                          }}
                        />
                      </SwiperSlide>
                    ))
                  }
                </Swiper>
              </div>

              <div className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Trend     
                  <span className={styles.text_primary}>aýdymlar</span>
                </h3>
                <Link href='/song?songTypeId=trand'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(trandSongList) ? 
                  loader('standard')
                  : 
                  trandSongList?.map((song, i) => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.cover_art_url}
                      name={song.name}
                      artist={song.artist}
                      artistId={song.artistId}
                      liked={song.favorite}
                      defaultCard
                      onClick={() => dispatch(setCurrentSong({
                        data: trandSongList, 
                        index: i, 
                        id: song.id
                      }))}
                      onLike={async () => {
                        setTrandSongList(updateState(trandSongList, song))
                        await likeSong(song)
                      }}
                      onAddPlaylist={() => openPlaylistModal(song)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={clipsRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Klipler     
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/videoplay'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(clipsData) ? 
                  loader('standard')
                  :
                  clipsData?.map((song, i) => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.coverUrl}
                      name={song.name}
                      videoCard
                      onClick={() => router.push(`/videoplay/${song.id}${getSongSlug(song)}`)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={karaokeRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Karaoke     
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/videoplay?videoTypeId=10'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(karaokeData) ? 
                  loader('standard') :
                  karaokeData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.coverUrl}
                      name={song.name}
                      videoCard
                      onClick={() => router.push(`/videoplay/${song.id}${getSongSlug(song)}`)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={concertsRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Konsertler     
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/videoplay?videoTypeId=9'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(concertsData) ? 
                  loader('standard')
                  :
                  concertsData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.coverUrl}
                      name={song.name}
                      videoCard
                      onClick={() => router.push(`/videoplay/${song.id}${getSongSlug(song)}`)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={showRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Show &     
                  <span className={styles.text_primary}>Gepleşikler</span>
                </h3>
                <Link href='/videoplay?videoTypeId=7'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(showsData) ? 
                  loader('standard')
                  :
                  showsData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.coverUrl}
                      name={song.name}
                      videoCard
                      onClick={() => router.push(`/videoplay/${song.id}${getSongSlug(song)}`)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={amazesRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Giň we    
                  <span className={styles.text_primary}>geň dünýä</span>
                </h3>
                <Link href='/videoplay?videoTypeId=8'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(amazesData) ? 
                  loader('standard')
                  :
                  amazesData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.coverUrl}
                      name={song.name}
                      videoCard
                      onClick={() => router.push(`/videoplay/${song.id}${getSongSlug(song)}`)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={interestingRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Gyzyklyja    
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/song?songTypeId=7'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(interestingList) ? 
                  loader('standard')
                  :
                  interestingList?.map((song, i) => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.cover_art_url}
                      name={song.name}
                      artist={song.artist}
                      artistId={song.artistId}
                      liked={song.favorite}
                      defaultCard
                      onClick={() => dispatch(setCurrentSong({
                        data: interestingList, 
                        index: i, 
                        id: song.id
                      }))}
                      onLike={async () => {
                        setInterestingList(updateState(interestingList, song))
                        await likeSong(song)
                      }}
                      onAddPlaylist={() => openPlaylistModal(song)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={sportsRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Sport    
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/videoplay?videoTypeId=5'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(sportsData) ? 
                  loader('standard')
                  :
                  sportsData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.coverUrl}
                      name={song.name}
                      videoCard
                      onClick={() => router.push(`/videoplay/${song.id}${getSongSlug(song)}`)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={podcastsRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Podkast    
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/song?songTypeId=5'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(podcastsList) ? 
                  loader('standard')
                  :
                  podcastsList?.map((song, i) => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.cover_art_url}
                      name={song.name}
                      artist={song.artist}
                      artistId={song.artistId}
                      liked={song.favorite}
                      defaultCard
                      onClick={() => dispatch(setCurrentSong({
                        data: podcastsData, 
                        index: i, 
                        id: song.id
                      }))}
                      onLike={async () => {
                        setPodcastsList(updateState(podcastsList, song))
                        await likeSong(song)
                      }}
                      onAddPlaylist={() => openPlaylistModal(song)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={podcastsRef} className={cn({
                  section_header: true, 
                  marginTop: true, 
                  removeHeaderMargin: true
                })}>
                <h3>
                  Bildiriş    
                  <span className={styles.text_primary}></span>
                </h3>
              </div>

              <Divider />

              <div className={cn({
                banners: true, 
                reduceMarginTop: true
              })}>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={15}
                  navigation
                  modules={[ Navigation]}
                  autoplay
                  breakpoints={{
                    0: {
                      slidesPerView: 1
                    }, 
                    576: {
                      slidesPerView: 1
                    },
                    1200: {
                      slidesPerView: 3
                    }
                  }}
                >
                  {
                    advBanners?.map((banner, index) => (
                      <SwiperSlide key={index}>
                        <Banner 
                          id={banner.id}
                          bannerUrl={banner.bannerUrl}
                          url={banner.url}
                          title={banner.title}
                          titleRu={banner.titleRu}
                          type={banner.type}
                          onClick={() => {
                            console.log('type', banner.type)
                            const type = banner.type
                            console.log('type', banner)
                            if(type === 'WEB_LINK'){
                              router.push(banner.url)
                            }else if(type === 'WEBVIEW_DETAIL') {
                              setWebViewUrl(banner.url)
                              setShowBannerModal(true)
                            }
                          }}
                        />
                      </SwiperSlide>
                    ))
                  }
                </Swiper>
              </div>

              <div ref={forSongsRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Daşary Ýurt    
                  <span className={styles.text_primary}>aýdymlary</span>
                </h3>
                <Link href='/album?albumType=homeItem'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(foreignSongsData) ? 
                  loader('standard')
                  :
                  foreignSongsData?.map((song, i) => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.imageUrl}
                      name={song.name}
                      artist={song.artistName}
                      artistId={song.artistId}
                      onClick={() => router.push(`/album/${song.id}${getSongSlug(song)}`)} 
                      albumCard
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={forVideosRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Daşary Ýurt    
                  <span className={styles.text_primary}>klipleri</span>
                </h3>
                <Link href='/videoplay?videoTypeId=2'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(foreignVideosData) ? 
                  loader('standard')
                  :
                  foreignVideosData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.coverUrl}
                      name={song.name}
                      videoCard
                      onClick={() => router.push(`/videoplay/${song.id}${getSongSlug(song)}`)} 
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={topWeekRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Hepdäniň    
                  <span className={styles.text_primary}>aýdymlary</span>
                </h3>
                <Link href='/playlist/71633'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(topWeekendList) ? 
                  loader('standard')
                  :
                  topWeekendList?.map((song, i) => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.cover_art_url}
                      name={song.name}
                      artist={song.artist}
                      artistId={song.artistId}
                      liked={song.favorite}
                      defaultCard
                      onClick={() => dispatch(setCurrentSong({
                        data: topWeekendList, 
                        index: i, 
                        id: song.id
                      }))}
                      onLike={async () => {
                        setTopWeekendList(updateState(topWeekendList, song))
                        await likeSong(song)
                      }}
                      onAddPlaylist={() => openPlaylistModal(song)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={top100Ref} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                TOP     
                  <span className={styles.text_primary}>100</span>
                </h3>
                <Link href='/playlist/17601'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(top100List)  ? loader('standard')
                  : 
                  top100List?.map((song, i) => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.cover_art_url}
                      name={song.name}
                      artist={song.artist}
                      artistId={song.artistId}
                      liked={song.favorite}
                      defaultCard
                      onClick={() => dispatch(setCurrentSong({
                        data: top100List, 
                        index: i, 
                        id: song.id
                      }))}
                      onLike={async () => {
                        setTop100List(updateState(top100List, song))
                        await likeSong(song)
                      }}
                      onAddPlaylist={() => openPlaylistModal(song)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={playlistsRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Playlistler     
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/playlist'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(playlistsData) ? loader('standard')
                  : 
                  playlistsData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.imageUrl}
                      name={song.name}
                      playlistCard
                      onClick={() => router.push(`/playlist/${song.id}${getSongSlug(song)}`)} 
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={legendsRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Rowaýat,Erteki     
                  <span className={styles.text_primary}>we Hekaýalar</span>
                </h3>
                <Link href='/song?songTypeId=4'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(legendsList) ? loader('standard')
                  : 
                  legendsList?.map((song, i) => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      artistId={song.artistId}
                      defaultCard
                      image={song.cover_art_url}
                      name={song.name}
                      artist={song.artist}
                      liked={song.favorite}
                      onClick={() => dispatch(setCurrentSong({
                        data: legendsList, 
                        index: i, 
                        id: song.id
                      }))}
                      onLike={async () => {
                        setLegendsList(updateState(legendsList, song))
                        await likeSong(song)
                      }}
                      onAddPlaylist={() => openPlaylistModal(song)}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={childrenRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Çagalar     
                  <span className={styles.text_primary}>Üçin</span>
                </h3>
                <Link href='/videoplay?videoTypeId=3'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(childrenData) ? loader('standard')
                  : 
                  childrenData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.coverUrl}
                      name={song.name}
                      videoCard
                      onClick={() => router.push(`/videoplay/${song.id}${getSongSlug(song)}`)} 
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={oldSongsRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                  Köne      
                  <span className={styles.text_primary}>Aýdymlar</span>
                </h3>
                <Link href='/genre/11'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(oldSchoolList) ? loader('standard')
                  :    
                  oldSchoolList?.map((song, i) => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.cover_art_url}
                      name={song.name}
                      artist={song.artist}
                      artistId={song.artistId}
                      liked={song.favorite}
                      defaultCard
                      onClick={() => dispatch(setCurrentSong({
                        data: oldSchoolList, 
                        index: i, 
                        id: song.id
                      }))}
                      onLike={async () => {
                        setOldSchoolList(updateState(oldSchoolList, song))
                        await likeSong(song)
                      }}
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={albumsRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Albomlar      
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/album'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(albumsData) ? loader('standard')
                  : 
                  albumsData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.imageUrl}
                      name={song.name}
                      artist={song.artistName}
                      artistId={song.artistId}
                      albumCard
                      onClick={() => router.push(`/album/${song.id}${getSongSlug(song)}`)} 
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={featuredArtRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Bagşylar      
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/artist?sort=featured'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(featuredArtistsData) ? loader('artist')
                  : 
                  featuredArtistsData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.imageUrl}
                      name={song.name}
                      onClick={() => router.push(`/artist/${song.id}${getSongSlug(song)}`)} 
                      artistCardRounded
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={newArtRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Täze       
                  <span className={styles.text_primary}>Ýüzler</span>
                </h3>
                <Link href='/artist?sort=newArtists'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(newArtistsData) ? loader('artist')
                  : 
                  newArtistsData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.imageUrl}
                      name={song.name}
                      onClick={() => router.push(`/artist/${song.id}${getSongSlug(song)}`)} 
                      artistCardRounded
                    />
                    </SwiperSlide>
                  ))
                }
              </Swiper>

              <div ref={genresRef} className={cn({
                  section_header: true, 
                  marginTop: true
                })}>
                <h3>
                Žanrlar       
                  <span className={styles.text_primary}></span>
                </h3>
                <Link href='/genre'>{t('viewAll')}</Link>
              </div>
              <Swiper
                slidesPerView={5}
                spaceBetween={15}
                navigation
                modules={[ Navigation]}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  !CheckObjOrArrForNull(genresData) ? loader('standard')
                  : 
                  genresData?.map(song => (
                  <SwiperSlide key={song.id}>
                    <SongCard 
                      id={song.id}
                      image={song.imageUrl}
                      name={song.name}
                      onClick={() => router.push(`/genre/${song.id}${getSongSlug(song)}`)} 
                      genresCard
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
