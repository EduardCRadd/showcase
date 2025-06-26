export const MADRI_ZERO_PUBS_START_DATE = new Date('19 May 2025')
export const MADRI_ZERO_PUBS_END_DATE = new Date('15 June 2025 23:59')

export const checkAreMadriZeroPubsLive = () => {
  // if (process.env.NEXT_PUBLIC_APP_ENV !== 'prod') return true

  const now = new Date()
  return now >= MADRI_ZERO_PUBS_START_DATE && now <= MADRI_ZERO_PUBS_END_DATE
}

export const MADRI_ZERO_RESTAURANTS_START_DATE = new Date('1 July 2025')
export const MADRI_ZERO_RESTAURANTS_END_DATE = new Date('28 July 2025 23:59')

export const checkAreMadriZeroRestaurantsLive = () => {
  // if (process.env.NEXT_PUBLIC_APP_ENV !== 'prod') return true

  const now = new Date()
  return now >= MADRI_ZERO_RESTAURANTS_START_DATE && now <= MADRI_ZERO_RESTAURANTS_END_DATE
}

export const checkIsMadriZeroTakeoverLive = () => {
  // if (process.env.NEXT_PUBLIC_APP_ENV !== 'prod') return true

  return checkAreMadriZeroPubsLive() || checkAreMadriZeroRestaurantsLive()
}

export const MADRI_RATE_OF_SALE_START_DATE = new Date('29 May 2025 23:59')

export const checkIsMadriRateOfSaleLive = (): boolean => {
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'prod') return true

  const now = new Date()
  return now >= MADRI_RATE_OF_SALE_START_DATE
}
