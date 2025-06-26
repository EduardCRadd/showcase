import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { type FC, useState } from 'react'
import { TransitionStatus } from 'react-transition-group'

import enteredImg from '@/assets/madridTrip/entered.webp'
import Button from '@/components/button/Button'
import BackButton from '@/components/paint/backButton/BackButton'
import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'

import styles from './Entered.module.scss'

type LandingProps = {
  transitionStatus: TransitionStatus
  onBackClick: () => void
}

const Entered: FC<LandingProps> = ({ transitionStatus, onBackClick }) => {
  const { trackEvent } = useGTMEvent()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleBackClick = () => {
    onBackClick()
  }
  const handleLetsGoClick = () => {
    // trackEvent(EventName.RateOfSaleLetsGo)
    setIsNavigating(true)
  }

  useGSAP(() => {
    gsap.set(['#header', '#bgImage', '#textBox > *', '#buttonBox'], {
      opacity: 0,
      y: 16,
    })
  }, [])

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      const tl = gsap.timeline()

      // tl.fromTo('#header', { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power1.out' })
      // tl.fromTo(
      //   '#bgImage',
      //   { opacity: 0, scale: 1.2 },
      //   { opacity: 1, scale: 1, duration: 0.35, ease: 'power1.out' },
      //   '-=0.2',
      // )
      tl.fromTo(
        ['#header', '#bgImage', '#textBox > *', '#buttonBox'],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.35, ease: 'power1.out' },
      )
      // tl.fromTo('#buttonBox', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power1.out' }, '-=0.1')
    }

    if (transitionStatus === 'exiting' || isNavigating) {
      gsap.to(['#header', '#bgImage', '#textBox > *', '#buttonBox'], {
        opacity: 0,
        y: 16,
        duration: 0.35,
        stagger: -0.1,
        ease: 'power1.in',
        onComplete: () => {
          if (isNavigating) {
            router.push(Pathname.EventsMap) // Navigate to EventsMap after animation completes
          } else {
            router.push(Pathname.MadridTrip + '?st=0') // Redirect to Landing if Back button is clicked
          }
        },
      })
    }
  }, [transitionStatus, router])

  return (
    <div id="landing" className={styles.container}>
      <BackButton onClick={handleBackClick} />
      <h1 id="header" className={styles.header}>
        Win a trip to Madrid
      </h1>

      <Image src={enteredImg} id="bgImage" height={250} width={414} className={styles.bgImage} alt="Image of Madrid" />

      <div id="textBox" className={styles.textBox}>
        <div role="presentation" className={styles.textBox_border} />
        <h2 style={{ whiteSpace: 'nowrap' }}>
          You’re <span>in the draw!</span>
        </h2>
        <p>
          We’ve entered you into the draw to win a trip to Madrid or one of hundreds of other prizes. All winners of
          prizes will be contacted directly via email.
        </p>
        <div role="presentation" className={styles.textBox_border} />
      </div>

      <div id="buttonBox" className={styles.buttonBox}>
        <span>Explore Madrí Bars and Events</span>
        <Button arrowRight url={`${Pathname.EventsMap}?bars=madrid-trip`} onClick={handleLetsGoClick} variant="primary">
          Let’s go!
        </Button>
      </div>
    </div>
  )
}

export default Entered
