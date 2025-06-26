'use client'

import { useState } from 'react'

import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import RedDoorSmallLargeIntro from '@/components/redDoor/RedDoorSmallLarge'
import { Story } from '@/components/story/Story'

// import styles from './story.module.scss'

export default function SpanishStoryPage() {
  const { overlay } = useOverlays()
  const [animateDoor, setAnimateDoor] = useState(true)

  if (overlay !== OverlayScreen.None) return null

  // This is needed to animate the door out
  setTimeout(() => setAnimateDoor(false), 1500)

  return <RedDoorSmallLargeIntro show={animateDoor} mainContent={<Story />}></RedDoorSmallLargeIntro>
}
