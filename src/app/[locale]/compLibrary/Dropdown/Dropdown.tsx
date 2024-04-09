import React from 'react'
//styles
import styles from './Dropdown.module.scss';
import { Localization } from '@app/types';
import {useLocale} from 'next-intl'

type SortType = 'sortingDate' | 'popular'
 
interface DropdownProps {
    data: {
        value: string, 
        label: Localization
    }[]
    onChange: (value: SortType) => void
}
const Dropdown = (props: DropdownProps) => {
    const {
        data, 
        onChange
    } = props

    const locale = useLocale()

  return (
    <>
        <select className={styles.dropdown} onChange={e => onChange(e.target.value as SortType)}>
            {
                data.map((item, index) => (
                    <option key={index} value={item.value}>{item.label[locale as keyof Localization]}</option>
                ))
            }
        </select>
    </>
  )
}

export default Dropdown
