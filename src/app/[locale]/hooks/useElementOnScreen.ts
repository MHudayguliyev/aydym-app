import React, {useRef, useState, useEffect} from 'react'

interface OptionsType {
    root: null
    rootMargin: string 
    threshold: number
}
const useElementOnScreen = (options: OptionsType): [any, boolean] => {
    const containerRef:any = useRef(null)
    const [visible, setVisible] = useState<boolean>(false)

    const callbackFN = (entries:any) => {
        const [ entry ] = entries
        setVisible(entry.isIntersecting)
    }
    
    useEffect(() => {
        const observer = new IntersectionObserver(callbackFN, options)
        if(containerRef.current) observer.observe(containerRef.current)

        return () => {
            if(containerRef.current) observer.unobserve(containerRef.current)
        }
    }, [containerRef, options])

    return [containerRef, visible]
}

export default useElementOnScreen
