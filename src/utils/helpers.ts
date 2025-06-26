import { PreciseLoc } from '@/hooks/useMapStore'
import { Locale } from '@/resources/locale'

// Read bars and shops from JSON in the public folder
export const getJSON = async <T>(filePath: string): Promise<T[]> => {
  try {
    const response = await fetch(filePath)
    const data = (await response.json()) as T[]
    return data
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getDirectionsUrl = ({
  locale = Locale.UK,
  location,
  preciseLoc,
  venue,
}: {
  locale?: Locale
  location: any
  preciseLoc?: PreciseLoc
  venue?: string
}): string => {
  const targetLat = location?.lat
  const targetLng = location?.lon ?? location?.lng

  const domain = locale === Locale.Spain ? 'es' : 'co.uk'

  if (preciseLoc) {
    const startLat = preciseLoc?.lat
    const startLng = preciseLoc?.lng

    return `https://www.google.${domain}/maps/dir/${startLat},${startLng}/${venue
      ?.split(' ')
      .join('+')}/@${targetLat},${targetLng}z`
  }

  return `https://www.google.${domain}/maps/search/${venue?.split(' ').join('+')}/@${targetLat},${targetLng}z`
}
