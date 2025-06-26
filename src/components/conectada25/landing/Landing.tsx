import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { LottieRefCurrentProps } from 'lottie-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { type FC, useRef } from 'react'
import { TransitionStatus } from 'react-transition-group'

import landingSticker from '@/assets/conectada25/images/landing-sticker.png'
import landingCopySVG from '@/assets/conectada25/landing-copy.svg'
import Button from '@/components/button/Button'
import LottieLanding from '@/components/conectada25/lottieLanding/LottieLanding'
import useGTMEvent from '@/hooks/useGTMEvent'
import useModalsStore from '@/hooks/useModalStore'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'
import { TicketFlow } from '@/types/ticketFlow'

import styles from './Landing.module.scss'

type LandingProps = {
  transitionStatus: TransitionStatus
  goToNextStep: () => void
  ticketFlow: TicketFlow
}

const Landing: FC<LandingProps> = ({ transitionStatus, goToNextStep, ticketFlow }) => {
  const { trackEvent } = useGTMEvent()
  const { openAboutArtistModal } = useModalsStore()
  const landingLottieRef = useRef<LottieRefCurrentProps>(null)

  const onGetStartedClick = () => {
    goToNextStep()

    trackEvent({
      event: EventName.TapGetStarted,
      pageName: 'A1',
      ...(ticketFlow === TicketFlow.Win
        ? {
            packType: '10 pack',
          }
        : {
            pointOfSale: 'leaflet',
          }),
    })
  }

  const handleStickerClick = () => {
    openAboutArtistModal(goToNextStep)
    trackEvent({
      event: EventName.TapAboutTheArtist,
      pageName: 'A1',
      ...(ticketFlow === TicketFlow.Win
        ? {
            packType: '10 pack',
          }
        : {
            pointOfSale: 'leaflet',
          }),
    })
  }

  useGSAP(() => {
    gsap.set(['#landing-copy', '#button', '#terms', '#sticker'], {
      opacity: 0,
      scale: 0.9,
    })
  }, [])

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      const tl = gsap.timeline()

      tl.fromTo(
        '#landing-copy',
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 0.25, ease: 'power1.out' },
      )
      tl.fromTo(
        ['#button', '#terms'],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.4, ease: 'power1.out' },
        '-=0.2',
      )
      landingLottieRef.current?.stop()
      landingLottieRef.current?.setDirection(1)
      tl.fromTo(['#sticker'], { x: 24 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power1.out' }, '-=0.3')
      landingLottieRef.current?.play()
    }

    if (transitionStatus === 'exiting') {
      const tl = gsap.timeline()

      landingLottieRef.current?.setDirection(-1)
      landingLottieRef.current?.play()
      tl.to(['#button', '#terms'], { opacity: 0, y: 16, stagger: -0.2, duration: 0.4, ease: 'power1.out' }, '-=0.2')
      tl.to('#landing-copy', { opacity: 0, scale: 1.2, duration: 0.25, ease: 'power1.out' })
      tl.to(['#sticker'], { opacity: 0, x: 24, duration: 0.2, ease: 'power1.out' }, '-=0.2')
    }
  }, [transitionStatus])

  return (
    <div className={styles.container}>
      <Image id="landing-copy" src={landingCopySVG} className={styles.landingCopy} alt="Win festival tickets" />

      <div className={styles.buttonWrapper}>
        <Button
          id="button"
          arrowRight
          onClick={onGetStartedClick}
          fullWidth
          variant="secondary"
          style={{ zIndex: 100 }}>
          Get Started
        </Button>
      </div>
      <p id="terms" className={styles.terms} style={{ zIndex: 100 }}>
        <Link href={(ticketFlow === TicketFlow.Win ? Pathname.Win : Pathname.RateOfSale) + Pathname.TermsAndConditions}>
          Terms & Conditions
        </Link>{' '}
        apply
      </p>

      <div className={styles.assetWrapper}>
        <button onClick={handleStickerClick}>
          <Image
            id="sticker"
            src={landingSticker}
            height={106}
            width={106}
            className={styles.sticker}
            alt="About the artist"
          />
        </button>
        <LottieLanding ref={landingLottieRef} autoPlay={true} />
      </div>
    </div>
  )
}

export default Landing
