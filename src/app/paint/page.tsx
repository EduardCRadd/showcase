'use client'

import gsap from 'gsap'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { type FC, useRef, useState } from 'react'

import introGlass from '@/assets/images/intro-glass.png'
import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import ProgressBar from '@/components/progressBar/ProgressBar'
import RedDoorLargeIntro from '@/components/redDoor/RedDoorLarge'
import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'

import styles from './page.module.scss'

function Home() {
  const [showDoor, setShowDoor] = useState(true)

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
        mainContent={<PaintYourGlassOnboarding isPaused={showDoor} />}
      />
    </main>
  )
}

export default Home

const PaintYourGlassOnboarding: FC<{ isPaused: boolean }> = ({ isPaused }) => {
  const { push } = useRouter()
  const { trackEvent } = useGTMEvent()
  const tweenRef = useRef<GSAPTween>()

  const onTimeEnd = (pathname: string) => {
    if (tweenRef.current) return
    tweenRef.current = gsap.to('#intro', { opacity: 0, y: 16, onComplete: () => push(pathname) })
  }

  const onAboutTheDesignClick = () => {
    // trackEvent(EventName.ClickAboutTheDesign)
    onTimeEnd(Pathname.PaintBehindOurGlass)
  }

  return (
    <div id="intro" className={styles.intro}>
      <div className={styles.skip} onClick={() => onTimeEnd(Pathname.PaintDesigner)} />

      <div className={styles.glassContainer}>
        <Image src={introGlass} alt="Madri Beer Glass" />
        <button className={styles.about} onClick={onAboutTheDesignClick}>
          <span>About</span>
          <span>The Design</span>
        </button>
      </div>

      <p className="mid">
        Experience the Soul of Madrid with our new limited edition
        <br /> glass, designed by Madridian artist Sokram.
      </p>

      <ProgressBar
        duration={6}
        onEnd={() => onTimeEnd(Pathname.PaintDesigner)}
        className={styles.progress}
        isPaused={isPaused}
      />
    </div>
  )
}
