import { useGSAP } from '@gsap/react'
import classNames from 'classnames'
import gsap from 'gsap'
import Image, { StaticImageData } from 'next/image'
import React, { FC } from 'react'
import { TransitionStatus } from 'react-transition-group'

import paintedPint from '@/assets/paint/painted-pint-landing.png'
import megaphoneSticker from '@/assets/paint/stickers/megaphone-sticker.png'
import spraySticker from '@/assets/paint/stickers/spray-sticker.svg'
import starsSticker from '@/assets/paint/stickers/stars-sticker.svg'
import Button from '@/components/button/Button'
import DisplayHeading from '@/components/paint/displayHeading/DisplayHeading'
import TextContainer from '@/components/paint/textContainer/TextContainer'
import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'

import { usePaintTerms } from '../terms/PaintTermsProvider'
import styles from './Landing.module.scss'

const STICKERS: {
  image: StaticImageData
  top: number
  left: number
  width?: number
}[] = [
  {
    image: megaphoneSticker,
    top: -116,
    left: 17,
    width: 120,
  },
  {
    image: starsSticker,
    top: -124,
    left: 60,
  },
  {
    image: spraySticker,
    top: 92,
    left: 33,
  },
]

type LandingProps = {
  transitionStatus: TransitionStatus
  goToSelector: () => void
}

const Landing: FC<LandingProps> = ({ transitionStatus, goToSelector }) => {
  const { setShowTerms } = usePaintTerms()
  const { trackEvent } = useGTMEvent()

  useGSAP(() => {
    gsap.set(['#pint-glass', '#heading', '#prizes', '.sticker'], { opacity: 0, scale: 1.2 })
    gsap.set('#action, #terms', { opacity: 0 })
  }, [])

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      gsap
        .timeline()
        .to('#pint-glass', { opacity: 1, scale: 1 })
        .to(['#heading', '#prizes'], { opacity: 1, scale: 1, stagger: 0.3, delay: 0.25 })
        .to('.sticker', { opacity: 1, scale: window.innerHeight < 620 ? 0.85 : 1, stagger: 0.15 })
        .to(['#action', '#terms'], { opacity: 1, delay: 0.3 })
        .to('.sticker', { clearProps: 'scale' })
    }

    if (transitionStatus === 'exiting') {
      gsap.to(['#pint-glass', '#heading', '#action', '.sticker', '#terms'], {
        opacity: 0,
        stagger: (i) => -0.25,
        y: (i) => (i + 1) * 16,
      })
    }
  }, [transitionStatus])

  const onVamosClick = () => {
    // trackEvent(EventName.StartPaintYourPint)
    goToSelector()
  }

  return (
    <div id="landing" className={styles.container}>
      <div className={styles.glassContainer}>
        <Image id="pint-glass" src={paintedPint} alt="Painted Madri Pint Glass" className={styles.glass} />

        <div className={styles.headingWrapper}>
          <TextContainer id="heading">
            <DisplayHeading />

            {STICKERS.map((sticker, index) => {
              return (
                <Image
                  key={'sticker-' + index}
                  src={sticker.image}
                  alt=""
                  className={classNames(styles.sticker, 'sticker')}
                  style={{ left: sticker.left + '%', top: sticker.top + '%', width: sticker.width, height: 'auto' }}
                />
              )
            })}
          </TextContainer>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <Button id="action" variant="primary" fullWidth onClick={onVamosClick} arrowRight>
          Vamos
        </Button>
      </div>

      <p id="terms" className={styles.terms}>
        <span onClick={() => setShowTerms(true)}>Terms & Conditions</span> apply. All entrants must be over 18.
      </p>
    </div>
  )
}

export default Landing
