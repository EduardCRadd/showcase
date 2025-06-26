'use client'

import React, { useEffect } from 'react'

import Modals from '@/components/modals/Modals'
import useTicketCompetitionFlowStore from '@/hooks/winFlowStore'

function RosLayout({ children }: { children: React.ReactNode }) {
  const setFlowType = useTicketCompetitionFlowStore((s) => s.setFlowType)
  useEffect(() => {
    setFlowType('rateOfSale')
  }, [setFlowType])
  return (
    <>
      {children}
      <Modals />
    </>
  )
}

export default RosLayout
