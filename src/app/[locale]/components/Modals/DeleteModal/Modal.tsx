import React from 'react'
import CommonModalI from '../CommonModali'
//modal
import Modal from '@compLibrary/Modal'
//styles
import styles from './Modal.module.scss';
import Button from '@compLibrary/Button';

interface DeleteModalProps extends CommonModalI{
    onAgree: () => void
}
const DeleteModal = (props: DeleteModalProps) => {
    const {
        show, 
        close, 
        onAgree
    } = props
  return (
    <>
      <Modal
        isOpen={show}
        close={close}
        className={styles.deleteModal}
      >
        <h3 className={styles.text}>Do you want to continue?</h3>

        <div className={styles.buttonGroup}>
            <Button color='violet' onClick={() => onAgree()}>
                Yes
            </Button>
            <Button color='yellow' onClick={() => close()}>
                No
            </Button>
        </div>
      </Modal>
    </>
  )
}

export default DeleteModal
