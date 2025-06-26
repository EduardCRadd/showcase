'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { getJSON } from 'src/utils/helpers'

import Controls from '@/components/events/Controls'
import HeaderBg from '@/components/header/HeaderBg'
import useLocale from '@/hooks/useLocale'
import useMapStore from '@/hooks/useMapStore'
import type { MapElement } from '@/model/map'
import {
  BAR_MARKER_PATHS,
  MADRI_ZERO_PUBS_MARKER_PATHS,
  MADRI_ZERO_RESTAURANTS_MARKER_PATHS,
  SHOP_MARKER_PATHS,
} from '@/resources/map'
import { Pathname } from '@/resources/pathname'
import { fetchEventsListByLocale } from '@/services/contentful'

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale()
  const setEvents = useMapStore(({ setEvents }) => setEvents)
  const setShops = useMapStore(({ setShops }) => setShops)
  const setBars = useMapStore(({ setBars }) => setBars)
  const setMadriZeroPubs = useMapStore(({ setMadriZeroPubs }) => setMadriZeroPubs)
  const setMadriZeroRestaurants = useMapStore(({ setMadriZeroRestaurants }) => setMadriZeroRestaurants)

  const pathname = usePathname()
  const isMap = pathname === Pathname.EventsMap
  const searchParams = useSearchParams()
  const barsSource = searchParams.get('bars')

  useEffect(() => {
    if (!locale) return

    fetchEventsListByLocale(locale)
      .then((data) => {
        if (!data.items.length) setEvents(null)
        else setEvents(data.items[0].fields.events)
      })
      .catch(console.error)

    if (barsSource === 'madrid-trip') {
      getJSON<MapElement>(`${process.env.BASE_PATH}/madrid-trip/bars.json`).then((data) => setBars(data))
    } else {
      getJSON<MapElement>(BAR_MARKER_PATHS[locale]).then((data) => setBars(data))
      getJSON<MapElement>(SHOP_MARKER_PATHS[locale]).then((data) => setShops(data))

      const madriZeroPubsPath = MADRI_ZERO_PUBS_MARKER_PATHS[locale]
      if (!!madriZeroPubsPath) getJSON<MapElement>(madriZeroPubsPath).then((data) => setMadriZeroPubs(data))
      const madriZeroRestaurantsPath = MADRI_ZERO_RESTAURANTS_MARKER_PATHS[locale]
      if (!!madriZeroRestaurantsPath)
        getJSON<MapElement>(madriZeroRestaurantsPath).then((data) => setMadriZeroRestaurants(data))
    }
  }, [barsSource, locale, setBars, setEvents, setShops, setMadriZeroPubs, setMadriZeroRestaurants])

  return (
    <>
      <HeaderBg show={isMap} />
      {children}
      <Controls />
    </>
  )
}
