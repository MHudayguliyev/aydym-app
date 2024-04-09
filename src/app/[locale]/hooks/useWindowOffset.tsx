import { useEffect, useState } from 'react'

export const useWindowScrollPositions = () => {

   const [scrollposition, setposition] = useState({ scrollx: 0, scrolly: 0 })

   useEffect(() => {
    function updateposition() {
        // const isBottom =
        // window.innerHeight + window.scrollY >= document.documentElement.offsetHeight;
        setposition({ scrollx: window.scrollX, scrolly: window.scrollY })
        // console.log("isBottom", isBottom)
    }

    window.addEventListener('scroll', updateposition)
    updateposition()

    return () => window.removeEventListener('scroll', updateposition)
   }, [])

   return scrollposition
}