'use client'

import React, { useEffect } from 'react'

import Modals from '@/components/modals/Modals'
import useTicketCompetitionFlowStore from '@/hooks/winFlowStore'

function WinLayout({ children }: { children: React.ReactNode }) {
  const setFlowType = useTicketCompetitionFlowStore((s) => s.setFlowType)
  useEffect(() => {
    setFlowType('win')
  }, [setFlowType])
  return (
    <>
      {children}
      <Modals />
    </>
  )
}

export default WinLayout
