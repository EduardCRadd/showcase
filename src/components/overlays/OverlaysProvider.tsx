import { useLocalStorage, useViewportSize } from '@mantine/hooks'
import { createContext, type FC, type PropsWithChildren, useContext, useEffect, useState } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'

import AgeGate, { OVER_18_STORAGE_KEY } from './ageGate/AgeGate'
import CookiesScript from './cookiesScript/CookiesScript'
import DesktopScreen from './desktopScreen/DesktopScreen'
import DeviceOrientation from './deviceOrientation/DeviceOrientation'
import Splash from './splash/Splash'

export enum OverlayScreen {
  Splash = 'Splash',
  AgeGate = 'AgeGate',
  Cookies = 'Cookies',
  Desktop = 'Desktop',
  RotateDevice = 'RotateDevice',
  None = 'None',
}

type ContextValue = {
  overlay: OverlayScreen
}

const INITIAL_STATE: ContextValue = {
  overlay: process.env.NODE_ENV === 'production' ? OverlayScreen.Splash : OverlayScreen.Splash,
}

export const COOKIES_REQUIRED_STORAGE_KEY = 'allowFunctionalCookies'
export const COOKIES_NON_REQUIRED_STORAGE_KEY = 'allowNonFunctionalCookies'
// const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export const Context = createContext<ContextValue>(INITIAL_STATE)

// The <OverlaysProvider> component should wrap the main application in the root layout.

export const OverlaysProvider: FC<PropsWithChildren> = ({ children }) => {
  const { height, width } = useViewportSize()
  const [overlay, setOverlay] = useState<OverlayScreen>(INITIAL_STATE.overlay)

  // Desktop Screen
  const [showDesktopScreen, setShowDesktopScreen] = useState<boolean>(false)

  useEffect(() => {
    const isDesktop = !checkIsMobile()
    if (isDesktop) setShowDesktopScreen(true)
  }, [])

  const isLandscape = width > height

  // Rotate Screen
  const [showRotateScreen, setShowRotateScreen] = useState<boolean>(false)

  useEffect(() => {
    if (isLandscape) {
      setShowRotateScreen(true)
    } else {
      setShowRotateScreen(false)
    }
  }, [isLandscape])

  // Age Store
  const [isOver18, setIsOver18] = useLocalStorage<boolean>({
    key: OVER_18_STORAGE_KEY,
    defaultValue: false,
  })

  const onSplashEnd = () => {
    if (!isOver18) return setOverlay(OverlayScreen.AgeGate)
    return setOverlay(OverlayScreen.None)
  }

  const onConfirmCookies = () => {
    if (!isOver18) return setOverlay(OverlayScreen.AgeGate)
    return setOverlay(OverlayScreen.None)
  }

  const onConfirmAge = () => {
    setIsOver18(true)
    setOverlay(OverlayScreen.None)
  }

  return (
    <Context.Provider value={{ overlay }}>
      {children}

      <SwitchTransition mode="out-in">
        <Transition key={overlay} timeout={500}>
          {(state) => {
            if (overlay === OverlayScreen.Splash) return <Splash transitionStatus={state} onEnd={onSplashEnd} />

            if (overlay === OverlayScreen.AgeGate) return <AgeGate transitionStatus={state} onConfirm={onConfirmAge} />
            return null
          }}
        </Transition>
      </SwitchTransition>

      {overlay !== OverlayScreen.Splash && process.env.NODE_ENV !== 'development' && (
        <CookiesScript onConfirm={onConfirmCookies} />
      )}
      {process.env.NODE_ENV === 'production' && showRotateScreen && <DeviceOrientation show={showRotateScreen} />}
      {process.env.NODE_ENV === 'production' && showDesktopScreen && <DesktopScreen show={showDesktopScreen} />}
    </Context.Provider>
  )
}

export function useOverlays() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useOverlays must be used within an OverlaysProvider')
  }
  return context
}

function checkIsMobile(): boolean {
  return (
    typeof navigator != 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}
