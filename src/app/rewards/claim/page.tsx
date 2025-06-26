'use client'
import gsap from 'gsap'
import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'

import tenOff from '@/assets/images/claim-10.svg'
import revl from '@/assets/images/revl.png'
import Button from '@/components/button/Button'
import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'

import styles from './claim.module.scss'

// NOTE: This has been removed and is now redirecting to home in next.config.js. Left for reference.

export default function Rewards() {
  const container = useRef<HTMLElement>(null)
  const { overlay } = useOverlays()

  useLayoutEffect(() => {
    if (overlay !== OverlayScreen.None) return

    const animateIn = () => {
      const selector = gsap.utils.selector(container.current)
      const elements = selector('img, p, span, a, div')
      const directDescendants = elements.filter((el) => el.parentElement === container.current)

      gsap.set(directDescendants, { opacity: 0, y: 24 })
      gsap.to(directDescendants, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, delay: 0.5, ease: 'back.out(1.5)' })
    }

    animateIn()
  }, [overlay])

  return (
    <main ref={container} className={styles.main}>
      <Image src={tenOff} alt="10% off Madri" quality={100} className={styles.image} />
      <p className={styles.text}>For 10% off your next purchase visit revl.co.uk/Madri to claim. Use the code:</p>
      <span>SALUD10</span>
      <Button
        type="submit"
        variant="primary"
        arrowRight
        className={styles.button}
        url="https://revl.co.uk/collections/madri-excepcional">
        Redeem now
      </Button>
      <div className={styles.revlImageContainer}>
        <Image src={revl} alt="Revl - drinks to your door" quality={80} width={82} height={82} />
      </div>
    </main>
  )
}
