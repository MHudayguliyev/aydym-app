import React from 'react'
//styles
import styles from './icon.module.scss'
import classNames from 'classnames/bind'

interface ListIconProps {
    /** @defaultValue like */
    iType: 'like' | 'more' | 'vip'
    /** @defaultValue false */
    liked?: boolean
    /** @defaultValue false */
    withBgActive?: boolean
    onClick?: (event: any) => void
    className?: string
}
const cn = classNames.bind(styles)
const ListIcons = React.forwardRef<SVGSVGElement,ListIconProps>((props, ref): JSX.Element => {
    const {
        iType = 'like', 
        liked = false, 
        withBgActive = false,
        onClick,
        className = ""
    } = props

    const commmonStyles = {
        fontSize: '1.2rem', 
        cursor: 'pointer'
    }

    return (
    <>  
        {
            iType === 'like' ? 
            (
                <div className={`${className} ${cn({ like: withBgActive })}` } onClick={onClick} >
                    {
                        liked ? <svg style={commmonStyles} xmlnsXlink="http://www.w3.org/1999/xlink"  stroke="#E72412" fill="#E72412" strokeWidth="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z"></path></svg> : 
                
                        <svg style={commmonStyles} stroke="var(--dropdown-link-main-color)" fill="var(--dropdown-link-main-color)" strokeWidth="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><g id="Heart"><path d="M12,20.043a.977.977,0,0,1-.7-.288L4.63,13.08A5.343,5.343,0,0,1,6.053,4.513,5.266,5.266,0,0,1,12,5.371a5.272,5.272,0,0,1,5.947-.858A5.343,5.343,0,0,1,19.37,13.08l-6.676,6.675A.977.977,0,0,1,12,20.043ZM8.355,4.963A4.015,4.015,0,0,0,6.511,5.4,4.4,4.4,0,0,0,4.122,8.643a4.345,4.345,0,0,0,1.215,3.73l6.675,6.675,6.651-6.675a4.345,4.345,0,0,0,1.215-3.73A4.4,4.4,0,0,0,17.489,5.4a4.338,4.338,0,0,0-4.968.852h0a.744.744,0,0,1-1.042,0A4.474,4.474,0,0,0,8.355,4.963Z"></path></g></svg>
                    }
                </div>
            )
            : 
            iType === 'more' ? 
            <svg ref={ref} style={commmonStyles} onClick={onClick} stroke="var(--dropdown-link-main-color)" fill="var(--dropdown-link-main-color)" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg> : 
            ""
        }
    </>
    )
})

export default ListIcons



