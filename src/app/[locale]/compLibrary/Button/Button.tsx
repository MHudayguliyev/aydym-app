/* eslint-disable react/display-name */
'use-client'
import React, {CSSProperties, ReactNode} from 'react'
import Link, {LinkProps} from 'next/link'
//styles
import classNames from 'classnames/bind'
import styles from './Button.module.scss'
//utils
import { capitalize } from '@app/utils/helpers'
//icons 
import loadingIcon from '@app/assets/images/loading.gif';
import Image from 'next/image'

type ButtonProps = {
    children: ReactNode 
    icon?: ReactNode
    /** @defaultValue blue  */
    color: 'blue' | 'darkblue' | 'violet' | 'light' | 'dark' | 'green' | 'red' | 'yellow'
    onClick?: (event: any) => void;
    /** @defaultValue false  */
    disabled?: boolean
    /** @defaultValue false  */
    rounded?: boolean
    /** @defaultValue false  */
    roundedSm?: boolean
    /** @defaultValue false  */
    roundedLg?: boolean
    /** @defaultValue false  */
    loading?: boolean
    /** @defaultValue false  */
    withIcon?: boolean
    linkProps?: LinkProps
    htmlType?: "button" | "submit" | "reset",
    style?: CSSProperties
    className?: any
}
const cn = classNames.bind(styles)
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref): JSX.Element => {
    const {
        children,
        icon,
        style, 
        className = "",
        color = 'blue', 
        onClick, 
        disabled = false,
        rounded = false, 
        roundedSm = false, 
        roundedLg = false,
        loading = false,
        withIcon = false, 
        linkProps, 
        htmlType = 'button'
    } = props

  return (
    <button ref={ref} type={htmlType} style={style} onClick={onClick} disabled={disabled}  className={`${
        cn({
            baseStyle: true, 
            rounded: rounded, 
            roundedSm: roundedSm, 
            roundedLg: roundedLg, 
            [`color${capitalize(color)}`]: true, 
            opacitate: loading,
        })
    } ${className}`}>
        {
            linkProps?.href ? 
                <Link 
                    {...linkProps} 
                    
                    className={ cn({
                        link: true,
                        withIcon: withIcon
                    })}
                >
                   {withIcon ? (
                    <>
                        {icon}
                        {children}
                    </>
                   ): (
                    <>
                        {children}
                    </>
                   )}
                    
                </Link> : 
                loading ? (
                    <div className={styles.loading_wrapper}>
                        <Image src={loadingIcon} alt='loading' className={styles.loadingBtn}/>
                        {children}
                    </div>
                ) : children
        }
    </button>
  )
})

export default Button
