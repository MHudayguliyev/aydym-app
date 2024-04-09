import React from 'react'
//type
import CommonModalI from '../CommonModali'
//lib
import Modal from '@compLibrary/Modal'
import Button from '@compLibrary/Button';
import Divider from '@compLibrary/Divider';
//styles
import styles from './Modal.module.scss';

interface ActivationModalProps extends CommonModalI {
    dates: {
        startingDate: string 
        endingDate: string
    }
}
const SuccessModal = (props: ActivationModalProps) => {
    const {
        show, 
        close, 
        dates
    } = props

  return (
    <>
      <Modal
        isOpen={show}
        close={close}
        className={styles.activationModal}
        header={
            <>
            <div className={styles.header}>
              <h5>Üstünlikli ýerine ýetirildi</h5>
              <Button color='light' roundedLg onClick={()=> close()}>
                  X
              </Button>
            </div>
            <Divider />
          </>
        }
      >
        
        <p className={styles.successText}>
            {
                `Hormatly Müşderi, gutlaýarys, indi sizde şu sene aralyklarynda ${dates.startingDate} - ${dates.endingDate} PREMIUM hasap bar.`
            }
        </p>
      </Modal>
    </>
  )
}

export default SuccessModal
