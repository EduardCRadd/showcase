'use client'
import { useState } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'

import ComingSoonLanding from '@/components/paint/landing/ComingSoonLanding'
import Landing from '@/components/paint/landing/Landing'

import styles from './page.module.scss'

enum Screen {
  Landing,
  Prizes,
  Selector,
  Designer,
  Review,
}

export default function PaintYourPintPage() {
  const [screen, setScreen] = useState<Screen>(Screen.Landing)

  return (
    <main className={styles.main}>
      <SwitchTransition mode="out-in">
        <Transition key={screen} timeout={800} appear mountOnEnter unmountOnExit>
          {(status) => {
            if (screen === Screen.Landing) return <ComingSoonLanding transitionStatus={status} />
            return null
          }}
        </Transition>
      </SwitchTransition>
    </main>
  )
}
