import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { type FC, useEffect, useState } from 'react'

import logo from '@/assets/brand/logo-vertical.png'
import menuCloseIcon from '@/assets/icons/menu-close.svg'
import menuIcon from '@/assets/icons/menu-hamburger.svg'
import useAnalyticsEvent from '@/hooks/useAnalyticsEvent'
import useLayoutStore from '@/hooks/useLayoutStore'
import useRewardsStore from '@/hooks/useRewardsStore'
import useTranslation from '@/hooks/useTranslation'
import { EventName } from '@/resources/analytics'
import { PAGE_TITLES, Pathname } from '@/resources/pathname'

import Menu from '../menu/Menu'
import { OverlayScreen, useOverlays } from '../overlays/OverlaysProvider'
import styles from './Header.module.scss'

type Props = {
  checked?: boolean
  disabled?: boolean
  onChange?: () => void
}

const PATHNAMES_WITH_LOGO = [Pathname.Phrases]

const PATHNAMES_WITH_H1_TITLE = [
  Pathname.Rewards,
  Pathname.Phrases,
  Pathname.Story,
  Pathname.ScavengerHuntComplete,
  Pathname.ScavengerHuntPrizes,
]

const PATHNAMES_WITHOUT_MENU = [
  Pathname.Landing,
  Pathname.Paint,
  Pathname.PaintEvent,
  Pathname.PaintEventComingSoon,
  Pathname.PaintEventBehindOurGlass,
  Pathname.ScavengerHunt,
]

const Header: FC<Props> = () => {
  const logAnalyticsEvent = useAnalyticsEvent()
  const { checkIfCanUnlockBeerMat } = useRewardsStore()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const stParam = searchParams.get('st')

  const t = useTranslation()
  const { overlay } = useOverlays()

  const isMadridTripWithStateZero = pathname === Pathname.MadridTrip && stParam === '0'

  const { showMenu, setShowMenu, showMenuButton, setShowMenuButton } = useLayoutStore()

  const [delayedIsMadridTripWithStateZero, setDelayedIsMadridTripWithStateZero] = useState(isMadridTripWithStateZero)
  useEffect(() => {
    const delayTimeout = setTimeout(() => {
      setDelayedIsMadridTripWithStateZero(isMadridTripWithStateZero)
    }, 685)

    return () => clearTimeout(delayTimeout)
  }, [isMadridTripWithStateZero])

  useEffect(() => {
    checkIfCanUnlockBeerMat()
  }, [checkIfCanUnlockBeerMat])

  useEffect(() => {
    setShowMenu(false)
  }, [pathname, setShowMenu])

  const onOpenMenuClick = () => {
    logAnalyticsEvent(EventName.TapBurgerMenu, pathname)
    setShowMenu(true)
  }

  const title = PAGE_TITLES[pathname as Pathname]

  const pageHasMenuButton = !PATHNAMES_WITHOUT_MENU.includes(pathname as Pathname)

  const showLogo = showMenu || PATHNAMES_WITH_LOGO.includes(pathname as Pathname)

  const showH1Title = PATHNAMES_WITH_H1_TITLE.includes(pathname as Pathname)

  useEffect(() => {
    setShowMenuButton(pageHasMenuButton)
  }, [pageHasMenuButton, setShowMenuButton])

  if (overlay !== OverlayScreen.None) return null

  return (
    <>
      {showLogo && <Image alt="Madri" src={logo} width={40} height={116} className={styles.logo} />}
      <header className={styles.container}>
        {!delayedIsMadridTripWithStateZero && (
          <div
            className={styles.menuIcon}
            style={{
              transform: showMenuButton ? 'translateY(0)' : 'translateY(-100px)',
            }}>
            {showMenu ? (
              <>
                <Image
                  alt="Close menu"
                  src={menuCloseIcon}
                  width={24}
                  height={24}
                  onClick={() => setShowMenu(!showMenu)}
                />
                <h1>{t('menu')}</h1>
              </>
            ) : (
              <>
                <Image
                  alt="Open menu"
                  src={menuIcon}
                  width={24}
                  height={24}
                  className={styles.menuSvg}
                  onClick={onOpenMenuClick}
                />
                {showH1Title && <h1>{title}</h1>}
              </>
            )}
          </div>
        )}
      </header>
      <Menu isOpen={showMenu} close={() => setShowMenu(false)} />
    </>
  )
}

export default Header
