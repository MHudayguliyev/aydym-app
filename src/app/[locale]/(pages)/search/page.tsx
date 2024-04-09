'use client';
import React, { useEffect } from 'react'
import { useQuery } from 'react-query';
import { useSearchParams } from 'next/navigation';
//styles 
import styles from './page.module.scss';
//api
import { GetSearchData, GetWithSearchType } from '@api/Queries/Getters';
//comps
import SongSearch from '@components/SongSearch/SongSearch';
//utils
import { CheckObjOrArrForNull } from '@utils/helpers';


const Search = () => {
  const searchParams = useSearchParams()
  const mask = searchParams.get('mask')
  const type = searchParams.get('type')

  const {
    data: searchData, 
    isLoading, 
    isError
  } = useQuery(["GetSearchData", mask], () => GetSearchData(mask!), {
    enabled: !!mask, refetchOnWindowFocus: false
  })

  const {
    data: searchDataWithType,
  } = useQuery(['GetWithSearchType', type, mask], () => GetWithSearchType(type!, mask!), {
    refetchOnWindowFocus: false
  })

  return (
    <>
      <div className={styles.hero}></div>

      <div className={styles.wrapper}>
        
        <h1>Gozleg: <span>{mask}</span></h1>

        <SongSearch 
          searchData={
            CheckObjOrArrForNull(
              type === 'artists' ? searchDataWithType?.artists?.data :
              type === 'songs' ? searchDataWithType?.songs?.data : 
              type === 'albums' ? searchDataWithType?.albums?.data : 
              type === 'playlists' ? searchDataWithType?.playlists?.data : 
              type === 'genres' ? searchDataWithType?.genres?.data : 
              searchDataWithType?.videos?.data
            ) ? searchDataWithType! : searchData!
          }
          fetchStatus={{
            isLoading, isError
          }}
          mask={mask as string}
        />
      </div>
    </>
  )
}

export default Search
