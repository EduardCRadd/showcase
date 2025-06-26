'use client'
import Lottie, { type LottieRef, type LottieRefCurrentProps } from 'lottie-react'
import React, { forwardRef } from 'react'

import lottieEntered from '@/assets/conectada25/lottie/entered.json'

import styles from './LottieEntered.module.scss'

type LottieHandsProps = {
  loop?: boolean
  autoPlay?: boolean
}

// Using forwardRef so parent can call ref.current?.play()
const LottieEntered = forwardRef<LottieRefCurrentProps, LottieHandsProps>((props, ref) => {
  const { loop = false, autoPlay = false } = props

  return (
    <div id="enteredLottie" className={styles.lottieWrapper}>
      <Lottie lottieRef={ref as LottieRef} animationData={lottieEntered} autoPlay={autoPlay} loop={loop} />
    </div>
  )
})

LottieEntered.displayName = 'LottieEntered'

export default LottieEntered
