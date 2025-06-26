import { useReducedMotion } from '@mantine/hooks'
import gsap from 'gsap'
import Image from 'next/image'
import { type FC, useEffect, useLayoutEffect } from 'react'
import { type TransitionStatus } from 'react-transition-group'

import useGTMEvent, { ENVIRONMENT } from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'

import image from './_assets/splash.png'
import styles from './Splash.module.scss'

type Props = {
  transitionStatus: TransitionStatus
  onEnd: () => void
}

const Splash: FC<Props> = ({ transitionStatus, onEnd }) => {
  const disableMotion = useReducedMotion(false)
  const { trackEvent } = useGTMEvent()

  useLayoutEffect(() => {
    // Set the initial hidden state
    const onEnter = () => {
      gsap.set('#splash-image', { opacity: 0, scale: disableMotion ? 1 : 1.25 })
    }
    onEnter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onEntered = () => {
      // Transtion the element(s) in
      gsap
        .timeline()
        .to('#splash-image', {
          opacity: 1,
          scale: 0.5,
        })

        .call(() => {
          // After the animations call a function to hide the splash screen
          setTimeout(() => {
            onEnd()
          }, 1000)
        })
    }

    if (transitionStatus === 'entered') return onEntered()

    // Transition the element(s) out
    const onExiting = () => {
      gsap
        .timeline()
        .to(['#splash-image'], {
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          stagger: 0.1,
        })
        .to('#splash-container', { autoAlpha: 0, duration: 0.3 })
    }

    if (transitionStatus === 'exiting') return onExiting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionStatus])

  return (
    <div id="splash-container" className={styles.container}>
      <Image
        id="splash-image"
        src={image}
        alt="Madri logo"
        priority={true}
        loading="eager"
        quality={90}
        width={180}
        height={290}
        className={styles.image}
      />
    </div>
  )
}

export default Splash
