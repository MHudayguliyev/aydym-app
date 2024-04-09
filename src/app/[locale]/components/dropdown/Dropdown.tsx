'use client'
import React, {useState, useRef} from 'react'
import styles from './dropdown.module.scss'
import {moreHorizontal, moreVertical } from '@app/assets/icons'
import Image from 'next/image'

// hooks
import useClickOutside from '@app/hooks/useOutClick'
import { Localization } from '@app/types'

interface IDropdown {
  data: Localization[]
  orientation: 'horizontal' | 'vertical'
}

export default function Dropdown({orientation, data}:IDropdown) {

  const contentRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  const [modalActive, setModalAcitive] = useClickOutside(contentRef, toggleRef, "click");

  const activeHandler = () => {
    setModalAcitive(prev => !prev);
  }
  
  return (
    <div className={styles.dropdown}>
        <div 
            className={styles.dropdown__icon}
            onClick={activeHandler}
            ref={toggleRef}
        >
          {orientation === 'horizontal' && (
            <Image src={moreHorizontal} alt="more icon" />
          )}
          {orientation === 'vertical' && (
            <Image src={moreVertical} alt="more icon" />
          )}

        </div>
        {modalActive && (
        <ul className={styles.dropdown__menu} ref={contentRef}>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                {index === data.length-1 && (
                  <li className={styles.dropdown__divider}></li>
                )}
                <li>
                  <a className={styles.dropdown__item}>{item.ru}</a>
                </li>
              </React.Fragment>
            ))}
        </ul>
        )}
    </div>
  )
}
