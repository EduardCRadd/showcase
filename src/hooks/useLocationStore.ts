import { create } from 'zustand'

import { LocationResponse } from '@/services/location'

type Store = {
  location: LocationResponse | null
  setLocation: (location: LocationResponse | null) => void
}

const useLocationStore = create<Store>((set, get) => ({
  location: null,
  setLocation: (location) => {
    if (location) {
      set({ location })
    }
  },
}))

export default useLocationStore
