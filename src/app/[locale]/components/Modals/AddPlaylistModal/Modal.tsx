'use client';
import React, {useEffect, useState} from 'react'
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
//styles
import classNames from 'classnames/bind';
import styles from './Modal.module.scss';
//common type
import CommonModalI from '../CommonModali';
//libs
import Modal from '@compLibrary/Modal';
import Button from '@compLibrary/Button';
import Divider from '@compLibrary/Divider';
import Input from '@compLibrary/Input';
import Preloader from '@compLibrary/Preloader';
//utils
import { CheckObjOrArrForNull, isEmpty } from '@utils/helpers';
//api
import { addToPlaylist, renamePlaylist } from '@api/Queries/Post';
import { GetPersonalPlaylist } from '@api/Queries/Getters';
//redux 
import { useAppSelector } from '@hooks/redux_hooks';
//toast 
import toast from 'react-hot-toast';

interface ModalProps extends CommonModalI{}
const cn = classNames.bind(styles)
const AddPlaylistModal = (props: ModalProps) => {
    const {
        show, 
        close
    } = props
    const router = useRouter()

    const songId = useAppSelector(state => state.topnavbarReducer.songId)
    const editMode = useAppSelector(state => state.topnavbarReducer.editMode)
    const valueToEdit = useAppSelector(state => state.topnavbarReducer.valueToEdit)
    const [value, setValue] = useState<string>(editMode ? valueToEdit : "")

    const {
      data: playlists, 
      isLoading, 
      isError
    } = useQuery(['GetPersonalPlaylist', show], () => GetPersonalPlaylist(), {
      refetchOnWindowFocus: false, 
      enabled: show
    })

    useEffect(() => {
      if(!show && !isEmpty(value)) setValue("")
    }, [show])

    useEffect(() => {
      if(editMode) setValue(valueToEdit)
    }, [editMode, valueToEdit])

    const addPlaylist = async (e: any) => {
      e.preventDefault();
      const freshValue = value.replace(/\s+$/, '')
      if(!isEmpty(freshValue)){

        if(editMode){
          try {
            const response = await renamePlaylist(songId, {name: freshValue})
            // console.log('response', response)
            if(response.status) {
              toast.success('Successfully edited.')
              close()
              router.replace(`/userPlaylist`)
            }
          } catch (error) {
            console.log('Edit playlist error ', error)
          }

        }else {
          try {
            let key: 'name' | 'userPlaylistId' = 'name'
            let playlistId; 
            for(let i = 0; i < playlists!?.length; i++){
              const name = playlists?.[i]?.name
              if(name === freshValue) {
                key = 'userPlaylistId'
                playlistId = playlists?.[i]?.id
                break;
              }
            }
  
            const response = await addToPlaylist({
              id: songId, 
              [key]: key === 'userPlaylistId' ? playlistId : freshValue,  
              type: 'SONG'
            })
            // console.log('resdponse', response)
            if(response.status) {
              toast.success('Successfully added.')
              close()
            }

          } catch (error) {
            console.log('Add to playlist error ', error)
          }
        }
      }
    }

  return (
    <>
    <Modal
      isOpen={show}
      close={close}
      className={styles.addPlaylistModal}
      header={
        <>
          <div className={styles.header}>
              <div className={styles.content}>
                <h5>Add to playlist</h5>
                <p>Bar bolanlara gosun ya-da taze saylan.</p>
              </div>
              <Button color='light' roundedLg onClick={()=> close()}>
                  X
              </Button>
          </div>
          <Divider />
        </>
      }
    >
        <form  className={styles.modalBody} onSubmit={addPlaylist}>
          <Input 
            type='text'
            placeholder='Playlistin ady'
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={styles.inputField}
          />
          <Button color='violet' htmlType='submit'>
            {
              editMode ? 'Rename' : '+Add'
            }
          </Button>
        </form>
        
       {
        !editMode && CheckObjOrArrForNull(playlists) && (
          <div className={styles.footer}>
            {
              isLoading ? <div className={styles.loader}>
                <Preloader size='md'/>
              </div>
              : isError ? <div className={styles.error}>
                No Personal playlist found.
              </div> 
              : 
              (
                <div className={styles.playlists}>
                  <h5>Personal playlists</h5>
                  {
                    playlists?.map((playlist, i) => (
                      <div className={cn({
                        playlist: true, 
                        borderBottom: i !== playlists.length -1, 
                      })} key={playlist.id} onClick={() => setValue(playlist.name)}>
                        <p>{playlist.name}</p>
                      </div>
                    ))
                  }
                </div>
              )
            }
          </div>
        )
       }
    </Modal> 
    </>
  )
}

export default AddPlaylistModal
