import { useMemo, useRef } from 'react';
import Link from 'next/link';
import Image  from 'next/image';
//translations 
import { useTranslations } from 'next-intl';
// styles
import styles from './ItemProfile.module.scss'
// components
import SongDetails from '../SongDetails/SongDetails';
//types   
import { DropdownType } from '@app/types';
//icons
import ItemProfileIcons from '../icons/item_profile_icons/icon';
import MoreI from '../icons/more/icon';
//hooks
import useClickOutside from '@hooks/useOutClick';
import { useAppSelector } from '@hooks/redux_hooks';
//utils
import { CheckObjOrArrForNull, isNull, isUndefined } from '@utils/helpers';
import ListIcons from '../icons/list_icons/icon';
import Button from '../../compLibrary/Button';
import VideoJSIcons from '../icons/video_icons/icon';


interface PropsData<T>{
      data: any
      /** @defaultValue false **/  
      artistCard?: boolean;
      /** @defaultValue false **/  
      albumCard?: boolean;
      /** @defaultValue false **/  
      songCard?: boolean;
      /** @defaultValue false **/  
      playlistCard?: boolean;
      /** @defaultValue false **/  
      genreCard?: boolean;
      /** @defaultValue false **/  
      detailsData?: DropdownType
      onPlay?: () => void
      // onLike?: () => void
      onDetailsClick?: (value: string) => void
      onPlaylistLike?: (id: number) => void
      fetchStatuses:{
            isLoading: boolean
            isError: boolean
      }
      /**@default true */
      haveSongs?: boolean
}

 const ItemProfle = <T, >(props:PropsData<T>) => {
    const {
      data,
      artistCard = false,
      songCard = false,
      albumCard = false,
      playlistCard = false,
      genreCard = false,
      detailsData,
      haveSongs= true,
      onPlay,
      // onLike, 
      onDetailsClick, 
      onPlaylistLike, 
      fetchStatuses: {
            isLoading, isError
      }
      } = props;

      const t = useTranslations('meta')
      const contentRef:any = useRef(null)
      const toggleRef:any = useRef(null)
      const [show, setShow] = useClickOutside(contentRef, toggleRef, 'click')
      //states
      const isPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying);
      const songData = useAppSelector(state => state.mediaReducer.songData)
      const songObj = useAppSelector(state => state.mediaReducer.songObj)
      const songIndex = useAppSelector(state => state.mediaReducer.songIndex)

      const playPause = useMemo((): 'play' | 'pause' => {
            if(isPlaying){
                  const song = songData?.[songIndex]
                  const id = artistCard ? 'artistId' : albumCard ? 'albumId' : playlistCard ? 'playlistId'  : 'id'
                  if(
                        (song?.[id] === data?.id) || 
                        (
                              (!isNull(songObj?.id) && !isUndefined(data?.id)) && 
                              (songObj?.id === data?.id)
                        )
                  ) return 'pause'
                  else if(genreCard) return 'pause'
            }
            return 'play'
      }, [
            isPlaying, 
            songData,
            songIndex, 
            songCard,
            artistCard, 
            albumCard, 
            data
      ])

  return (
      <>
        
      <div className={styles.section} itemScope itemType='http://schema.org/MusicRecording' itemProp='track'>

            <section itemScope itemType="http://schema.org/MediaObject">
                  <Link href={data?.shareUrl ?? ""} />
                  <meta content="mp3" itemProp="encodingFormat" />
                  <meta content={data?.coverUrl ?? data?.cover_art_url} itemProp="image" />
                  <meta content={data?.fileSize} itemProp="contentSize" />
                  <meta content={data?.bitRate} itemProp="bitrate" />
                  <meta content={data?.duration} itemProp="duration" />
                  <meta content={`${data?.artist} - ${data?.name}`} itemProp="name" />
                  <meta content={`${t('song.description', {0: data?.name, 1: 'Aydym.com'})}`} itemProp="description" />
            </section>

            {  
                  CheckObjOrArrForNull(detailsData) && (
                        <SongDetails 
                              ref={contentRef}
                              data={detailsData!}
                              open={show}
                              id={data?.id}
                              onClick={(e, value) => {
                                    e.stopPropagation()
                                    if(onDetailsClick) onDetailsClick(value)
                                    setShow(false)
                              }}
                        />
                  )
            }
                        
          {isLoading ? (
            <div className={`${styles.row} ${styles.skeleton_wrapper}`}>
                  <div className={styles.image}></div>
                  
                  <div className={styles.content}>
                        <div className={styles.name}></div>
                        <div className={styles.infoList}></div>
                        <div className={styles.description}></div>
                        <ul className={styles.infoItem}>
                              <li></li>
                              <li></li>
                        </ul>
                  </div>
            </div>
          ): (
            CheckObjOrArrForNull(data) ? (
                  <div className={styles.row}>
                  <div className={styles.image}>
                        <div className={`${styles.cover} ${styles.cover__round}`}> 
                              <div className={styles.cover__image}>
                              {data && (
                                    <Image
                                    src={data.cover_art_url ? data.cover_art_url : data.imageUrl}
                                    alt={data.name ?? ''}
                                    width='400'
                                    height='400'
                                    />
                              )}         
                              </div> 
                        </div> 
                  </div>

                  <div className={styles.block}></div>

                  <div className={styles.content}>
                        <div className={styles.name} itemProp="name">
                              <span>{data?.name}</span>
                              <MoreI ref={toggleRef} />
                        </div>

                        <ul className={styles.infoList}>
                              {!artistCard && !genreCard && (<li>{data?.duration}</li>)}
                              {songCard && (
                                    <>
                                          <li>{data.fileSize}</li>
                                          <li>{data.bitRate}</li>
                                    </>
                              )}
                              {songCard && <li>{data.date}</li>}
                              {(albumCard || songCard) && (<li>{data?.artistName ? data?.artistName : data?.artist}</li>)}
                        </ul>

                        <div className={styles.description}>
                              {songCard && (
                                <>
                                    <p>
                                          Siz bu sahypada <b>{data.artist} - {data.name} aýdymyny ýükläp bilersiňiz! </b> 
                                          Öz android, iphone ýa-da kompýuteriňizden 
                                          islendik wagt onlaýn diňläp, lezzet alyp 
                                          bilersiňiz.
                                    </p>

                                </>    
                              )}
                              {artistCard && (
                                    <p style={{marginBottom: '3rem'}}>
                                          Siz bu sahypada <b>{data.name} aýdymyny diňläp bilersiňiz! </b> 
                                          Öz android, iphone ýa-da kompýuteriňizden 
                                          islendik wagt onlaýn diňläp, lezzet alyp 
                                          bilersiňiz.
                                    </p>
                              )}
                        </div>
                        
                        <ul className={styles.infoItem} itemProp="interactionStatistic" itemScope itemType="https://schema.org/InteractionCounter">
                              {haveSongs &&
                                    <li onClick={onPlay}>
                                          <div>
                                                <Button color='darkblue' roundedLg className={styles.btn}>
                                                      <ItemProfileIcons iType={playPause} />
                                                </Button>
                                                {!songCard && <span>Play All</span>}
                                                {
                                                      playlistCard && (
                                                            <Button color='red' roundedLg className={styles.btn} onClick={e => {
                                                                  e.stopPropagation()
                                                                  if(onPlaylistLike) onPlaylistLike(data?.id)
                                                            }}>
                                                                  <VideoJSIcons iType='favorites'/>
                                                            </Button>
                                                      )
                                                }
                                                {songCard && (
                                                      <>
                                                            <meta itemProp="interactionType" content="https://schema.org/ListenAction" />
                                                            <meta itemProp='userInteractionCount' content={data?.lCount ?? 0}/>
                                                            <span >{data.lCount}</span>
                                                      </>
                                                )}
                                          </div>
                                    </li>
                              }
                              {songCard && (
                                    <> 
                                          <li>
                                                <span>
                                                      <ItemProfileIcons iType='download' />
                                                      <span>{data.dCount}</span>
                                                </span>
                                          </li>
                                    </>
                              )}
                        </ul>
                  </div>
            </div>
            ) : ""
          )}

          
      </div>
      </>
  )
}

export default ItemProfle;