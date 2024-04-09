import React from 'react'

interface HomeIconProps {
    /**  @defaultValue theme-mode-light */
    theme?: 'theme-mode-dark' | 'theme-mode-light'
}

const Home = (props: HomeIconProps) => {
    const {
        theme = 'theme-mode-light'
    } = props
  return (
    <svg stroke='var(--main-color)' fill='var(--main-color)' stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69"></path></svg>
  )
}

export default Home
