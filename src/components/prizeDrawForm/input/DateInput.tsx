import classNames from 'classnames'
import React, { FC, useEffect, useRef, useState } from 'react'

import styles from './DateInput.module.scss'

type DateInputProps = {
  id?: string
  initialValue?: string
  placeholder?: string
  required?: boolean
  onChange?: (date: string) => void
  checkForError?: (date: Date) => string
  onErrorChange?: (error: string, id: string) => void
}

const DateInput: FC<DateInputProps> = ({
  id,
  initialValue,
  placeholder,
  required,
  onChange,
  checkForError,
  onErrorChange,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const initialDate = initialValue ? new Date(initialValue) : null
  const [day, setDay] = useState(initialDate?.getDate().toString() || '')

  const initialMonth = initialDate ? initialDate.getMonth() + 1 : undefined
  const [month, setMonth] = useState(
    initialMonth !== undefined && initialMonth < 10 ? `0${initialMonth}` : initialMonth?.toString() || '',
  )
  const [year, setYear] = useState(initialDate?.getFullYear().toString() || '')
  const [error, setError] = useState('')

  const onFocus = () => {
    setIsFocused(true)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const dayRef = useRef<HTMLInputElement>(null)
  const monthRef = useRef<HTMLInputElement>(null)
  const yearRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isFocused) return
    if (day.length >= 2) monthRef.current?.focus()
  }, [day, isFocused])

  useEffect(() => {
    if (!isFocused) return
    if (month.length >= 2) yearRef.current?.focus()
  }, [isFocused, month])

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsFocused(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const showPlaceholder = !day && !month && !year && !isFocused

  const isValidDay = day.length === 2 && +day >= 1 && +day <= 31
  const isValidMonth = month.length === 2 && +month >= 1 && +month <= 12
  const isValidYear = year.length === 4 && +year >= 1900 && +year <= new Date().getFullYear()

  // ON CHANGE
  useEffect(() => {
    if (!day.length && !month.length && !year.length) return
    const date = `${year}-${month}-${day}`
    onChange?.(date)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month, year])

  useEffect(() => {
    if (!day.length && !month.length && !year.length) return setError('')

    if (day.length && !isValidDay) return setError('Invalid day')
    if (month.length && !isValidMonth) return setError('Invalid month')
    if (year.length && !isValidYear) return setError('Invalid year')

    if (!day.length || !month.length || !year.length) return
    const date = new Date(+year, +month - 1, +day)
    const error = checkForError?.(date)
    setError(error || '')
  }, [checkForError, day, isValidDay, isValidMonth, isValidYear, month, year])

  useEffect(() => {
    onErrorChange?.(error, id || '')
  }, [error, id, onErrorChange])

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div ref={containerRef} className={classNames(styles.container, isFocused && styles.focused)} onClick={onFocus}>
        {showPlaceholder && <span className={styles.placeholder}>{placeholder}</span>}

        <div className={classNames(styles.wrapper, showPlaceholder && styles.hidden)}>
          <input
            id={id}
            ref={dayRef}
            type="number"
            min={1}
            max={31}
            onFocus={onFocus}
            placeholder="DD"
            value={day}
            onChange={(e) => {
              let value = e.target.value
              if (+value && +value > 31) return
              setDay(value)
            }}
            onBlur={(e) => {
              let value = +e.target.value
              if (value && value < 10) return setDay('0' + value)
            }}
            className={classNames(!isFocused && !isValidDay && styles.error)}
            required={required}
          />
          <span className={styles.dobDelimitator}>&nbsp;/</span>
          <input
            ref={monthRef}
            type="number"
            min={1}
            max={12}
            onFocus={onFocus}
            placeholder="MM"
            value={month}
            onChange={(e) => {
              let value = e.target.value
              if (+value && +value > 12) return
              setMonth(value)
            }}
            onBlur={(e) => {
              let value = +e.target.value
              if (value && value < 10) return setMonth('0' + value)
            }}
            className={classNames(!isFocused && !isValidMonth && styles.error)}
            required={required}
          />
          <span className={styles.dobDelimitator}>/&nbsp;</span>
          <input
            ref={yearRef}
            type="number"
            min={1900}
            max={new Date().getFullYear()}
            onFocus={onFocus}
            placeholder="YYYY"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={classNames(!isFocused && !isValidYear && styles.error)}
            required={required}
          />
        </div>
      </div>
      {!isFocused && error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  )
}

export default DateInput
