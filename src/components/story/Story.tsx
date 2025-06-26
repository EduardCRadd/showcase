'use client'

import classNames from 'classnames'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC, useEffect, useState } from 'react'
import { type SwipeEventData, useSwipeable } from 'react-swipeable'
import { SwitchTransition, Transition } from 'react-transition-group'

import logoImg from '@/assets/brand/logo-strapline.png'
import beerTapImg from '@/assets/images/beer-tap.png'
import chulapoImg from '@/assets/images/chulapo.png'
import { useOverlays } from '@/components/overlays/OverlaysProvider'
import useAnalyticsEvent from '@/hooks/useAnalyticsEvent'
import useGTMEvent from '@/hooks/useGTMEvent'
import useLocale from '@/hooks/useLocale'
import useTranslation from '@/hooks/useTranslation'
import useTicketCompetitionFlowStore, { FlowType } from '@/hooks/winFlowStore'
import { EventName } from '@/resources/analytics'
import { Locale } from '@/resources/locale'
import { Pathname } from '@/resources/pathname'

import styles from './Story.module.scss'

gsap.registerPlugin(ScrollTrigger)

type Props = {}

export const Story: FC<Props> = ({}) => {
  const { overlay } = useOverlays()
  const { trackEvent } = useGTMEvent()
  const t = useTranslation()
  const { isSpanish } = useLocale()
  const logAnalyticsEvent = useAnalyticsEvent()
  const pathname = usePathname()

  const [slideIndex, setSlideIndex] = useState(0)
  const [showSwipeUp, setShowSwipeUp] = useState(true)

  const slides = [
    {
      image: {
        url: logoImg,
        width: 230,
        height: 373,
      },
      text: t('story-1'),
    },

    {
      image: {
        url: beerTapImg,
      },
      text: t('story-2'),
    },
    {
      image: {
        url: chulapoImg,
      },
      text: t('story-3'),
    },
  ]

  const slide = slides[slideIndex]

  const ctaHref = isSpanish ? `/${Locale.Spain}${Pathname.EventsMap}` : Pathname.EventsMap

  const onSwipedDown = (e: SwipeEventData) => {
    setSlideIndex((prev) => {
      const newIndex = Math.max(prev - 1, 0)
      logAnalyticsEvent(EventName.SwipeDown, pathname)
      return newIndex
    })
  }

  const onSwipedUp = (e: SwipeEventData) => {
    setSlideIndex((prev) => {
      const newIndex = Math.min(prev + 1, slides.length - 1)
      logAnalyticsEvent(EventName.SwipeUp, pathname)
      return newIndex
    })
  }

  const swipeHandlers = useSwipeable({
    onSwipedDown: onSwipedDown,
    onSwipedUp: onSwipedUp,
    delta: 40,
    trackTouch: true,
    trackMouse: true,
  })

  useEffect(() => {
    const showSwipeUp = slideIndex < slides.length - 1
    setShowSwipeUp(showSwipeUp)
  }, [slideIndex, slides.length, trackEvent])

  const onEnter = () => {
    const selector = gsap.utils.selector('#story-section')
    const els = selector('img, p')
    gsap.set(els, { opacity: 0, y: 32 })
    gsap.to(els, { opacity: 1, y: 0, stagger: 0.2, duration: 0.7 })
  }

  const onExit = () => {
    const selector = gsap.utils.selector('#story-section')
    const els = selector('img, p')
    gsap.to(els, { opacity: 0, y: 24, stagger: -0.2, duration: 0.6 })
  }

  return (
    <div className={styles.container} {...swipeHandlers}>
      <SwitchTransition mode="out-in">
        <Transition key={slideIndex} timeout={800} onEnter={onEnter} onExit={onExit}>
          <section id="story-section">
            <Image
              src={slide.image.url}
              alt="Madri"
              width={slide.image.width}
              height={slide.image.height}
              className={styles.image}
              sizes={!slide.image.width ? '100vw' : ''}
              style={!slide.image.width ? { width: '100%', height: 'auto', objectFit: 'cover' } : {}}
            />
            <p>{slide.text}</p>
          </section>
        </Transition>
      </SwitchTransition>

      <div className={classNames(styles.swipeUp, showSwipeUp ? styles.show : styles.hide)}>
        <span>{t('swipe-up')}</span>
        <div />
      </div>
      <Link href={ctaHref} onClick={() => logAnalyticsEvent(EventName.TapFindMadri, pathname)}>
        <div className={classNames(styles.cta, showSwipeUp ? styles.hide : styles.show)}>
          <span>{t('find-madri-near-you')}</span>
          <div />
        </div>
      </Link>
    </div>
  )
}
