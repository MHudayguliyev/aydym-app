import React from 'react'
// custom styles
import classNames from 'classnames/bind';
import styles from './Preloader.module.scss';
import { capitalize } from '../../utils/helpers';

interface PreloaderProps {
    size: 'sm' | 'md'
}

const cn = classNames.bind(styles)
export default function Preloader({size = 'md'}: PreloaderProps) {
    return (
        <div className={cn({
            [`status${capitalize(size)}`]: true
        })}>
            <div className={cn({
                chase_base: true, 
                [`spinner_chase${capitalize(size)}`]: true
            })}>
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
            </div>
        </div>
    )
}
