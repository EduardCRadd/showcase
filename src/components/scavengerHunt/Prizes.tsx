'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { push } from 'micromark-util-chunked'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

import cover from '@/assets/scavenger/prizes-cover.jpg'
import BackButton from '@/components/paint/backButton/BackButton'
import { Pathname } from '@/resources/pathname'

import { useHuntTerms } from './HuntTermsProvider'
import styles from './Prizes.module.scss'

const Prizes = () => {
  const { setShowTerms } = useHuntTerms()
  const { push } = useRouter()
  const { contextSafe } = useGSAP()

  useGSAP(() => {
    gsap.set('#container, #container *', { opacity: 0, y: 12 })
    gsap.to('#container, #container *', {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.1,
    })
  })

  const goToIntroPage = contextSafe(() => {
    gsap.to(['#back', 'main > *', 'article > *'], {
      opacity: 0,
      y: 16,
      stagger: -0.1,
      onComplete: () => push(Pathname.ScavengerHunt),
    })
  })
  return (
    <main id="container" className={styles.main}>
      <BackButton id="back" onClick={goToIntroPage} />
      <div className={styles.displayText}>
        <span className={styles.enter}>
          ENTER THE <span className={styles.gold}>SCAVENGER HUNT</span>
        </span>

        <span className={styles.chance}>
          <span>
            to be in with <b>a chance of winning</b>
          </span>
          <span className={styles.line} />
        </span>
        <span className={styles.prizesWrapper}>
          <span className={styles.madri}>
            MADRí<span className={styles.exceptional}>Excepcional</span>
          </span>

          <span className={styles.prizes}>
            PRIZES<span className={styles.asterisk}>*</span>
          </span>
        </span>
      </div>
      <Image src={cover} alt="Madri Exceptional Glass" className={styles.cover} />
      <div className={styles.text}>
        <p>
          Find 3 Madrí Excepcional cans to be in with a chance of winning a free pint of Madrí Excepcional or a REVL
          voucher.
        </p>
        <button onClick={() => setShowTerms(true)}>Tap here for full Terms & Conditions</button>
      </div>
    </main>
  )
}

export default Prizes
