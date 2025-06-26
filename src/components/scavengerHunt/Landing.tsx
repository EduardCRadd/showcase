'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { type FC, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'

import compassIcon from '@/assets/icons/compass.svg'
import Button from '@/components/button/Button'
import DialogBox from '@/components/events/map/DialogBox'
import { Pathname } from '@/resources/pathname'

import ZigZagCircle from '../stickers/ZigZagCircle'
import { useHuntTerms } from './HuntTermsProvider'
import styles from './Landing.module.scss'

type LandingProps = {
  show: boolean
  onCtaClick: () => void
}

const Landing: FC<LandingProps> = ({ show, onCtaClick }) => {
  const { setShowTerms } = useHuntTerms()
  const { push } = useRouter()
  const [showDialog, setShowDialog] = useState(false)

  const { contextSafe } = useGSAP()
  const containerRef = useRef<HTMLDivElement>(null)

  const onEnter = contextSafe(() => {
    gsap.set(containerRef.current, { opacity: 0, y: 32 })
    gsap.set('#prizes', { scale: 2, opacity: 0 })
  })

  const onEntering = contextSafe(() => {
    gsap
      .timeline()
      .call(() => setShowDialog(true))
      .to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.8,
        ease: 'back.out(1.4)',
      })
      .to('#prizes', {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.2)',
      })
  })

  const onExiting = contextSafe(() => {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: 32,
      duration: 0.3,
      ease: 'back.in(1.4)',
    })
  })

  const onPrizesClick = () => {
    setShowDialog(false)

    gsap.to('main', {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        push(Pathname.ScavengerHuntPrizes)
      },
    })
  }

  return (
    <>
      <Transition
        mountOnEnter
        unmountOnExit
        timeout={600}
        in={show}
        appear
        onEnter={onEnter}
        onEntering={onEntering}
        onExiting={onExiting}>
        <div className={styles.container} ref={containerRef}>
          <div className={styles.card}>
            <ZigZagCircle
              id="prizes"
              onClick={onPrizesClick}
              overline="Discover"
              label="The prizes"
              className={styles.prizesSticker}
            />
            <div className={styles.textWrapper}>
              <span className={styles.overline}>Street art</span>
              <span className={styles.heading}>
                <span className={styles.gold}>Scavenger</span> Hunt
              </span>
              <span className={styles.subheading}>
                Find 3 <span className={styles.gold}>Madrí Excepcional Cans</span>
              </span>
              <span className={styles.smallSubheading}>
                and be in with <b>a chance to win prizes</b>
              </span>
            </div>
            <Button arrowRight fullWidth className={styles.cta} onClick={onCtaClick}>
              Vamos
            </Button>
            <p className={styles.terms}>
              <button onClick={() => setShowTerms(true)}>Terms & Conditions</button> apply. All entrants must be over
              18.
            </p>
          </div>
        </div>
      </Transition>

      <DialogBox
        show={showDialog && show}
        className={styles.dialog}
        message={
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <Image src={compassIcon} alt="" style={{ marginRight: 8 }} />
            Find Madrí Bars and Events
          </span>
        }
        onClick={() => {
          push(Pathname.EventsMap)
        }}
        onCloseClick={() => setShowDialog(false)}
        portal={true}
      />
    </>
  )
}

export default Landing
