import { DARKER_RED, DARKEST_RED, GOLD, RED } from '@/styles/colours'

export const CUSTOM_MAP_STYLES = [
  {
    elementType: 'geometry',
    stylers: [{ color: RED }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: GOLD }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#00000000' }],
  },

  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.fill',
    stylers: [{ color: DARKER_RED }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry.stroke',
    stylers: [{ color: GOLD }],
  },

  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: GOLD }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: RED }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: GOLD }],
  },
  {
    featureType: 'poi.business.shopping',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: DARKER_RED }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: GOLD }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: DARKER_RED }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [{ color: GOLD }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: DARKER_RED }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: GOLD }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{ color: GOLD }],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [{ color: DARKER_RED }],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [{ color: DARKER_RED }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: DARKEST_RED }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: GOLD }],
  },
]
