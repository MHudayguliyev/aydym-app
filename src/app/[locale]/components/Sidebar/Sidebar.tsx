'use client';
import React, { useEffect, useState, useRef } from 'react';
import {Link, usePathname} from '@lang/navigation';
import Image from 'next/image'
//styles
import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
//images
import logoLight from '@app/assets/images/aydym-logo-white.webp';
import logoDark from '@app/assets/images/aydym-logo.webp'
//json_data
import sidebar_routes from '@app/assets/json-data/sidebar_routes';
//libs
import Switch from '@app/compLibrary/Switch';
//comp
import Toggler from '../Toggler/Toggler';
//redux 
import { useAppDispatch, useAppSelector } from '@app/hooks/redux_hooks';
import { toggleSidebar, setShowHiddenSidebar } from '@app/redux/reducers/SidebarReducer';
import { setMode } from '@app/redux/reducers/ThemeReducer';
//icons
import SidebarIcons from '../icons/sidebar_icons/icon';
//hooks
import useWindowSize from '@hooks/useWindowSize';
//localization tk/ru
import { useLocale, useTranslations } from 'next-intl';

import { Localization } from '../../types';
import { isUndefined } from '../../utils/helpers';

function getStorageTheme(){
  // if(typeof window !== 'undefined'){
    const theme = JSON.parse(localStorage.getItem('themeMode')!)
    return !isUndefined(theme?.checked) ? theme.checked : false
  // }
  // return false
}

interface SidebarProps {
  onSidebarShow: Function
}
const cn = classNames.bind(styles)
// eslint-disable-next-line react/display-name
const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>((props, ref):JSX.Element => {
  const {
    onSidebarShow
  } = props

  const pathname = usePathname()
  const t = useTranslations('menu')
  const locale = useLocale()
  const dispatch = useAppDispatch()


  const activeTab = sidebar_routes.findIndex((item) => {
    return item.route === pathname
  });

  const theme = useAppSelector(state => state.themeReducer.mode)
  const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)
  const showHiddenSidebar = useAppSelector(state => state.sidebarReducer.showHiddenSidebar)
  const [checked, setChecked] = useState<boolean>(getStorageTheme())
  console.log("checked",checked)
  /// hooks is use
  const [width] = useWindowSize()


  const mode_settings = [
    {
      id: "light",
      name: "Light",
      class: "theme-mode-light",
      checked: false, 
    },
    {
      id: "dark",
      name: "Dark",
      class: "theme-mode-dark",
      checked: true, 
    },
  ];

  useEffect(() => {
    if(width >= 992 && showHiddenSidebar)
      dispatch(setShowHiddenSidebar(false)) /// disable showHiddenSidebar state if true to prevent media query conflict
  }, [width])

  useEffect(() => {
    const mode = mode_settings[checked ? 1 : 0]
    localStorage.setItem('themeMode', JSON.stringify({
      class: mode.class, checked
    }))
    dispatch(setMode(mode.class));
  }, [checked])


    return (
      <div ref={ref} className={cn({
        sidebar_wrapper: true, 
        sidebarFolded: sidebarFolded, 
        showHiddenSidebar: showHiddenSidebar
      })}>  

        <div className={styles.header}>
            <Image src={
              theme === 'theme-mode-dark' ? logoDark : logoLight
            } alt='logo' className={cn({
              hide: sidebarFolded, 
              show: showHiddenSidebar
            })}/>
            <Toggler 
              onClick={() => {
                if(showHiddenSidebar){
                  dispatch(setShowHiddenSidebar(false))
                  // onSidebarShow()
                }
                else dispatch(toggleSidebar(!sidebarFolded))
              }}
            />
        </div>

        <div className={styles.navbar}>
            <ul>
              <li className={cn({
                nav_header: true, 
                hide: sidebarFolded, 
                show: showHiddenSidebar
              })}>{t('title')}</li>
              {
                sidebar_routes.map((route, i) => {
                  if(
                    route.route === '/likedSongs' || 
                    route.route === '/favoriteVideo' || 
                    route.route === '/userPlaylist'
                  ) {
                    return null
                  } 
                  return (
                    <li key={i} className={cn({
                      active: i === activeTab
                    })}>
                      <Link href={route.route}>
                        <SidebarIcons iType={route.icon}/>
                        <span className={cn({
                          hide: sidebarFolded, 
                          show: showHiddenSidebar
                        })}>{route.display_name[locale as keyof Localization]}</span>
                      </Link>
                    </li>
                  )
                })
              }
              <li className={cn({
                nav_header: true, 
                hide: sidebarFolded
              })}>{t('additional')}</li>
              {
                sidebar_routes.map((route, i) => {
                  if(
                    route.route === '/likedSongs' || 
                    route.route === '/favoriteVideo' || 
                    route.route === '/userPlaylist'
                  ) {
                    return (
                      <li key={i} className={cn({
                        active: i === activeTab
                      })}>
                        <Link href={route.route}>
                          <SidebarIcons iType={route.icon}/>
                          <span className={cn({
                            hide: sidebarFolded, 
                            show: showHiddenSidebar
                        })}>{route.display_name[locale as keyof Localization]}</span>
                        </Link>
                      </li>
                    )
                  } 
                })
              }
            </ul> 
        </div>

        <div className={cn({
          footer: true, 
          hide: sidebarFolded, 
          show: showHiddenSidebar
        })}>
            <h6>Theme</h6>
            <div className={styles.switch}>
              <label>Night mode</label>
              <Switch 
                checked={checked}
                onClick={() => setChecked(!checked)}
              />
            </div>
        </div>

      </div>
    )
}) 

export default Sidebar;


  