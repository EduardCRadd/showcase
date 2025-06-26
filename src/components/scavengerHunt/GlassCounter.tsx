import { useGSAP } from '@gsap/react'
import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import React, { type FC, Fragment, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'

import chulapoImg from '@/assets/images/man-illustration.png'
import beerFill from '@/assets/scavenger/beer-fill.svg'
import checkCircle from '@/assets/scavenger/check-circle.svg'
import useScavengerHuntStore from '@/hooks/useScavengerHuntStore'

import styles from './GlassCounter.module.scss'
import { GLASSES_COUNT } from './TiledMural'

type GlassCounterProps = {
  show: boolean
}

const GlassCounter: FC<GlassCounterProps> = ({ show }) => {
  const collectedGlasses = useScavengerHuntStore((s) => s.collectedGlasses)

  const containerRef = useRef<HTMLDivElement>(null)
  const chulapoRef = useRef<HTMLImageElement>(null)
  const { contextSafe } = useGSAP()

  const onEnter = contextSafe(() => {
    gsap.set(containerRef.current, { y: 100 })
    gsap.set(chulapoRef.current, { y: 200 })
  })

  const onEntering = contextSafe(() => {
    gsap.to(containerRef.current, { y: 0, duration: 0.3 })
    gsap.to(chulapoRef.current, { y: 0, duration: 0.5, ease: 'back.out(1.3)', delay: 0.4 })
  })

  const onExiting = contextSafe(() => {
    gsap.to(containerRef.current, { y: 100, duration: 0.3, delay: 0.4 })
    gsap.to(chulapoRef.current, { y: 200, duration: 0.5, ease: 'back.in(1.3)' })
  })

  if (typeof document === 'undefined') return null

  return createPortal(
    <Transition
      in={show}
      timeout={500}
      mountOnEnter
      unmountOnExit
      onEnter={onEnter}
      onEntering={onEntering}
      onExiting={onExiting}>
      <div id="glass-counter" ref={containerRef} className={styles.container}>
        <div className={styles.glasses}>
          {new Array(GLASSES_COUNT).fill(null).map((_, index) => (
            <CollectedGlass key={'collected-glass-' + index} isCollected={collectedGlasses.length > index} />
          ))}
        </div>
        <span className={styles.count}>
          {collectedGlasses.length}/{GLASSES_COUNT}
        </span>
        <Image id="chulapo" ref={chulapoRef} src={chulapoImg} alt="Chulapo" className={styles.chulapo} />
      </div>
    </Transition>,
    document.body,
  )
}

export default GlassCounter

type CollectedGlassProps = {
  isCollected: boolean
}

const CollectedGlass: FC<CollectedGlassProps> = ({ isCollected }) => {
  const { contextSafe } = useGSAP()

  const beerRef = useRef<HTMLImageElement>(null)
  const checkRef = useRef<HTMLImageElement>(null)

  const pourIn = contextSafe(() => {
    gsap
      .timeline()
      .to(beerRef.current, {
        y: -10,
        x: -10,
        duration: 6,
        ease: 'back.out(1.7)',
      })
      .to(
        checkRef.current,
        {
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        },
        1.8,
      )
  })

  useEffect(() => {
    if (isCollected) pourIn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCollected])

  return (
    <div
      className={classNames('collected-glass', styles.glass)}
      style={{ maskImage: `url('${process.env.BASE_PATH}/scavenger/can-counter-silhouette.svg')` }}>
      <Image src={beerFill} alt="" ref={beerRef} className={styles.beer} />
      <Image src={checkCircle} alt="" ref={checkRef} width={22} height={22} className={styles.check} />
    </div>
  )
}
