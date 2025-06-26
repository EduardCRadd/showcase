import gsap from 'gsap'
import Image from 'next/image'
import React, { FC } from 'react'
import { Transition } from 'react-transition-group'

import headerBg from '@/assets/images/map-header-bg.svg'

import styles from './HeaderBg.module.scss'

type HeaderBgProps = {
  show: boolean
}

const HeaderBg: FC<HeaderBgProps> = ({ show }) => {
  const onEnter = () => {
    gsap.set('#header-bg', {
      opacity: 0,
    })
  }

  const onEntering = () => {
    gsap.to('#header-bg', {
      opacity: 1,

      duration: 0.3,
    })
  }

  const onExiting = () => {
    gsap.to('#header-bg', {
      opacity: 0,
      duration: 0.3,
    })
  }

  return (
    <Transition
      timeout={600}
      in={show}
      onEnter={onEnter}
      onEntering={onEntering}
      onExiting={onExiting}
      mountOnEnter
      unmountOnExit>
      <div id="header-bg" className={styles.container}>
        <div>
          <Image src={headerBg} alt="" priority quality={100} />
        </div>
      </div>
    </Transition>
  )
}

export default HeaderBg
