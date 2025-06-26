'use client'
import { Loader } from '@googlemaps/js-api-loader'
import { GridAlgorithm, MarkerClusterer } from '@googlemaps/markerclusterer'
import { type FC, useEffect, useRef, useState } from 'react'
import { clusterRenderer, createEventMarkers, createMapElMarkers, MarkerType } from 'src/utils/map'

import { Alert } from '@/components/alert/Alert'
import Popup from '@/components/events/map/Popup'
import useGTMEvent from '@/hooks/useGTMEvent'
import useLocale from '@/hooks/useLocale'
import useMapStore from '@/hooks/useMapStore'
import useTranslation from '@/hooks/useTranslation'
import {
  checkAreMadriZeroPubsLive,
  checkAreMadriZeroRestaurantsLive,
  checkIsMadriZeroTakeoverLive,
} from '@/resources/goLiveDates'
import { DEFAULT_COORDS, MAP_OPTIONS } from '@/resources/map'
import { CUSTOM_MAP_STYLES } from '@/resources/mapStyles'

import styles from './Map.module.scss'
import PreciseLocationMarker from './PreciseLocationMarker'

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places'],
})

const Map: FC = () => {
  const {
    bars,
    madriZeroPubs,
    madriZeroRestaurants,
    events,
    shops,
    map,
    preciseLoc,
    popupData,
    setMap,
    setPopupData,
    setPopupTarget,
  } = useMapStore()
  const { locale } = useLocale()
  const t = useTranslation()
  const { trackEvent } = useGTMEvent()

  // TODO If more clusters have to be added the useEffects below
  //  will have to be refactored to use a custom hook (useMapMarkerClusters) to avoid the repetitive parts of the code

  useEffect(() => {
    loader
      .load()
      .then((google) => {
        const container = document.getElementById('map')
        if (!container) return
        const mapInstance = new google.maps.Map(container, MAP_OPTIONS)
        mapInstance.setOptions({
          styles: CUSTOM_MAP_STYLES,
        })

        setMap(mapInstance)
      })
      .catch((e) => {
        console.error(e)
      })

    return () => {
      setMap(undefined)
    }
  }, [setMap])

  useEffect(() => {
    if (map && locale) {
      map.panTo({ lat: DEFAULT_COORDS[locale].lat, lng: DEFAULT_COORDS[locale].lng })
    }
  }, [map, locale])

  useEffect(() => {
    if (!map) return

    const clickListener = map.addListener('click', () => {
      setPopupData(undefined)
    })

    return () => {
      google.maps.event.removeListener(clickListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  const barsClusterer = useRef<MarkerClusterer>()

  useEffect(() => {
    if (!map) return
    if (!bars?.length) return

    const isMadriZeroLive = checkIsMadriZeroTakeoverLive()
    if (isMadriZeroLive) return

    const createBarMarkers = () => {
      if (barsClusterer.current) barsClusterer.current.setMap(null)

      const lat = map.getCenter()?.lat() || 0
      const lng = map.getCenter()?.lng() || 0
      const center = { lat, lng }
      const markers = createMapElMarkers({
        map,
        data: bars,
        type: MarkerType.Bar,
        setPopupData,
        setPopupTarget,
        trackEvent,
        center,
      })
      barsClusterer.current = new MarkerClusterer({
        algorithm: new GridAlgorithm({}),
        map,
        markers,
        renderer: clusterRenderer(),
      })
    }

    const handle = map.addListener('idle', () => {
      createBarMarkers()
    })

    return () => google.maps.event.removeListener(handle)
  }, [map, bars, setPopupData, setPopupTarget, trackEvent])

  const madriZeroPubsClusterer = useRef<MarkerClusterer>()

  useEffect(() => {
    const isFeatureLive = checkAreMadriZeroPubsLive()
    if (!isFeatureLive) return

    if (!map) return
    if (!madriZeroPubs?.length) return

    const createPubMarkers = () => {
      if (madriZeroPubsClusterer.current) madriZeroPubsClusterer.current.setMap(null)

      const lat = map.getCenter()?.lat() || 0
      const lng = map.getCenter()?.lng() || 0
      const center = { lat, lng }
      const markers = createMapElMarkers({
        map,
        data: madriZeroPubs,
        type: MarkerType.MadriZero,
        setPopupData,
        setPopupTarget,
        trackEvent,
        center,
      })
      madriZeroPubsClusterer.current = new MarkerClusterer({
        algorithm: new GridAlgorithm({}),
        map,
        markers,
        renderer: clusterRenderer(),
      })
    }

    const handle = map.addListener('idle', () => {
      createPubMarkers()
    })

    return () => google.maps.event.removeListener(handle)
  }, [map, madriZeroPubs, setPopupData, setPopupTarget, trackEvent])

  const madriZeroRestaurantsClusterer = useRef<MarkerClusterer>()

  useEffect(() => {
    const isFeatureLive = checkAreMadriZeroRestaurantsLive()
    if (!isFeatureLive) return

    if (!map) return
    if (!madriZeroRestaurants?.length) return

    const createRestaurantMarkers = () => {
      if (madriZeroRestaurantsClusterer.current) madriZeroRestaurantsClusterer.current.setMap(null)

      const lat = map.getCenter()?.lat() || 0
      const lng = map.getCenter()?.lng() || 0
      const center = { lat, lng }
      const markers = createMapElMarkers({
        map,
        data: madriZeroRestaurants,
        type: MarkerType.MadriZero,
        setPopupData,
        setPopupTarget,
        trackEvent,
        center,
      })
      madriZeroRestaurantsClusterer.current = new MarkerClusterer({
        algorithm: new GridAlgorithm({}),
        map,
        markers,
        renderer: clusterRenderer(),
      })
    }

    const handle = map.addListener('idle', () => {
      createRestaurantMarkers()
    })

    return () => google.maps.event.removeListener(handle)
  }, [map, madriZeroRestaurants, setPopupData, setPopupTarget, trackEvent])

  const shopsClusterer = useRef<MarkerClusterer>()

  useEffect(() => {
    if (!map) return
    if (!shops?.length) return

    const isMadriZeroLive = checkIsMadriZeroTakeoverLive()
    if (isMadriZeroLive) return

    const createShopMarkers = () => {
      if (shopsClusterer.current) shopsClusterer.current.setMap(null)

      const lat = map.getCenter()?.lat() || 0
      const lng = map.getCenter()?.lng() || 0
      const center = { lat, lng }
      const markers = createMapElMarkers({
        map,
        data: shops,
        type: MarkerType.Shop,
        center,
        setPopupData,
        setPopupTarget,
        trackEvent,
      })
      shopsClusterer.current = new MarkerClusterer({
        algorithm: new GridAlgorithm({}),
        map,
        markers,
        renderer: clusterRenderer(),
      })
    }

    const handle = map.addListener('idle', () => {
      createShopMarkers()
    })

    return () => google.maps.event.removeListener(handle)
  }, [map, setPopupData, setPopupTarget, shops, trackEvent])

  useEffect(() => {
    const createEvMarkers = () => {
      if (!map) return
      if (!events) return
      const markers = createEventMarkers({ map, events: events, setPopupData, setPopupTarget, trackEvent })
      new MarkerClusterer({
        algorithm: new GridAlgorithm({}),
        map,
        markers,
        renderer: clusterRenderer(),
      })
    }

    createEvMarkers()
  }, [map, events, setPopupData, setPopupTarget, trackEvent])

  const showPopper = !!popupData

  const [showAlert, setShowAlert] = useState(true)

  return (
    <>
      <div id="map" className={styles.map}></div>
      {showPopper && <Popup />}
      {preciseLoc && <PreciseLocationMarker />}

      <Alert label={t('find-events')} show={showAlert} hide={() => setShowAlert(false)} bottom="80%" />
    </>
  )
}

export default Map
