'use client'
import React, {useMemo, useState, useEffect} from 'react'
import Link from 'next/link';
import { useQuery } from 'react-query';
//styles
import styles from './page.module.scss';
//api
import { GetArtistSongs, GetSong } from '@api/Queries/Getters';
import { likeDislike } from '@api/Queries/Post';
//comps
import SongList from '@components/SongList/SongList';
import ItemProfle from '@components/ItemProfile/ItemProfile';
//utils
import { CheckObjOrArrForNull, faveAdder, findIndex, setSeoScript } from '@utils/helpers';
//types
import { DropdownType } from '@app/types';
//redux
import { useAppDispatch } from '@hooks/redux_hooks';
import { setCurrentSong, setLikeSong, setSongObj } from '@redux/reducers/MediaReducer';
import { togglePlaylistModal } from '@redux/reducers/TopnavbarReducer';
//translations
import { useTranslations } from 'next-intl';

const Song = ({params}: {params: {each: string}}) => {
  const dispatch = useAppDispatch()
  const t = useTranslations()

  const idMem = useMemo(() => {
    return params?.each?.[0]
  }, [params.each])

  //queries
  const {
    data: song,
    isLoading: isSongLoading,
    isError: isSongError
  } = useQuery(["GetSong", idMem], () => GetSong(idMem), {
    refetchOnWindowFocus: false, 
    enabled: !!idMem
  })
  const {
    data: relatedSongs, 
    isLoading: isRelatedSongsLoading, 
    isError: isRelatedSongsError
  } = useQuery(['GetRelatedSongs', song?.artistId], () => GetArtistSongs(song!?.artistId), {
    refetchOnWindowFocus: false, 
    enabled: !!song?.artistId
  })

  ///states
  const [relatedSongsList, setRelatedSongsList] = useState(relatedSongs ?? [])

  useEffect(() => {
    if (!isSongLoading && !isSongError) {
      setSeoScript(
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              item: {
                '@id': 'https://aydym.com/song',
                name: `${t('menu.music')}`,
              },
            },
            {
              '@type': 'ListItem',
              position: 2,
              item: {
                name: `${song?.artist} - ${song?.name}`,
              },
            },
          ],
        }
      )
    }
  }, [song]);

  useEffect(() => {
    if(CheckObjOrArrForNull(relatedSongs))
      setRelatedSongsList(faveAdder(relatedSongs!, false))
  }, [relatedSongs])

  const detailsData: DropdownType = [
    {
      value: 'addToFavorites', label: {tk: 'Halanlaryma goş', ru: 'Избранное'}, 
    }, 
    {
      value: 'playlist', label: {tk: 'Playliste goş', ru: 'В плейлист'}, 
    }, 
    {
      value: 'share', label: {tk: 'Paýlaşmak', ru: 'Поделиться'}, 
    },     {
      value: 'play', label: {tk: 'Play', ru: 'Play'}, 
    }
  ]

  return (
    <>
      <div className={styles.hero}></div>
      <div className={styles.song}>
        <ItemProfle 
          data={song!} 
          fetchStatuses={{
            isLoading: isSongLoading, 
            isError: isSongError
          }}
          songCard 
          detailsData={detailsData}
          onPlay={() => {
            const index = findIndex(relatedSongs, song?.id as number)
            if(index !== -1)
              dispatch(setCurrentSong({
                data: relatedSongs, index, 
                id: song?.id
              }))
            else dispatch(setSongObj(song))
          }}
          onDetailsClick={value => {
            if(value === 'playlist')
            dispatch(togglePlaylistModal({
              id: song!?.id, 
              state: true
            }))
          }}
        />
        {
          CheckObjOrArrForNull(song) && (
            <div className={styles.section_header}>
              <div>
                Beýleki <span className={styles.text_primary}>aýdymlary</span>
              </div>
              <Link href={`/artist/${song?.artistId}`}>VIEW ALL</Link>
            </div>
          )
        }
        <SongList 
          data={relatedSongsList!}
          onPlay={index => {
            dispatch(setCurrentSong({
              data: relatedSongsList, index, 
              id: relatedSongsList!?.[index]?.id
            }))
          }}
          onLike={async song => {
            const apiPrefix: 'remove' | 'add' = song.favorite ? 'remove' : 'add'
            const response = await likeDislike(song.id, apiPrefix)
            if(response.status){
              setRelatedSongsList(prev => prev?.map(item => item.id === song.id ? {...item, favorite: !item.favorite} : item))
              dispatch(setLikeSong(song.id))
            }
          }}
          onAddToPlaylist={song => {
            // console.log('song', song)
            dispatch(togglePlaylistModal({
              id: song.id, 
              state: true
            }))
          }}

          fetchStatuses={{
            isLoading: isRelatedSongsLoading, 
            isError: isRelatedSongsError
          }}
          detailsData={detailsData}
        />
      </div>
    </>
  )
}

export default Song
