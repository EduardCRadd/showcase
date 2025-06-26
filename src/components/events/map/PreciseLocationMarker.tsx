import { autoUpdate, useFloating } from '@floating-ui/react-dom'
import gsap from 'gsap'
import Image from 'next/image'
import React, { type FC, useEffect, useState } from 'react'

import coneIcon from '@/assets/icons/cone.svg'
import emptyPixelImg from '@/assets/icons/empty-pixel.png'
import useGTMEvent from '@/hooks/useGTMEvent'
import useMapStore from '@/hooks/useMapStore'
import { EventName } from '@/resources/analytics'
import { INITIAL_ZOOM } from '@/resources/map'

import styles from './PreciseLocationMarker.module.scss'

const GEOLOC_MARKER_TITLE = 'geoloc'

const PreciseLocationMarker: FC = () => {
  const { trackEvent } = useGTMEvent()
  const { map, preciseLoc } = useMapStore()

  const [marker, setMarker] = useState<google.maps.Marker>()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement>()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) return setMounted(true)
    if (!map) return
    if (!preciseLoc) return

    if (marker) return

    // trackEvent({ event: EventName.GetPreciseLocation })

    const position = { lat: preciseLoc.lat, lng: preciseLoc.lng }

    const createLocationMarker = () => {
      const image = {
        url: emptyPixelImg.src,
        size: new google.maps.Size(1, 1),
        scaledSize: new google.maps.Size(1, 1),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0),
      }

      const title = GEOLOC_MARKER_TITLE + Math.random()
      const markerInstance = new google.maps.Marker({
        position,
        icon: image,
        map,
        title,
      })

      setMarker(markerInstance)

      map.panTo(position)
      map.setZoom(INITIAL_ZOOM)

      const timer = setTimeout(() => {
        const markerEl = document.querySelector(`[title="${title}"]`) as HTMLDivElement
        if (!markerEl) return
        setAnchorEl(markerEl)
        clearTimeout(timer)
      }, 100)
    }

    createLocationMarker()
  }, [map, marker, mounted, preciseLoc, trackEvent])

  const { x, y, refs } = useFloating({
    open: !!marker,
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: !!marker,
      }),
  })

  useEffect(() => {
    refs.setReference(anchorEl || null)
  }, [anchorEl, refs])

  // Updating live direction/heading
  useEffect(() => {
    if (!preciseLoc?.heading) return
    gsap.to('#direction', { rotate: preciseLoc.heading })
  }, [preciseLoc])

  useEffect(() => {
    const updateMarkerPosition = () => {
      if (!marker || !preciseLoc) return

      const position = { lat: preciseLoc.lat, lng: preciseLoc.lng }
      marker.setPosition(position)
    }
    updateMarkerPosition()
  }, [preciseLoc, marker])

  useEffect(() => {
    if (!map) return
    marker?.setMap(map)
  }, [marker, map])

  return (
    <div ref={refs.setFloating} className={styles.marker} style={{ position: 'fixed', top: y ?? 0, left: x ?? 0 }}>
      <div className={styles.point} />
      <Image id="direction" src={coneIcon} alt="arrow" className={styles.direction} />
    </div>
  )
}

export default PreciseLocationMarker
