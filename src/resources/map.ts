import { Locale } from '@/resources/locale'

export const SHOP_MARKER_PATHS: Record<Locale, string> = {
  [Locale.UK]: `${process.env.BASE_PATH}/map/uk/shops.json`,
  [Locale.Spain]: `${process.env.BASE_PATH}/map/es/shops.json`,
  [Locale.Ireland]: `${process.env.BASE_PATH}/map/ie/shops.json`,
}

export const BAR_MARKER_PATHS: Record<Locale, string> = {
  [Locale.UK]: `${process.env.BASE_PATH}/map/uk/bars.json`,
  [Locale.Spain]: `${process.env.BASE_PATH}/map/es/bars.json`,
  [Locale.Ireland]: `${process.env.BASE_PATH}/map/ie/bars.json`,
}
export const MADRI_ZERO_PUBS_MARKER_PATHS: Record<Locale, string | undefined> = {
  [Locale.UK]: `${process.env.BASE_PATH}/map/uk/madri-zero-pubs.json`,
  [Locale.Spain]: undefined,
  [Locale.Ireland]: undefined,
}
export const MADRI_ZERO_RESTAURANTS_MARKER_PATHS: Record<Locale, string | undefined> = {
  [Locale.UK]: `${process.env.BASE_PATH}/map/uk/madri-zero-restaurants.json`,
  [Locale.Spain]: undefined,
  [Locale.Ireland]: undefined,
}

export const INITIAL_ZOOM = 12
// Max zoom more than 15 creates an issue with precise location marker
// Increased max zoom to 18 otherwise you can't zoom in enough to uncluster
export const MAX_ZOOM = 18

export const DEFAULT_COORDS: { [key in Locale]: { lat: number; lng: number } } = {
  // London
  // [Locale.UK]: {
  //   lat: 51.509865,
  //   lng: -0.118092,
  // },
  // Manchester
  [Locale.UK]: {
    lat: 53.4694087,
    lng: -2.2925134,
  },
  // Dublin
  [Locale.Ireland]: {
    lat: 53.3498,
    lng: -6.2603,
  },
  // Madrid
  [Locale.Spain]: {
    lat: 40.416718609765695,
    lng: -3.7036441352804617,
  },
}

export const MAP_OPTIONS = {
  minZoom: 6,
  zoom: INITIAL_ZOOM,
  maxZoom: MAX_ZOOM,
  center: { lat: DEFAULT_COORDS[Locale.Spain].lat, lng: DEFAULT_COORDS[Locale.Spain].lng },
  disableDefaultUI: true,
}
