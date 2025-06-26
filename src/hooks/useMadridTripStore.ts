import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Store = {
  hasVisitedMadridTrip: boolean
  setHasVisitedMadridTrip: (value: boolean) => void
}

const useMadridTripStore = create(
  persist<Store>(
    (set) => ({
      hasVisitedMadridTrip: false,
      setHasVisitedMadridTrip: (value) => set({ hasVisitedMadridTrip: value }),
    }),
    {
      name: 'madrid-trip-store',
    },
  ),
)

export default useMadridTripStore
