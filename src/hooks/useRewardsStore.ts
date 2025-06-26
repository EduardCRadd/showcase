import { differenceInCalendarDays } from 'date-fns'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { BeerMatId } from '@/resources/beerMats'

type Store = {
  unlockedBeerMatIds: BeerMatId[]
  dateLastUnlocked: Date | null
  unlockBeerMat: () => void
  canUnlockBeerMat: boolean
  checkIfCanUnlockBeerMat: () => void
}

function getNextId(unlockedBeerMatIds: BeerMatId[]) {
  if (unlockedBeerMatIds.length === 0) return BeerMatId.One
  if (unlockedBeerMatIds.length === 1) return BeerMatId.Two
  if (unlockedBeerMatIds.length === 2) return BeerMatId.Three
  return BeerMatId.One
}

const useRewardsStore = create(
  persist<Store>(
    (set, get) => ({
      unlockedBeerMatIds: [],
      dateLastUnlocked: null,
      unlockBeerMat: () => {
        const { checkIfCanUnlockBeerMat } = get()
        checkIfCanUnlockBeerMat()

        const { unlockedBeerMatIds, canUnlockBeerMat } = get()
        if (!canUnlockBeerMat) return
        const nextId = getNextId(unlockedBeerMatIds)
        set({ unlockedBeerMatIds: [...unlockedBeerMatIds, nextId], dateLastUnlocked: new Date() })
      },
      canUnlockBeerMat: false,
      checkIfCanUnlockBeerMat: () => {
        // A mat can be unlocked once a day
        const { dateLastUnlocked } = get()
        if (!dateLastUnlocked) return set({ canUnlockBeerMat: true })

        // const minutesSinceLastUnlock = differenceInMinutes(new Date(), new Date(dateLastUnlocked))
        const daysSinceLastUnlock = differenceInCalendarDays(new Date(), new Date(dateLastUnlocked))
        if (daysSinceLastUnlock < 1) return set({ canUnlockBeerMat: false })
        return set({ canUnlockBeerMat: true })
      },
    }),
    {
      name: 'rewards-store', // unique name
      // storage: 'localStorage' is used
    },
  ),
)

export default useRewardsStore
