import { type ContentfulClientApi, createClient, type Entry, type EntryCollection } from 'contentful'

import type { FeaturedEvent, MadriEvent } from '@/model/map'
import { Locale } from '@/resources/locale'

let client: ContentfulClientApi

if (typeof window !== 'undefined') {
  if (process.env.NEXT_PUBLIC_APP_ENV === 'prod') {
    client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE ?? '',
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN ?? '',
    })
  } else {
    // USED FOR PREVIEW - IT ALLOWS SEEING "DRAFTS"
    client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE ?? '',
      accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN ?? '',
      host: 'preview.contentful.com',
    })
  }
}

export const fetchEvents = async (): Promise<EntryCollection<MadriEvent>> =>
  client.getEntries({
    content_type: 'event',
  })

export const fetchFeaturedEvent = async (): Promise<Entry<FeaturedEvent>> =>
  client.getEntry<FeaturedEvent>('5LvPjJ2vqmBEXbKgjNofpY')

type MadriEventsList = {
  title: string
  locale: Locale
  events: Entry<MadriEvent>[]
}

export const fetchEventsListByLocale = async (locale: Locale): Promise<EntryCollection<MadriEventsList>> =>
  client.getEntries({
    content_type: 'eventsList',
    'fields.locale': locale,
    limit: 1,
  })
