import React from 'react'
//styles
import classNames from 'classnames/bind'
import styles from './Modal.module.scss'
//libs
import Modal from '@app/compLibrary/Modal'
//Common type
import CommonModalI from '../CommonModali'
//json data
import SearchType from '@api/Types/queryReturnTypes/SearchType'
//rels
import SongSearch from '../../SongSearch/SongSearch'

interface SearchModalProps extends CommonModalI {
  data: SearchType
  fetchStatuses: {
    isLoading: boolean
    isError: boolean
  }
  searchValue: string 
}
const cn = classNames.bind(styles)
const SearchModal = (props: SearchModalProps) => {
    const {
        show, 
        close, 
        data, 
        fetchStatuses, 
        searchValue
    } = props

  return (
    <>

    <Modal 
        isOpen={show}
        close={close}
        className={cn({
          search_modal: true, 
        })}
    >
       <div className={styles.search_body}>
        <SongSearch 
          searchData={data}
          fetchStatus={{
            isLoading: fetchStatuses.isLoading, 
            isError: fetchStatuses.isError
          }}
          mask={searchValue}
          onLinkTouch={() => close()} // close modal when link clicked
        />
       </div>
    </Modal>
      
    </>
  )
}

export default SearchModal
