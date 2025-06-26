'use client'
import { create } from 'zustand'

import { Locale } from '../resources/locale'

type Store = {
  locale: Locale | undefined
  setLocale: (locale: Locale) => void
}

const useLocaleStore = create<Store>((set, get) => ({
  locale: Locale.UK,
  setLocale: (locale) => {
    console.warn('set locale:', locale)
    set({ locale })
  },
}))

export default useLocaleStore
