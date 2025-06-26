import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import React, { type FC, useEffect, useState } from 'react'

import useLayoutStore from '@/hooks/useLayoutStore'
import useScavengerHuntStore from '@/hooks/useScavengerHuntStore'
import { Pathname } from '@/resources/pathname'

import GetStarted from './GetStarted'
import GlassCounter from './GlassCounter'
import Hints from './Hints'
import Landing from './Landing'
import styles from './ScavengerHunt.module.scss'
import TiledMural, { GLASSES_COUNT } from './TiledMural'

enum Stage {
  None,
  Landing,
  GetStarted,
  Game,
}

const ScavengerHunt: FC = () => {
  const push = useRouter().push
  const setShowMenuButton = useLayoutStore((s) => s.setShowMenuButton)
  const collectedGlasses = useScavengerHuntStore((s) => s.collectedGlasses)
  const resetCollectedGlasses = useScavengerHuntStore((s) => s.resetCollectedGlasses)
  const [stage, setStage] = useState(Stage.None)
  const [mounted, setMounted] = useState(false)
  const { contextSafe } = useGSAP()

  useEffect(() => {
    resetCollectedGlasses()
    if (!mounted) return setMounted(true)
    gsap
      .timeline()

      .call(() => setShowMenuButton(true), undefined, 1.7)
      .call(() => setStage(Stage.Landing), undefined, 1.7)
    // .call(() => setStage(Stage.Game), undefined, 1.7)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShowMenuButton, mounted])

  const transitionOut = contextSafe((onComplete: () => void) => {
    gsap
      .timeline()
      .to('.collected-glass', {
        delay: 2,
        scale: 1.2,
        stagger: 0.15,
      })
      .to(
        '.collected-glass',
        {
          scale: 1,
          stagger: 0.15,
        },
        2.3,
      )
      .to('#chulapo', {
        y: 200,
        ease: 'back.in(1.3)',
        duration: 0.5,
      })
      .to(['.scavenger-popover', 'main'], {
        opacity: 0,
        duration: 0.2,
        stagger: 0.2,
      })
      .to('#glass-counter', {
        y: 200,
        duration: 0.3,
      })

      .call(() => onComplete())
  })

  useEffect(() => {
    if (!mounted) return
    if (collectedGlasses.length === GLASSES_COUNT) {
      transitionOut(() => {
        push(Pathname.ScavengerHuntComplete)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectedGlasses, push, mounted])

  return (
    <div id="scavenger-container" className={styles.container}>
      <TiledMural />

      <Landing
        show={stage === Stage.Landing}
        onCtaClick={() => {
          setStage(Stage.GetStarted)
        }}
      />

      <GetStarted
        show={stage === Stage.GetStarted}
        onCtaClick={() => {
          setStage(Stage.Game)
        }}
        onCloseClick={() => {
          setStage(Stage.Game)
        }}
      />

      <GlassCounter show={stage === Stage.Game} />

      <Hints isActive={stage === Stage.Game} />
    </div>
  )
}

export default ScavengerHunt
