import React, {useRef, useEffect} from 'react'
import { useRouter } from '@lang/navigation';
//styles
import styles from './Adv.module.scss';
import Image from 'next/image';
//lib
import Button from '@compLibrary/Button';
//redux
import { useAppSelector, useAppDispatch } from '@hooks/redux_hooks';
import { continueListening, stopListeningOnGetPremium } from '@redux/reducers/MediaReducer';
//utils
import { getFromStorage, setToStorage } from '@utils/storage';
import { CheckObjOrArrForNull, findByKeyName, getAudioAdvStatistics, getMillis, isEmpty, parse, roundMinutes, stringify } from '@utils/helpers';



interface SongAdvProps {}
const Adv = (props: SongAdvProps) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const audioRef:any = useRef(null)
    const adv = useAppSelector(state => state.mediaReducer.adv)

    useEffect(() => {
        if(audioRef && audioRef.current)
            audioRef.current.play()
    }, [audioRef])

    const onTimeUpdate = () => {
        const audio = audioRef?.current
        const playedPercentage = 100 / (audio.duration / audio.currentTime)
        const fixed = parseInt(playedPercentage.toFixed(0))
        // console.log("fixed", fixed)
        if(fixed === 20){
            const banners = parse(getFromStorage('audioBanners'))
            if(CheckObjOrArrForNull(banners)){
                for(let i = 0; i < banners.length; i++){
                    const banner = banners[i]
                    if(banner.id === adv.id){
                        // @ts-ignore
                        banner.s = parseFloat(banner.s) + parseFloat((1 / parseFloat(banner.adCount)))  
                    }
                }
                for(let i = 0; i < banners.length; i++){
                    for(let j = 0; j < banners.length - i - 1; j++){
                        if(banners[j].s > banners[j + 1].s){
                            const temp = banners[j]
                            banners[j] = banners[j + 1]
                            banners[j + 1] = temp 
                        }
                    }
                }
                setToStorage('audioBanners', stringify(banners))
            }
        }
    }

    const onEnded = () => {
        const advId = adv?.id
        const stats = getAudioAdvStatistics()
        const existAudioTypeObj = [...stats].find((stat) => stat.type === 'audioAdv')
        const existAudioAdvObj = [...existAudioTypeObj!.stats].find((stat:any) => stat.audioAdvId === advId)
        const millis = getMillis()
        if(CheckObjOrArrForNull(existAudioAdvObj)){
            
            const existAudioAdvMillisObject = findByKeyName([...existAudioAdvObj!.listens], millis)
            if(CheckObjOrArrForNull(existAudioAdvMillisObject)) existAudioAdvMillisObject![millis] += 1
            else {
                const aObj: {[key:string]: number} = {}
                aObj[millis] = 1
                existAudioAdvObj!.listens.push({...aObj})
            }
        }else {
            const aObj: {[key:number]: number} = {}
            aObj[millis] = 1
            existAudioTypeObj!.stats.push({
                audioAdvId: advId, 
                listens: [aObj]
            })
        }
        setToStorage('audio_adv_stats', stringify(stats))
        dispatch(continueListening())
    }

  return (
    <div className={styles.wrapper}>
        {
            adv && !isEmpty(adv?.url) && (
                <audio
                    ref={audioRef}
                    src={adv?.url}
                    onEnded={onEnded}
                    onTimeUpdate={onTimeUpdate}
                />
            ) 
        }

        <div className={styles.content}>
            <div className={styles.imgWrapper}>
                <Image src={adv?.img ? adv?.img : '/gaygysyz.webp'} alt='gaygysyz.webp' width='400' height='400'/>
            </div>
            <h2 className={styles.header}>
                {adv?.name ? adv.name : 'Gaýgysyz market'}
            </h2>
            <p className={styles.text}>
                Aydym.com ulgamynda aydymlary reklamasyz dinlemek isleseniz, we PREMIUM vidoelary 
                gormek isleseniz asaky duwma basyn
            </p>

            <div className={styles.buttonWrapper}>
                <Button color='violet' rounded onClick={() => {
                    router.push('/purchase')
                    dispatch(stopListeningOnGetPremium())
                }}>
                    Go premium
                </Button>
            </div>
        </div>
    </div>
  )
}

export default Adv
