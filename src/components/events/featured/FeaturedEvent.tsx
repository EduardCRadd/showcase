'use client'

import type { Entry } from 'contentful'
import { addDays } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { type FC, useEffect, useState } from 'react'

import madriMeetsImg from '@/assets/images/madri-meets.svg'
import EventInfo from '@/components/events/info/EventInfo'
import Timer from '@/components/timer/Timer'
import { FeaturedEvent, MadriEvent } from '@/model/map'
import { Pathname } from '@/resources/pathname'

import styles from './FeaturedEvent.module.scss'

type FeaturedEventProps = {
  isPhrasePassed: boolean
  featuredEvent: Entry<FeaturedEvent> | undefined
}

const FeaturedEventContent: FC<FeaturedEventProps> = ({ isPhrasePassed, featuredEvent }) => {
  const [showCountdown, setShowCountdown] = useState(false)
  const [event, setEvent] = useState<Entry<MadriEvent>>()
  const { push } = useRouter()

  useEffect(() => {
    const getFeaturedEvent = async () => {
      if (!isPhrasePassed) return
      if (!featuredEvent?.fields?.event) return
      try {
        const fields = featuredEvent.fields.event.fields

        const startCountdownDate = new Date(fields.startDate).getTime()
        const eventDate = new Date(fields.date).getTime()
        const currentDate = new Date().getTime()
        const showCountdown = currentDate > startCountdownDate && currentDate < eventDate

        // The event date is the start date of the event. After 1 day of the event, we redirect to the AlwaysOn page.
        const shouldRedirect = currentDate > addDays(eventDate, 1).getTime()
        if (shouldRedirect) {
          push(Pathname.Landing)
          return
        }

        setShowCountdown(showCountdown)
        setEvent(featuredEvent.fields.event)
      } catch (e) {
        console.error(e)
      }
    }

    getFeaturedEvent()
  }, [featuredEvent, isPhrasePassed, push])

  return (
    <div className={styles.eventWrapper}>
      <span className={styles.title}>
        <Image src={madriMeetsImg} alt="Madri" />
        <span>MEETS DUBLIN</span>
      </span>
      {/* Countdown to the start of the event when it's not live.  */}
      {showCountdown && (
        <Timer
          event={event}
          onTimerEnd={() => {
            setShowCountdown(false)
          }}
        />
      )}
      <EventInfo event={event} canGoBack={false} className={styles.eventInfoContainer} />
    </div>
  )
}
export default FeaturedEventContent
