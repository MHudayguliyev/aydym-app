'use client';
import React from 'react'
import Image from 'next/image'
// arrows
import arrow_left from '@app/_assets/icons/arrow_left.svg';
import arrow_right from '@app/_assets/icons/arrow_right.svg';


// styles 
import styles from './PrevNext.module.scss'
import classNames from 'classnames/bind';

type PrevNextTypes = {
    onClick?: () => void
    /** @defaultValue false **/
    right?: boolean
    /** @defaultValue false **/
    left?: boolean
    active?: boolean
}
const cn = classNames.bind(styles)
const PrevNextButton = React.forwardRef<HTMLButtonElement, PrevNextTypes>((props, ref): JSX.Element => {
    const {
        onClick, 
        right = false, 
        left = false, 
        active = false,
    } =props
    return (
        <div className={cn({
            button__container: true, 
            active: active, 
            removeMedia: right
        })} onClick={onClick}>
            <Image src={left ? arrow_left : arrow_right} alt='arrow'/>
        </div>
    )
}) 

export default PrevNextButton;