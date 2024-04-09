import React from 'react'
import { useTranslation } from 'react-i18next';
//styles
import styles from './Badge.module.scss';
import classNames from 'classnames/bind';

type BagdeProps<T> = {
    data: T[] | any
}
const cn = classNames.bind(styles)
function Badge <T>(props: BagdeProps<T>) {
    const { data } = props
    // translations
    const { t } = useTranslation()
  return (
    <div className={styles.badge__container}>
        {
            data.map((item:any, index:number) => (
                <div className={styles.badge} key={index}>
                    <span>{item.count}</span>
                    <p>{item.title}</p>
                </div>
            ))
        }
    </div>
  )
}

export default Badge