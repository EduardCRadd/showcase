'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import TicketCompetitionFlow from '@/components/conectada25/TicketCompetitionFlow'
import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import RedDoorLargeIntro from '@/components/redDoor/RedDoorLarge'
import { useROSStore } from '@/hooks/useFormStore'
import { checkIsMadriRateOfSaleLive } from '@/resources/goLiveDates'
import { Pathname } from '@/resources/pathname'
import { TicketFlow } from '@/types/ticketFlow'

import styles from './page.module.scss'

function Home() {
  const [showDoor, setShowDoor] = useState(true)
  const { push } = useRouter()
  const isRateOfSaleLive = checkIsMadriRateOfSaleLive()

  const userDetails = useROSStore((s) => s.userDetails)
  const setUserDetails = useROSStore((s) => s.setUserDetails)
  const updateUserDetails = useROSStore((s) => s.updateUserDetails)

  useEffect(() => {
    if (!isRateOfSaleLive) push(Pathname.Paint)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [push])

  const { overlay } = useOverlays()

  if (overlay !== OverlayScreen.None) return null
  return (
    <main className={styles.main}>
      {/* Main content revealed after intro  */}
      <RedDoorLargeIntro
        show={showDoor}
        section={'pint'}
        hideDoor={() => {
          setShowDoor(false)
        }}
        mainContent={
          <TicketCompetitionFlow
            doorIsPlaying={showDoor}
            ticketFlow={TicketFlow.RateOfSale}
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            updateUserDetails={updateUserDetails}
          />
        }
      />
    </main>
  )
}
export default Home
