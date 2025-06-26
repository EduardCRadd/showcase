'use client'
import type { LottieRefCurrentProps } from 'lottie-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { type FC, useRef } from 'react'

import festivalSVG from '@/assets/conectada25/festival.svg'
import festivalImg from '@/assets/conectada25/images/festival-modal-img.webp'
import arrowSVG from '@/assets/icons/arrow-back.svg'
import Button from '@/components/button/Button'
import LottieHands from '@/components/conectada25/lottieHands/LottieHands'
import Modal from '@/components/modals/Modal'
import useAnalyticsEvent from '@/hooks/useAnalyticsEvent'
import useModalsStore from '@/hooks/useModalStore'
import { EventName } from '@/resources/analytics'

import styles from './AboutFestivalModal.module.scss'

const AboutFestivalModal: FC = () => {
  const show = useModalsStore((s) => s.showAboutFestivalModal)
  const close = useModalsStore((s) => s.closeAboutFestivalModal)

  return (
    <Modal show={show} close={close}>
      <AboutFestivalModalContent />
    </Modal>
  )
}

export default AboutFestivalModal

const AboutFestivalModalContent = () => {
  const handsLottieRef = useRef<LottieRefCurrentProps>(null)
  const logAnalyticsEvent = useAnalyticsEvent()
  const pathname = usePathname()

  const onEnterNow = useModalsStore((s) => s.onEnterNow)
  const close = useModalsStore((s) => s.closeAboutFestivalModal)

  const handleEnterNow = () => {
    logAnalyticsEvent(EventName.TapExploreMadri, pathname)
    close()
    if (onEnterNow) onEnterNow()
  }

  const handleClose = () => {
    logAnalyticsEvent(EventName.TapGoBack, pathname)
    close()
  }
  return (
    <div className={styles.contentBox}>
      <div className={styles.navigation}>
        <Image onClick={handleClose} src={arrowSVG} alt="arrow icon" />
      </div>
      <div className={styles.contentWrapper}>
        <h1>About all points east</h1>
        <div className={styles.content}>
          <p>
            All Points East is the essential London music festival, taking place across ten days in Victoria Park. Since
            2018, the award-winning series has become known for their impeccably curated lineups, state of the art
            production and industry-leading fan experience.
          </p>
          <Image src={festivalImg} className={styles.festivalImg} alt="artist" />
          <p>
            The event comprises two weekends of music, celebrating the finest talent across a diverse range of genres,
            together with their four-day programme, In the Neighbourhood, featuring free entry and activities for the
            community. Returning for 2025 with an incredible lineup, All Points East will once again be the most
            anticipated music event of the summer.
          </p>
        </div>
        <div className={styles.buttonBox}>
          <Button
            onClick={handleEnterNow}
            variant="secondary"
            arrowRight={true}
            fullWidth={true}
            className={styles.button}>
            Explore Madrí Excepcional bars & events
          </Button>
        </div>
        <Image src={festivalSVG} className={styles.festivalSvg} alt="" />
        <LottieHands ref={handsLottieRef} autoPlay={true} />
      </div>
    </div>
  )
}
