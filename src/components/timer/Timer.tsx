'use client'

import classNames from 'classnames'
import { type Entry } from 'contentful'
import { type FC, useEffect, useState } from 'react'

import { MadriEvent } from '@/model/map'

import styles from './Timer.module.scss'

type Props = {
  event: Entry<MadriEvent> | undefined
  onTimerEnd: () => void
}

const Timer: FC<Props> = ({ event, onTimerEnd }) => {
  const getDifferenceBreakdown = () => {
    const currentDate = new Date()
    const goLiveDate = new Date(event?.fields.date ?? '')
    let difference = goLiveDate.getTime() - currentDate.getTime()

    // TODO: We have date-fns in the project, use it instead of this

    const daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24)
    difference -= daysDifference * 1000 * 60 * 60 * 24

    const hoursDifference = Math.floor(difference / 1000 / 60 / 60)
    difference -= hoursDifference * 1000 * 60 * 60

    const minutesDifference = Math.floor(difference / 1000 / 60)
    difference -= minutesDifference * 1000 * 60

    const secondsDifference = Math.floor(difference / 1000)

    return { daysDifference, hoursDifference, minutesDifference, secondsDifference }
  }

  const { daysDifference, hoursDifference, minutesDifference, secondsDifference } = getDifferenceBreakdown()

  const [minutes, setMinutes] = useState(minutesDifference)
  const [seconds, setSeconds] = useState(secondsDifference)
  const [hours, setHours] = useState(hoursDifference)
  const [days, setDays] = useState(daysDifference)

  const timerEnded = !seconds && !minutes && !hours && !days

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1)

      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            if (days === 0) {
              clearInterval(myInterval)
              onTimerEnd()
            } else {
              setDays(days)
              setHours(23)
              setMinutes(59)
              setSeconds(59)
            }
          } else {
            setHours(hours - 1)
            setMinutes(59)
            setSeconds(59)
          }
        } else {
          setMinutes(minutes - 1)
          setSeconds(59)
        }
      }
    }, 1000)
    return () => {
      clearInterval(myInterval)
    }
  })

  if (timerEnded) onTimerEnd()

  return (
    <div className={styles.container}>
      <div className={styles.timerCell}>
        {days <= 9 ? '0' : ''}
        {days}
        <div>DAYS</div>
      </div>
      <div className={styles.timerCell}>
        {hours <= 9 ? '0' : ''}
        {hours}
        <div>HOURS</div>
      </div>
      <div className={styles.timerCell}>
        {minutes <= 9 ? '0' : ''}
        {minutes}
        <div>MINUTES</div>
      </div>
      <div className={classNames(styles.timerCell, styles.timerSeconds)}>
        {seconds <= 9 ? '0' : ''}
        {seconds}
        <div>SECONDS</div>
      </div>
    </div>
  )
}

export default Timer
