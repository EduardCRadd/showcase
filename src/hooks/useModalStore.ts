'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type StoreValue = {
  onEnterNow?: () => void

  // About the Artist Modal
  showAboutArtistModal: boolean
  openAboutArtistModal: (onEnterNow?: () => void) => void
  closeAboutArtistModal: () => void

  // About the Festival Modal
  showAboutFestivalModal: boolean
  openAboutFestivalModal: (onEnterNow?: () => void) => void
  closeAboutFestivalModal: () => void

  // Help Modal
  showHelpModal: boolean
  openHelpModal: () => void
  closeHelpModal: () => void
}

const useModalsStore = create(
  persist<StoreValue>(
    (set, get) => ({
      onEnterNow: undefined,

      // About the Artist Modal
      showAboutArtistModal: false,
      openAboutArtistModal: (onEnterNow) =>
        set({
          showAboutArtistModal: true,
          onEnterNow,
        }),
      closeAboutArtistModal: () => set({ showAboutArtistModal: false }),

      // About the Festival Modal
      showAboutFestivalModal: false,
      openAboutFestivalModal: (onEnterNow) =>
        set({
          showAboutFestivalModal: true,
          onEnterNow,
        }),
      closeAboutFestivalModal: () => set({ showAboutFestivalModal: false }),

      // Help Modal
      showHelpModal: false,
      openHelpModal: () =>
        set({
          showHelpModal: true,
        }),
      closeHelpModal: () => set({ showHelpModal: false }),
    }),
    {
      name: 'modals-store',
      partialize: (state) => {
        return {} as StoreValue
      },
    },
  ),
)

export default useModalsStore
