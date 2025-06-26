'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import RedDoorLargeIntro from '@/components/redDoor/RedDoorLarge'
import useCookieConsentStore from '@/hooks/useCookieConsentStore'
import { checkIsMadriZeroTakeoverLive } from '@/resources/goLiveDates'
import { Pathname } from '@/resources/pathname'

function Home() {
  const { overlay } = useOverlays()
  const { push } = useRouter()
  const [showDoor, setShowDoor] = useState(true)
  const { allowNonFunctionalCookies } = useCookieConsentStore()

  const isTakeoverLive = checkIsMadriZeroTakeoverLive()

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.action === 'navigate' && event.data.url) {
        push(event.data.url)
      }

      if (event.data?.action === 'show-cookie-settings') {
        window?.truste?.eu.reopenBanner()
      }
    }

    window.addEventListener('message', handleMessage)

    return () => window.removeEventListener('message', handleMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [push])

  useEffect(() => {
    if (showDoor) return
    if (overlay !== OverlayScreen.None) return

    document.body.style.backgroundColor = 'white'
    document.body.style.color = 'black'

    return () => {
      document.body.style.removeProperty('background-color')
      document.body.style.removeProperty('color')
    }
  }, [overlay, showDoor])

  useEffect(() => {
    if (!isTakeoverLive) push(Pathname.Paint)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [push])

  if (overlay !== OverlayScreen.None || !isTakeoverLive) return null

  return (
    <main
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}>
      <RedDoorLargeIntro
        show={showDoor}
        section={'pint'}
        hideDoor={() => {
          setShowDoor(false)
        }}
        mainContent={
          <iframe
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            sandbox="allow-same-origin allow-scripts"
            src={
              process.env.NEXT_PUBLIC_APP_ENV === 'staging'
                ? `https://se-stg-madri-excepcional-zero.fly.dev/conectada/landing?cookies=${allowNonFunctionalCookies}`
                : `https://madri-excepcional-zero.x.io.tt/conectada/landing?cookies=${allowNonFunctionalCookies}`
            }
          />
        }
      />
    </main>
  )
}

export default Home
