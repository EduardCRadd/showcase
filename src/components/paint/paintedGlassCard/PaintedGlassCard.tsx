import Image, { StaticImageData } from 'next/image'
import React, { type FC } from 'react'

import logo from '@/assets/brand/logo-strapline.png'
import paintYourPintLabel from '@/assets/paint/paint-your-pint-label.svg'
import backgroundImg from '@/assets/paint/painted-pint-card-bg.jpg'

import styles from './PaintedGlassCard.module.scss'

type PaintedGlassCardProps = {
  imageSrc: string | StaticImageData
}

const PaintedGlassCard: FC<PaintedGlassCardProps> = ({ imageSrc }) => {
  return (
    <div className={styles.container}>
      <Image src={backgroundImg} alt="" className={styles.background} />
      <Image src={logo} alt="Madri logo" width={60} height={96} className={styles.logo} />
      <Image src={imageSrc} alt="Painted Madri Pint Glass" width={170} height={375} className={styles.glass} />
      <Image src={paintYourPintLabel} alt="Painted Your Pint label" width={75} height={25} className={styles.label} />
    </div>
  )
}

export default PaintedGlassCard
