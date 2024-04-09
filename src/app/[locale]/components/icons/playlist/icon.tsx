import React from 'react'

interface PlayListIProps {
  onClick: () =>  void
}
const PlayListI = React.forwardRef<SVGSVGElement,PlayListIProps>((props, ref): JSX.Element => {
  return (
    <svg onClick={props.onClick} ref={ref} style={{cursor: 'pointer'}} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg"><path d="M2 18H12V20H2V18ZM2 11H16V13H2V11ZM2 4H22V6H2V4ZM19 15.1707V9H24V11H21V18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18C15 16.3431 16.3431 15 18 15C18.3506 15 18.6872 15.0602 19 15.1707Z"></path></svg>
  )
  
})

export default PlayListI

