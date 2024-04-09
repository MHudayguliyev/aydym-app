import React, { CSSProperties } from 'react'
import styles from './Divider.module.scss';

interface DivideProps {
  styles?: CSSProperties
}
const Divider = (props: DivideProps) => {

  return (
    <div className={styles.divider} style={props.styles}></div>
  )
}

export default Divider
