import React from 'react'
//styles
import classNames from 'classnames/bind';
import styles from './icon.module.scss';
//preloader 
import Preloader from '@compLibrary/Preloader';

interface PlayPauseIconProps {
    status: {
        isPlaying: boolean
        isLoading: boolean
    }
    onClick: () => void
}
const cn = classNames.bind(styles)
const PlayPauseI = (props: PlayPauseIconProps) => {
    const {
        status, 
        onClick
    } = props


  return (
    <div className={cn({
        wrapper: true, 
        hoverable: status.isPlaying && !status.isLoading, 
        makeBgActive: status.isPlaying && !status.isLoading, 
    })} onClick={() => {
        if(!status.isLoading && onClick) onClick()
    }}>
        {
            status.isLoading ? 
                <Preloader size='sm'/>:
                status.isPlaying ? 
                <svg stroke="var(--light)" fill="var(--light)" strokeWidth="0" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path d="M6 5H8V19H6V5ZM16 5H18V19H16V5Z"></path></svg>  : 
                <svg  stroke="var(--icon-main-bg)" fill="var(--icon-main-bg)" strokeWidth="0" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path d="M19.376 12.4158L8.77735 19.4816C8.54759 19.6348 8.23715 19.5727 8.08397 19.3429C8.02922 19.2608 8 19.1643 8 19.0656V4.93408C8 4.65794 8.22386 4.43408 8.5 4.43408C8.59871 4.43408 8.69522 4.4633 8.77735 4.51806L19.376 11.5838C19.6057 11.737 19.6678 12.0474 19.5146 12.2772C19.478 12.3321 19.4309 12.3792 19.376 12.4158Z"></path></svg>
        }  
    </div>
  )
}

export default PlayPauseI
