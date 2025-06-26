import Script from 'next/script'
import { type FC, useEffect } from 'react'

import useCookieConsentStore from '@/hooks/useCookieConsentStore'

type Props = {
  onConfirm: () => void
}

const CookiesScript: FC<Props> = ({ onConfirm }) => {
  const { setCookiesPref, allowFunctionalCookies } = useCookieConsentStore()

  useEffect(() => {
    // Confirm on development always
    if (process.env.NODE_ENV === 'development') return onConfirm()

    function onMessage(e: MessageEvent<any>) {
      let data = e.data
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (e) {
          /* bail */
        }
      }

      if (data?.message === 'submit_preferences') {
        const preferences = data?.data?.split(',') ?? []
        const allowAnalyticsDecisions = ['2', '3']
        const allowAnalytics = allowAnalyticsDecisions.some((decision) => preferences.includes(decision))
        setCookiesPref(allowAnalytics)
        onConfirm()
      }
    }

    window.addEventListener('message', onMessage, false)

    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [allowFunctionalCookies, onConfirm, setCookiesPref])

  return (
    <>
      <div id="consent_blackbar" />
      <div id="teconsent" />
      <Script
        async={true}
        src={`https://consent.trustarc.com/notice?domain=molsoncoors.com&c=teconsent&pcookie=true&cdn=1&gtm=true&js=bb&noticeType=bb`}
        crossOrigin="anonymous"
      />
    </>
  )
}

export default CookiesScript

// Note – Privacy Policy parameter &privacypolicylink could be added to the script: Pease replace
// the privacy policy URL with an encoded URL of the privacy policy page on each website or
// cookie policy page. The privacy policy URL needs to be encoded and the privacypolicylink
// parameter must be the last parameter in the script.*

// Note – language parameter ‘&language=es’: If you would like to enforce the consent manager to
// be displayed in only one language on this site, please add the parameter ‘&language=es’ to the
// script but add this parameter

// Note - country parameter &country=es: specific country behaviour could be enforced if
// required on a specific local site by adding this parameter to the script &country=es for Spai
