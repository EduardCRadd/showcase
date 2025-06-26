import { CountryCode } from '@/resources/countryCodes'

export type LocationResponse = {
  country_code: CountryCode
  country_name: string
  region_name: string
  city: string
  latitude: number
  longitude: number
}

export const fetchLocationByIpAddress = async (ipAddress: string): Promise<LocationResponse> => {
  const geoRes = await fetch(`${process.env.BASE_PATH ?? ''}/api/geo?ip=${ipAddress}`)
  const geoData = await geoRes.json()
  return geoData
}

// Missing longitude to handle edge case.
// const MOCK_IP_STACK_DATA = {
//   ip: "5.148.57.90",
//   country_code: "GB",
//   country_name: "United Kingdom",
//   region_name: "England",
//   city: "Canning Town",
//   latitude: 51.5122184753418,
//   longitude: null,
// };
