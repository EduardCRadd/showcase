import { useGSAP } from '@gsap/react'
import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import { ChangeEvent, forwardRef, InputHTMLAttributes, useCallback, useEffect, useState } from 'react'
import { Transition } from 'react-transition-group'

import searchSVG from '@/assets/icons/search.svg'
import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'
import { formatBarAddress } from '@/utils/formattingText'

import styles from './SearchInputField.module.scss'

export type Bar = {
  name: string
  road: string
  postcode: string
  location?: string
  coordinates?: string
  lat?: string
  lng?: string
  address: string
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  initialValue?: string
  autofillValue?: Bar
  bars?: Bar[]
  onBarSelect?: (selectedValue: Bar | null) => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => any
  checkForError?: (value: string) => string
}

const SearchInputField = forwardRef<HTMLInputElement, InputProps>(
  ({ initialValue = '', autofillValue, bars = [], onBarSelect, type, onChange, checkForError, ...props }, ref) => {
    const [value, setValue] = useState(initialValue)
    const [error, setError] = useState('')
    const [isFocused, setIsFocused] = useState(false)
    const [showResults, setShowResults] = useState(true)
    const [filteredBars, setFilteredBars] = useState<Bar[]>([])
    const { trackEvent } = useGTMEvent()
    const { contextSafe } = useGSAP()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setValue(inputValue)
      onChange?.(e)

      const error = !!e.target.value ? checkForError?.(e.target.value) : null
      setError(error || '')

      setShowResults(!!inputValue) // Show search results when input is not empty

      // Filter bars based on input value
      const searchTerm = e.target.value.toLowerCase()
      const filtered = bars.filter((bar) => bar.address.toLowerCase().includes(searchTerm))
      setFilteredBars(filtered)

      // Hide the button if the user is typing or clears the input field
      if (inputValue === '' || filtered.length === 0) {
        onBarSelect?.(null)
      }
    }

    const handleResultClick = useCallback(
      (result: Bar) => {
        const fullAddress = formatBarAddress(result)
        setValue(fullAddress) // Autofill the input field with the selected result
        setShowResults(false) // Hide the search results
        onBarSelect?.(result)

        trackEvent({
          event: EventName.EnterPubName,
          pageName: 'A1',
          pointOfSale: 'leaflet',
          pubDetails: fullAddress,
        })
      },
      [onBarSelect, trackEvent],
    )

    useEffect(() => {
      if (!autofillValue) return

      handleResultClick(autofillValue)
    }, [autofillValue, handleResultClick])

    const onResultEnter = contextSafe(() => {
      gsap.fromTo('#searchResults', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power1.out' })
    })

    const onResultExit = contextSafe(() => {
      gsap.to('#searchResults', { opacity: 0, y: 10, duration: 0.3, ease: 'power1.in' })
    })

    return (
      <div className={styles.container}>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            className={classNames(styles.input, !isFocused && !!error && styles.error)}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
          <Image src={searchSVG} alt="Search Icon" className={styles.searchIcon} />

          {/* Search result dropdown */}
          <Transition
            in={showResults && filteredBars.length > 0}
            timeout={300}
            onEnter={onResultEnter}
            onExit={onResultExit}
            mountOnEnter
            unmountOnExit>
            <div id="searchResults" className={styles.searchResults}>
              <ul>
                {filteredBars.map((bar, index) => (
                  <li key={`${bar.name}-${bar.postcode}`} onClick={() => handleResultClick(bar)}>
                    {formatBarAddress(bar)}
                  </li>
                ))}
              </ul>
            </div>
          </Transition>
        </div>

        {!isFocused && error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    )
  },
)

SearchInputField.displayName = 'SearchInputField'

export default SearchInputField
