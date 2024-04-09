import React,{useState, useEffect, useMemo} from 'react'
import { useQuery } from 'react-query'
//styles
import styles from './Modal.module.scss'
//types
import CommonModalI from '../CommonModali'
//lib
import Modal from '@compLibrary/Modal'
import Button from '@compLibrary/Button'
import Divider from '@compLibrary/Divider'
import { GetHtml } from '@lang/app/[locale]/api/Queries/Getters'

interface BannerModalProps extends CommonModalI {
  url: string 
}
const BannerModal = (props: BannerModalProps) => {
    const {
        show, 
        close, 
        url
    } = props

    const updatedUrl = useMemo(() =>  url?.replace('tapgo.biz:8443', 'tmcars.info'),[url])
    const {
      data
    } = useQuery(['GetHtml', updatedUrl], () => GetHtml(updatedUrl), {
      refetchOnWindowFocus: false, enabled: !!updatedUrl
    })

  return (
    <>
      <Modal
        isOpen={show}
        close={close}
        className={styles.bannerModal}
        header={
          <>
            <div className={styles.header}>
              <Button color='light' onClick={()=> close()}>
                x
              </Button>
            </div>
            <Divider />
          </>
      }
      >
        <div dangerouslySetInnerHTML={{ __html: data }} />;
      </Modal>
    </>
  )
}

export default BannerModal
