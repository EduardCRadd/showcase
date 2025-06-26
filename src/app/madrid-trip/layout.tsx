'use client'

import { useEffect } from 'react'

import { MadridTripTermsProvider } from '@/components/madridTrip/terms/MadridTripTermsProvider'
import useMadridTripStore from '@/hooks/useMadridTripStore'

function MadridTripLayout({ children }: { children: React.ReactNode }) {
  const setHasVisitedMadridTrip = useMadridTripStore((s) => s.setHasVisitedMadridTrip)

  useEffect(() => {
    setHasVisitedMadridTrip(true)
  }, [setHasVisitedMadridTrip])

  return <MadridTripTermsProvider>{children}</MadridTripTermsProvider>
}

export default MadridTripLayout
