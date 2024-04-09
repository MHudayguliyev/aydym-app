import React,{MouseEventHandler, useMemo} from 'react'

interface MoreIconProps {
    color?: 'theme'| 'dark' | 'light'
    /** @defaultValue horizontal */
    orientation?: 'vertical' | 'horizontal'
    onClick?: (event: any) => void
    className?: string 

}

const MoreI = React.forwardRef<SVGSVGElement, MoreIconProps>((props, ref): JSX.Element => {
    const {
        color = 'theme', 
        orientation='horizontal', 
        onClick, 
        className = ''

    } = props

    const styles = {
        cursor: 'pointer'
    }

    const colorMem = useMemo(() => {
        if(color === 'theme')
            return 'var(--icon-main-bg)'
        else if(color === 'light')
            return '#fff'
        return '#000'
    }, [color])

    return (
        <>
            {
                orientation === 'horizontal' ? 
                <svg className={className} style={styles} ref={ref} onClick={onClick} stroke={colorMem} fill={colorMem} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg> : 
                
                <svg className={className} style={styles} ref={ref} onClick={onClick} stroke={colorMem} fill={colorMem} strokeWidth="0" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path></svg>
            } 
        </>
    )
}) 

export default MoreI

