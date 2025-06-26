'use client'
import Lottie, { type LottieRef, type LottieRefCurrentProps } from 'lottie-react'
import React, { forwardRef } from 'react'

import lottieTrumpet from '@/assets/conectada25/lottie/trumpet.json'

import styles from './LottieTrumpet.module.scss'

const LottieTrumpet = forwardRef<LottieRefCurrentProps>((props, ref) => {
  return (
    <div className={styles.lottieWrapper}>
      <Lottie lottieRef={ref as LottieRef} animationData={lottieTrumpet} autoPlay={true} loop={true} />
    </div>
  )
})

LottieTrumpet.displayName = 'LottieTrumpet'

export default LottieTrumpet
