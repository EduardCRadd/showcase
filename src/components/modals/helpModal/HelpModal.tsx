'use client'
import type { LottieRefCurrentProps } from 'lottie-react'
import Image from 'next/image'
import React, { type FC, useRef } from 'react'

import tempImg from '@/assets/conectada25/images/help-modal-temp.png'
import arrowSVG from '@/assets/icons/arrow-back.svg'
import Button from '@/components/button/Button'
import LottieHands from '@/components/conectada25/lottieHands/LottieHands'
import Modal from '@/components/modals/Modal'
import useGTMEvent from '@/hooks/useGTMEvent'
import useModalsStore from '@/hooks/useModalStore'
import { EventName } from '@/resources/analytics'

import styles from './HelpModal.module.scss'

const HelpModal: FC = () => {
  const show = useModalsStore((s) => s.showHelpModal)
  const close = useModalsStore((s) => s.closeHelpModal)

  return (
    <Modal show={show} close={close}>
      <HelpModalContent />
    </Modal>
  )
}

export default HelpModal

const HelpModalContent = () => {
  const handsLottieRef = useRef<LottieRefCurrentProps>(null)
  const { trackEvent } = useGTMEvent()
  const close = useModalsStore((s) => s.closeHelpModal)

  const handleBackArrowClick = () => {
    trackEvent({
      event: EventName.TapGoBack,
      pageName: 'A1',
      packType: '10 pack',
    })
    close()
  }
  const handleGotItClick = () => {
    trackEvent({ event: EventName.TapGotIt, pageName: 'A1', packType: '10 pack' })
    close()
  }

  return (
    <div className={styles.contentBox}>
      <button onClick={handleBackArrowClick} className={styles.navigation}>
        <Image src={arrowSVG} alt="arrow icon" />
      </button>
      <div className={styles.flexWrapper}>
        <div className={styles.contentWrapper}>
          <h1>Help</h1>
          <div className={styles.content}>
            <Image src={tempImg} alt="" />
            <p>Look for your unique 8-digit code on the inside of your Madrí Excepcional pack</p>
          </div>
          <Button onClick={handleGotItClick} variant="secondary" arrowRight={true} className={styles.button}>
            Got it
          </Button>
        </div>
        <div className={styles.handsContainer}>
          <LottieHands ref={handsLottieRef} autoPlay={true} />
        </div>
      </div>
    </div>
  )
}
