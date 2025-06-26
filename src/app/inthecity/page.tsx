'use client'

import { Entry } from 'contentful'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import FeaturedEventContent from '@/components/events/featured/FeaturedEvent'
import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import PhrasePlayer from '@/components/phrases/PhrasePlayer'
import RedDoorSmallLargeIntro from '@/components/redDoor/RedDoorSmallLarge'
import usePhrasesStore from '@/hooks/usePhraseStore'
import { FeaturedEvent } from '@/model/map'
import { Pathname } from '@/resources/pathname'
import { fetchFeaturedEvent } from '@/services/contentful'

import styles from './inthecity.module.scss'

// A6a
// User comes from a QR code on an "out of home" media touchpoint

export default function OOHPage() {
  const getPhrase = usePhrasesStore((state) => state.getPhrase)
  const [phrase, _] = useState(() => getPhrase())
  const [isPhrasePassed, setIsPhrasePassed] = useState(false)
  const { push } = useRouter()

  const { overlay } = useOverlays()

  const [featuredEvent, setFeaturedEvent] = useState<Entry<FeaturedEvent>>()

  useEffect(() => {
    const loadEvent = async () => {
      const featuredEvent = await fetchFeaturedEvent()
      if (!featuredEvent?.fields?.event) {
        console.warn('No featured event found')
        push(Pathname.Landing)
        return
      }
      setFeaturedEvent(featuredEvent)
    }
    loadEvent()
  }, [push])

  if (overlay !== OverlayScreen.None) return null

  return (
    <main className={styles.main}>
      <RedDoorSmallLargeIntro
        show={!isPhrasePassed}
        mainContent={<FeaturedEventContent featuredEvent={featuredEvent} isPhrasePassed={isPhrasePassed} />}>
        <PhrasePlayer onCompleted={() => setIsPhrasePassed(true)} phrase={phrase} isPractice={false} />
      </RedDoorSmallLargeIntro>
    </main>
  )
}
