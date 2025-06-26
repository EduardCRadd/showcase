'use client'
import gsap from 'gsap'
import Image from 'next/image'
import { type FC, useEffect, useState } from 'react'

import lightbulbImg from '@/assets/icons/lightbulb.png'
import ProgressBar from '@/components/progressBar/ProgressBar'
import useFactsStore from '@/hooks/useFactsStore'
import { type Fact } from '@/resources/facts'

import styles from './FunFact.module.scss'

type FactProps = {
  onEnd: () => void
}

const FACT_DURATION_S = 6

const FunFact: FC<FactProps> = ({ onEnd }) => {
  const getFact = useFactsStore((state) => state.getFact)

  const [fact, setFact] = useState<Fact>()

  useEffect(() => setFact(getFact()), [getFact])

  useEffect(() => {
    const selector = gsap.utils.selector('#fact-container')
    const textElements = selector('h2, span')
    const icon = selector('img')
    gsap.set(textElements, { opacity: 0, y: 24 })
    gsap.set(icon, { opacity: 0, y: 24, rotate: 400, scale: 0.3 })
    gsap.to(textElements, {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      duration: 0.7,
      ease: 'back.out(1.8)',
      delay: 0.6,
    })
    gsap.to(icon, {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.5)',
    })
  }, [])

  return (
    <>
      <div id="fact-container" className={styles.container}>
        <div>
          <h2>Did you know?</h2>
          <span>{fact?.text}</span>
        </div>
        <Image src={lightbulbImg} width={80} height={80} alt="lightbulb" style={{ objectFit: 'contain' }} />
      </div>
      <ProgressBar duration={FACT_DURATION_S} onEnd={onEnd} />
    </>
  )
}

export default FunFact
