import { Cluster, ClusterStats } from '@googlemaps/markerclusterer'
import type { Entry } from 'contentful'

import barImg from '@/assets/icons/map/marker-bar.png'
import eventImg from '@/assets/icons/map/marker-event.png'
import madriZeroImg from '@/assets/icons/map/marker-madri-zero.png'
import shopImg from '@/assets/icons/map/marker-shop.png'
import { PopupData } from '@/hooks/useMapStore'
import type { MadriEvent, MapElement } from '@/model/map'
import { CustomEventProperties, EventName } from '@/resources/analytics'
import { MAX_ZOOM } from '@/resources/map'
import { GOLD } from '@/styles/colours'

export enum MarkerType {
  Event = 'event',
  Bar = 'bar',
  Shop = 'shop',
  MadriZero = 'madriZero',
}

export const MARKER_IMAGE_URLS = {
  event: eventImg.src,
  bar: barImg.src,
  shop: shopImg.src,
  madriZero: madriZeroImg.src,
}

type CreateEventMarkersParams = {
  map: google.maps.Map
  events: Entry<MadriEvent>[]
  setPopupTarget: (target: HTMLDivElement) => void
  setPopupData: (data: PopupData) => void
  trackEvent: (props: CustomEventProperties) => void
}

export function createEventMarkers({
  map,
  events,
  setPopupData,
  setPopupTarget,
  trackEvent,
}: CreateEventMarkersParams): google.maps.Marker[] {
  const markers: google.maps.Marker[] = []
  events.forEach((event, index) => {
    const { fields } = event
    const latitude = fields.location.lat
    const longitude = fields.location.lon
    if (!latitude || !longitude) return
    const marker = createMarker({
      map,
      index,
      latitude,
      longitude,
      entryId: event.sys.id,
      type: MarkerType.Event,
      data: fields,
      setPopupData,
      setPopupTarget,
      trackEvent,
    })
    markers.push(marker)
  })
  return markers
}

const getNearbyMapEls = (
  data: MapElement[],
  center: { lat: number; lng: number },
): (MapElement & { distance: number })[] => {
  if (!data || !center) return []
  return data
    .map((el) => {
      const latitude = parseFloat(el?.lat)
      const longitude = parseFloat(el?.lng)

      const latDistance = Math.abs(latitude - center.lat)
      const lngDistance = Math.abs(longitude - center.lng)
      const distance = (latDistance + lngDistance) / 2

      return { ...el, distance }
    })
    .filter((el) => {
      return !!parseFloat(el?.lat) && !!parseFloat(el?.lng) && el?.distance && el.distance < 0.5
    })
}

const getClosestMapEls = (data: Array<MapElement & { distance: number }>) => {
  return data.sort((a, b) => Number(a.distance) - Number(b.distance)).splice(0, 99)
}

type CreateMapElMarkersParams = {
  map: google.maps.Map
  data: MapElement[]
  type: MarkerType
  center: { lat: number; lng: number }
  setPopupTarget: (target: HTMLDivElement) => void
  setPopupData: (data: PopupData) => void
  trackEvent: (props: CustomEventProperties) => void
}

export function createMapElMarkers({
  map,
  data,
  type,
  center,
  setPopupData,
  setPopupTarget,
  trackEvent,
}: CreateMapElMarkersParams): google.maps.Marker[] {
  const markers: google.maps.Marker[] = []

  const nearbyEls = getNearbyMapEls(data, center)
  const closestEls = getClosestMapEls(nearbyEls)

  closestEls.forEach((el, index) => {
    const latitude = parseFloat(el?.lat)
    const longitude = parseFloat(el?.lng)

    const marker = createMarker({
      map,
      index,
      latitude,
      longitude,
      type,
      data: el,
      setPopupData,
      setPopupTarget,
      trackEvent,
    })
    markers.push(marker)
  })

  return markers
}

type CreateMarkerParams = {
  map: google.maps.Map
  index: number
  latitude: number
  longitude: number
  type: MarkerType
  data: MadriEvent | MapElement
  entryId?: string // for Contentful entries (events)
  setPopupTarget: (target: HTMLDivElement) => void
  setPopupData: (data: PopupData) => void
  trackEvent: (props: CustomEventProperties) => void
}

function createMarker(props: CreateMarkerParams): google.maps.Marker {
  const { index, type, data, entryId, map, latitude, longitude, setPopupData, setPopupTarget, trackEvent } = props

  const icon = {
    url: MARKER_IMAGE_URLS[type],
    size: new google.maps.Size(64, 94),
    scaledSize: new google.maps.Size(64, 94),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(32, 94),
  }

  const title = `marker-${type}-${index}`

  const marker = new google.maps.Marker({
    position: new google.maps.LatLng(latitude, longitude),
    map: map,
    icon,
    title,
  })

  const onClick = () => {
    map.setZoom(MAX_ZOOM)
    map.panTo(marker.getPosition() as google.maps.LatLng)
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
      postcode: (data as MadriEvent)?.postcode,
      date: (data as MadriEvent)?.date,
      latitude,
      longitude,
      location: (data as MapElement)?.location,
    })

    trackEvent({
      event: EventName.TapLocation1,
      locationName: data.name,
      postCode: data.postcode,
    })
  }
  marker.addListener('click', (e: google.maps.MapMouseEvent) => onClick())
  return marker
}

export const clusterRenderer = () => {
  return {
    render: function ({ count, position }: Cluster, stats: ClusterStats): google.maps.Marker {
      // create svg url with fill color
      const svg = window.btoa(`
    <svg fill="${GOLD}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <circle cx="120" cy="120" opacity=".8" r="70" />    
    </svg>`)

      // create marker using svg icon
      return new google.maps.Marker({
        position,
        icon: {
          url: `data:image/svg+xml;base64,${svg}`,
          scaledSize: new google.maps.Size(75, 75),
        },
        label: {
          text: String(count),
          color: 'rgba(255,255,255,1.0)',
          fontSize: '12px',
        },
        // adjust zIndex to be above other markers
        zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
      })
    },
  }
}
