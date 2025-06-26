import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Store = {
  collectedGlasses: number[]
  collectGlass: (id: number) => void
  resetCollectedGlasses: () => void
  includeScavengerLinkInMenu: boolean
  setIncludeScavengerLinkInMenu: (value: boolean) => void
}

const useScavengerHuntStore = create(
  persist<Store>(
    (set, get) => ({
      collectedGlasses: [],
      collectGlass: (id) => {
        set((state) => {
          if (state.collectedGlasses.includes(id)) return state
          return { collectedGlasses: [...state.collectedGlasses, id] }
        })
      },
      resetCollectedGlasses: () => set({ collectedGlasses: [] }),
      includeScavengerLinkInMenu: false,
      setIncludeScavengerLinkInMenu: (value) => set({ includeScavengerLinkInMenu: value }),
    }),
    {
      name: 'scavenger-hunt-store',
    },
  ),
)

export default useScavengerHuntStore
