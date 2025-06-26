'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type LottieRefCurrentProps } from 'lottie-react'
import React, { type FC, type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { type TransitionStatus } from 'react-transition-group'
import { SwitchTransition, Transition } from 'react-transition-group'

import Button from '@/components/button/Button'
import LottieHands from '@/components/conectada25/lottieHands/LottieHands'
import LottieTrumpet from '@/components/conectada25/lottieTrumpet/LottieTrumpet'
import PageTitle from '@/components/conectada25/pageTitle/PageTitle'
import useGTMEvent from '@/hooks/useGTMEvent'
import useModalsStore from '@/hooks/useModalStore'
import { EventName } from '@/resources/analytics'

import styles from './CodeVerificationInput.module.scss'

type CodeVerificationInputProps = {
  transitionStatus: TransitionStatus
  goToNextStep: () => void
  updateUserDetails: (data: any) => void
}

const PIN_LENGTH = 8

const CodeVerificationInput: FC<CodeVerificationInputProps> = ({
  transitionStatus,
  goToNextStep,
  updateUserDetails,
}) => {
  const { trackEvent } = useGTMEvent()
  const inputsRef = useRef<HTMLInputElement[]>([])
  const { contextSafe } = useGSAP()
  const { openHelpModal } = useModalsStore()
  const handsLottieRef = useRef<LottieRefCurrentProps>(null)
  const trumpetLottieRef = useRef<LottieRefCurrentProps>(null)

  const [pin, setPin] = useState(Array<string>(PIN_LENGTH).fill(''))
  const [status, setStatus] = useState<'incomplete' | 'correct' | 'invalid' | 'used'>('incomplete')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const onEnter = contextSafe((node: HTMLElement, delay = 0) => {
    gsap.fromTo(node, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, delay, ease: 'power2.out' })
  })

  const onExit = contextSafe((node: HTMLElement, delay = 0) => {
    gsap.to(node, { opacity: 0, y: 16, duration: 0.2, delay, ease: 'power2.in' })
  })

  useGSAP(() => {
    // Transition elements outside of the switch transitions
    if (transitionStatus === 'entering') {
      const tl = gsap.timeline()
      tl.fromTo(
        ['#cta', '#instructions'],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.4, ease: 'power1.out' },
      )
      tl.fromTo('#inputs', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power1.out' }, '-=0.2')
      tl.fromTo(
        ['#helpBtn', '#hands'],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.2, duration: 0.4, ease: 'power1.out' },
        '-=0.2',
      )
      tl.call(() => {
        handsLottieRef.current?.play()
      })
    }

    if (transitionStatus === 'exiting') {
      const tl = gsap.timeline()
      tl.to(['#hands', '#helpBtn'], { opacity: 0, y: 16, duration: 0.4, ease: 'power1.in' })
      tl.to('#inputs', { opacity: 0, y: 16, duration: 0.4, ease: 'power1.in' }, '-=0.2')
      tl.to(['#cta', '#instructions'], { opacity: 0, y: 16, stagger: 0.2, duration: 0.4, ease: 'power1.in' }, '-=0.2')
    }
  }, [transitionStatus])

  // useGSAP doesn't call the cleanup function
  useEffect(() => {
    if (!submitting) return

    const pulseTl = gsap.to('#inputs', {
      opacity: 0.7,
      repeat: -1,
      yoyo: true,
      duration: 0.55,
      ease: 'power1.inOut',
    })

    return () => {
      pulseTl.kill()
      gsap.set('#inputs', { opacity: 1 })
    }
  }, [submitting])

  const onPinFilled = async (newPin: string[]) => {
    setSubmitting(true)

    try {
      const res = await fetch(`${process.env.BASE_PATH ?? ''}/api/conectada-25/win/code/${newPin.join('')}`, {
        cache: 'no-store',
      })

      if (!res.ok) throw new Error(`Error: ${res.status}`)

      const data = await res.json()

      if (!data.status) {
        updateUserDetails({ code: newPin.join('') })
        setStatus('correct')
        setTimeout(goToNextStep, 2500)
      } else {
        switch (data.status) {
          case 404:
            setStatus('invalid')
            break
          case 400:
          default:
            setStatus('used')
            break
        }
      }
    } catch (err) {
      console.error(err)
      setStatus('invalid')
    } finally {
      setSubmitting(false)
      trackEvent({ event: EventName.SubmitCode, pageName: 'A1', packType: '10 pack' })
    }
  }

  const onPinChange = (index: number, value: string) => {
    if (status === 'correct') return
    const upperValue = value.toUpperCase()

    // allow 0–9 or A–Z
    if (!/^[0-9A-Z]?$/.test(upperValue)) return

    const shouldFocusOnNextInput = index > 0 && pin[index - 1] === ''
    if (shouldFocusOnNextInput) {
      inputsRef.current[index - 1]?.focus()
      return
    }

    const shouldFocusOnPrevInput = !!upperValue && index < PIN_LENGTH - 1
    if (shouldFocusOnPrevInput) {
      inputsRef.current[index + 1]?.focus()
    }

    const newPin = [...pin]
    newPin[index] = upperValue
    const allFilled = newPin.every((digit) => digit !== '')

    if (allFilled) {
      onPinFilled(newPin)
    } else {
      setStatus('incomplete')
    }

    setPin(newPin)
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleTryAgain = () => {
    setPin(Array(PIN_LENGTH).fill(''))
    setStatus('incomplete')
    inputsRef.current[0]?.focus()

    trackEvent({
      event: EventName.TapTryAgain,
      pageName: 'A1',
      packType: '10 pack',
    })
  }

  const handleWhereIsCodeBtn = () => {
    openHelpModal()

    trackEvent({
      event: EventName.TapWhereIsMyCode,
      pageName: 'A1',
      packType: '10 pack',
    })
  }

  const isExiting = transitionStatus === 'exiting'
  const transitionKey = `${status}-${isExiting}`

  return (
    <section className={styles.container}>
      <PageTitle
        title="Enter your unique code"
        description={
          <>
            Enter the 8 digit code inside your
            <br />
            Madrí Excepcional pack
          </>
        }
      />

      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <div className={styles.stateContainer}>
          <SwitchTransition mode="out-in">
            <Transition
              key={transitionKey}
              timeout={{ enter: 0, exit: 300 }}
              mountOnEnter
              unmountOnExit
              onEnter={(node: HTMLElement) => onEnter(node, 0)}
              onExit={(node: HTMLElement) => onExit(node)}>
              {(_) => {
                if (isExiting) return <div />
                // <Image src={trumpetSVG} alt="Success illustration" />
                if (status === 'correct') return <LottieTrumpet ref={trumpetLottieRef} />
                if (status === 'used')
                  return (
                    <div className={styles.stateBox}>
                      <span className={styles.stateMessage}>oops</span>
                      <p className={styles.stateInfo}>Code is invalid or has already been redeemed.</p>
                    </div>
                  )
                if (status === 'invalid')
                  return (
                    <div className={styles.stateBox}>
                      <span className={styles.stateMessage}>oops</span>
                      <p className={styles.stateInfo}>This code doesn&apos;t look right</p>
                    </div>
                  )
                return <div />
              }}
            </Transition>
          </SwitchTransition>
        </div>

        {/* PIN Input Fields */}
        <div className={styles.inputBox}>
          {pin.map((value, index) => (
            <div id="inputs" key={index} className={styles.inputWrapper}>
              <input
                ref={(el) => {
                  inputsRef.current[index] = el as HTMLInputElement
                }}
                type="text"
                inputMode="text"
                maxLength={1}
                value={value}
                onChange={(e) => onPinChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={styles.input}
              />
              {!value && <div role="presentation" className={styles.inputDecoration} />}
            </div>
          ))}
        </div>

        <div className={styles.stateContainer}>
          <SwitchTransition mode="out-in">
            <Transition
              key={status}
              timeout={{ enter: 0, exit: 300 }}
              mountOnEnter
              unmountOnExit
              onEnter={(node: HTMLElement) => onEnter(node, 0.1)}
              onExit={onExit}>
              {(_) => {
                if (isExiting) return <div />
                if (status === 'correct') return <span className={styles.stateMessage}>Success</span>
                if (status === 'invalid' || status === 'used')
                  return (
                    <Button onClick={handleTryAgain} variant="secondary" arrowRight={true}>
                      Try again
                    </Button>
                  )
                return <div />
              }}
            </Transition>
          </SwitchTransition>
        </div>
      </form>

      <button id="helpBtn" onClick={handleWhereIsCodeBtn} className={styles.helpBtn}>
        Where&apos;s my code?
      </button>
      <LottieHands ref={handsLottieRef} />
    </section>
  )
}

export default CodeVerificationInput
