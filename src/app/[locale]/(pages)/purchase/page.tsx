'use client';
import { useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
//icons 
import checkbox from '@app/assets/icons/checkbox.svg'
//query
import { useQuery } from 'react-query';
//localization
import { useLocale } from 'next-intl';
//styles
import styles from './page.module.scss';
//api
import { GetPremiumTypes } from '@api/Queries/Getters';
import { makePremium } from '@api/Queries/Post';
//libs
import Button from '@compLibrary/Button';
//react hot toast
import toast from 'react-hot-toast';
//utils
import { isUndefined } from '@utils/helpers';
//comps
import AuthMiddleware from '@components/AuthMiddleware';
//icons 
import Vip from '@components/icons/vip/icon';

const Purchase = () => {
    const locale = useLocale()
    const router = useRouter()

    const {
        data: premiumTypes, 
        isLoading, 
        isError
    } = useQuery(['GetPremiumTypes', locale], () => GetPremiumTypes(locale), {
        refetchOnWindowFocus: false
    })


    const goPremium = async (premiumType: string) => {
        try {
            console.log('premiumType', premiumType)
            const response = await makePremium(premiumType)
            console.log('resp', response)
            if(response.status){
                if(!isUndefined(response.redirectUrl)){
                    router.push(response.redirectUrl)
                }else {
                    // setOpenModal(true)
                    // localStorage.setItem('isPremium', 'true');
                }
            }else return toast.error(response.text)

        } catch (error) {
            console.log('make premium error', error)
        }
    }

    const premiumTypeGetter = useCallback((data: any, index: number) => {
        return (
            <div className={styles.plan_col} key={index}>
                <div className={styles.plan_body}>
                    <h4>
                        <Vip />
                        {data.name}
                    </h4>
                    <div className={styles.price}>{data.price}</div>
                    <p>What you'll get</p>

                    <div className={styles.features}>
                        {
                            premiumTypes?.features.map((feature, featureI) => (
                                <div className={styles.feature} key={featureI}>
                                    <Image src={checkbox} alt='checkbox'/>
                                    <span>{feature}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className={styles.plan_footer}>
                    <Button color='darkblue' style={{width: '100%'}} onClick={() => goPremium(data.type)}>
                        Go Premium
                    </Button>
                </div>
            </div>
        )
    }, [premiumTypes])


  return (
    <>
      <div className={styles.hero}></div>

      <div className={styles.wrapper}>
        <div className={styles.header}>
            PREMIUM Satyn almak
        </div>

        <div className={styles.plan}>
            <div className={styles.plan_data}>

                {
                    premiumTypes?.profiles.map((data, i) => {
                        if(i >= 3)
                            return null 
                        return premiumTypeGetter(data, i)
                    })
                }

            </div>
        </div>  


        <div className={styles.plan}>
            <div className={styles.plan_data}>

                {
                    premiumTypes?.profiles.map((data, i) => {
                        if(i < 3)
                            return null 
                        return premiumTypeGetter(data, i)
                    })
                }

            </div>
        </div>
                
      </div>
    </>
  )
}

export default AuthMiddleware(Purchase)
