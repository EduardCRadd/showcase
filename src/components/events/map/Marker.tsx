import { type FC, useEffect } from 'react'

import barImg from '@/assets/icons/map/marker-bar.png'
import eventImg from '@/assets/icons/map/marker-event.png'
import shopImg from '@/assets/icons/map/marker-shop.png'
import useMapStore from '@/hooks/useMapStore'
import type { MadriEvent, MapElement } from '@/model/map'
import { MAX_ZOOM } from '@/resources/map'
import { MARKER_IMAGE_URLS, MarkerType } from '@/utils/map'

type MarkerProps = {
  index: number
  latitude: number
  longitude: number
  type: MarkerType
  data: MadriEvent | MapElement
  entryId?: string // for Contentful entries (events)
  map?: google.maps.Map
}

const Marker: FC<MarkerProps> = ({ index, type, map, data, entryId, longitude, latitude }) => {
  const { setPopupData, setPopupTarget } = useMapStore()

  useEffect(() => {
    if (!map) return

    const image = {
      url: MARKER_IMAGE_URLS[type],
      size: new google.maps.Size(64, 94),
      scaledSize: new google.maps.Size(64, 94),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(32, 94),
    }

    const title = `marker-${type}-${index}`

    const markerInstance = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: map,
      icon: image,
      title,
    })

    const onClick = () => {
      map.setZoom(MAX_ZOOM)
      map.panTo(markerInstance.getPosition() as google.maps.LatLng)
      const markerEl = document.querySelector(`[title="${title}"]`)
      setPopupTarget(markerEl as HTMLDivElement)
      setPopupData({
        type,
        id: entryId,
        name: data.name,
        address:
          (data as MadriEvent)?.venue ??
          (data as MapElement)?.address ??
          (data as MapElement)?.postcode ??
          (data as MapElement)?.location ??
          '',
        date: (data as MadriEvent)?.date,
        latitude,
        longitude,
        location: (data as MapElement)?.location,
      })
    }

    const clickListener = markerInstance.addListener('click', (e: google.maps.MapMouseEvent) => onClick())

    return () => google.maps.event.removeListener(clickListener)
  }, [data, index, longitude, latitude, map, setPopupData, setPopupTarget, type, entryId])

  return null
}

export default Marker
