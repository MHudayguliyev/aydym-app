'use client'
//hooks
import { useWindowHeight } from "@hooks/useWindowHeight";
import { useMemo, useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
//styles
import styles from './page.module.scss'
import classNames from "classnames/bind";
// components
import ItemProfile from '@components/ItemProfile/ItemProfile'
import SongCard from '@components/SongCard/SongCard';
import SongList from '@components/SongList/SongList';
import Tab from "@compLibrary/Tab";
import Divider from "@compLibrary/Divider";
import Sort from "@compLibrary/Sort/Sort";
// api
import { useQuery } from "react-query";
import { GetArtistById, GetArtistData, GetPremiumData } from "@app/api/Queries/Getters";
import { likeDislike } from '@api/Queries/Post';
//types
import { DropdownType } from '@app/types/index';
//utils
import { CheckObjOrArrForNull, copyLink, faveAdder, isUndefined, setSeoScript } from '@utils/helpers';
//redux
import { useAppDispatch } from "@hooks/redux_hooks";
import { setLikeSong, setCurrentSong } from '@redux/reducers/MediaReducer';
import { togglePlaylistModal } from "@redux/reducers/TopnavbarReducer";
import InfiniteScroll from "react-infinite-scroller";
import Preloader from "@compLibrary/Preloader";
import authToken from "@api/service/auth_token";
import toast from "react-hot-toast";


const cn = classNames.bind(styles)
export default function ArtistPage({params}: {params: {each: any}}) { 
  const dispatch = useAppDispatch()
  const router = useRouter()
  const t = useTranslations('menu')
  const locale = useLocale()
  const userToken = authToken();
  const pathname = usePathname()

  const [offset, setOffset] = useWindowHeight(20)
  const [isSortMode, setIsSortMode] = useState<boolean>(false)
  const [selectedSort, setSelectedSort] = useState<string>('date')
  const [selectedTab, setSelectedTab] = useState<'song' | 'video' | 'album'>('song');
  const [dataList, setDataList] = useState<any>([]);
  const [totalSongs, setTotalSongs] = useState<number>(0)
  const [hasMore, setHasMore] = useState<boolean>(false)
  const idMem = useMemo(() => params?.each?.[0], [params.each])
  //queries
  const {
    data: artistData, 
    isLoading: isArtistLoading, 
    isError:  isArtistError
  } = useQuery(['GetArtistById', idMem], () => GetArtistById(idMem), {
    refetchOnWindowFocus: false, enabled: !!idMem
  })

  const {
    data: premiumData
  } = useQuery(['GetPremiumData', locale], () => GetPremiumData(locale), {
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    setTotalSongs(0)
    fetchSongs()
  }, [selectedSort, selectedTab])

  const fetchSongs = async () => {
    const response = await GetArtistData(selectedTab, offset, selectedSort, idMem)
    if(CheckObjOrArrForNull(response.data)) {
      if(isSortMode){
        setDataList(faveAdder(response.data, false))
        setIsSortMode(false)
      }else {
        setDataList([...dataList, ...faveAdder(response.data, false)])
      }
      setOffset(offset + response.data.length);
      setHasMore(true)
      setTotalSongs(response.total);
    }else setHasMore(false)
  }

  useEffect(() => {
    if(!isArtistLoading && !isArtistError){
      setSeoScript({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "item": {
             "@id": "https://aydym.com",
             "name": "Aydym.com"
          }
        },{
          "@type": "ListItem",
          "position": 2,
          "item": {
             "@id": "https://aydym.com/artist",
             "name": t('artists')
          }
        },{
          "@type": "ListItem",
          "position": 3,
          "item": {
             "name": artistData?.name ?? ""
          }
        }]
      })
    }
  }, [artistData])

  const playAll = () => {
    const index = 0
    dispatch(setCurrentSong({
      data: dataList, index, 
      id: dataList?.[index]?.id
    }))
  }

  // tab's data
  const tabs:DropdownType = [
    {
      value: 'song',
      label:{ru: 'Все песни', tk: 'Aýdymlar'},
    } ,
    {
      value: 'video',
      label:{ru: 'Видеоклипы', tk: 'Şekilli Aýdymlar'},
    },
    {
      value: 'album',
      label:{ru: 'Альбомы', tk: 'Albomlar'},
    }
  ]

  const detailsData: DropdownType = [
    {
      value: 'addToFavorites', label: {tk: 'Halanlaryma goş', ru: 'Избранное'}, 
    }, 
    {
      value: 'share', label: {tk: 'Paýlaşmak', ru: 'Поделиться'}, 
    },     
    {
      value: 'play', label: {tk: 'Play', ru: 'Play'}, 
    }
  ]

  const sortOptions = [
    {
      value: 'date',
      option: { tk: 'Default', ru: 'Default'}, 
    } ,
    {
      value: 'popular',
      option: { tk: 'Popular', ru: 'Popular'}, 
    } ,
  ]

  return (
    <div>
      <div className={styles.hero}></div>
      <div className={styles.underHero}>
        {/* Artist */}
        <ItemProfile 
          data={artistData!}    
          fetchStatuses={{
            isLoading: isArtistLoading, 
            isError: isArtistError
          }}
          onPlay={playAll}
          onDetailsClick={value => {
            console.log('value', value)
            if(value === 'play') playAll()
            else if(value === 'share')
            copyLink(`https://aydym.com${pathname}`)
          }}
          detailsData={detailsData} 
          haveSongs={selectedTab === 'song'} 
          artistCard 
        />
        
        {/* Songs */}
        <Tab 
          tabs={tabs} 
          selectedValue={selectedTab} 
          onChange={(value) => {
            console.log("value", value)
            if (value !== selectedTab) setDataList([]);
            setOffset(0);
            setSelectedTab(value);
          }} 
        />

        <div className={styles.tab_content}>
          <div className={styles.sort}>
            <span>
              Tracks: {totalSongs ?? 0}
            </span>
            <Sort 
              data={sortOptions} 
              selectedValue={selectedSort} 
              onChange={(value) => {
                setSelectedSort(value)
                setIsSortMode(true)
                setOffset(0)
              }}/>
          </div>
          <Divider />
          <div className={cn({
            tab_pane: true,
            fade: true,
            active: selectedTab === 'song',
          })}>
            {
              selectedTab === 'song' &&
              <InfiniteScroll
                loadMore={() => {
                  fetchSongs()
                }}
                hasMore={hasMore}
                loader={<span className={styles.loader}><Preloader size='md'/></span>}
              >
                <SongList 
                  data={dataList!}
                  fetchStatuses={{
                    isLoading: false, isError: false
                  }}
                  detailsData={
                    [{value: 'playlist', label: {tk: 'Playliste goş', ru: 'В плейлист'}},     
                    {value: 'info', label: {tk: 'Aýdym Hakynda', ru: 'О треке'}},...detailsData]
                  }
                  onPlay={(index) => 
                    dispatch(setCurrentSong({
                      data: dataList, index, 
                      id: dataList[index]?.id
                    }))
                  }
                  onLike={async (song) => {
                    console.log('song', song.name)
                    const apiPrefix: 'remove' | 'add' = song.favorite ? 'remove' : 'add'
                    const response = await likeDislike(song.id, apiPrefix)
                    if(response.status){
                      setDataList((prev: any[]) => prev?.map((item: { id: number; favorite: any; }) => item.id === song.id ? {...item, favorite: !item.favorite} : item))
                      dispatch(setLikeSong(song.id))
                    }
                  }}
                  onAddToPlaylist={song => {
                    console.log('song', song)
                    dispatch(togglePlaylistModal({
                      id: song.id, 
                      state: true
                    }))
                  }}
                  goInfo={song => router.push(`/song/${song.id}/${song.slug}`)}
                />   
              </InfiniteScroll>
            }
          </div>
          <div className={cn({
            tab_pane: true,
            fade: true,
            active: selectedTab === 'video',
          })}>
            {selectedTab === 'video' && 
              <InfiniteScroll
                loadMore={() => {
                  fetchSongs()
                }}
                hasMore={hasMore}
                loader={<span className={styles.loader}><Preloader size='md'/></span>}
              >
                <div className={styles.grid}>
                  {
                    dataList && dataList?.map((video:any) => (
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
            }
          </div>

          <div className={cn({
            tab_pane: true,
            fade: true,
            active: selectedTab === 'album',
          })}>
            { selectedTab === 'album' &&  
              
            <InfiniteScroll
              loadMore={() => {
                fetchSongs()
              }}
              hasMore={hasMore}
              loader={<span className={styles.loader}><Preloader size='md'/></span>}
            >
              <div className={styles.grid}>
                {
                  dataList && dataList?.map((album:any) => (
                    <SongCard 
                      key={album.id}
                      id={album.id} 
                      image={album.imageUrl} 
                      name={album.name}
                      artist={album.artistName}
                      onClick={() => router.push(`/album/${album.id}${!isUndefined(album?.slug) ? `/${album?.slug}` : ""}`)} 
                      albumCard
                  />
                  ))
                }
              </div>
             
            </InfiniteScroll>
             
            }
          </div>
        </div>
      </div>
    </div>
  )
}
