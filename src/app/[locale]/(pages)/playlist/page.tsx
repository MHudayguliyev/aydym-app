'use client'
//styles
import styles from './page.module.scss'
//hooks
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
//components
import SongCard from '../../components/SongCard/SongCard'
import Sort from '../../compLibrary/Sort/Sort'
//api
import { GetPlaylistsData } from '../../api/Queries/Getters'
import { useWindowHeight } from '../../hooks/useWindowHeight'
import Playlists from '../../api/Types/queryReturnTypes/Playlists'
import { CheckObjOrArrForNull, isEmpty } from '../../utils/helpers'
import Preloader from '../../compLibrary/Preloader'
import InfiniteScroll from 'react-infinite-scroller'

const Playlist = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = useMemo(() => searchParams?.get('categoryId') ,[searchParams])
  //states
  const [offset, setOffset] = useWindowHeight(42)
  const [isSortMode, setIsSortMode] = useState<boolean>(false);
  const [playlistsList, setPlaylistsList] = useState<Playlists[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false)

  // Sort component information
  const sortOptions = [
    {
      value: '',
      option: { tk: 'Playlistler', ru: 'Playlistler'}, 
    },
    {
      value: '1',
      option: { tk: 'Ýerli', ru: 'Ýerli'}, 
    },
    {
      value: '2',
      option: { tk: 'Daşary ýurt', ru: 'Daşary ýurt'}, 
    },
    {
      value: '3',
      option: { tk: 'Top Charts', ru: 'Top Charts'}, 
    },
    {
      value: '4',
      option: { tk: 'Çagalar üçin', ru: 'Çagalar üçin'}, 
    },
    {
      value: '5',
      option: { tk: 'Žanrlar', ru: 'Žanrlar'}, 
    },
    {
      value: '6',
      option: { tk: 'Bagşylar', ru: 'Bagşylar'}, 
    },
    {
      value: '7',
      option: { tk: 'Sport üçin', ru: 'Sport üçin'}, 
    },
    {
      value: '8',
      option: { tk: 'Car music', ru: 'Car music'}, 
    },
    {
      value: '9',
      option: { tk: 'Halk aýdym', ru: 'Halk aýdym'}, 
    },
    {
      value: '10',
      option: { tk: 'Rahatlandyryjy', ru: 'Rahatlandyryjy'}, 
    },
    {
      value: '11',
      option: { tk: 'Soundtracks', ru: 'Soundtracks'}, 
    },
    {
      value: '12',
      option: { tk: 'Baýramçylyk', ru: 'Baýramçylyk'}, 
    },
    {
      value: '13',
      option: { tk: 'Beýlekiler', ru: 'Beýlekiler'}, 
    },
  ] 
  
  useEffect(() => {
    setOffset(0)
    fetchArtists()
    console.log('categoryId', categoryId)
  }, [categoryId])

  const fetchArtists = async () => {
    const response = await GetPlaylistsData(offset, categoryId!)
    console.log('response', response)
    if(CheckObjOrArrForNull(response)) {

      if(isSortMode){
        setPlaylistsList(response)
        setIsSortMode(false)
      }else {
        setPlaylistsList([...playlistsList, ...response])
      }
      setOffset(offset + response.length);
      setHasMore(true)
      
    }else setHasMore(false)
  }

  useEffect(() => {
    console.log('playlistsList', playlistsList)
  }, [playlistsList])

  return (
    <>
      <div className={styles.hero}></div>
      <div className={styles.underHero}>
        <div className={styles.head}>
          <h3>Playlistler</h3>
          <Sort 
            data={sortOptions} 
            selectedValue={categoryId!} 
            onChange={(value) => {
              setIsSortMode(true)
              setOffset(0)
              if(isEmpty(value)) router.push('/playlist')
              else router.push(`/playlist?categoryId=${value}`)
            }}/>
        </div>
        
        {
          CheckObjOrArrForNull(playlistsList) ? (
            <InfiniteScroll
              loadMore={() => {
                fetchArtists()
              }}
              hasMore={hasMore}
              loader={<span className={styles.loader}><Preloader size='md'/></span>}
            >
              <div className={styles.grid}>
              {
                playlistsList && playlistsList?.map((playlist, idx) => (
                  <SongCard 
                    id={playlist.id} 
                    key={idx}
                    image={playlist.imageUrl} 
                    name={playlist.name}
                    onClick={() => router.push(`/playlist/${playlist.id}`)}
                    playlistCard
                  />
                ))
              }
            </div>
            </InfiniteScroll>
          ) : <h3>No data found</h3>
        }
      </div>
    </>
  )
}

export default Playlist