import { useEffect } from 'react'

import { CountryCode } from '@/resources/countryCodes'
import { fetchIpAddress } from '@/services/ipAddress'
import { fetchLocationByIpAddress } from '@/services/location'

import useLocationStore from './useLocationStore'

const useLocationByIp = () => {
  const setLocation = useLocationStore((s) => s.setLocation)

  useEffect(() => {
    fetchIpAddress().then((ip) => {
      if (ip) {
        fetchLocationByIpAddress(ip)
          .then((data) => {
            setLocation(data)
          })
          .catch((error) => {
            console.error('Error fetching location by IP address: ', error, ip)
            setLocation({
              country_code: CountryCode.UnitedKingdom,
              country_name: 'United Kingdom',
              region_name: 'England',
              city: 'London',
              latitude: 0,
              longitude: 0,
            })
          })
      }
    })
  }, [setLocation])
}

export default useLocationByIp
