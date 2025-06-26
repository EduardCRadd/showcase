'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { type FC, useCallback, useEffect, useState } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'

import { Position } from '@/app/madrid-trip/page'
import styles from '@/app/madrid-trip/page.module.scss'
import manImg from '@/assets/images/man-illustration.png'
import Entered from '@/components/conectada25/entered/Entered'
import Landing from '@/components/conectada25/landing/Landing'
import CodeVerificationInput from '@/components/conectada25/win/codeVerificationInput/CodeVerificationInput'
import PubSelector from '@/components/madridTrip/pubSelector/PubSelector'
import Pagination from '@/components/pagination/Pagination'
import PreciseLocationDialog from '@/components/preciseLocationDialog/PreciseLocationDialog'
import UserDetailsForm from '@/components/prizeDrawForm/userDetailsForm/UserDetailsForm'
import { Bar } from '@/components/searchInputField/SeachInputField'
import useGTMEvent from '@/hooks/useGTMEvent'
import useMapStore from '@/hooks/useMapStore'
import { EventName } from '@/resources/analytics'
import { TicketFlow } from '@/types/ticketFlow'
import { mapStepToScreen, Screen } from '@/utils/mapStepToScreen'

type TicketCompetitionFlowProps = {
  doorIsPlaying: boolean
  ticketFlow: TicketFlow
  userDetails: any
  setUserDetails: (data: any) => void
  updateUserDetails: (data: any) => void
}

const TicketCompetitionFlow: FC<TicketCompetitionFlowProps> = ({
  doorIsPlaying,
  ticketFlow,
  userDetails,
  setUserDetails,
  updateUserDetails,
}) => {
  const { preciseLoc, setPreciseLoc, isTracking, setIsTracking } = useMapStore()
  const { trackEvent } = useGTMEvent()
  const searchParams = useSearchParams()
  const { push } = useRouter()
  const [showDialog, setShowDialog] = useState(false)

  const stParam = searchParams.get('st')
  const step = !!stParam ? parseInt(stParam) : 0

  const { contextSafe } = useGSAP()

  const setStep = (step: number) => {
    push('?st=' + step)
  }

  const makeCodeIri = (code?: string) => (code && code.length === 8 ? `/api/code/${code}` : undefined)

  const onUserDetailsFormSubmit = async () => {
    const retailerDropDown = ticketFlow === TicketFlow.Win ? userDetails.retailer : undefined
    const barPubAddress = ticketFlow === TicketFlow.RateOfSale ? userDetails.barPubAddress : undefined

    const payload =
      ticketFlow === TicketFlow.Win
        ? {
            ...userDetails,
            phone: `+44${userDetails.phone}`,
            code: makeCodeIri(userDetails.code),
          }
        : {
            ...userDetails,
            phone: `+44${userDetails.phone}`,
            barPubAddress,
          }

    const route = ticketFlow === TicketFlow.Win ? '/api/conectada-25/win/entry' : '/api/conectada-25/ros/entry'

    try {
      const res = await fetch(`${process.env.BASE_PATH ?? ''}${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      })

      if (res.status !== 201) {
        console.error('Entry creation failed', await res.text())
        return
      }

      trackEvent({
        event: EventName.SubmitEnterDraw,
        pageName: 'A1',
        ...(ticketFlow === TicketFlow.Win ? { packType: '10 pack', retailerDropDown } : { pointOfSale: 'leaflet' }),
      })

      setStep(step + 1)
    } catch (err) {
      console.error(err)
    }
  }

  const currentScreen: Screen = mapStepToScreen(ticketFlow, step)
  const isPaginationVisible =
    ticketFlow === TicketFlow.RateOfSale &&
    (currentScreen === Screen.PubSelector || currentScreen === Screen.UserDetails)

  const activeIndex = currentScreen === Screen.UserDetails ? 1 : 0
  useGSAP(() => {
    if (isPaginationVisible) {
      gsap.fromTo(
        '#pagination',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power1.out', delay: 1 },
      )
    }
  }, [isPaginationVisible])

  const onDialogEnter = contextSafe(() => {
    gsap.fromTo('#dialogBox', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1.8, ease: 'power1.out' })
  })
  const onDialogExit = contextSafe(() => {
    gsap.to('#dialogBox', { opacity: 0, duration: 0.3, ease: 'power1.out' })
  })

  useEffect(() => {
    if (!preciseLoc) setShowDialog(true)
  }, [preciseLoc])

  const setSelectedPub = useCallback((pub: Bar | null) => {
    const var1 = pub ? `${pub?.name}, ${pub?.postcode}` : undefined
    // console.log('update pub: ', { var1 })
    // updateUserDetails({ var1 })
  }, [])

  const handleLocationFound = (pos: Position) => {
    setPreciseLoc(pos)
  }

  if (doorIsPlaying) return null

  const screen: Screen = mapStepToScreen(ticketFlow, step)

  return (
    <div className={styles.main}>
      <SwitchTransition mode="out-in">
        <Transition key={screen} timeout={1400} appear mountOnEnter unmountOnExit>
          {(status) => {
            // SCREEN #1: Landing (common to both flows)
            if (screen === Screen.Landing) {
              return (
                <Landing transitionStatus={status} ticketFlow={ticketFlow} goToNextStep={() => setStep(step + 1)} />
              )
            }

            // SCREEN #2 (Win flow): PIN entry
            if (screen === Screen.Pin && ticketFlow === TicketFlow.Win) {
              return (
                <CodeVerificationInput
                  transitionStatus={status}
                  goToNextStep={() => setStep(step + 1)}
                  updateUserDetails={updateUserDetails}
                />
              )
            }

            // SCREEN #2 (RateOfSale flow): PubSelector
            if (screen === Screen.PubSelector && ticketFlow === TicketFlow.RateOfSale) {
              return (
                <PubSelector
                  transitionStatus={status}
                  setSelectedPub={setSelectedPub}
                  goToSelector={() => setStep(step + 1)}
                />
              )
            }

            // SCREEN #3: UserDetails (for both flows)
            if (screen === Screen.UserDetails) {
              return (
                <UserDetailsForm
                  ticketFlow={ticketFlow}
                  showPagination={false}
                  transitionStatus={status}
                  userDetails={userDetails}
                  setUserDetails={setUserDetails}
                  updateUserDetails={updateUserDetails}
                  onFormSubmit={onUserDetailsFormSubmit}
                />
              )
            }

            // SCREEN #4: Entered (both flows)
            if (screen === Screen.Entered) {
              return <Entered transitionStatus={status} ticketFlow={ticketFlow} />
            }

            // Default fallback (unlikely):
            return null
          }}
        </Transition>
      </SwitchTransition>

      {isPaginationVisible && (
        <div
          id="pagination"
          className={styles.paginationWrapper}
          style={{ bottom: preciseLoc || screen !== Screen.PubSelector ? 24 : 72 }}>
          <Pagination length={2} activeIndex={activeIndex} />
        </div>
      )}

      <Transition
        in={screen === Screen.PubSelector}
        timeout={300}
        onEnter={onDialogEnter}
        onExit={onDialogExit}
        mountOnEnter={true}
        unmountOnExit={true}>
        <div id="dialogBox" className={styles.preciseLocationWrapper}>
          <Image id="manImg" src={manImg} alt="Chulapo" />

          <PreciseLocationDialog
            show={showDialog}
            hide={() => setShowDialog(false)}
            onLocationFound={handleLocationFound}
            onTrackingStart={() => setIsTracking(true)}
            onTrackingEnd={() => setIsTracking(false)}
          />
        </div>
      </Transition>
    </div>
  )
}

export default TicketCompetitionFlow
