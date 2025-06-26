import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import React, { type FC } from 'react'
import { TransitionStatus } from 'react-transition-group'

import madridTripBG from '@/assets/madridTrip/landing.webp'
import madridCtaSVG from '@/assets/madridTrip/madrid-cta.svg'
import Button from '@/components/button/Button'
import { useMadridTripTerms } from '@/components/madridTrip/terms/MadridTripTermsProvider'
import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'

import styles from './Landing.module.scss'

type LandingProps = {
  transitionStatus: TransitionStatus
  goToSelector: () => void
}

const Landing: FC<LandingProps> = ({ transitionStatus, goToSelector }) => {
  const { setShowTerms } = useMadridTripTerms()

  const { trackEvent } = useGTMEvent()

  const onVamosClick = () => {
    goToSelector()
    // trackEvent(EventName.StartRateOfSale)
  }

  useGSAP(() => {
    gsap.set(['#bgImage', '#cta', '#vamosButton', '#terms'], {
      opacity: 0,
      scale: 0.9,
    })
  }, [])

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      const tl = gsap.timeline()

      tl.fromTo('#bgImage', { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power1.out' })

      tl.fromTo(
        ['#cta', '#vamosButton', '#terms'],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.4, ease: 'power1.out' },
        '-=0.2',
      )
    }

    if (transitionStatus === 'exiting') {
      gsap.to(['#bgImage', '#cta', '#vamosButton', '#terms'], {
        opacity: 0,
        y: 16,
        duration: 0.25,
        stagger: -0.2,
        ease: 'power1.in',
      })
    }
  }, [transitionStatus])

  return (
    <div className={styles.container}>
      <Image src={madridTripBG} id="bgImage" className={styles.bgImage} alt="Win a trip to madrid background image" />
      <Image src={madridCtaSVG} id="cta" className={styles.cta} alt="Win a trip to madrid background image" />

      <div className={styles.contentWrapper}>
        <div className={styles.bottomElements}>
          <div className={styles.buttonBox}>
            <Button id="vamosButton" arrowRight onClick={onVamosClick} fullWidth variant="primary">
              Vamos
            </Button>
          </div>

          <p id="terms" className={styles.terms}>
            <span onClick={() => setShowTerms(true)}>Terms & Conditions</span> apply. All entrants must be over 18.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Landing
