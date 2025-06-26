'use client'

import { Loader } from '@googlemaps/js-api-loader'
import { type FC, useEffect, useRef } from 'react'

import Input from '@/components/prizeDrawForm/input/Input'
// import useCountryCode from '@/hooks/useCountryCode'

type AddressAutocompleteProps = {
  placeholder?: string
  onAddressSelect: (place: google.maps.places.PlaceResult) => void
}

const AddressAutocomplete: FC<AddressAutocompleteProps> = ({ placeholder, onAddressSelect }) => {
  // const countryCodeFromIP = useCountryCode()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places'],
      // region: countryCodeFromIP,
      // ...additionalOptions,
    })

    loader
      .importLibrary('places')
      .then(() => {
        if (inputRef.current) {
          const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current!)

          autocompleteInstance.addListener('place_changed', () => {
            const place = autocompleteInstance.getPlace()

            onAddressSelect(place)
            if (inputRef.current) inputRef.current.value = ''
          })
        }
      })
      .catch((e) => {
        console.error('Error loading Google Maps API', e)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Input ref={inputRef} placeholder={placeholder} />
}

export default AddressAutocomplete
