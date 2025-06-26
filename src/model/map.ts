import type { Asset, Entry } from 'contentful'

// Loaded from Contentful

export type FeaturedEvent = {
  event: Entry<MadriEvent>
}

export type MadriEvent = {
  name: string
  venue: string
  startDate: string
  postcode: string
  date: string
  location: { lat: number; lon: number }
  image: Asset
  description: string
}

// Loaded from JSON

export type MapElement = {
  name: string
  address: string
  postcode: string
  coordinates: string // lat, lng = 52.2488345, -0.8749102
  lat: string
  lng: string
  location: string
}
