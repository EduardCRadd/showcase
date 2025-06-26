'use client'
import React, { useState } from 'react'

import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import RedDoorLargeIntro from '@/components/redDoor/RedDoorLarge'
import ScavengerHunt from '@/components/scavengerHunt/ScavengerHunt'
import { CustomEventProperties } from '@/resources/analytics'

import styles from './scavengerHunt.module.scss'

const ScavengerHuntPage = () => {
  const [showDoor, setShowDoor] = useState(true)
  const { overlay } = useOverlays()

  if (overlay !== OverlayScreen.None) return null

  return (
    <main className={styles.main}>
      <RedDoorLargeIntro
        show={showDoor}
        section={'hunt'}
        hideDoor={() => {
          setShowDoor(false)
        }}
        mainContent={<ScavengerHunt />}
      />
    </main>
  )
}

export default ScavengerHuntPage
