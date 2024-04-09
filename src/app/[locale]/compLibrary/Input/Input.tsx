import React, { InputHTMLAttributes, useRef } from "react";
// custom styles
import styles from './Input.module.scss';
import classNames from 'classnames/bind';
// helpers
import { capitalize } from "@utils/helpers";
//icons 
import searchIcon from '@app/assets/icons/search.svg';
import Image from "next/image";

const cx = classNames.bind(styles);

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
   /** @default medium */
   fontSize?: 'small' | 'medium' | 'big'
   /** @defualt medium */
   fontWeight?: 'normal' | 'medium' | 'bold'
   autoFocus?: boolean
   maxLength?: number
   /** @defaultValue false */
   searchI?: boolean
   /** @defaultValue false */
   removeTheForm?: boolean
   onSearchClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref): JSX.Element => {
   const {
      fontSize = 'medium',
      fontWeight = 'medium',
      className,
      autoFocus,
      searchI, 
      removeTheForm = false, 
      onSearchClick, 
   } = props;

   return (
      <div className={cx({
         theForm: !removeTheForm
      })}>
         {
            searchI && 
            <Image 
               src={searchIcon} 
               alt="search" 
               style={{cursor: 'pointer'}}
               onClick={(e) => onSearchClick && onSearchClick(e)}
            />
         }
         <input  autoFocus={autoFocus} ref={ref} {...props} className={`${className} ${cx({
            input: true,
            [`fontSize${capitalize(fontSize)}`]: true,
            [`fontWeight${capitalize(fontWeight)}`]: true,
         })}
      `} />
      </div>
   )
})

export default Input;