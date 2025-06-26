import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import React, { type FC, useRef } from 'react'
import { Transition } from 'react-transition-group'

import arrow from '@/assets/icons/arrow.svg'
import closeIcon from '@/assets/icons/close-small.svg'
import introCan from '@/assets/scavenger/intro-can.png'

import styles from './GetStarted.module.scss'

type GetStartedProps = {
  show: boolean
  onCtaClick: () => void
  onCloseClick: () => any
}

const GetStarted: FC<GetStartedProps> = ({ show, onCtaClick, onCloseClick }) => {
  const { contextSafe } = useGSAP()
  const cardRef = useRef<HTMLDivElement>(null)

  const onEnter = contextSafe(() => {
    gsap.set(cardRef.current, { opacity: 0, y: 32 })
  })

  const onEntering = contextSafe(() => {
    gsap.to(cardRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'back.out(1.4)',
      delay: 1,
    })
  })

  const onExiting = contextSafe(() => {
    gsap.to(cardRef.current, {
      opacity: 0,
      y: 32,
      duration: 0.3,
      ease: 'back.in(1.4)',
    })
  })
  return (
    <Transition
      mountOnEnter
      unmountOnExit
      timeout={600}
      in={show}
      appear
      onEnter={onEnter}
      onEntering={onEntering}
      onExiting={onExiting}>
      <div className={styles.container}>
        <div className={styles.card} ref={cardRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCloseClick()
            }}
            className={styles.close}>
            <span>
              <Image src={closeIcon} alt={'Close'} />
            </span>
          </button>

          <Image src={introCan} alt="Madri Glass" className={styles.introCan} />

          <div className={styles.textContainer}>
            <p>Search and find 3 Madrí Excepcional cans and be in with a chance of winning exclusive prizes.</p>
            <button onClick={onCtaClick}>
              <span>Get started</span>
              <Image src={arrow} alt="arrow" width={32} />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  )
}

export default GetStarted
