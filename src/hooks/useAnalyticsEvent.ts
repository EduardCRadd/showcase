import { useCallback } from 'react'

import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'

type AnalyticsOptions = {
  menuCategory?: string
  socialIcon?: string
}

const useAnalyticsEvent = () => {
  const { trackEvent } = useGTMEvent()

  /**
   * @param eventName
   * @param pathname
   * @param options
   */
  return useCallback(
    (eventName: EventName, pathname: string, options: AnalyticsOptions = {}) => {
      const { menuCategory, socialIcon } = options

      const isRateOfSale = pathname.includes(Pathname.RateOfSale)
      const isWin = pathname.includes(Pathname.Win)
      const hasFlow = isRateOfSale || isWin

      trackEvent({
        event: eventName,
        ...(hasFlow && {
          pageName: 'A1',
          experienceName: isRateOfSale ? 'Madri Rate of Sale' : isWin ? 'Madri On Pack' : undefined,
        }),
        ...(isRateOfSale && { pointOfSale: 'leaflet' }),
        ...(isWin && { packType: '10 pack' }),
        ...(menuCategory && { menuCategory }),
        ...(socialIcon && { socialIcon }),
      })
    },
    [trackEvent],
  )
}

export default useAnalyticsEvent
