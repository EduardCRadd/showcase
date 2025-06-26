'use client'

import { useForm } from '@mantine/form'
import Image from 'next/image'
import { type FC, FormEvent, useState } from 'react'

import GetAFreeMadriText from '@/assets/images/free-madri-small.svg'
import Button from '@/components/button/Button'
import CheckBox from '@/components/checkbox/Checkbox'
import FreeMadriText from '@/components/freeMadriText/FreeMadriText'
import { InlineInput, LargeInput } from '@/components/inputField/InputField'
import MultiScreen from '@/components/multiScreen/MultiScreen'

import styles from './signup.module.scss'

enum SignUpScreens {
  Email = 'email',
  Details = 'details',
}

type EmailScreenType = {
  error?: string | null
  submitHandler: (val: string) => void
}

type FormScreenType = {
  formData: any
  onFormSubmit: (e: FormEvent<HTMLFormElement>) => void
}

type SignUpDataPropertyType = {
  email: string
  firstName: string
  lastName: string
  mobile: string
  tAndC: boolean
}

const EMAIL_FORM_INITIAL_STATE = {
  email: '',
}

const INITIAL_STATE: SignUpDataPropertyType = {
  ...EMAIL_FORM_INITIAL_STATE,
  firstName: '',
  lastName: '',
  mobile: '',
  tAndC: false,
}

const INITIAL_ERRORS = {
  email: 'Enter a valid email address',
  firstName: 'First name is too short',
  lastName: 'Last name is too short',
  mobile: 'Enter a valid mobile number',
  tAndC: 'Please accept the terms',
}

const FORM_VALIDATION = {
  email: (value: string) => (validateEmail(value) ? null : INITIAL_ERRORS.email),
  firstName: (value: string) => (validateName(value) ? null : INITIAL_ERRORS.firstName),
  lastName: (value: string) => (validateName(value) ? null : INITIAL_ERRORS.lastName),
  mobile: (value: string) => (validatePhone(value) ? null : INITIAL_ERRORS.mobile),
  tAndC: (value: boolean) => (!!value ? null : INITIAL_ERRORS.tAndC),
}

type FormErrorRecord<K extends keyof SignUpDataPropertyType, T> = {
  [P in K]?: T
}

const validateEmail = (email: string) =>
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )

const validateName = (name: string) => !!name && typeof name === 'string' && name.length >= 2

const validatePhone = (phone: string) => phone.match(/^\+?[1-9]{1}[0-9]{3,14}$/)

const EmailScreen: FC<EmailScreenType> = ({ submitHandler }) => {
  const emailForm = useForm({
    initialValues: EMAIL_FORM_INITIAL_STATE,

    validate: {
      email: (value) => (validateEmail(value) ? null : 'Enter a valid email address'),
    },
  })

  const onEmailSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    emailForm.validateField('email')

    if (emailForm.isValid()) submitHandler(emailForm.values.email)
  }

  return (
    <>
      <FreeMadriText />
      <form onSubmit={onEmailSubmit} className={styles.inputContainer}>
        <LargeInput label="Enter your email" placeholder="EMAIL ADDRESS" {...emailForm.getInputProps('email')} />
        <Button className={styles.submitBtn} variant="primary" fullWidth type="submit">
          SIGNUP FOR TICKETS
        </Button>
      </form>
    </>
  )
}

const FormScreen: FC<FormScreenType> = ({ formData, onFormSubmit }) => {
  const [consentChecked, toggleConsent] = useState<boolean>(false)
  const { tAndC } = formData.errors

  return (
    <form onSubmit={onFormSubmit} className={styles.inputContainer}>
      <Image src={GetAFreeMadriText} alt="Get a free madri" />
      <div className={styles.moreDetailsText}>We just need a few more details</div>
      <InlineInput
        className={styles.marginTop}
        placeholder="Email"
        value={formData.values.email}
        {...formData.getInputProps('email')}
      />
      <InlineInput className={styles.marginTop} placeholder="First name" {...formData.getInputProps('firstName')} />
      <InlineInput className={styles.marginTop} placeholder="Last name" {...formData.getInputProps('lastName')} />
      <InlineInput className={styles.marginTop} placeholder="Mobile" {...formData.getInputProps('mobile')} />
      <CheckBox
        name="terms"
        className={styles.marginTop}
        isChecked={formData.values.tAndC}
        label="I accept the Terms & Conditions"
        onChange={() => formData.setFieldValue('tAndC', !formData.values.tAndC)}
        error={tAndC}
      />
      <CheckBox
        name="offers"
        className={styles.marginTop}
        isChecked={consentChecked}
        label="I consent to be contacted by Madrí Excepcional about offers and events"
        onChange={() => toggleConsent(!consentChecked)}
      />
      <Button className={styles.submitBtn} type="submit" variant="primary" fullWidth>
        SIGN UP AND CLAIM REWARD
      </Button>
    </form>
  )
}

export default function SignUp() {
  const [signUpScreen, setSignUpScreen] = useState<SignUpScreens>(SignUpScreens.Details)

  // MANTINE FORM INITIALIZATION
  const signUpForm = useForm({
    initialValues: INITIAL_STATE,
    // initialErrors: INITIAL_ERRORS,
    validate: FORM_VALIDATION,
  })

  const emailSubmitHandler = (email: string) => {
    signUpForm.setFieldValue('email', email)
    setSignUpScreen(SignUpScreens.Details)
  }

  const detailsErrorHandler = (errors: typeof signUpForm.errors) => {
    // RESET THE ERROR SO THAT THE ERROR STATES GET UPDATED EACH TIME WHEN THE FORM IS SUBMITTED UNCHANGED
    setTimeout(() => {
      signUpForm.clearErrors()
    }, 500)
  }

  const detailsSubmitHandler = () => {
    // TODO: Implement API call here
  }

  const errors: FormErrorRecord<keyof SignUpDataPropertyType, string> = signUpForm.errors

  return (
    <MultiScreen transitionKey={signUpScreen}>
      {signUpScreen === SignUpScreens.Email ? (
        <EmailScreen submitHandler={emailSubmitHandler} error={errors.email} />
      ) : null}

      {signUpScreen === SignUpScreens.Details ? (
        <FormScreen
          formData={signUpForm}
          onFormSubmit={signUpForm.onSubmit(detailsSubmitHandler, detailsErrorHandler)}
        />
      ) : null}
    </MultiScreen>
  )
}
