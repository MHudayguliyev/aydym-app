import Image from 'next/image'
import styles from '../comments-card.module.scss'
import Link from 'next/link'
import { replyIcon, starFill } from '@app/assets/icons'
import avatar from '@app/assets/images/3.jpg'

interface Reply {
    reply?: boolean;
}

const Comment = (props:Reply) => {
    const {reply = false} = props;
  return (
    <div className={styles.avatar}>
        {/* Image */}
        <div className={styles.avatar__image}>
            <Image src={avatar} alt='avatar' />
        </div>
        {/* Comment content */}
        <div className={styles.avatar__content}>
            <span className={`${styles.avatar__title} ${styles.margin__bottom__1}`}>Komekow Kakamyrat</span>
            <span className={`${styles.avatar__subtitle} ${styles.margin__bottom__2}`}>Dec 12, 2023</span>
            {/* Star Icons */}
            <div className={`${styles.avatar__stars} ${styles.margin__bottom__1}`}>
                <Image src={starFill} alt='star icon' />
                <Image src={starFill} alt='star icon' />
                <Image src={starFill} alt='star icon' />
                <Image src={starFill} alt='star icon' />
            </div>
            {/* Comment */}
            <p> 
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                Iste nemo commodi, perspiciatis itaque repellendus 
                eos corrupti architecto perferendis ducimus provident. 
            </p>
            {/* Reply button */}
            <div className={`${styles.btn} ${styles.btn__link}`}>
                {/* ::before */}
                <div className={styles.btn__wrap}>
                    <Image src={replyIcon} alt='reply'/>
                    <span>Jogap ber</span>
                </div>
                {/* ::after */}
            </div>

            {/* Comment Reply */}
            {reply && (
                <div className={`${styles.avatar} ${styles.margin__top__4}`}>
                {/* Image */}
                    <div className={styles.avatar__image}>
                        <Image src={avatar} alt='avatar' />
                    </div>
                {/* Comment content */}
                    <div className={styles.avatar__content}>
                        <span className={`${styles.avatar__title} ${styles.margin__bottom__1}`}>Aydym.com</span>
                        <span className={`${styles.avatar__subtitle} ${styles.margin__bottom__2}`}>Dec 12, 2023</span>
                        {/* Star Icons */}
                        <div className={`${styles.avatar__stars} ${styles.margin__bottom__1}`}>
                            <Image src={starFill} alt='star icon' />
                            <Image src={starFill} alt='star icon' />
                            <Image src={starFill} alt='star icon' />
                            <Image src={starFill} alt='star icon' />
                        </div>
                        <p> 
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                            Iste nemo commodi, perspiciatis itaque repellendus  
                        </p>
                    </div>
                </div>
            )}
        </div>

    </div>
  )
}

export default Comment