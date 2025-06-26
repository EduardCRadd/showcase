import { useGSAP } from '@gsap/react'
import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'

import introCan from '@/assets/scavenger/intro-can.png'
import useScavengerHuntStore from '@/hooks/useScavengerHuntStore'

import styles from './Popover.module.scss'
import { GLASSES_COUNT } from './TiledMural'

type PopoverProps = {
  anchorEl: HTMLElement | null
  onClose: () => void
}

const Popover: FC<PopoverProps> = ({ anchorEl, onClose }) => {
  const collectedGlasses = useScavengerHuntStore((s) => s.collectedGlasses)
  const containerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP()
  const timeline = useRef<gsap.core.Timeline>()
  const requestId = useRef<number>()
  const [isReady, setIsReady] = useState(false)
  const [popoverWidth, setPopoverWidth] = useState(0)

  const onEnter = contextSafe(() => {
    if (!popoverRef.current) return
    setPopoverWidth(popoverRef.current.getBoundingClientRect().width)

    const selector = gsap.utils.selector(containerRef.current)
    const pulseEls = selector('.pulse')

    if (timeline.current) timeline.current.kill()

    gsap.set(pulseEls, { scale: 0, opacity: 1 })
    gsap.set(popoverRef.current, { scale: 0, opacity: 0 })
    gsap.set(arrowRef.current, { scale: 0, opacity: 0 })
  })

  const transitionIn = contextSafe(() => {
    const selector = gsap.utils.selector(containerRef.current)
    const pulseEls = selector('.pulse')

    timeline.current = gsap
      .timeline()
      .to(pulseEls, {
        scale: 1,
        duration: (i) => 1.6 + i * 0.4,
        stagger: 0.4,
      })
      .to(
        pulseEls,
        {
          opacity: 0,
          duration: 1,
          stagger: 0.4,
        },
        1.6,
      )
      .set(pulseEls, { clearProps: 'transform,opacity' })

    gsap
      .timeline()
      .to(arrowRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.2,
      })
      .to(
        popoverRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.2)',
        },
        0,
      )
  })

  const onExiting = contextSafe(() => {
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0,
      duration: 0.3,
      ease: 'back.in(1.2)',
    })
  })

  useEffect(() => {
    if (!anchorEl) return
    const onOutsideClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        if (requestId.current) cancelAnimationFrame(requestId.current)
        onClose()
      }
    }

    document.addEventListener('click', onOutsideClick)
    return () => document.removeEventListener('click', onOutsideClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, anchorEl])

  const calculateAndSetPositionsFromAnchor = useCallback(() => {
    const anchorRect = anchorEl?.getBoundingClientRect()

    if (!containerRef.current) return
    if (!anchorRect) return

    const padding = 15

    const containerTop = anchorRect.top + anchorRect.height / 2
    const containerLeft = anchorRect.left + anchorRect.width / 2

    const adjustedLeft = Math.min(Math.max(padding, containerLeft), window.innerWidth - padding)

    gsap.set(containerRef.current, {
      top: containerTop + 'px',
      left: adjustedLeft + 'px',
    })

    if (!popoverRef.current) return
    if (!arrowRef.current) return

    const minTranslateX = -1 * ((adjustedLeft / window.innerWidth) * popoverWidth)

    const maxTranslateX = popoverWidth / 2 - padding

    const translateX = Math.min(Math.min(-padding, minTranslateX), maxTranslateX) //px comparison

    gsap.set(popoverRef.current, { x: translateX + 'px', transformOrigin: `${Math.abs(translateX)}px bottom` })

    setIsReady(true)
  }, [anchorEl, popoverWidth])

  const updatePosition = useCallback(() => {
    calculateAndSetPositionsFromAnchor()
    requestId.current = requestAnimationFrame(updatePosition)
  }, [calculateAndSetPositionsFromAnchor])

  useEffect(() => {
    requestId.current = requestAnimationFrame(updatePosition)
    return () => {
      if (requestId.current) cancelAnimationFrame(requestId.current)
    }
  }, [anchorEl, updatePosition])

  useEffect(() => {
    if (isReady) transitionIn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  if (typeof document === 'undefined') return null

  return createPortal(
    <Transition
      in={!!anchorEl}
      appear
      timeout={600}
      mountOnEnter
      unmountOnExit
      onEnter={onEnter}
      // onEntering={onEntering}
      onExiting={onExiting}>
      <div ref={containerRef} className={classNames('scavenger-popover', styles.container)}>
        <div ref={popoverRef} className={styles.popover} onClick={onClose}>
          <Image src={introCan} alt="Madri Glass" className={styles.introCan} />
          <div className={styles.message}>
            <span>{collectedGlasses.length === 2 ? 'VAMOS!' : 'Muy bueno'}</span>
            <span>You found 1 Madrí Excepcional can</span>

            {collectedGlasses.length === GLASSES_COUNT ? (
              <span>You’ve found all 3</span>
            ) : (
              <span>Only {GLASSES_COUNT - collectedGlasses.length} more to find</span>
            )}
          </div>
        </div>
        <div ref={arrowRef} role="presentation" className={styles.arrow} />
        {new Array(3).fill(0).map((_, i) => (
          <div key={'pulse-' + i} className={classNames('pulse', styles.pulse)} />
        ))}
      </div>
    </Transition>,
    document.body,
  )
}

export default Popover
