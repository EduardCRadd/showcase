'use client'
import { useEffect } from 'react'

import useLocale from '@/hooks/useLocale'
import useMapStore from '@/hooks/useMapStore'
import { fetchEventsListByLocale } from '@/services/contentful'

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale()
  const setEvents = useMapStore(({ setEvents }) => setEvents)

  useEffect(() => {
    if (!locale) return

    fetchEventsListByLocale(locale)
      .then((data) => setEvents(data.items[0].fields.events))
      .catch(console.error)
  }, [locale, setEvents])

  return <>{children}</>
}
