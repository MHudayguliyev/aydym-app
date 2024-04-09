"use client"
import dynamic from 'next/dynamic'
import React, {useEffect, useRef, useState, useMemo} from "react"
import { Link, usePathname } from "@lang/navigation";
//styles
import classNames from "classnames/bind";
import styles from './layout.module.scss';
//redux
import { useAppSelector, useAppDispatch } from "@app/hooks/redux_hooks";
import { setShowHiddenSidebar } from '@redux/reducers/SidebarReducer'
//lib
import LineLoader from "@app/compLibrary/Line-loader/LineLoader";
import Button from "@compLibrary/Button";
//hooks
import useClickOutside from '@hooks/useOutClick';
//comps 
import Sidebar from "@app/components/Sidebar/Sidebar";
import Topnavbar from "@app/components/Topnavbar/Topnavbar";
import AudioPlayer from '@components/players/audio/audio'
import Image from 'next/image';
//assets
import playstore from '@assets/icons/play-store.svg'
import appstore from '@assets/icons/appstore.svg'
const Adv = dynamic(() => import('@components/Adv/Adv'))


const cn = classNames.bind(styles)
export default function PagesLayout({
    children
  }: {
    children: React.ReactNode, 
  }) {
    const dispatch = useAppDispatch()
    const pathname = usePathname()

    //refs
    const sidebarToggleRef:any = useRef(null)
    const sidebarRef:any = useRef(null)

    const [showSidebar] = useClickOutside(sidebarRef, sidebarToggleRef, 'mousedown')

    const theme = useAppSelector(state => state.themeReducer.mode)
    const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)
    const showHiddenSidebar = useAppSelector(state => state.sidebarReducer.showHiddenSidebar)
    const showAdv = useAppSelector(state => state.mediaReducer.showAdv)

    const [loading, setLoading] = useState<boolean>(false)

    const hideSidebar = () => dispatch(setShowHiddenSidebar(false))
    useEffect(() => {
      window.history.scrollRestoration = 'manual';
      setLoading(true)
      if(showHiddenSidebar) hideSidebar()
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }, [pathname])

    useEffect(() => {
      if(!showSidebar) hideSidebar()
  }, [showSidebar])

  const AudioPlayerMem = useMemo(() => {
    return (
      <AudioPlayer />
    )
  }, [])
  const SidebarMem = useMemo(() => {
    return (
      <Sidebar 
        ref={sidebarRef}
        onSidebarShow={() => {}}
      />
    )
  }, [sidebarRef])
  const TopnavbarMem = useMemo(() => {
    return (
      <Topnavbar 
        ref={sidebarToggleRef}
        onSidebarHide={() => {}} 
      />
    )
  }, [sidebarToggleRef])

    return (
      <div className={theme}>
        {loading && <LineLoader />}
        {SidebarMem}
        {TopnavbarMem}
        <div className={cn({
          pages_layout: true, 
          sidebarFolded: sidebarFolded
        })}>
          {children}

          <div className={styles.layout_footer}>
              <div className={styles.content}>
                <div className={styles.text}>
                  <Link href='https://aydym.com'>
                    info@aydym.com
                  </Link>
                </div>

                <div className={styles.btn_group}>
                  <Button color="darkblue" withIcon linkProps={{
                    href: 'https://play.google.com/store/apps/details?id=com.gozleg.aydym&hl=ru&gl=US'
                  }}>
                    <Image src={playstore} alt={'playstore'} width={20} height={20} />
                    Google Play
                  </Button>
                  <Button color="darkblue" withIcon linkProps={{
                    href: 'https://apps.apple.com/tm/app/aydym/id1573017137'
                  }}> 
                     <Image src={appstore} alt={'appstore'} width={20} height={20} />
                    App Store
                  </Button>
                </div>
              </div>
          </div>

        </div>
        {AudioPlayerMem}
        <div className={cn({
          backdrop: true, 
          active: showHiddenSidebar
        })}/>

        {showAdv && <Adv />}
      </div>
    )
  }
