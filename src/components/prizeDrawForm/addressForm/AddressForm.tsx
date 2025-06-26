'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import React, { type FC, FormEvent, useCallback, useEffect, useState } from 'react'
import { Transition, TransitionStatus } from 'react-transition-group'
import validator from 'validator'

import chevronIcon from '@/assets/icons/chevron-down.svg'
import Button from '@/components/button/Button'
import CheckBox from '@/components/checkbox/Checkbox'
import { useMadridTripTerms } from '@/components/madridTrip/terms/MadridTripTermsProvider'
import PageTitle from '@/components/pageTitle/PageTitle'
import Pagination from '@/components/pagination/Pagination'
import BackButton from '@/components/paint/backButton/BackButton'
import AddressAutocomplete from '@/components/prizeDrawForm/addressAutocomplete/AddressAutocomplete'
import { AddressDetailsFormData, EnterDrawFormData, useMadridTripStore } from '@/hooks/useFormStore'
import useLocationStore from '@/hooks/useLocationStore'
import { CountryCode } from '@/resources/countryCodes'
import { Locale } from '@/resources/locale'

import Input from '../input/Input'
import inputStyles from '../input/Input.module.scss'
import styles from './AddressForm.module.scss'

export enum ParagonCountryId {
  England = 1,
  Scotland = 2,
  Wales = 3,
  NorthernIreland = 4,
  RepublicOfIreland = 5,
  UnitedKingdom = 6,
  Bulgaria = 7,
  Romania = 8,
  Serbia = 9,
  Germany = 10,
}

export const COUNTRIES: {
  [key: number]: {
    value: number
    label: string
    countryCode?: CountryCode
  }
} = {
  // update countries from paragon screenshot and enum
  [ParagonCountryId.England]: {
    value: ParagonCountryId.England,
    label: 'England',
  },
  [ParagonCountryId.Scotland]: {
    value: ParagonCountryId.Scotland,
    label: 'Scotland',
  },
  [ParagonCountryId.Wales]: {
    value: ParagonCountryId.Wales,
    label: 'Wales',
  },
  [ParagonCountryId.NorthernIreland]: {
    value: ParagonCountryId.NorthernIreland,
    label: 'Northern Ireland',
  },
  // [ParagonCountryId.RepublicOfIreland]: {
  //   value: ParagonCountryId.RepublicOfIreland,
  //   label: 'Republic of Ireland',
  //   countryCode: CountryCode.Ireland,
  // },
  // [ParagonCountryId.UnitedKingdom]: {
  //   value: ParagonCountryId.UnitedKingdom,
  //   label: 'United Kingdom',
  //   countryCode: CountryCode.UnitedKingdom,
  // },
  // [ParagonCountryId.Bulgaria]: {
  //   value: ParagonCountryId.Bulgaria,
  //   label: 'Bulgaria',
  //   countryCode: CountryCode.Bulgaria,
  // },
  // [ParagonCountryId.Romania]: {
  //   value: ParagonCountryId.Romania,
  //   label: 'Romania',
  //   countryCode: CountryCode.Romania,
  // },
  // [ParagonCountryId.Serbia]: {
  //   value: ParagonCountryId.Serbia,
  //   label: 'Serbia',
  //   countryCode: CountryCode.Serbia,
  // },
  // [ParagonCountryId.Germany]: {
  //   value: ParagonCountryId.Germany,
  //   label: 'Germany',
  //   countryCode: CountryCode.Germany,
  // },
}

type AddressFormProps = {
  title: string
  transitionStatus: TransitionStatus
  onBackClick: () => void
  handleFormSubmit: (data: EnterDrawFormData) => Promise<void>
  showPagination?: boolean
}

const AddressForm: FC<AddressFormProps> = ({
  title,
  transitionStatus,
  onBackClick,
  handleFormSubmit,
  showPagination = true,
}) => {
  const userDetails = useMadridTripStore((s) => s.userDetails)
  const setUserDetails = useMadridTripStore((s) => s.setUserDetails)
  const { setShowTerms } = useMadridTripTerms()
  const [showButton, setShowButton] = useState(false)
  const { contextSafe } = useGSAP()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [errorInputIds, setErrorInputIds] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const location = useLocationStore((s) => s.location)

  useEffect(() => {
    if (!location) return
    if (typeof userDetails.countryId !== 'number') {
      const regionByIp = location?.region_name
      const countryCodeByIp = location?.country_code
      const matchingRegion = Object.values(COUNTRIES).find((c) => c.label.toLowerCase() === regionByIp?.toLowerCase())
      if (matchingRegion) return setUserDetails({ ...userDetails, countryId: matchingRegion.value })

      const matchingCountry = Object.values(COUNTRIES).find((c) => c.countryCode && c.countryCode === countryCodeByIp)
      setUserDetails({ ...userDetails, countryId: matchingCountry?.value || ParagonCountryId.England })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  useGSAP(() => {
    gsap.set(['#address-container > *', '#title > *', '#address-container form > *'], {
      opacity: 0,
      scale: 1.2,
    })
  }, [])

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      gsap.timeline().to(['#address-container > *', '#title > *', '#address-container form > *'], {
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        delay: 0.25,
      })
    }

    if (transitionStatus === 'exiting') {
      gsap.to(['#address-container > *', '#title > *', '#address-container form > *'], {
        opacity: 0,
        stagger: (i) => i * -0.05,
        y: (i) => i * 8,
      })
    }
  }, [transitionStatus])

  useEffect(() => {
    const areRequiredFieldsFilled =
      !!userDetails.address1 &&
      !!userDetails.city &&
      !!userDetails.county &&
      !!userDetails.countryId &&
      !!userDetails.postcode &&
      !!userDetails.hasCheckedTerms

    const formHasErrors = !!errorInputIds.length

    setShowButton(areRequiredFieldsFilled && !formHasErrors)
  }, [errorInputIds.length, userDetails])

  const onVamosBtnEnter = contextSafe(() => {
    gsap.fromTo('#vamosBtn', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' })
  })

  const onVamosBtnExit = contextSafe(() => {
    gsap.to('#vamosBtn', { opacity: 0, y: -16, duration: 0.3, ease: 'power1.out' })
  })

  const checkAddressForError = (value: string) => {
    if (!validator.isAlphanumeric(value, 'en-GB', { ignore: ' -,' })) {
      return 'Please enter a valid address'
    }
    return ''
  }

  const checkCityForError = (value: string) => {
    if (!validator.isAlpha(value, 'en-GB', { ignore: ' -' })) {
      return 'Please enter a valid city'
    }
    return ''
  }

  const checkCountyForError = (value: string) => {
    if (!validator.isAlpha(value, 'en-GB', { ignore: ' -' })) {
      return 'Please enter a valid county'
    }
    return ''
  }

  const checkPostcodeForError = (value: string) => {
    // No RoI atm
    const hasSelectedIE = false // userDetails.countryId === COUNTRIES[ParagonCountryId.RepublicOfIreland].value

    if (!validator.isPostalCode(value, hasSelectedIE ? 'IE' : 'GB')) {
      return `Please enter a valid ${hasSelectedIE ? 'ROI' : 'UK'} postcode`
    }
    return ''
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!!errorInputIds.length) return

    setIsSubmitting(true)

    // onSubmit prop with the formdata
    try {
      await handleFormSubmit(userDetails as EnterDrawFormData)
    } catch (error: any) {
      console.error(error)
      if (error?.error) setError(error.error)
      else setError('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onInputErrorChange = useCallback((error: string, inputId: string) => {
    if (error) setErrorInputIds((prev) => [...prev, inputId])
    else setErrorInputIds((prev) => prev.filter((i) => i !== inputId))
  }, [])

  // autocomplete
  const handleAddressSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      const addressComponents = place.address_components

      if (!addressComponents) return

      // reset previous address values
      setUserDetails({
        ...userDetails,
        address1: '',
        address2: '',
        city: '',
        county: '',
        countryId: ParagonCountryId.UnitedKingdom,
        postcode: '',
      })

      const addressCountryCode = addressComponents.find((c) => c.types.includes('country'))?.short_name

      if (
        !addressCountryCode ||
        ![CountryCode.UnitedKingdom, CountryCode.Ireland].includes(addressCountryCode as CountryCode)
      ) {
        alert('Please select an address in United Kingdom or Ireland')
        return
      }

      const streetNumber = addressComponents.find((c) => c.types.includes('street_number'))?.long_name
      const route = addressComponents.find((c) => c.types.includes('route'))?.long_name
      const neighborhood = addressComponents.find((c) => c.types.includes('neighborhood'))?.long_name
      const locality = addressComponents.find((c) => c.types.includes('locality'))?.long_name
      const postalTown = addressComponents.find((c) => c.types.includes('postal_town'))?.long_name
      const postalCode = addressComponents.find((c) => c.types.includes('postal_code'))?.long_name
      const administrativeAreaLevel1 = addressComponents.find((c) => c.types.includes('administrative_area_level_1'))
        ?.long_name
      const administrativeAreaLevel2 = addressComponents.find((c) => c.types.includes('administrative_area_level_2'))
        ?.long_name

      const matchingAdminArea = Object.values(COUNTRIES).find(
        (c) => c.label.toLowerCase() === administrativeAreaLevel1?.toLowerCase(),
      )
      const matchingCountry = Object.values(COUNTRIES).find(
        (c) => c.countryCode && c.countryCode.toLowerCase() === addressCountryCode.toLowerCase(),
      )

      const addressDetails: Partial<AddressDetailsFormData> = {
        address1: [streetNumber, route].join(' ').trim(),
        address2: neighborhood || '',
        city: locality || postalTown || '',
        county: administrativeAreaLevel2 || '',
        countryId: matchingAdminArea?.value || matchingCountry?.value || ParagonCountryId.UnitedKingdom,
        postcode: postalCode || '',
      }

      setUserDetails({ ...userDetails, ...addressDetails })
    },
    [userDetails, setUserDetails],
  )

  return (
    <>
      <BackButton onClick={onBackClick} />
      <div id="address-container" className={styles.container}>
        <PageTitle id="title" title={title} subtitle="Enter your details to enter the prize draw" />
        <form onSubmit={onSubmit} className={styles.form}>
          <AddressAutocomplete placeholder="Search address with post code" onAddressSelect={handleAddressSelect} />
          <Input
            placeholder="Address 1"
            type="text"
            name="address1"
            id="address1"
            autoComplete="address-line1"
            required
            value={userDetails.address1}
            onChange={(e) => setUserDetails({ ...userDetails, address1: e.target.value || '' })}
            checkForError={checkAddressForError}
            onErrorChange={onInputErrorChange}
          />
          <Input
            placeholder="Address 2 (optional)"
            type="text"
            name="address2"
            id="address2"
            autoComplete="address-line2"
            value={userDetails.address2}
            onChange={(e) => setUserDetails({ ...userDetails, address2: e.target.value || '' })}
            checkForError={checkAddressForError}
            onErrorChange={onInputErrorChange}
          />

          <Input
            placeholder="City"
            type="text"
            name="city"
            id="city"
            required
            value={userDetails.city}
            onChange={(e) => setUserDetails({ ...userDetails, city: e.target.value || '' })}
            checkForError={checkCityForError}
            onErrorChange={onInputErrorChange}
          />

          <Input
            placeholder="County"
            type="text"
            id="county"
            name="county"
            required
            value={userDetails.county}
            onChange={(e) => setUserDetails({ ...userDetails, county: e.target.value || '' })}
            checkForError={checkCountyForError}
            onErrorChange={onInputErrorChange}
          />

          <div className={inputStyles.select}>
            <select
              placeholder="Select a country"
              id="country"
              name="country"
              value={userDetails.countryId || Locale.UK}
              onChange={(e) => {
                setUserDetails({ ...userDetails, countryId: +e.target.value || ParagonCountryId.UnitedKingdom })
              }}
              required>
              {Object.values(COUNTRIES).map((country, index) => {
                return (
                  <option key={'option-' + index} value={country.value}>
                    {country.label}
                  </option>
                )
              })}
            </select>
            <div className={inputStyles.arrow}>
              <Image src={chevronIcon} alt="" width={20} height={12} />
            </div>
          </div>

          <Input
            placeholder="Post Code"
            name="postcode"
            id="postcode"
            type="text"
            autoComplete="postal-code"
            required
            value={userDetails.postcode}
            onChange={(e) => setUserDetails({ ...userDetails, postcode: e.target.value || '' })}
            checkForError={checkPostcodeForError}
            onErrorChange={onInputErrorChange}
            errorCheckTrigger={userDetails.countryId}
          />

          <CheckBox
            name="terms"
            label={
              <p>
                I accept the{' '}
                <span
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowTerms(true)
                  }}
                  style={{ textDecoration: 'underline' }}>
                  Terms & Conditions
                </span>
              </p>
            }
            isChecked={userDetails.hasCheckedTerms}
            onChange={(e) => {
              setUserDetails({ ...userDetails, hasCheckedTerms: e.target.checked })
            }}
            required
          />

          <Transition
            in={showButton}
            onEnter={onVamosBtnEnter}
            onExit={onVamosBtnExit}
            timeout={300}
            mountOnEnter={true}
            unmountOnExit={true}>
            <Button id="vamosBtn" arrowRight fullWidth type="submit" loading={isSubmitting}>
              Vamos
              {error && <p className={styles.error}>{error}</p>}
            </Button>
          </Transition>

          {showPagination && <Pagination length={2} activeIndex={1} />}
        </form>
      </div>
    </>
  )
}

export default AddressForm
