'use client'

import { useGSAP } from '@gsap/react'
import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import React, { type FC, useEffect, useRef, useState } from 'react'

import gameCan from '@/assets/scavenger/mural-can.png'
import TiledImageLoader from '@/components/tiledImageLoader/TiledImageLoader'
import useScavengerHuntStore from '@/hooks/useScavengerHuntStore'

import Popover from './Popover'
import styles from './TiledMural.module.scss'

type Glass = {
  id: number
  top: number //Percent
  left: number //Percent
}

const CANS: {
  // Row numer
  [key: number]: {
    //Col number
    [key: number]: Glass
  }
} = {
  4: {
    6: {
      id: 1,
      top: 0,
      left: 80,
    },
  },
  7: {
    13: {
      id: 2,
      top: 0,
      left: 14,
    },
  },
  2: {
    23: {
      id: 3,
      top: 45,
      left: 28,
    },
  },
}

export const GLASSES_COUNT = Object.values(CANS).reduce((acc, row) => acc + Object.keys(row).length, 0)

const TiledMural: FC = () => {
  const renderTileContent = (row: number, col: number) => {
    const glass = CANS[row]?.[col]

    if (!glass) return null

    return <TileContent key={`tile-content-${row}-${col}`} glass={glass} />
  }

  return (
    <>
      <TiledImageLoader
        renderTileContent={renderTileContent}
        tiledImagePath={process.env.BASE_PATH + '/scavenger/tiles'}
        rows={7}
        cols={29}
      />
    </>
  )
}

export default TiledMural

type TileContentProps = {
  glass: Glass
}

const TileContent: FC<TileContentProps> = ({ glass }) => {
  const collectGlass = useScavengerHuntStore((s) => s.collectGlass)
  const collectedGlasses = useScavengerHuntStore((s) => s.collectedGlasses)

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { contextSafe } = useGSAP()
  const tween = useRef<gsap.core.Tween>()

  const onClick = contextSafe(() => {
    if (!buttonRef.current) return
    setPopoverAnchorEl(buttonRef.current)
    collectGlass(glass.id)

    if (tween.current) tween.current.kill()

    tween.current = gsap.to(buttonRef.current, {
      scale: 0,
      duration: 0.5,
      ease: 'back.in(2)',
    })
  })

  const requestId = useRef<number>()

  useEffect(() => {
    if (!popoverAnchorEl) return

    const checkIsOutsideViewport = () => {
      if (containerRef.current) {
        const { top, bottom, left, right } = containerRef.current.getBoundingClientRect()
        const { innerHeight, innerWidth } = window

        const isOutside = right < -10 || left > innerWidth + 10 || bottom < -10 || top > innerHeight + 10

        if (isOutside) {
          setPopoverAnchorEl(null)
        }
      }

      requestId.current = requestAnimationFrame(checkIsOutsideViewport)
    }

    requestId.current = requestAnimationFrame(checkIsOutsideViewport)

    return () => {
      if (requestId.current) cancelAnimationFrame(requestId.current)
    }
  }, [popoverAnchorEl])

  useEffect(() => {
    if (collectedGlasses[collectedGlasses.length - 1] === glass.id) return
    setPopoverAnchorEl(null)
  }, [collectedGlasses, glass.id])

  return (
    <>
      <div className={styles.tile} ref={containerRef}>
        <button
          ref={buttonRef}
          onClick={onClick}
          className={styles.glassWrapper}
          style={{
            top: `${glass.top}%`,
            left: `${glass.left}%`,
          }}>
          <div
            className={classNames('glass', styles.glass)}
            style={{
              maskImage: `url('${process.env.BASE_PATH}/scavenger/game-can-silhouette.png')`,
            }}>
            <Image src={gameCan} alt="Madri Glass" width={60} height={106} />
          </div>
        </button>
      </div>

      <Popover
        anchorEl={popoverAnchorEl}
        onClose={() => {
          setPopoverAnchorEl(null)
        }}
      />
    </>
  )
}
