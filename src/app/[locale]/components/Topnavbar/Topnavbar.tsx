import React, {useEffect, useRef, useState} from 'react'
import { useSearchParams } from 'next/navigation'
import {Link, usePathname, useRouter} from '@lang/navigation'
import { useQuery } from 'react-query'
import { useLocale, useTranslations  } from 'next-intl'
import Image from 'next/image'
//styles
import classNames from 'classnames/bind'
import styles from './Topnavbar.module.scss'
//libs
import Input from '@app/compLibrary/Input'
import Divider from '@app/compLibrary/Divider'
import Toggler from '../Toggler/Toggler'

//icons 
import vip from '@app/assets/icons/vip-crown-fill.svg'
import tm from '@app/assets/images/flags/tm.jpg'
import ru from '@app/assets/images/flags/ru.jpg'
import user from '@app/assets/images/user.png'
import logout from '@app/assets/icons/logout.svg'
//json_data 
import profile_json from '@app/assets/json-data/profile_json'
//redux 
import { useAppSelector, useAppDispatch } from '@app/hooks/redux_hooks'
import { setShowHiddenSidebar } from '@redux/reducers/SidebarReducer'
import { closePlaylistModal, togglePlaylistModal } from '@redux/reducers/TopnavbarReducer'
//hooks
import useClickOutside from '@app/hooks/useOutClick'
import useWindowSize from '@hooks/useWindowSize'
//comp
import SearchModal from '../Modals/SearchModal/Modal'
import ProfileIcons from '../icons/profile_icons/icon'
import PremiumModal from '@components/Modals/PremiumModal/Modal';
import ActivationModal from '@components/Modals/ActivationModal/Modal'
//types
import { ProfileIconTypes } from '../../types'
//api
import { GetSearchData, GetPremiumData } from '@api/Queries/Getters'
import authToken from '@api/service/auth_token'
//utils
import { isUndefined, isEmpty, delay } from '@utils/helpers'
import { getFromStorage } from '@utils/storage'
import AddPlaylistModal from '../Modals/AddPlaylistModal/Modal'
import SuccessModal from '../Modals/ActivationModal/SuccessModal'



interface TopnavbarProps  {
  onSidebarHide: Function 
}

const cn = classNames.bind(styles)
const Topnavbar = React.forwardRef<HTMLDivElement, TopnavbarProps>((props, ref): JSX.Element => {
  const {
    onSidebarHide
  } = props

  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const dispatch = useAppDispatch()
  const locale = useLocale()
  const translate = useTranslations()
  const mask = search.get('mask')
  const userToken = authToken()
  const userData = getFromStorage('auth')

  const profileContentRef:any = useRef(null)
  const profileToggleRef:any = useRef(null)
  const [show, setShow] = useClickOutside(profileContentRef, profileToggleRef, 'mousedown')
  const [width] = useWindowSize()
  
  //states
  const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded) 
  const showHiddenSidebar = useAppSelector(state => state.sidebarReducer.showHiddenSidebar)
  const openPlaylistModal = useAppSelector(state => state.topnavbarReducer.openPlaylistModal)
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false)
  const [showVipModal, setShowVipModal] = useState<boolean>(false)
  const [showActivationModal, setShowActivationModal] = useState<boolean>(false)
  const [showActivationSuccessModal, setShowActivationSucessModal] = useState<boolean>(false)
  const [dates, setDates] = useState({
    startingDate: "", 
    endingDate: ""
  })
  const [searchValue, setSearchValue] = useState<string>('')

  ///queries 
  const {
    data: searchData, 
    isLoading, 
    isError
  } = useQuery(['GetSearchData', searchValue], () => GetSearchData(searchValue), {
    enabled: !!searchValue, refetchOnWindowFocus: false
  })
  const {
    data: premiumData
  } = useQuery(['GetPremiumDataForTopnavbar', userToken], () => GetPremiumData(locale),  {
    refetchOnWindowFocus: false, 
    enabled: !!userToken
  })

  const changeLanguage = (e:any) => {
    let path = pathname
    if(!isUndefined(mask))
    path = `${pathname}?mask=${mask}`
    
    const lang = e.target.alt as string
    if(lang !== locale)
    router.replace(path, {locale: lang});
  }

  const goToSearchPage = () => {
    if(!isEmpty(searchValue))
    router.push(`/search?mask=${searchValue}`)
    setShowSearchModal(false)
  }
  
  const handleKeyDown = (e:any) => {
    if (e.keyCode === 13)
    goToSearchPage()
  }

  const buyPremium = () => {
    if(premiumData?.profileType === 'STANDARD'){
      router.push('/purchase')
    }else if(premiumData?.profileType === 'PREMIUM'){
      setShowVipModal(true)
    }else router.push('/register') //then, go sign in
  }

  useEffect(() => {
    if(showHiddenSidebar && showSearchModal)
    setShowSearchModal(false)
    else if(showHiddenSidebar && showVipModal)
    setShowVipModal(false)

    // if(showVipModal&& showSearchModal)
    // setShowVipModal(false)
  }, [showHiddenSidebar, showSearchModal, showVipModal])

  useEffect(() => {
    if(!isUndefined(searchData) && !isEmpty(searchValue))
    setShowSearchModal(true)
  }, [searchData])

  useEffect(() => {
    if(isEmpty(searchValue))
    setShowSearchModal(false)
  }, [searchValue])

  useEffect(() => {
    if(showActivationModal && show || showActivationSuccessModal && show) setShow(false)
  }, [showActivationModal, showActivationSuccessModal])

  useEffect(() => {
    if(!isEmpty(dates.startingDate) && !isEmpty(dates.endingDate)){
      setShowActivationSucessModal(true)
    }
  }, [dates])

  return (
    <>
      <SearchModal 
        show={showSearchModal}
        close={() => setShowSearchModal(false)}
        data={searchData!}
        searchValue={searchValue}
        fetchStatuses={{
          isLoading, isError
        }}
      />

      <PremiumModal 
        show={showVipModal}
        close={() => setShowVipModal(false)}
        locale={locale}
      />

      <AddPlaylistModal 
        show={openPlaylistModal}
        close={() => dispatch(closePlaylistModal())}
      />

      <ActivationModal 
        show={showActivationModal}
        close={() => setShowActivationModal(false)}
        onSuccess={(startingDate, endingDate) => {
          console.log("successfully entered")
          setDates({startingDate, endingDate})
        }}
      />

      <SuccessModal  
        show={showActivationSuccessModal}
        close={() => setShowActivationSucessModal(false)}
        dates={dates}
      />

      <div className={cn({
        topnavbar: true, 
        reduceZIndex: showVipModal || showActivationModal || showActivationSuccessModal || openPlaylistModal, 
        sidebarFolded: sidebarFolded, 
        showHiddenSidebar: showHiddenSidebar
      })}>

        <div className={styles.header_container}>
          <div className={styles.search} >
            {
              width <= 992 && 
                <Toggler 
                  ref={ref}
                  styles={{
                    marginLeft: 0, 
                    marginTop: 'auto', 
                    marginRight: '1rem'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch(setShowHiddenSidebar(true))
                    onSidebarHide()
                  }}
                />
            }
            
            <Input 
              className={styles.inputField}
              searchI
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onSearchClick={goToSearchPage}
            />
          </div>
          
          <div className={styles.buyPremium} onClick={buyPremium}>
            <Image src={vip} alt='vip'/>
            <span>
              {
                premiumData?.profileType === 'STANDARD' ? 
                translate('profile.upgradeToPremium') :
                premiumData?.profileType === 'PREMIUM' ? 
                translate('profile.havePremium') : isUndefined(premiumData?.profileType) ? 
                translate('profile.upgradeToPremium') : ""
              }
            </span>
          </div>

          <div className={styles.dropdown_group}>
              <div className={styles.dropdown}>
                <Image src={ru} alt='ru' onClick={changeLanguage} className={cn({
                  flag: true,
                  langActive: locale === 'ru'
                })}/>
                <Image src={tm} alt='tk' onClick={changeLanguage} className={cn({
                  flag: true,
                  langActive: locale === 'tk'
                })}/>
              </div>

              <div className={styles.dropdown} ref={profileToggleRef}>
                <Image src={user} alt='user' className={styles.user}/>
                <div className={styles.dropdown_userName}>
                  {
                    !isUndefined(userData) ? userData?.username : "Anonymous"
                  }
                </div>
              </div>
          </div>

        </div>

        <div ref={profileContentRef} className={styles.dropdown}>
          <ul className={cn({
            dropdown_menu: true, 
            openDropdown: show
          })}>
            <li>
                <div className={styles.avatar}>
                  <Image src={user} alt='user' className={styles.avatar_image}/>
                  <div className={styles.avatar_content}>
                    <span className={styles.avatar_title}>Androws Kinny</span>
                    <span className={styles.avatar_subtitle}>Artist</span>
                  </div>
                </div>
            </li>
            <Divider />
            {
              profile_json.map((profile, i) => (
                <li key={i} className={styles.each_pro_list} onClick={() => {
                  if(profile.type.toLocaleLowerCase() === 'credit'){
                    setShowActivationModal(true)
                  }
                }}>
                    <ProfileIcons iType={profile.type.toLocaleLowerCase() as ProfileIconTypes}/>
                    <span>{profile.type}</span>
                </li>
              ))
            }
            <Divider />
            <li className={styles.each_pro_list}>
                <Image src={logout} alt='logout'/>
                <span style={{color: 'var(--main-color-red)'}}>Logout</span>
            </li>
          </ul>
        </div>

      </div>
    </>
  )

})

export default Topnavbar
