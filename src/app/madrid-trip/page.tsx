'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { type FC, useCallback, useEffect, useState } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'

import manImg from '@/assets/images/man-illustration.png'
import Entered from '@/components/madridTrip/entered/Entered'
import Landing from '@/components/madridTrip/landing/Landing'
import PubSelector from '@/components/madridTrip/pubSelector/PubSelector'
import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import Pagination from '@/components/pagination/Pagination'
import PreciseLocationDialog from '@/components/preciseLocationDialog/PreciseLocationDialog'
import AddressForm from '@/components/prizeDrawForm/addressForm/AddressForm'
import UserDetailsForm from '@/components/prizeDrawForm/userDetailsForm/UserDetailsForm'
import RedDoorLargeIntro from '@/components/redDoor/RedDoorLarge'
import { Bar } from '@/components/searchInputField/SeachInputField'
import { useMadridTripStore } from '@/hooks/useFormStore'
import useGTMEvent from '@/hooks/useGTMEvent'
import useMapStore from '@/hooks/useMapStore'
import { Pathname } from '@/resources/pathname'

import styles from './page.module.scss'

function Home() {
  const [showDoor, setShowDoor] = useState(true)

  const { overlay } = useOverlays()

  if (overlay !== OverlayScreen.None) return null

  return (
    <main className={styles.main}>
      {/* Main content revealed after intro  */}
      <RedDoorLargeIntro
        show={showDoor}
        section={'pint'}
        hideDoor={() => {
          setShowDoor(false)
        }}
        mainContent={<MadridTripMainFlow doorIsPlaying={showDoor} />}
      />
    </main>
  )
}

export default Home

enum Screen {
  Landing,
  PubSelector,
  UserDetails,
  Address,
  Entered,
}

export type Position = {
  lat: number
  lng: number
  heading: number | null
}

const MadridTripMainFlow: FC<{ doorIsPlaying: boolean }> = ({ doorIsPlaying }) => {
  const { preciseLoc, setPreciseLoc, isTracking, setIsTracking } = useMapStore()
  const { trackEvent } = useGTMEvent()
  const userDetails = useMadridTripStore((s) => s.userDetails)
  const updateUserDetails = useMadridTripStore((s) => s.updateUserDetails)
  const setUserDetails = useMadridTripStore((s) => s.setUserDetails)
  const [screen, setScreen] = useState<Screen>()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const [showDialog, setShowDialog] = useState(false)
  const { contextSafe } = useGSAP()

  const selectedPub = userDetails.var1

  //On mount only
  useEffect(() => {
    const step = searchParams.get('st')

    if (!!step) setScreen(+step)
    else setScreen(Screen.Landing)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (screen !== undefined) {
      replace(Pathname.MadridTrip + '?st=' + screen)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  useEffect(() => {
    if (!preciseLoc) setShowDialog(true)
  }, [preciseLoc])

  // prevents user from skipping steps in the Screen enum
  useEffect(() => {
    if (!selectedPub && screen !== Screen.Landing && screen !== Screen.PubSelector && screen !== Screen.Entered) {
      setScreen(Screen.Landing)
    }
  }, [selectedPub, screen, userDetails])

  useEffect(() => {
    // Prevent going straight to address field from browser address bar if there're missing fields
    if (screen === Screen.Address) {
      if (
        !userDetails.firstName ||
        !userDetails.lastName ||
        !userDetails.dob ||
        !userDetails.phone ||
        !userDetails.email
      ) {
        setScreen(Screen.UserDetails)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  const isPaginationVisible = screen !== Screen.Landing && screen !== Screen.Entered
  const activeIndex =
    screen === Screen.PubSelector ? 0 : screen === Screen.UserDetails ? 1 : screen === Screen.Address ? 2 : 0

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
    gsap.fromTo('#dialogBox', { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 1.2, ease: 'power1.out' })
  })
  const onDialogExit = contextSafe(() => {
    gsap.to('#dialogBox', { opacity: 0, duration: 0.3, ease: 'power1.out' })
  })

  const onUserDetailsFormSubmit = () => {
    setScreen(Screen.Address)
  }

  const handleFormSubmit = async () => {
    const areAllRequiredFieldsFilled =
      !!userDetails.firstName &&
      !!userDetails.lastName &&
      !!userDetails.dob &&
      !!userDetails.phone &&
      !!userDetails.email &&
      !!userDetails.address1 &&
      !!userDetails.city &&
      !!userDetails.county &&
      !!userDetails.postcode &&
      !!userDetails.countryId &&
      !!userDetails.hasCheckedTerms &&
      !!userDetails.var1

    if (!areAllRequiredFieldsFilled) return

    const res = await fetch(`${process.env.BASE_PATH}/api/prize-draw`, {
      method: 'POST',
      body: JSON.stringify({
        ...userDetails,
        competitionToken: 'E1CEE702-6BD3-474E-BF78-E6BB70BAF088',
        prizeTypeId: 20,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
    const json = await res.json()
    if (json?.result?.code === 1) {
      // trackEvent(EventName.RateOfSaleFormSubmitted)
      setScreen(Screen.Entered)
    }
    if (json?.error) {
      throw new Error(json.error)
    }
  }

  const setSelectedPub = useCallback(
    (pub: Bar | null) => {
      const var1 = pub ? `${pub?.name}, ${pub?.postcode}` : undefined
      // console.log('update pub: ', { var1 })
      updateUserDetails({ var1 })
    },
    [updateUserDetails],
  )

  const handleLocationFound = (pos: Position) => {
    setPreciseLoc(pos)
  }

  if (doorIsPlaying) return null
  return (
    <main className={styles.main}>
      <SwitchTransition mode="out-in">
        <Transition key={screen} timeout={800} appear mountOnEnter unmountOnExit>
          {(status) => {
            if (screen === Screen.Landing)
              return <Landing transitionStatus={status} goToSelector={() => setScreen(Screen.PubSelector)} />
            if (screen === Screen.PubSelector)
              return (
                <PubSelector
                  transitionStatus={status}
                  setSelectedPub={setSelectedPub}
                  goToSelector={() => setScreen(Screen.UserDetails)}
                  onBackClick={() => {
                    setScreen(Screen.Landing)
                  }}
                />
              )
            if (screen === Screen.UserDetails)
              return (
                <UserDetailsForm
                  title="WIN A TRIP TO MADRID"
                  showPagination={false}
                  transitionStatus={status}
                  userDetails={userDetails}
                  setUserDetails={setUserDetails}
                  updateUserDetails={updateUserDetails}
                  onFormSubmit={onUserDetailsFormSubmit}
                  onBackClick={() => {
                    setScreen(Screen.PubSelector)
                  }}
                />
              )
            if (screen === Screen.Address)
              return (
                <AddressForm
                  title="WIN A TRIP TO MADRID"
                  showPagination={false}
                  transitionStatus={status}
                  onBackClick={() => {
                    setScreen(Screen.UserDetails)
                  }}
                  handleFormSubmit={handleFormSubmit}
                />
              )
            if (screen === Screen.Entered)
              return (
                <Entered
                  transitionStatus={status}
                  onBackClick={() => {
                    setScreen(Screen.Landing)
                  }}
                />
              )
          }}
        </Transition>
      </SwitchTransition>
      {isPaginationVisible && (
        <div
          id="pagination"
          className={styles.paginationWrapper}
          style={{ bottom: preciseLoc || screen !== Screen.PubSelector ? 24 : 72 }}>
          <Pagination length={3} activeIndex={activeIndex} />
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
    </main>
  )
}
