import classNames from 'classnames'
import gsap from 'gsap'
import { type FC, useEffect, useRef } from 'react'

import styles from './ProgressBar.module.scss'

type Props = {
  duration: number
  onEnd: () => void
  className?: string
  isPaused?: boolean
}

const ProgressBar: FC<Props> = ({ duration, onEnd, className, isPaused }) => {
  const indicator = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<GSAPTween>()

  useEffect(() => {
    if (tweenRef.current) return
    tweenRef.current = gsap.to(indicator.current, {
      x: 0,
      ease: 'linear',
      duration: duration,
      onComplete: onEnd,
    })
  }, [duration, onEnd])

  useEffect(() => {
    if (isPaused) tweenRef.current?.pause()
    else tweenRef.current?.play()
  }, [isPaused])

  return (
    <div className={classNames(styles.container, className)}>
      <div ref={indicator} className={styles.indicator} />
    </div>
  )
}

export default ProgressBar
