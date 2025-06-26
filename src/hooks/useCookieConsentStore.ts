import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Store = {
  allowFunctionalCookies: boolean
  allowNonFunctionalCookies: boolean | null // Starts as null before user has made a choice
  setCookiesPref: (allowNonFunctionalCookies: boolean) => void
}

const useCookieConsentStore = create(
  persist<Store>(
    (set, get) => ({
      allowFunctionalCookies: false,
      allowNonFunctionalCookies: null,
      setCookiesPref: (allowNonFunctionalCookies: boolean) => {
        set({
          allowFunctionalCookies: true,
          allowNonFunctionalCookies,
        })
      },
    }),
    {
      name: 'cookie-consent', // unique name
      // storage: 'localStorage' is used
    },
  ),
)

export default useCookieConsentStore
