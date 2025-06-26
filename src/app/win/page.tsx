'use client'
import React, { useState } from 'react'

import TicketCompetitionFlow from '@/components/conectada25/TicketCompetitionFlow'
import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import RedDoorLargeIntro from '@/components/redDoor/RedDoorLarge'
import { useOnPackStore } from '@/hooks/useFormStore'
import { TicketFlow } from '@/types/ticketFlow'

import styles from './page.module.scss'

function Home() {
  const [showDoor, setShowDoor] = useState(true)

  const userDetails = useOnPackStore((s) => s.userDetails)
  const setUserDetails = useOnPackStore((s) => s.setUserDetails)
  const updateUserDetails = useOnPackStore((s) => s.updateUserDetails)

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
            ticketFlow={TicketFlow.Win}
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
