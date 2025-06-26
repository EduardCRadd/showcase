import { sendGTMEvent } from '@next/third-parties/google'
import { useCallback } from 'react'

import { type CommonEventProperties, type CustomEventProperties } from '@/resources/analytics'

// const IS_PROD = process.env.NEXT_PUBLIC_APP_ENV === 'prod'
export const IS_STAGING = process.env.NEXT_PUBLIC_APP_ENV === 'staging'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export const ENVIRONMENT = IS_DEVELOPMENT ? 'development' : IS_STAGING ? 'staging' : 'production'

export default function useGTMEvent() {
  const trackEvent = useCallback((properties: CustomEventProperties) => {
    const { flowName, experienceName } = getNames(window.location.pathname)

    // push a reset object to the dataLayer to clear any previous values
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      const resetParams: Partial<CustomEventProperties> = {
        pageName: undefined,
        pointOfSale: undefined,
        packType: undefined,
        pubDetails: undefined,
        alertType: undefined,
        footerCategory: undefined,
        retailerDropDown: undefined,
        menuCategory: undefined,
        socialIcon: undefined,
        postCode: undefined,
        locationName: undefined,
        cardName: undefined,
        ageGatePassed: undefined,
      }
      window.dataLayer.push(resetParams)
    }

    const commonProperties: CommonEventProperties = {
      environment: ENVIRONMENT,
      pageURL: window.location.href,
      flowName,
      experienceName,
    }

    const eventProperties = {
      ...commonProperties,
      ...properties,
    }

    if (IS_DEVELOPMENT) return console.log('Event:', eventProperties.event, eventProperties)

    sendGTMEvent(eventProperties)
  }, [])

  return { trackEvent }
}

function getNames(path: string): { flowName: string; experienceName: string } {
  if (path.includes('/paint')) {
    return { flowName: 'paint your pint', experienceName: 'paint your pint' }
  }
  if (path.includes('/win')) {
    return { flowName: 'win festival tickets', experienceName: 'madri on pack' }
  }
  if (path.includes('/rate-of-sale')) {
    return { flowName: 'win festival tickets', experienceName: 'madri rate of sale' }
  }
  if (path.includes('/events')) {
    return { flowName: 'madri near you', experienceName: 'madri near you' }
  }
  if (path.includes('/phrases')) {
    return { flowName: 'learn spanish', experienceName: 'learn spanish' }
  }
  if (path.includes('/story')) {
    return { flowName: 'our story', experienceName: 'our story' }
  }
  // Fallback
  return { flowName: '', experienceName: '' }
}
