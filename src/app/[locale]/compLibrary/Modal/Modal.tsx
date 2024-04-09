import React, { CSSProperties, ReactNode, useEffect, useState } from "react";    
import ReactDOM from 'react-dom';

// custom styles
import styles from './Modal.module.scss';
import classNames from "classnames/bind";
import sassVars from '@styles/globalExports.module.scss'
// typed redux hooks
import { useAppSelector } from "@hooks/redux_hooks";
//window size hook
import useWindowSize from "@hooks/useWindowSize";

const cx = classNames.bind(styles);

interface KeyboardEvent {
   key: string;
   preventDefault: Function
}

type ModalProps = {
   isOpen: boolean
   close: Function
   children: ReactNode
   header?: ReactNode
   footer?: ReactNode
   /** @default false */
   fullScreen?: boolean
   className?: string
   style?: CSSProperties
   styleOfModalBody?:CSSProperties
}
const Modal = (props: ModalProps) => {

   const {
      isOpen,
      close,
      children,
      header,
      footer,
      fullScreen = false,
      className = '',
      style,
      styleOfModalBody
   } = props;

   const [isClient, setIsClient] = useState(false);
   const [width] = useWindowSize()
   const themeReducer = useAppSelector((state) => state.themeReducer);
   const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)

   useEffect(() => {
      setIsClient(true);
   }, []);

   useEffect(() => {
      if (isOpen)
         document.getElementsByTagName('body')[0].classList.add('modal-opened');
      else
         document.getElementsByTagName('body')[0].classList.remove('modal-opened');
   }, [isOpen])

   // keydown listener for 'escape' key
   useEffect(() => {
      const keyDownHandler = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            event.preventDefault();
            close()
         }
      }
      document.addEventListener('keydown', keyDownHandler);
      return () => {
         document.removeEventListener('keydown', keyDownHandler);
      };
   }, []);

   const modalContent = isOpen ? (
      <div onClick={() => close()} className={
         cx({
            modal: true,
            notFullScreenModal: !fullScreen
         })
      }>
         <div className={cx({
            modalContent_wrapper: true, 
            sidebarFolded: sidebarFolded && width > parseInt(sassVars.large)
         })}>
            <div onClick={(e) => e.stopPropagation()} style={style} className={`${className} ${cx({
                  modalContent: true,
                  modalAnimation: isOpen,
                  fullScreen: fullScreen, 
               })}
            `}>
               <div>
                  {header}
               </div>
               <div style={styleOfModalBody} className={styles.modalBody}>
                  {children}
               </div>
               <div className={styles.modalFooter} >
                  {footer}
               </div>
            </div>
         </div>
      </div>
   ) : null;

   if (!isClient) {
      return null;
   }
   return ReactDOM.createPortal(
      <div className={themeReducer.mode}>
         {modalContent}
      </div>,
      document.body as HTMLElement
   );
}

export default Modal;