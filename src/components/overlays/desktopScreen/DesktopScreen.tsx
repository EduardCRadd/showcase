import { useReducedMotion } from '@mantine/hooks'
import gsap from 'gsap'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { type FC } from 'react'
import { Transition } from 'react-transition-group'

import image from '@/assets/brand/logo-strapline.png'
import qrOnPack from '@/assets/conectada25/images/on-pack-desktop-qr.webp'
import qrRateOfSale from '@/assets/conectada25/images/rate-of-sale-desktop-qr.webp'
import qrAlwaysOn from '@/assets/images/qr-always.png'
import { Pathname } from '@/resources/pathname'

import styles from './DesktopScreen.module.scss'

type Props = {
  show: boolean
}

const DesktopScreen: FC<Props> = ({ show = false }) => {
  const pathname = usePathname()
  // const searchParams = useSearchParams()

  const reduceMotion = useReducedMotion()

  let qrCodeImg = qrAlwaysOn
  if (pathname === Pathname.Win) {
    qrCodeImg = qrOnPack
  } else if (pathname === Pathname.RateOfSale) {
    qrCodeImg = qrRateOfSale
  }

  function onEnter() {
    gsap.set('#desktop-container', {
      scale: reduceMotion ? 1 : 1.2,
    })
  }

  function onEntering() {
    gsap.to('#desktop-container', {
      scale: 1,
      duration: 0.5,
    })
  }

  function onExit() {
    gsap.to('#desktop-container', {
      autoAlpha: 0,
      duration: 0.2,
    })
  }

  return (
    <Transition
      in={show}
      appear={show}
      timeout={500}
      mountOnEnter={true}
      unmountOnExit={true}
      onEnter={onEnter}
      onEntering={onEntering}
      onExit={onExit}>
      <div id="desktop-container" className={styles.container}>
        <Image src={image} alt="Madri logo" quality={100} className={styles.logo} width={300} />
        <div className={styles.lineContainer}>
          <div />
        </div>
        <div className={styles.qrContainer}>
          <Image src={qrCodeImg} alt="Qr code" quality={100} width={220} />
          <p>SCAN HERE</p>
        </div>
      </div>
    </Transition>
  )
}

export default DesktopScreen
