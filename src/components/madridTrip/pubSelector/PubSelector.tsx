import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import bars from 'public/ros/bars.json'
import React, { type FC, useCallback, useEffect, useRef, useState } from 'react'
import { Transition, TransitionStatus } from 'react-transition-group'

import Button from '@/components/button/Button'
import SearchInputField, { Bar } from '@/components/searchInputField/SeachInputField'
import { useROSStore } from '@/hooks/useFormStore'
import useGTMEvent from '@/hooks/useGTMEvent'
import useMapStore from '@/hooks/useMapStore'
import { EventName } from '@/resources/analytics'
import { formatBarAddress } from '@/utils/formattingText'

import styles from './PubSelector.module.scss'

type LandingProps = {
  transitionStatus: TransitionStatus
  goToSelector: () => void
  setSelectedPub: (pub: Bar | null) => void
  onBackClick?: () => void
}

const PubSelector: FC<LandingProps> = ({ transitionStatus, goToSelector, setSelectedPub, onBackClick }) => {
  const preciseLoc = useMapStore((s) => s.preciseLoc)
  const { trackEvent } = useGTMEvent()

  const [closestBar, setClosestBar] = useState<Bar | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [selectedPubLocal] = useState<Bar | null>(null)
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const searchInputField = useRef<HTMLInputElement>(null)
  const updateUserDetails = useROSStore((s) => s.updateUserDetails)
  const { contextSafe } = useGSAP()

  const onVamosClick = () => {
    const fullAddress = selectedPubLocal ? formatBarAddress(selectedPubLocal) : inputValue
    trackEvent({
      event: EventName.TapOnVamos,
      pageName: 'A1',
      pointOfSale: 'leaflet',
      pubDetails: fullAddress,
    })

    updateUserDetails({ barPubAddress: fullAddress })
    goToSelector()
  }
  // const handleBackClick = () => {
  //   onBackClick()
  // }

  const resetInput = () => {
    setInputValue('')
    setIsButtonVisible(false)
    setClosestBar(null)
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => (value * Math.PI) / 180
    const R = 6371 // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  // Function to find the closest bar based on the user's lat/lng
  const findClosestBar = (userLat: number, userLng: number) => {
    const validBars = bars.filter((bar) => bar.lat && bar.lng) // Ensure both lat and lng are available

    if (validBars.length === 0) return null

    const sortedBars = bars.sort((a, b) => {
      const distanceA = calculateDistance(userLat, userLng, parseFloat(a.lat as string), parseFloat(a.lng as string))
      const distanceB = calculateDistance(userLat, userLng, parseFloat(b.lat as string), parseFloat(b.lng as string))
      return distanceA - distanceB
    })
    return sortedBars[0] // Return the closest bar
  }

  const handleBarSelect = useCallback(
    (selectedValue: Bar | null) => {
      setSelectedPub(selectedValue)
      setIsButtonVisible(!!selectedValue)

      if (!selectedValue) return

      const fullAddress = formatBarAddress(selectedValue)
      setInputValue(fullAddress) // Set input value when a bar is selected
    },
    [setSelectedPub],
  )

  useEffect(() => {
    if (preciseLoc) {
      const closestBar = findClosestBar(preciseLoc.lat, preciseLoc.lng)

      if (closestBar) {
        setClosestBar(closestBar) // Only format and set if closestBar is valid
      } else {
        setClosestBar(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preciseLoc])

  useGSAP(() => {
    gsap.set(['#header', '#text', '#addressInput'], {
      opacity: 0,
      scale: 1.2,
    })
  }, [])

  // Animate elements on enter/exit
  useGSAP(() => {
    if (transitionStatus === 'entering') {
      const tl = gsap.timeline()

      tl.fromTo('#header', { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power1.out' })
      tl.fromTo(
        '#text',
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power1.out' },
        '-=0.2',
      )
      tl.fromTo(
        '#addressInput',
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power1.out' },
        '-=0.2',
      )
    }

    if (transitionStatus === 'exiting') {
      gsap.to(['#header', '#text', '#addressInput'], {
        opacity: 0,
        scale: 1.2,
        duration: 0.3,
        stagger: -0.1,
        ease: 'power1.in',
      })

      gsap.to('#vamosButton', { opacity: 0, duration: 0.3, ease: 'power1.in' })
    }
  }, [transitionStatus])

  const onButtonEnter = contextSafe(() => {
    gsap.fromTo('#vamosButton', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' })
  })

  return (
    <div id="landing" className={styles.container}>
      {/*<BackButton onClick={handleBackClick} />*/}
      <div className={styles.contentWrapper}>
        <h1 id="header" className={styles.header}>
          Enter the draw to win
        </h1>
        <h2 id="text" className={styles.text}>
          Enter your details to enter the prize draw
        </h2>

        <h2 id="text" className={styles.text}>
          Tell us where you bought your Madrí Excepcional
        </h2>

        <div id="addressInput" className={styles.addressInput}>
          <SearchInputField
            ref={searchInputField}
            placeholder="Enter the name of your pub or bar"
            type="text"
            name="searchInputField"
            id="searchInputField"
            autofillValue={closestBar ?? undefined}
            bars={bars}
            value={inputValue}
            onBarSelect={handleBarSelect}
            onChange={(e) => setInputValue(e.target.value)}
            required
          />
        </div>

        <Transition in={isButtonVisible} timeout={300} onEnter={onButtonEnter} mountOnEnter unmountOnExit>
          <div id="vamosButton" className={styles.buttonBox}>
            <Button arrowRight onClick={onVamosClick} fullWidth variant="secondary">
              Vamos
            </Button>

            <button onClick={resetInput} className={styles.resetButton}>
              This isn&apos;t the right pub or bar
            </button>
          </div>
        </Transition>
      </div>
    </div>
  )
}

export default PubSelector
