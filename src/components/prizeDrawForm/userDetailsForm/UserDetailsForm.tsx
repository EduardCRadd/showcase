'use client'

import { useGSAP } from '@gsap/react'
import { differenceInYears } from 'date-fns'
import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import React, { type FC, FormEvent, useCallback, useEffect, useState } from 'react'
import { Transition, type TransitionStatus } from 'react-transition-group'
import validator from 'validator'

import chevronSVG from '@/assets/conectada25/chevron.svg'
import Button from '@/components/button/Button'
import CheckBox from '@/components/checkbox/Checkbox'
import PageTitle from '@/components/conectada25/pageTitle/PageTitle'
import { useRosTerms } from '@/components/conectada25/ros/terms/RosTermsProvider'
import { useWinTerms } from '@/components/conectada25/win/terms/WinTermsProvider'
import Pagination from '@/components/pagination/Pagination'
import DateInput from '@/components/prizeDrawForm/input/DateInput'
import Input from '@/components/prizeDrawForm/input/Input'
import { Pathname } from '@/resources/pathname'
import { TicketFlow } from '@/types/ticketFlow'

import styles from './UserDetailsForm.module.scss'

// export const PHONE_EXTENSIONS: {
//   [key: string]: {
//     value: string
//     label: string
//   }
// } = {
//   [CountryCode.UnitedKingdom]: {
//     value: '+44',
//     label: 'UK (+44)',
//   },
//   [CountryCode.Ireland]: {
//     value: '+353',
//     label: 'Ireland (+353)',
//   },
// }

// Inside UserDetailsForm.tsx (above your component)
const ON_PACK_STORE_OPTIONS = [
  'Tesco',
  'Asda',
  'Morrison’s',
  'Sainsbury’s',
  'Co-op',
  'Waitrose',
  'Spar',
  'Nisa',
  'Onestop',
  'Premier',
  'Londis',
  'Budgens',
  'Ocado',
  'Amazon',
  'Other',
]

type UserDetailsFormProps = {
  title?: string
  ticketFlow?: TicketFlow
  transitionStatus: TransitionStatus
  showPagination?: boolean
  onFormSubmit: () => void
  onBackClick?: () => void
  userDetails: any
  setUserDetails: (data: any) => void
  updateUserDetails: (data: any) => void
}

const UserDetailsForm: FC<UserDetailsFormProps> = ({
  title,
  transitionStatus,
  showPagination = true,
  onFormSubmit,
  onBackClick,
  ticketFlow,
  userDetails,
  setUserDetails,
  updateUserDetails,
}) => {
  // const userDetails = useEnterDrawStore((s) => s.userDetails)
  // const setUserDetails = useEnterDrawStore((s) => s.setUserDetails)
  const [showButton, setShowButton] = useState(false)
  const { contextSafe } = useGSAP()

  const [errorInputIds, setErrorInputIds] = useState<string[]>([])

  useGSAP(() => {
    gsap.set(['#user-details-container > *', '#title > *', '#user-details-container form > *'], {
      opacity: 0,
      scale: 1.2,
    })
  }, [])

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      gsap.timeline().to(['#user-details-container > *', '#title > *', '#user-details-container form > *'], {
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        delay: 0.15,
      })
    }

    if (transitionStatus === 'exiting') {
      gsap.to(['#user-details-container > *', '#title > *', '#user-details-container form > *'], {
        opacity: 0,
        stagger: (i) => i * -0.05,
        y: (i) => i * 8,
      })
    }
  }, [transitionStatus])

  const onVamosBtnEnter = contextSafe(() => {
    gsap.fromTo('#vamosBtn', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' })
  })
  const onVamosBtnExit = contextSafe(() => {
    gsap.to('#vamosBtn', { opacity: 0, y: -16, duration: 0.3, ease: 'power1.out' })
  })

  const checkNameForError = (value: string) => {
    if (!validator.isAlpha(value, 'en-GB', { ignore: ' -,' })) {
      return 'Please enter a valid name'
    }
    return ''
  }

  const checkDOBForError = (dob: Date) => {
    if (!dob) {
      return 'Please enter a valid date of birth'
    }

    const age = differenceInYears(new Date(), new Date(dob))

    if (Number.isNaN(age)) {
      return 'Please enter a valid date of birth'
    }

    if (age < 18) {
      return 'You must be over 18 to enter the prize draw'
    }

    return ''
  }

  const checkMobileNumberForError = (value: string) => {
    const sanitizedNumber = value.replace(/\s/g, '')

    if (!/^\d+$/.test(sanitizedNumber)) {
      return 'Please enter a valid UK phone number (digits only).'
    }

    if (sanitizedNumber.length === 10) {
      return sanitizedNumber.startsWith('0') ? 'Please enter a 10-digit UK phone number.' : ''
    }

    if (sanitizedNumber.length === 11 && sanitizedNumber.startsWith('0')) {
      const noLeadingZero = sanitizedNumber.slice(1)
      return noLeadingZero.length === 10 ? '' : 'Please enter a 10-digit UK phone number.'
    }

    return 'Please enter a 10-digit UK phone number.'
  }

  const checkEmailForError = (value: string) => {
    if (!validator.isEmail(value)) {
      return 'Please enter a valid email'
    }
    return ''
  }

  useEffect(() => {
    // only require store if it's the Win flow
    const storeIsNeeded = ticketFlow === TicketFlow.Win ? !!userDetails.retailer : true

    const areRequiredFieldsFilled =
      !!userDetails.firstName &&
      !!userDetails.lastName &&
      !!userDetails.dob &&
      !!userDetails.phone &&
      !!userDetails.email &&
      !!userDetails.termsAndConditions &&
      storeIsNeeded

    const formHasErrors = !!errorInputIds.length

    setShowButton(areRequiredFieldsFilled && !formHasErrors)
  }, [errorInputIds.length, userDetails, ticketFlow])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!userDetails.firstName || !userDetails.lastName || !userDetails.dob || !userDetails.phone || !userDetails.email)
      return
    if (errorInputIds.length) return

    onFormSubmit()
  }

  const onInputErrorChange = useCallback((error: string, inputId: string) => {
    if (error) setErrorInputIds((prev) => [...prev, inputId])
    else setErrorInputIds((prev) => prev.filter((i) => i !== inputId))
  }, [])

  return (
    <div id="user-details-container" className={styles.container}>
      <PageTitle title="Enter the draw to win" description="Enter your details to enter the prize draw" />
      <form onSubmit={onSubmit} className={styles.form}>
        <Input
          placeholder="First name"
          type="text"
          name="firstName"
          id="firstName"
          autoComplete="given-name"
          required
          value={userDetails.firstName}
          onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
          checkForError={checkNameForError}
          onErrorChange={onInputErrorChange}
        />
        <Input
          placeholder="Last name"
          type="text"
          name="lastName"
          id="lastName"
          autoComplete="family-name"
          required
          value={userDetails.lastName}
          onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })}
          checkForError={checkNameForError}
          onErrorChange={onInputErrorChange}
        />
        <DateInput
          id="dob"
          placeholder="Date of birth"
          required
          initialValue={userDetails.dob}
          onChange={(date) => {
            setUserDetails({ ...userDetails, dob: date })
          }}
          checkForError={checkDOBForError}
          onErrorChange={onInputErrorChange}
        />
        <Input
          placeholder="Contact number"
          type="tel"
          id="phone"
          name="phone"
          autoComplete="tel"
          prefix="+44"
          required
          value={userDetails.phone}
          onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
          checkForError={checkMobileNumberForError}
          onErrorChange={onInputErrorChange}
        />
        <Input
          placeholder="Email address"
          name="email"
          id="email"
          type="email"
          autoComplete="email"
          required
          value={userDetails.email}
          onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
          checkForError={checkEmailForError}
          onErrorChange={onInputErrorChange}
        />

        {ticketFlow === TicketFlow.Win && (
          <div className={styles.selectBox}>
            <select
              className={styles.select}
              name="store"
              id="store"
              value={userDetails.retailer || ''}
              onChange={(e) => setUserDetails({ ...userDetails, retailer: e.target.value })}
              required>
              <option value="" disabled>
                Retailer
              </option>
              {ON_PACK_STORE_OPTIONS.map((storeName) => (
                <option key={storeName} value={storeName}>
                  {storeName}
                </option>
              ))}
            </select>
            <div className={styles.arrow}>
              <Image src={chevronSVG} alt="" />
            </div>
          </div>
        )}

        <CheckBox
          name="terms"
          label={
            <p style={{ zIndex: 100 }}>
              I accept the&nbsp;
              <Link
                href={
                  (ticketFlow === TicketFlow.Win ? Pathname.Win : Pathname.RateOfSale) + Pathname.TermsAndConditions
                }>
                Terms & Conditions
              </Link>{' '}
            </p>
          }
          isChecked={userDetails.termsAndConditions}
          onChange={(e) => {
            setUserDetails({ ...userDetails, termsAndConditions: e.target.checked })
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
          <Button id="vamosBtn" variant="secondary" arrowRight={true} fullWidth type="submit">
            Vamos
          </Button>
        </Transition>

        <p className={styles.notice}>
          We will use your email address to contact you
          <br /> if you have won a prize.
        </p>

        {showPagination && <Pagination length={2} activeIndex={0} />}
      </form>
    </div>
  )
}

export default UserDetailsForm
