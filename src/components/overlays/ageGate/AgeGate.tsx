import { differenceInCalendarDays } from 'date-fns'
import gsap from 'gsap'
import Image from 'next/image'
import { type ChangeEvent, type FC, type FormEvent, useEffect, useRef, useState } from 'react'
import { SwitchTransition, Transition, type TransitionStatus } from 'react-transition-group'

import image from '@/assets/brand/logo-strapline.png'
import Button from '@/components/button/Button'
import FooterLinks from '@/components/footerLinks/FooterLinks'
import useGTMEvent, { ENVIRONMENT } from '@/hooks/useGTMEvent'
import useTranslation from '@/hooks/useTranslation'
import { EventName } from '@/resources/analytics'

import DateInput from './_components/DateInput'
import TooYoung from './_components/TooYoung'
import { validateDate } from './_utilities/validateDate'
import styles from './AgeGate.module.scss'

enum AgeGateScreen {
  Form = 'form',
  Under18 = 'under-18',
}

export const LEGAL_AGE = 18

export const OVER_18_STORAGE_KEY = 'over-18'

type Props = {
  transitionStatus: TransitionStatus
  onConfirm: () => void
}

const AgeGate: FC<Props> = ({ transitionStatus, onConfirm }) => {
  const t = useTranslation()
  const { trackEvent } = useGTMEvent()

  const [activeScreen, setActiveScreen] = useState<AgeGateScreen>(AgeGateScreen.Form)
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [isInvalidDate, setIsInvalidDate] = useState(false)
  const [inputIsOver18, setInputIsOver18] = useState<boolean | undefined>(undefined)
  const allInputsAreFilledIn = year.length === 4 && month.length === 2 && day.length === 2

  useEffect(() => {
    if (!allInputsAreFilledIn) return

    const validateInputs = (year: number, month: number, day: number) => {
      const isValidDate = validateDate(year, month, day)
      if (!isValidDate) return setIsInvalidDate(true)
      const currentDate = new Date()
      const dateOfBirth = new Date(year, month - 1, day)
      const legalAgeDate = new Date(year + LEGAL_AGE, month - 1, day)

      const legalAgeDifference = differenceInCalendarDays(legalAgeDate, dateOfBirth)

      const difference = differenceInCalendarDays(currentDate, dateOfBirth)

      const over18 = difference >= legalAgeDifference
      setInputIsOver18(over18)
      setIsInvalidDate(false)
    }

    validateInputs(+year, +month, +day)
  }, [allInputsAreFilledIn, year, month, day])

  // Manages the Input Focus
  const dayInput = useRef<HTMLInputElement>(null)
  const monthInput = useRef<HTMLInputElement>(null)
  const yearInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (day.length === 2) monthInput.current?.focus()
  }, [day])

  useEffect(() => {
    if (month.length === 2) yearInput.current?.focus()
  }, [month])

  useEffect(() => {
    if (year.length === 4) yearInput.current?.blur()
  }, [year])

  const onDayChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 2) return
    setDay(e.target.value)
  }

  const onMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 2) return
    setMonth(e.target.value)
  }

  const onYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 4) return
    setYear(e.target.value)
  }

  const userIsUnder18 = allInputsAreFilledIn && inputIsOver18 === false && !isInvalidDate

  const buttonIsDisabled = isInvalidDate || !allInputsAreFilledIn

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (userIsUnder18) {
      setActiveScreen(AgeGateScreen.Under18)
    } else {
      onConfirm()
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      trackEvent({
        event: EventName.SubmitAgeGate,
        ageGatePassed: true,
      })
    }
  }

  // Handle the transitions
  const container = useRef<HTMLDivElement>(null)
  const containerSelector = gsap.utils.selector(container)

  const onEnter = () => {
    const childElements = containerSelector('#logo, #dob-wrapper, p, #submit')
    if (!childElements.length) return

    gsap.set(childElements, {
      opacity: 0,
      y: 24,
    })
  }

  const onEntering = () => {
    const childElements = containerSelector('#logo, #dob-wrapper, p, #submit')
    if (!childElements.length) return

    gsap.to(childElements, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      stagger: 0.08,
    })
  }

  const onExit = () => {
    gsap.to(container.current, {
      opacity: 0,
      y: 16,
      duration: 0.3,
    })
  }

  const Form = (
    <form className={styles.form} onSubmit={onSubmit}>
      {isInvalidDate ? (
        <div className={styles.notValidAgeText}>
          <p>{t('enter-valid-date-of-birth')}</p>
        </div>
      ) : (
        <p className={styles.text}>{t('enter-your-date-of-birth')}</p>
      )}
      <div id="dob-wrapper" className={styles.dateContainer}>
        <DateInput
          ref={dayInput}
          placeholder={'DD'}
          type="number"
          value={day}
          min="1"
          max="31"
          onChange={onDayChange}
          required
          name="day"
          error={day.length === 2 && (+day < 1 || +day > 31)}
        />
        <DateInput
          ref={monthInput}
          placeholder={'MM'}
          type="number"
          value={month}
          min="1"
          max="12"
          onChange={onMonthChange}
          required
          name="month"
          error={month.length === 2 && (+month < 1 || +month > 12)}
        />
        <DateInput
          ref={yearInput}
          placeholder={'YYYY'}
          type="number"
          value={year}
          min="1900"
          max={new Date().getFullYear()}
          onChange={onYearChange}
          required
          name="year"
          error={year.length === 4 && (+year < 1900 || +year > new Date().getFullYear())}
        />
      </div>

      <Button id="submit" type="submit" variant="primary" fullWidth={true} disabled={buttonIsDisabled} arrowRight>
        {t('submit')}
      </Button>
    </form>
  )

  const isExiting = transitionStatus === 'exiting'
  const transitionKey = `${isExiting}-${activeScreen}`

  return (
    <SwitchTransition mode="out-in">
      <Transition
        key={transitionKey}
        appear={true}
        timeout={600}
        mountOnEnter
        unmountOnExit
        onEnter={onEnter}
        onEntering={onEntering}
        onExit={onExit}>
        {() =>
          isExiting ? (
            <div ref={container} />
          ) : (
            <div ref={container} className={styles.container}>
              <Image id="logo" src={image} alt="Madri logo" priority={true} loading="eager" className={styles.image} />
              {activeScreen === AgeGateScreen.Form && Form}
              {activeScreen === AgeGateScreen.Under18 && <TooYoung />}
              <FooterLinks className={styles.footerLinks} />
            </div>
          )
        }
      </Transition>
    </SwitchTransition>
  )
}

export default AgeGate
