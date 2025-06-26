import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { type FC, ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'

import pattern from '@/assets/images/houndstooth-pattern.png'
import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import useLayoutStore from '@/hooks/useLayoutStore'
import { Pathname } from '@/resources/pathname'

import styles from './Footer.module.scss'

const PATHNAMES_WITH_FOOTER = [
  // Pathname.Onboarding,
  Pathname.Events,
  Pathname.Paint,
  Pathname.PaintGallery,
  Pathname.PaintEvent,
  Pathname.ScavengerHuntComplete,
  Pathname.ScavengerHuntPrizes,
]

const FixedFooter: FC = () => {
  const pathname = usePathname()
  const { overlay } = useOverlays()

  const { showFooter, setShowFooter } = useLayoutStore()
  const footer = useRef<HTMLElement>(null)

  useEffect(() => {
    if (overlay !== OverlayScreen.None) {
      setShowFooter(true)
    } else if (PATHNAMES_WITH_FOOTER.includes(pathname as Pathname)) {
      setShowFooter(true)
    } else {
      setShowFooter(false)
    }
  }, [overlay, pathname, setShowFooter])

  function onEnter() {
    gsap.fromTo(
      footer.current,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out' },
    )
  }

  function onExit() {
    gsap.to(footer.current, { yPercent: 100, opacity: 0, duration: 1 })
  }

  return (
    <Transition
      in={showFooter}
      timeout={1000}
      appear={true}
      nodeRef={footer}
      onEnter={onEnter}
      onExit={onExit}
      mountOnEnter
      unmountOnExit>
      <Footer ref={footer} fixed />
    </Transition>
  )
}

export default FixedFooter

type FooterProps = { fixed?: boolean }

export const Footer = forwardRef(({ fixed }: FooterProps, ref: ForwardedRef<HTMLElement>) => {
  return (
    <footer ref={ref} className={classNames(styles.footer, styles.houndToothImg, fixed && styles.fixed)}>
      <div className={styles.line} />
      <Image src={pattern} alt="Houndstooth pattern" quality={75} className={styles.image} />
    </footer>
  )
})

Footer.displayName = 'Footer'
