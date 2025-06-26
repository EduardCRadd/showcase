import { useGSAP } from '@gsap/react'
import classNames from 'classnames'
import gsap from 'gsap'
import Image, { StaticImageData } from 'next/image'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect } from 'react'
import { TransitionStatus } from 'react-transition-group'

import paintedPint from '@/assets/paint/painted-pint-landing.png'
import megaphoneSticker from '@/assets/paint/stickers/megaphone-sticker.png'
import spraySticker from '@/assets/paint/stickers/spray-sticker.svg'
import starsSticker from '@/assets/paint/stickers/stars-sticker.svg'
import DisplayHeading from '@/components/paint/displayHeading/DisplayHeading'
import TextContainer from '@/components/paint/textContainer/TextContainer'
import { Pathname } from '@/resources/pathname'

import BackButton from '../backButton/BackButton'
import styles from './ComingSoonLanding.module.scss'

const STICKERS: {
  image: StaticImageData
  top: number
  left: number
  width?: number
}[] = [
  {
    image: megaphoneSticker,
    top: -86,
    left: 41,
    width: 120,
  },
  {
    image: starsSticker,
    top: -106,
    left: 69,
  },
  {
    image: spraySticker,
    top: 90,
    left: 33,
  },
]

type LandingProps = {
  transitionStatus: TransitionStatus
}

const ComingSoonLanding: FC<LandingProps> = ({ transitionStatus }) => {
  const { push } = useRouter()

  const { contextSafe } = useGSAP()

  const onEnter = contextSafe(() => {
    gsap.set(['#back', '#pint-glass', '#heading', '.sticker', '#coming-soon'], { opacity: 0, scale: 1.2 })
    gsap.set('#action, #terms', { opacity: 0 })
  })

  const onEntering = contextSafe(() => {
    gsap
      .timeline()
      .to('#pint-glass', { opacity: 1, scale: 1 })
      .to(['#back', '#heading'], { opacity: 1, scale: 1, stagger: 0.3, delay: 0.25 })
      .to(['.sticker', '#coming-soon'], { opacity: 1, scale: window.innerHeight < 620 ? 0.85 : 1, stagger: 0.15 })
      .to(['#action', '#terms'], { opacity: 1, delay: 0.3 })
      .set(['.sticker', '#coming-soon'], { clearProps: 'scale' })
  })

  const onExiting = contextSafe((onComplete?: () => void) => {
    gsap.to(['#pint-glass', '#heading', '#action', '.sticker', '#terms', '#back'], {
      opacity: 0,
      stagger: (i) => -0.25,
      y: (i) => (i + 1) * 16,
      onComplete,
    })
  })

  useEffect(() => {
    onEnter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (transitionStatus === 'entering') onEntering()

    if (transitionStatus === 'exiting') onExiting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionStatus])

  return (
    <>
      <BackButton id="back" onClick={() => onExiting(() => push(Pathname.PaintEvent))} />
      <div id="landing" className={styles.container}>
        <div className={styles.glassContainer}>
          <Image id="pint-glass" src={paintedPint} alt="Painted Madri Pint Glass" className={styles.glass} />

          <div className={styles.headingWrapper}>
            <TextContainer id="heading">
              <DisplayHeading />
              <div id="coming-soon" className={styles.comingSoon}>
                <span className={styles.label}>
                  <span>Coming</span>
                  <span>Soon</span>
                </span>
              </div>
              {STICKERS.map((sticker, index) => {
                return (
                  <Image
                    key={'sticker-' + index}
                    src={sticker.image}
                    alt=""
                    className={classNames(styles.sticker, 'sticker')}
                    style={{ left: sticker.left + '%', top: sticker.top + '%', width: sticker.width, height: 'auto' }}
                    quality={100}
                  />
                )
              })}
            </TextContainer>
          </div>
        </div>
      </div>
    </>
  )
}

export default ComingSoonLanding
