'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'

import PaintCanvas from '@/components/paint/canvas/PaintCanvas'
import Entered from '@/components/paint/entered/Entered'
import GlassSelector from '@/components/paint/glassSelector/GlassSelector'
import Landing from '@/components/paint/landing/Landing'
import Review from '@/components/paint/review/Review'
import { Pathname } from '@/resources/pathname'

import styles from './page.module.scss'

enum Screen {
  Landing,
  Selector,
  Designer,
  Review,
  Entered,
}

export default function PintDesignerPage() {
  const [screen, setScreen] = useState<Screen>()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const [imageKey, setImageKey] = useState<string>('')

  //On mount only
  useEffect(() => {
    const step = searchParams.get('st')

    if (typeof step === 'string') setScreen(+step)
    else setScreen(Screen.Landing)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (screen !== undefined) {
      replace(Pathname.PaintDesigner + '?st=' + screen)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  const [show, setShow] = useState<boolean>()
  const [iOSVersion, setIOSVersion] = useState<number>()

  useEffect(() => {
    if (!isIOS) return setShow(true)

    const iOSVersion = getIOSVersion()?.[0]
    setIOSVersion(iOSVersion)
    setShow(true)
  }, [])

  return (
    <main className={styles.main}>
      <SwitchTransition mode="out-in">
        <Transition key={show ? screen : undefined} timeout={800} appear mountOnEnter unmountOnExit>
          {(status) => {
            if (screen === Screen.Landing)
              return <Landing transitionStatus={status} goToSelector={() => setScreen(Screen.Selector)} />
            if (screen === Screen.Selector)
              return <GlassSelector transitionStatus={status} goToDesigner={() => setScreen(Screen.Designer)} />
            if (screen === Screen.Designer)
              return (
                <PaintCanvas
                  transitionStatus={status}
                  goToReview={() => setScreen(Screen.Review)}
                  showFallbackMessage={isIOS && !!iOSVersion && iOSVersion < 16.3}
                />
              )
            if (screen === Screen.Review)
              return (
                <Review
                  transitionStatus={status}
                  goToDesigner={() => setScreen(Screen.Designer)}
                  goToEntered={(imageKey) => {
                    setScreen(Screen.Entered)
                    setImageKey(imageKey)
                  }}
                />
              )
            if (screen === Screen.Entered) return <Entered transitionStatus={status} imageKey={imageKey} />
            return null
          }}
        </Transition>
      </SwitchTransition>
    </main>
  )
}

function getIOSVersion() {
  if (typeof navigator === 'undefined') return [0]
  const ua = navigator.userAgent
  if (/(iPhone|iPod|iPad)/i.test(ua)) {
    return ua
      .match(/OS [\d_]+/i)?.[0]
      .substr(3)
      .split('_')
      .map((n) => parseInt(n))
  }
  return [0]
}

const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
