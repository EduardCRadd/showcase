import type { Entry } from 'contentful'
import { create } from 'zustand'

import type { MadriEvent, MapElement } from '@/model/map'
import { MarkerType } from '@/utils/map'

export type PreciseLoc = { lat: number; lng: number; heading: number | null }

export type PopupData = {
  type: MarkerType
  name: string
  address: string
  postcode?: string
  date?: string
  id?: string
  latitude: string | number
  longitude: string | number
  location?: string
}

type Store = {
  map: google.maps.Map | undefined
  setMap: (map: google.maps.Map | undefined) => void
  popupData: PopupData | undefined
  setPopupData: (data: PopupData | undefined) => void
  popupTarget: HTMLDivElement | undefined
  setPopupTarget: (targetEl: HTMLDivElement | undefined) => void
  events: Entry<MadriEvent>[] | null
  setEvents: (events: Entry<MadriEvent>[] | null) => void
  shops: MapElement[] | null
  setShops: (shops: MapElement[] | null) => void
  bars: MapElement[] | null
  setBars: (bars: MapElement[] | null) => void
  madriZeroPubs: MapElement[] | null
  setMadriZeroPubs: (bars: MapElement[] | null) => void
  madriZeroRestaurants: MapElement[] | null
  setMadriZeroRestaurants: (bars: MapElement[] | null) => void
  preciseLoc: PreciseLoc | undefined
  setPreciseLoc: (pos: PreciseLoc | undefined) => void
  isTracking: boolean
  setIsTracking: (isTracking: boolean) => void
}

const useMapStore = create<Store>((set, get) => ({
  map: undefined,
  setMap: (map) => {
    set({ map })
  },

  popupData: undefined,
  setPopupData: (data) => {
    set({ popupData: data })
  },

  popupTarget: undefined,
  setPopupTarget: (el) => {
    set({ popupTarget: el })
  },

  events: null,
  setEvents: (events) => set({ events }),

  shops: null,
  setShops: (shops) => set({ shops }),

  bars: null,
  setBars: (bars) => set({ bars }),

  madriZeroPubs: null,
  setMadriZeroPubs: (madriZeroPubs) => set({ madriZeroPubs }),

  madriZeroRestaurants: null,
  setMadriZeroRestaurants: (madriZeroRestaurants) => set({ madriZeroRestaurants }),

  preciseLoc: undefined,
  setPreciseLoc: (pos) => set({ preciseLoc: pos }),

  isTracking: false,
  setIsTracking: (isTracking) => set({ isTracking }),
}))

export default useMapStore
