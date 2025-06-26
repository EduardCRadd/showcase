import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { type FC, useEffect, useRef, useState } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'

import useScavengerHuntStore from '@/hooks/useScavengerHuntStore'

import styles from './Hints.module.scss'
import { GLASSES_COUNT } from './TiledMural'

type Hint = {
  inDelay?: number
  message: string
  outDelay?: number
}

const HINTS: { [key: number]: Hint } = {
  0: {
    inDelay: 0.6,
    message: 'Tap and drag to explore',
    outDelay: 0.6,
  },
  [GLASSES_COUNT - 1]: {
    inDelay: 3,
    message: 'Only 1 more Madrí Excepcional to find',
  },
}

type HintsProps = {
  isActive: boolean
}

const Hints: FC<HintsProps> = ({ isActive }) => {
  const collectedGlasses = useScavengerHuntStore((s) => s.collectedGlasses)

  const { contextSafe } = useGSAP()
  const cardRef = useRef(null)

  const onEnter = contextSafe(() => {
    if (!cardRef.current) return

    gsap.set(cardRef.current, { scale: 0, opacity: 0 })
  })

  const onEntering = contextSafe(() => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      delay: HINTS[collectedGlasses.length]?.inDelay,
    })
  })

  const onExiting = contextSafe(() => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.in(1.7)',
      delay: HINTS[collectedGlasses.length]?.outDelay,
    })
  })

  const [hint, setHint] = useState<Hint>()

  useEffect(() => {
    if (!isActive) return
    setHint(HINTS[collectedGlasses.length])
  }, [collectedGlasses, isActive])

  useEffect(() => {
    if (!isActive) return
    const onOutsideClick = (e: MouseEvent) => {
      if (collectedGlasses.length === 0) setHint(undefined)
    }

    document.addEventListener('pointerdown', onOutsideClick)
    return () => document.removeEventListener('pointerdown', onOutsideClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectedGlasses, isActive])

  const show = !!hint && isActive

  return (
    <SwitchTransition>
      <Transition
        key={show ? hint?.message : 'hide'}
        timeout={1600}
        onEnter={onEnter}
        onEntering={onEntering}
        onExiting={onExiting}
        mountOnEnter
        unmountOnExit>
        <>
          {show ? (
            <div ref={cardRef} className={styles.card}>
              <p>{hint?.message}</p>
            </div>
          ) : null}
        </>
      </Transition>
    </SwitchTransition>
  )
}

export default Hints
