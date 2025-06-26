'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type FC, useState } from 'react'

import experienceText from '@/assets/images/experience-near-you.svg'
import FunFact from '@/components/funFact/FunFact'
import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import ProgressBar from '@/components/progressBar/ProgressBar'
import RedDoorSmallLargeIntro from '@/components/redDoor/RedDoorSmallLarge'
import { Pathname } from '@/resources/pathname'

import styles from './page.module.scss'

// B2-B4 - Map and event list screens
export default function Events() {
  const [showFact, setShowFact] = useState(true)
  const { overlay } = useOverlays()

  if (overlay !== OverlayScreen.None) return null

  return (
    <main className={styles.main}>
      {/* Main content revealed after intro  */}
      <RedDoorSmallLargeIntro show={showFact} mainContent={<MapIntro show={!showFact} />}>
        <FunFact onEnd={() => setShowFact(false)} />
      </RedDoorSmallLargeIntro>
    </main>
  )
}

const MapIntro: FC<{ show: boolean }> = ({ show }) => {
  const { push } = useRouter()
  if (!show) return null

  const onTimeEnd = () => {
    push(Pathname.EventsMap)
  }

  const onTap = () => {
    setTimeout(onTimeEnd, 100)
  }

  return (
    <div className={styles.mapIntro} onClick={onTap}>
      <p className={styles.overline}>Hola, bienvenido!</p>

      <Image src={experienceText} alt="Experience the soul of Madrid" />

      <p>
        <span>
          Find exciting events, discover where to find your nearest Madrí Excepcional, learn Spanish and much more.
        </span>

        <span style={{ display: 'block', marginTop: 24 }}>Ready to dive in? Vamos!</span>
      </p>
      <ProgressBar duration={8} onEnd={onTimeEnd} />
    </div>
  )
}
