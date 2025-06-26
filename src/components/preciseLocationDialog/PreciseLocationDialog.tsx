'use client'

import Image from 'next/image'
import React, { type FC, useEffect, useRef, useState } from 'react'

import compassIcon from '@/assets/icons/compass.svg'
import DialogBox from '@/components/events/map/DialogBox'
import useGTMEvent from '@/hooks/useGTMEvent'
import useTranslation from '@/hooks/useTranslation'
import { EventName } from '@/resources/analytics'

type Props = {
  show: boolean
  hide: () => void
  className?: string
  onLocationFound?: (pos: { lat: number; lng: number; heading: number | null }) => void
  onTrackingStart?: () => void
  onTrackingEnd?: () => void
  portal?: boolean
  shouldWatch?: boolean
}

const GEOLOC_WATCH_OPTIONS: PositionOptions = { enableHighAccuracy: true, timeout: 27000, maximumAge: 0 }

const PreciseLocationDialog: FC<Props> = ({
  show,
  hide,
  className,
  onLocationFound,
  onTrackingStart,
  onTrackingEnd,
  portal,
  shouldWatch,
}) => {
  const [isTracking, setIsTracking] = useState(false)
  const watchIdsRef = useRef<number[]>([])
  const t = useTranslation()
  const { trackEvent } = useGTMEvent()

  const onGeolocSuccess: PositionCallback = (position: GeolocationPosition) => {
    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      heading: position.coords.heading,
    }

    onLocationFound?.(pos)
    hide()
    setIsTracking(false)
    onTrackingEnd?.()
  }

  const onGeolocError: PositionErrorCallback = (error) => {
    alert(error.message)
    console.error(error)
    setIsTracking(false)
    onTrackingEnd?.()
  }

  const findPreciseLocation = () => {
    if (isTracking) return

    if (navigator.geolocation) {
      setIsTracking(true)
      onTrackingStart?.()

      if (shouldWatch) {
        const watchId = navigator.geolocation.watchPosition(onGeolocSuccess, onGeolocError, GEOLOC_WATCH_OPTIONS)
        watchIdsRef.current.push(watchId)
      } else {
        navigator.geolocation.getCurrentPosition(onGeolocSuccess, onGeolocError, GEOLOC_WATCH_OPTIONS)
      }
    } else {
      alert("Browser doesn't support Geolocation")
    }
  }

  function handleClick() {
    findPreciseLocation()
    trackEvent({ event: EventName.GetPreciseLocation })
  }

  useEffect(() => {
    const clearWatchIds = () => {
      watchIdsRef.current.forEach((watchId) => navigator.geolocation.clearWatch(watchId))
    }
    return () => clearWatchIds()

    // this may have to be cleared on pathname change if it's not unmounting when switching listview/mapview in google maps feature
  }, [])

  return (
    <DialogBox
      show={show}
      message={
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <Image src={compassIcon} alt="" style={{ marginRight: 8 }} />
          {t('get-your-precise-location')}
        </span>
      }
      isLoading={isTracking}
      onClick={handleClick}
      onCloseClick={hide}
      className={className}
      portal={portal}
    />
  )
}

export default PreciseLocationDialog
