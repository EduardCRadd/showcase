'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import HeaderBg from '@/components/header/HeaderBg'
import { HuntTermsProvider } from '@/components/scavengerHunt/HuntTermsProvider'
import useLayoutStore from '@/hooks/useLayoutStore'
import useScavengerHuntStore from '@/hooks/useScavengerHuntStore'
import { Pathname } from '@/resources/pathname'

function ScavengerHuntLayout({ children }: { children: React.ReactNode }) {
  const { push } = useRouter()

  // useEffect(() => {
  //   push(Pathname.Paint)
  // }, [push])

  // return null

  const showMenuButton = useLayoutStore((s) => s.showMenuButton)
  const pathname = usePathname()
  const isHuntPage = pathname === Pathname.ScavengerHunt

  const setIncludeScavengerLinkInMenu = useScavengerHuntStore((s) => s.setIncludeScavengerLinkInMenu)

  useEffect(() => {
    setIncludeScavengerLinkInMenu(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <HuntTermsProvider>
      <HeaderBg show={showMenuButton && isHuntPage} />
      {children}
    </HuntTermsProvider>
  )
}

export default ScavengerHuntLayout
