'use client'

import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import { type FC, useLayoutEffect } from 'react'

import EventItem from '@/components/events/list/Item'
import useMapStore from '@/hooks/useMapStore'
import { Pathname } from '@/resources/pathname'

import styles from './ListItems.module.scss'

type Props = {}

const ListItems: FC<Props> = () => {
  const { push } = useRouter()
  const events = useMapStore((state) => state.events)

  useLayoutEffect(() => {
    if (!events) return
    gsap.fromTo(
      '.list-item',
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.15,
        delay: 0.1,
      },
    )
  }, [events])

  const onEventClick = (id: string, name: string) => {
    gsap.to('#list-container', {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        push(Pathname.Events + `/${id}`)
      },
    })
  }

  return (
    <div id="list-container" className={styles.container}>
      <header>
        <h1>Events</h1>
      </header>
      <section>
        {events?.map((item) => {
          if (!item) return null
          const date = item.fields.date
          const name = item.fields.name
          const address = item.fields.venue
          const entryId = item.sys.id
          const imageUrl = item.fields.image?.fields.file.url
          return (
            <EventItem
              key={entryId}
              name={name}
              date={date}
              address={address}
              imageUrl={imageUrl}
              onClick={() => onEventClick(entryId, name)}
            />
          )
        })}
      </section>
    </div>
  )
}

export default ListItems
