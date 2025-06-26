'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { getJSON } from 'src/utils/helpers'

import Controls from '@/components/events/Controls'
import HeaderBg from '@/components/header/HeaderBg'
import useLocale from '@/hooks/useLocale'
import useMapStore from '@/hooks/useMapStore'
import { MapElement } from '@/model/map'
import { BAR_MARKER_PATHS, SHOP_MARKER_PATHS } from '@/resources/map'
import { Pathname } from '@/resources/pathname'
import { fetchEventsListByLocale } from '@/services/contentful'

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  // TODO: Code duplicated in the other events layout - could create "useEventsLayout" hook
  const { locale } = useLocale()
  const setEvents = useMapStore(({ setEvents }) => setEvents)
  const setShops = useMapStore(({ setShops }) => setShops)
  const setBars = useMapStore(({ setBars }) => setBars)

  const pathname = usePathname()
  const isMap = pathname === Pathname.EventsMap

  useEffect(() => {
    if (!locale) return

    fetchEventsListByLocale(locale)
      .then((data) => setEvents(data.items[0].fields.events))
      .catch(console.error)

    getJSON<MapElement>(BAR_MARKER_PATHS[locale]).then((data) => setBars(data))
    getJSON<MapElement>(SHOP_MARKER_PATHS[locale]).then((data) => setShops(data))
  }, [locale, setBars, setEvents, setShops])

  return (
    <>
      <HeaderBg show={isMap} />
      {children}
      <Controls />
    </>
  )
}
