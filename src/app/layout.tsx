'use client'

import '@/styles/globals.scss'

import { GoogleTagManager } from '@next/third-parties/google'
import gsap from 'gsap'
import Flip from 'gsap/Flip'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useLayoutEffect } from 'react'

import FixedFooter from '@/components/footer/Footer'
import Header from '@/components/header/Header'
import { OverlaysProvider } from '@/components/overlays/OverlaysProvider'
import useAnalyticsEvent from '@/hooks/useAnalyticsEvent'
import useCookieConsentStore from '@/hooks/useCookieConsentStore'
import useGTMEvent from '@/hooks/useGTMEvent'
import useLocaleStore from '@/hooks/useLocaleStore'
import useLocationByIp from '@/hooks/useLocationByIp'
import { EventName } from '@/resources/analytics'
import { Locale } from '@/resources/locale'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip)
}

function RootLayout({ children }: { children: React.ReactNode }) {
  const { allowNonFunctionalCookies } = useCookieConsentStore()
  const setLocale = useLocaleStore((s) => s.setLocale)
  const { get } = useSearchParams()
  const locale = get('locale') as Locale | null
  const pathname = usePathname()
  const { trackEvent } = useGTMEvent()
  const logAnalyticsEvent = useAnalyticsEvent()

  useLocationByIp()

  useLayoutEffect(() => {
    // This is needed for direct links to events.
    // e.g https://madriexcepcional.io.tt/conectada/events/1dbhr312ihPs7WwCWDB0Pj?locale=ie
    if (!!locale) setLocale(locale)
  }, [locale, setLocale])

  useEffect(() => {
    logAnalyticsEvent(EventName.ViewedPage, pathname)
  }, [pathname, logAnalyticsEvent])

  return (
    <html lang="en">
      <body>
        <OverlaysProvider>
          <Header />
          {children}
          <FixedFooter />
          {allowNonFunctionalCookies && <GoogleTagManager gtmId="GTM-WPX58LC9" />}
        </OverlaysProvider>
      </body>
    </html>
  )
}

export default RootLayout
