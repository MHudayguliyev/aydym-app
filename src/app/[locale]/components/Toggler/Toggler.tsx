import React, { CSSProperties } from 'react'
//redux
import { useAppSelector } from '../../hooks/redux_hooks'
//styles
import classNames from 'classnames/bind'
import styles from './Toggler.module.scss'

interface TogglerProps {
  styles?: CSSProperties
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const cn = classNames.bind(styles)
const Toggler = React.forwardRef<HTMLDivElement, TogglerProps>((props, ref): JSX.Element => {
  const {
    styles, 
    onClick
  } = props

  const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)
  const showHiddenSidebar = useAppSelector(state => state.sidebarReducer.showHiddenSidebar)
  return (
    <div ref={ref} style={styles} className={cn({
        toggle_sidebar: true, 
        annuleSpanWidth: sidebarFolded, 
        changeBg: showHiddenSidebar 
      })} onClick={e => onClick(e)}>
          <span></span>
          <span></span>
          <span></span>
      </div>
  )
})

export default Toggler

