/* eslint-disable react/display-name */
import React, { CSSProperties, MouseEvent } from "react";
///styles
import classNames from "classnames/bind";
import styles from './SongDetails.module.scss'
//types
import { DropdownType, Localization } from "@app/types";
//locale 
import { useLocale } from "next-intl";
//redux
import { useAppSelector } from "@hooks/redux_hooks";

interface SongDetailsProps {
    data: DropdownType
    id?: number 
    /** @defaultValue false */
    open?: boolean
    style?: CSSProperties
    /** @defaultValue topRight */
    transformOrigin?: 'topRight' | 'topLeft' | "bottomRight" | 'bottomLeft'
    onClick?: (event:MouseEvent, value: string) => void
}

const cn = classNames.bind(styles)
const SongDetails = React.forwardRef<HTMLDivElement, SongDetailsProps>((props, ref): JSX.Element => {
    const {
        data, 
        id, 
        open = false, 
        style, 
        transformOrigin = 'topRight', 
        onClick
    } = props
    const locale = useLocale()
    ///states
    const songData = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)
    // console.log("songData", songData[songIndex])
    return (
        <div className={styles.dropdown} ref={ref}>
            <ul style={style} className={cn({
                dropdown_menu:true, 
                [`${transformOrigin}`]: true, 
                open: open, 
            })}>
                {
                    data.map((item, index) => (
                        <li onClick={(e: MouseEvent) => {
                            if(onClick)
                            onClick(e, item.value)
                        }} key={index} className={cn({
                            each_pro_list: true, 
                            border_top: data.length -1 === index
                        })}>
                            <span>
                                {
                                   ((item.value === 'play' && isPlaying) && 
                                   (
                                    songData[songIndex]?.id === id || songData[songIndex]?.artistId === id || 
                                    songData[songIndex]?.albumId === id
                                   )
                                   )
                                    ? "Pause" 
                                    :  item.label[locale as keyof Localization]
                                }
                            </span>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
})

export default SongDetails;