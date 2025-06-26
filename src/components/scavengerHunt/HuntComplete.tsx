'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { type FC, useEffect, useState } from 'react'

import can from '@/assets/scavenger/can-with-checkmark.svg'
import useScavengerHuntStore from '@/hooks/useScavengerHuntStore'
import { Pathname } from '@/resources/pathname'

import Button from '../button/Button'
import styles from './HuntComplete.module.scss'
import { useHuntTerms } from './HuntTermsProvider'
import { GLASSES_COUNT } from './TiledMural'

const HuntComplete: FC = () => {
  const { setShowTerms } = useHuntTerms()
  const collectedGlasses = useScavengerHuntStore((s) => s.collectedGlasses)
  const push = useRouter().push
  const { contextSafe } = useGSAP()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (!mounted) return setMounted(true)
    if (collectedGlasses.length < GLASSES_COUNT) push(process.env.BASE_PATH + Pathname.ScavengerHunt)
  }, [collectedGlasses.length, push, mounted])

  const onVamosClick = contextSafe(() => {
    gsap.to('#card,  #cta', {
      opacity: 0,
      y: 12,
      duration: 0.5,
      stagger: 0.1,
      onComplete: () => {
        push(Pathname.EventsMap)
      },
    })
  })

  useGSAP(() => {
    gsap.set('#card, #card-content > *, #cta', { opacity: 0, y: 12 })

    gsap.timeline().to('#card, #card-content > *, #cta', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
    })
  }, [])

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div id="card" className={styles.card}>
          <div id="card-content" className={styles.cardContent}>
            <h2>Felicidades!</h2>
            <div className={styles.glasses}>
              {new Array(GLASSES_COUNT).fill('').map((_, index) => (
                <Image key={index} src={can} alt="can with checkmark" />
              ))}
            </div>
            <p>
              You&apos;ve found all 3 Madrí Excepcional cans. Show this page to a Madrí Excepcional staff member to
              discover if you have won.
            </p>
            <p>VALID TODAY ONLY. Offer expires in:</p>
            <Countdown />
          </div>
        </div>
      </div>
      <div id="cta" className={styles.ctaWrapper}>
        <p className={styles.terms}>
          <button onClick={() => setShowTerms(true)}>Terms & Conditions</button> apply. All entrants must be over 18.
        </p>
        <div id="action" className={styles.actionBanner}>
          <p>
            Explore Madrí Excepcional
            <br /> Bars and Events
          </p>
          <Button arrowRight onClick={onVamosClick}>
            Vamos
          </Button>
        </div>
      </div>
    </main>
  )
}

export default HuntComplete

const Countdown: FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
      const timeDifference = midnight.getTime() - now.getTime()

      const hours = Math.floor(timeDifference / (1000 * 60 * 60))
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    const timer = setInterval(calculateTimeLeft, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formattedHours = timeLeft.hours.toString().padStart(2, '0')
  const formattedMinutes = timeLeft.minutes.toString().padStart(2, '0')
  const formattedSeconds = timeLeft.seconds.toString().padStart(2, '0')

  return (
    <div className={styles.countdown}>
      <span className={styles.count}>{formattedHours}</span>
      <span className={styles.label}>hours</span>
      <span className={styles.count}>{formattedMinutes}</span>
      <span className={styles.label}>mins</span>
      <span className={styles.count}>{formattedSeconds}</span>
      <span className={styles.label}>secs</span>
    </div>
  )
}
