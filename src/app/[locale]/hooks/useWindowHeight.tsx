import { useEffect, useState } from 'react'

export const useWindowHeight = (incrementBy:number): [number, React.Dispatch<React.SetStateAction<number>>] => {

    const [offset, setOffset] = useState<number>(0)

   useEffect(() => {
    function handleScroll() {
        const offsetHeight = document.documentElement.offsetHeight
        const innerHieght = window.innerHeight
        const scrollTop = document.documentElement.scrollTop
        if (innerHieght + scrollTop >= offsetHeight) 
        setOffset(prev => prev + incrementBy)
    }


    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
   }, [])

   return [offset, setOffset];
}