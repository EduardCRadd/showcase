'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import type { LottieRefCurrentProps } from 'lottie-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import React, { type FC, useEffect, useMemo, useRef, useState } from 'react'
import { TransitionStatus } from 'react-transition-group'

import sticker from '@/assets/conectada25/images/entered-sticker.png'
import copySVG from '@/assets/conectada25/landing-copy.svg'
import flagSVG from '@/assets/conectada25/success-flag.svg'
import Button from '@/components/button/Button'
import LottieEntered from '@/components/conectada25/lottieEntered/LottieEntered'
import LottieHands from '@/components/conectada25/lottieHands/LottieHands'
import useAnalyticsEvent from '@/hooks/useAnalyticsEvent'
import useModalsStore from '@/hooks/useModalStore'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'
import { TicketFlow } from '@/types/ticketFlow'

import styles from './Entered.module.scss'

type LandingProps = {
  transitionStatus: TransitionStatus
  ticketFlow: TicketFlow
}

gsap.registerPlugin(CustomEase)

const Entered: FC<LandingProps> = ({ transitionStatus, ticketFlow }) => {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const { openAboutFestivalModal } = useModalsStore()
  const enteredLottieRef = useRef<LottieRefCurrentProps>(null)
  const handsLottieRef = useRef<LottieRefCurrentProps>(null)
  const logAnalyticsEvent = useAnalyticsEvent()
  const pathname = usePathname()

  useEffect(() => {
    logAnalyticsEvent(EventName.YouAreInTheDraw, pathname)
  }, [logAnalyticsEvent, pathname])

  const customEase = CustomEase.create('custom', '0.85, 0, 0.15, 1')

  useGSAP(() => {
    gsap.set(['#flag', '#copy', '#textBox > *', '#buttonBox', '#sticker', '#buildings', '#grass', '#hands'], {
      opacity: 0,
      y: 16,
    })
  }, [])

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      const tl = gsap.timeline()

      tl.fromTo(
        ['#flag'],
        { opacity: 0, scale: 0.85, x: -24 },
        { opacity: 1, scale: 1, x: 0, duration: 0.3, ease: customEase },
      )
      tl.fromTo(
        ['#copy'],
        { opacity: 0, scale: 0.85, x: 24 },
        { opacity: 1, scale: 1, x: 0, duration: 0.3, ease: customEase },
        '-=0.3',
      )

      tl.fromTo(
        ['#textBox > *'],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.3, ease: 'power1.out' },
        '-=0.3',
      )
      tl.fromTo('#buttonBox', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' }, '-=0.2')

      tl.fromTo(['#hands'], { y: 64 }, { opacity: 1, y: 0, duration: 0.5, ease: customEase }, '-=0.5')
      tl.fromTo(['#sticker'], { y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: customEase }, '-=0.25')
      enteredLottieRef.current?.stop()
      enteredLottieRef.current?.setDirection(1)
      enteredLottieRef.current?.play()
    }

    if (transitionStatus === 'exiting' || isNavigating) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (isNavigating) {
            router.push(Pathname.EventsMap)
          } else {
            router.push(Pathname.RateOfSale + '?st=0')
          }
        },
      })

      tl.call(() => {
        enteredLottieRef.current?.setDirection(-1)
        enteredLottieRef.current?.play()
      })
      tl.to('#sticker', {
        opacity: 0,
        scale: 0.8,
        y: 16,
        duration: 0.3,
        ease: customEase,
      })

      tl.to(
        '#hands',
        {
          opacity: 0,
          scale: 0.8,
          y: 16,
          duration: 0.3,
          ease: customEase,
        },
        '-=0.45',
      )

      tl.to(
        '#buttonBox',
        {
          opacity: 0,
          y: 24,
          duration: 0.2,
          ease: 'power1.out',
        },
        '-=0.2',
      )

      tl.to(
        '#textBox > *',
        {
          opacity: 0,
          y: 16,
          duration: 0.2,
          stagger: { each: 0.2, from: 'end' },
          ease: 'power1.out',
        },
        '-=0.1',
      )

      tl.to(
        '#copy',
        {
          opacity: 0,
          scale: 0.85,
          x: 24,
          duration: 0.2,
          ease: customEase,
        },
        '-=0.3',
      )

      tl.to(
        '#flag',
        {
          opacity: 0,
          scale: 0.85,
          x: -24,
          duration: 0.2,
          ease: customEase,
        },
        '-=0.3',
      )
    }
  }, [transitionStatus, router, isNavigating])

  const handleExploreClick = () => {
    logAnalyticsEvent(EventName.TapExploreMadri, pathname)
    setIsNavigating(true)
  }

  const handleOpenFestivalModal = () => {
    logAnalyticsEvent(EventName.TapAboutAllPointsEast, pathname)
    // Set isNavigating when the modal's button is clicked
    openAboutFestivalModal(() => {
      setIsNavigating(true)
    })
  }
  return (
    <div className={styles.container}>
      <div className={styles.headerBox}>
        <Image id="flag" src={flagSVG} className={styles.flag} height={98} width={108} alt="Madrid flag" />
        <Image id="copy" src={copySVG} className={styles.copy} height={68} width={100} alt="Win festival tickets" />
      </div>
      <div id="textBox" className={styles.textBox}>
        <div role="presentation" className={styles.textBox_border} />
        <h2 style={{ whiteSpace: 'nowrap' }}>You’re in the draw</h2>
        <div role="presentation" className={styles.textBox_border} />
        <p>
          The prize draw will take place after the 01/08/25 and winners will be notified by email by 05/08/25. In the
          meantime find Madrí Excepcional bars and events near you.
        </p>
      </div>
      <div id="buttonBox" className={styles.buttonBox}>
        <Button className={styles.button} onClick={handleExploreClick} variant="secondary" arrowRight={true} fullWidth>
          Explore Madrí Excepcional bars & events
        </Button>
      </div>
      <button onClick={handleOpenFestivalModal}>
        <Image
          id="sticker"
          src={sticker}
          className={styles.sticker}
          alt="About all points East"
          width={96}
          height={96}
        />
      </button>
      <LottieHands ref={handsLottieRef} />
      <LottieEntered ref={enteredLottieRef} />
    </div>
  )
}

export default Entered
