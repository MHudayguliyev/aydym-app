import React from 'react'

interface ItemProfileIconProps {
    iType: 'play' | 'pause' | 'like' | 'download'
    liked?: boolean
    isPlay?: boolean
    onClick?: (event: any) => void;
}

const ItemProfileIcons = (prpos:ItemProfileIconProps) => {
    const {
        iType = 'like',
        liked=false,
        isPlay=false,
        onClick
    } = prpos

  return (
    <>
    {
        iType === 'like' ? (
          liked ? <svg onClick={onClick} xmlnsXlink="http://www.w3.org/1999/xlink"  stroke="#E72412" fill="#E72412" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z"></path></svg>
                : <svg onClick={onClick} xmlnsXlink="http://www.w3.org/1999/xlink"  stroke="var(--text-color-main)" fill="var(--text-color-main)" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853ZM18.827 6.1701C17.3279 4.66794 14.9076 4.60701 13.337 6.01687L12.0019 7.21524L10.6661 6.01781C9.09098 4.60597 6.67506 4.66808 5.17157 6.17157C3.68183 7.66131 3.60704 10.0473 4.97993 11.6232L11.9999 18.6543L19.0201 11.6232C20.3935 10.0467 20.319 7.66525 18.827 6.1701Z"></path></svg>
        ) :
        iType === 'download' ? 
        <svg stroke="var(--text-color-main)" fill="var(--text-color-main)" strokeWidth="0" viewBox="0 0 24 24" height="1.5rem" width="1.5rem" xmlns="http://www.w3.org/2000/svg"><path d="M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z"></path></svg>:
    
        iType === 'play' ? 
        <svg  xmlnsXlink="http://www.w3.org/1999/xlink" stroke="#ffffff" fill="#ffffff" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M19.376 12.4158L8.77735 19.4816C8.54759 19.6348 8.23715 19.5727 8.08397 19.3429C8.02922 19.2608 8 19.1643 8 19.0656V4.93408C8 4.65794 8.22386 4.43408 8.5 4.43408C8.59871 4.43408 8.69522 4.4633 8.77735 4.51806L19.376 11.5838C19.6057 11.737 19.6678 12.0474 19.5146 12.2772C19.478 12.3321 19.4309 12.3792 19.376 12.4158Z"></path></svg>:
        
        iType === 'pause' ? 
        <svg width="1.5rem" height="1.5rem" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="20" fill="none"></circle><path d="M15 12C13.8954 12 13 12.8954 13 14V26C13 27.1046 13.8954 28 15 28H17C18.1046 28 19 27.1046 19 26V14C19 12.8954 18.1046 12 17 12H15ZM23 12C21.8954 12 21 12.8954 21 14V26C21 27.1046 21.8954 28 23 28H25C26.1046 28 27 27.1046 27 26V14C27 12.8954 26.1046 12 25 12H23Z" fill="#ffffff"></path></svg>:''
    }
    </>
  )
}

export default ItemProfileIcons;