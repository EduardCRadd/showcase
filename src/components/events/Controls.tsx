import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { type FC } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'

import manImg from '@/assets/images/man-illustration.png'
import ViewToggle from '@/components/events/map/ViewToggle'
import PreciseLocationDialog from '@/components/preciseLocationDialog/PreciseLocationDialog'
import useMapStore from '@/hooks/useMapStore'
import { Pathname } from '@/resources/pathname'

import LoadingSpinner from '../loading/LoadingSpinner'
import styles from './Controls.module.scss'

// Set this to 0 after testing on staging

const Controls: FC = () => {
  const { map, preciseLoc, setPreciseLoc, isTracking, setIsTracking, events } = useMapStore()
  const pathname = usePathname()

  const showManIllustration = pathname === Pathname.EventsMap || pathname === Pathname.SpanishEventsMap

  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    if (!pathname.includes(Pathname.EventsMap)) return setShowDialog(false)
    if (!preciseLoc) setShowDialog(true)
  }, [pathname, preciseLoc])

  const show =
    pathname.includes(Pathname.EventsMap) ||
    pathname.includes(Pathname.EventsList) ||
    pathname.includes(Pathname.SpanishEventsMap)

  const showMapToggle =
    !!events?.length && (pathname.includes(Pathname.EventsMap) || pathname.includes(Pathname.EventsList))

  const onEntering = () => {
    gsap.fromTo('#controls', { opacity: 0, yPercent: 100 }, { opacity: 1, yPercent: 0, duration: 0.3 })
  }

  const onExiting = () => {
    gsap.to('#controls', { opacity: 0, yPercent: 100, duration: 0.3 })
  }

  return (
    <Transition
      timeout={600}
      in={show}
      appear={true}
      mountOnEnter
      unmountOnExit
      onEntering={onEntering}
      onExiting={onExiting}>
      <>
        <div id="controls" className={classNames(styles.controls, showDialog && styles.withDialog)}>
          <div>
            {showMapToggle && <ViewToggle />}
            {showManIllustration && <Image src={manImg} alt="man" />}
          </div>

          <PreciseLocationDialog
            show={showDialog}
            hide={() => setShowDialog(false)}
            onLocationFound={(pos) => {
              setPreciseLoc(pos)
            }}
            onTrackingStart={() => setIsTracking(true)}
            onTrackingEnd={() => setIsTracking(false)}
            className={styles.dialog}
            portal={true}
            shouldWatch={true}
          />
        </div>
        {isTracking && preciseLoc && (
          <div className={styles.loading}>
            <LoadingSpinner />
          </div>
        )}
      </>
    </Transition>
  )
}

export default Controls
