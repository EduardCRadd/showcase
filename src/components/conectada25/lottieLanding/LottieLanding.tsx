'use client'
import Lottie, { type LottieRef, type LottieRefCurrentProps } from 'lottie-react'
import React, { forwardRef } from 'react'

import lottieLanding from '@/assets/conectada25/lottie/landing-page.json'

import styles from './LottieLanding.module.scss'

type LottieHandsProps = {
  loop?: boolean
  autoPlay?: boolean
}

// Using forwardRef so parent can call ref.current?.play()
const LottieLanding = forwardRef<LottieRefCurrentProps, LottieHandsProps>((props, ref) => {
  const { loop = false, autoPlay = false } = props

  return (
    <div id="landingLottie" className={styles.lottieWrapper}>
      <Lottie lottieRef={ref as LottieRef} animationData={lottieLanding} autoPlay={autoPlay} loop={loop} />
    </div>
  )
})

LottieLanding.displayName = 'LottieLanding'

export default LottieLanding
