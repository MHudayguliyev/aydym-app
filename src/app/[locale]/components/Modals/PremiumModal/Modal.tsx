import React from 'react'
import Image from 'next/image'
import { useQuery } from 'react-query'
//styles
import styles from './Modal.module.scss'
//icons 
import checkbox from '@app/assets/icons/checkbox.svg'
//types
import CommonModalI from '../CommonModali'
//libs
import Modal from '@compLibrary/Modal'
import Button from '@compLibrary/Button'
import Divider from '@compLibrary/Divider'
import Preloader from '@compLibrary/Preloader'
//api
import { GetPremiumData } from '@api/Queries/Getters'

interface PremiumModalTypes extends CommonModalI {
    locale: string
}

const PremiumModal = (props: PremiumModalTypes) => {
    const {
        show, 
        close, 
        locale
    } = props

    const {
        data: premiumData, 
        isLoading, 
        isError
    } = useQuery(['GetPremiumData', show], () => GetPremiumData(locale), {
        refetchOnWindowFocus: false, 
        enabled: show
    })
  return (
    <Modal
        isOpen={show}
        close={close}
        className={styles.premiumModal}
        header={
            <>
                <div className={styles.header}>
                    <h5>Premium hasap</h5>
                    <Button color='light' roundedLg onClick={()=> close()}>
                        X
                    </Button>
                </div>
                <Divider />
            </>
        }
    >
        {
            isLoading ? <span className={styles.loading}><Preloader size='md'/></span> : 
            (
                <div className={styles.body}>
                    <div className={styles.body_header}>
                        Hormatly Müşderi, sizdäki {premiumData?.profileType} hasap:
                    </div>

                    <div className={styles.profiles}>
                        {
                            premiumData?.profiles.map((profile, index) => (
                                <div className={styles.profile} key={index}>
                                    <Image src={checkbox} alt='checkbox'/>
                                    <span>{profile.profileType}: {profile.startingDate} - {profile.endingDate}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )
        }
        <Divider />
        
        <div className={styles.footer}>
            <Button color='darkblue' onClick={()=> close()}>
                OK, dowam etmek
            </Button>
        </div>

    </Modal>
  )
}

export default PremiumModal
