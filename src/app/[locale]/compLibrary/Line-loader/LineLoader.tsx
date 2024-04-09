import React, { useEffect, useRef, useState } from 'react'
import styles from './LineLoader.module.scss';

const LineLoader = () => {
    const loaderRef:any = useRef(null)

    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 50));
      }, 500);
  
      return () => {
        clearInterval(timer);
      };
    }, [])

  return (
    <div className={styles.loader} ref={loaderRef} style={{ width: `${progress}%` }}></div>
  )
}

export default LineLoader
