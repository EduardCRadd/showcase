'use client'

import classNames from 'classnames'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import lockedIcon from '@/assets/icons/locked.svg'
import unlockedIcon from '@/assets/icons/unlocked.svg'
import alertIcon from '@/assets/icons/unlocked-alert.svg'
import lockedMatImg from '@/assets/mats/mat-locked.jpg'
import { Alert } from '@/components/alert/Alert'
import Button from '@/components/button/Button'
import Carousel from '@/components/carousel/Carousel'
import useRewardsStore from '@/hooks/useRewardsStore'
import { BEER_MATS_ARRAY } from '@/resources/beerMats'
import { Pathname } from '@/resources/pathname'

import styles from './rewards.module.scss'

// M2a

// NOTE: This has been removed and is now redirecting to home in next.config.js. Left for reference.

export default function RewardsPage() {
  const { unlockedBeerMatIds, canUnlockBeerMat, unlockBeerMat } = useRewardsStore()

  const hasUnlockedAllMats = unlockedBeerMatIds.length >= 3

  const [activeIndex, setActiveIndex] = useState(0)
  const [showClaimRewardButton, setShowClaimRewardButton] = useState(false)
  const [showUnlockedAlert, setShowUnlockedAlert] = useState(true)

  const [slideIndex, setSlideIndex] = useState(0)
  const onIndicatorTap = (index: number) => setSlideIndex(index)

  // Beer mat is automatically unlocked when you visit this page after time has passed
  useEffect(() => {
    if (canUnlockBeerMat) {
      unlockBeerMat()
      setShowUnlockedAlert(true)
    }
  }, [canUnlockBeerMat, unlockBeerMat, unlockedBeerMatIds.length])

  useEffect(() => {
    if (hasUnlockedAllMats) setShowClaimRewardButton(true)
  }, [hasUnlockedAllMats])

  const panels = BEER_MATS_ARRAY.map(({ id, imageSrc }) => {
    const isUnlocked = unlockedBeerMatIds.includes(id)

    return (
      <div key={id} className={styles.panel}>
        {isUnlocked ? (
          <Image id="mat" alt="mat" src={imageSrc} quality={90} />
        ) : (
          <Image id="locked-mat" alt="locked mat" src={lockedMatImg} quality={90} />
        )}
      </div>
    )
  })

  const indicators = BEER_MATS_ARRAY.map(({ id }, index) => {
    const isUnlocked = unlockedBeerMatIds.includes(id)
    const isActive = index === activeIndex

    return (
      <div
        key={id}
        className={classNames(styles.indicator, isActive && styles.activeIndicator)}
        onClick={() => onIndicatorTap(index)}>
        {isUnlocked ? (
          <Image alt="lock" src={unlockedIcon} width={40} />
        ) : (
          <Image alt="lock" src={lockedIcon} width={40} />
        )}
        <div />
      </div>
    )
  })

  return (
    <main className={styles.main}>
      {hasUnlockedAllMats && <h3>You’ve unlocked 3 beer mats!</h3>}
      <section className={styles.mats}>
        <Carousel panels={panels} activeIndex={slideIndex} onIndexChanged={setActiveIndex} />
        <div className={styles.indicators}>{indicators}</div>
        <Alert
          show={showUnlockedAlert}
          hide={() => setShowUnlockedAlert(false)}
          label="New mat unlocked!"
          bottom={120}
          icon={<Image src={alertIcon} alt="unlocked" width={32} height={32} />}
        />
      </section>
      <div className={styles.cta}>
        {showClaimRewardButton ? (
          <Button variant="primary" fullWidth arrowRight url={Pathname.Claim}>
            Claim your reward
          </Button>
        ) : (
          <p>Collect all 3 beer mats to earn 10% off your next purchase of Madrí Excepcional</p>
        )}
      </div>
    </main>
  )
}
