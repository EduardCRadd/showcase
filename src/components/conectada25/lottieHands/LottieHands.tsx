'use client'
import Lottie, { type LottieRef, type LottieRefCurrentProps } from 'lottie-react'
import React, { forwardRef } from 'react'

import lottieHands from '@/assets/conectada25/lottie/hands.json'

import styles from './LottieHands.module.scss'

type LottieHandsProps = {
  loop?: boolean
  autoPlay?: boolean
}

// Using forwardRef so parent can call ref.current?.play()
const LottieHands = forwardRef<LottieRefCurrentProps, LottieHandsProps>((props, ref) => {
  const { loop = true, autoPlay = false } = props

  return (
    <div id="hands" className={styles.lottieWrapper}>
      <Lottie lottieRef={ref as LottieRef} animationData={lottieHands} autoPlay={autoPlay} loop={loop} />
    </div>
  )
})

LottieHands.displayName = 'LottieHands'

export default LottieHands
