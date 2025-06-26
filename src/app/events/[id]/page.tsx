'use client'

import React, { useMemo } from 'react'

import EventInfo from '@/components/events/info/EventInfo'
import SpotifyCard from '@/components/spotifyCard/SpotifyCard'
import useMapStore from '@/hooks/useMapStore'

import styles from './eventId.module.scss'

const EventPage = ({ params }: { params: { id: string } }) => {
  const id = params.id
  const { events, preciseLoc } = useMapStore()

  const event = useMemo(() => {
    return events?.find((event) => event.sys.id === id)
  }, [id, events])

  if (!event) return null

  return (
    <main className={styles.main}>
      <EventInfo event={event} canGoBack={true} preciseLoc={preciseLoc} />
      <SpotifyCard event={event} />
    </main>
  )
}

export default EventPage
