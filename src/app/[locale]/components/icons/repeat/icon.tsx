import React, { CSSProperties, useMemo } from 'react'

interface RepeatIconProps {
    active: boolean
    onClick: () => void
    style?: CSSProperties
    className?: string 
}
const RepeatI = (props: RepeatIconProps) => {
    const {
      active = false, 
      onClick, 
      style, 
      className = ''
    } = props

    const styles = {
      cursor: 'pointer', 
      ...style
    }
    const themeColor = useMemo(() => (
        active ? 'var(--main-color-blue)' : 'var(--icon-main-bg)'
    ), [active])

  return (
    <svg className={className} style={styles} onClick={onClick} stroke={themeColor} fill={themeColor} strokeWidth="0" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path d="M8 19.9999V21.9323C8 22.2085 7.77614 22.4323 7.5 22.4323C7.38303 22.4323 7.26977 22.3913 7.17991 22.3165L3.06093 18.884C2.84879 18.7072 2.82013 18.3919 2.99691 18.1798C3.09191 18.0658 3.23264 17.9999 3.38103 17.9999L18 17.9999C19.1046 17.9999 20 17.1044 20 15.9999V7.99987H22V15.9999C22 18.209 20.2091 19.9999 18 19.9999H8ZM16 3.99987V2.06738C16 1.79124 16.2239 1.56738 16.5 1.56738C16.617 1.56738 16.7302 1.60839 16.8201 1.68327L20.9391 5.11575C21.1512 5.29253 21.1799 5.60782 21.0031 5.81995C20.9081 5.93395 20.7674 5.99986 20.619 5.99986L6 5.99987C4.89543 5.99987 4 6.89531 4 7.99987V15.9999H2V7.99987C2 5.79074 3.79086 3.99987 6 3.99987H16Z"></path></svg>
  )
}

export default RepeatI
