import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image, { StaticImageData } from 'next/image'
import React, { type FC, useEffect, useState } from 'react'
import { TransitionStatus } from 'react-transition-group'

import glassDesign1 from '@/assets/paint/stencils/glass-1.svg'
import glassDesign2 from '@/assets/paint/stencils/glass-2.svg'
import glassDesign3 from '@/assets/paint/stencils/glass-3.svg'
import glassDesign4 from '@/assets/paint/stencils/glass-4.svg'
import glassDesign5 from '@/assets/paint/stencils/glass-5.svg'
import Button from '@/components/button/Button'
import Carousel from '@/components/carousel/Carousel'
import PageTitle from '@/components/pageTitle/PageTitle'
import { PAINT_ACTIONS_STORAGE_KEY } from '@/hooks/usePaintHistoryState'
import usePaintStore from '@/hooks/usePaintStore'

import styles from './GlassSelector.module.scss'

const GLASS_DESIGNS: {
  id: string
  image: { src: StaticImageData; alt: string }
}[] = [
  { id: 'glass-1', image: { src: glassDesign1, alt: '' } },
  { id: 'glass-2', image: { src: glassDesign2, alt: '' } },
  { id: 'glass-3', image: { src: glassDesign3, alt: '' } },
  { id: 'glass-4', image: { src: glassDesign4, alt: '' } },
  { id: 'glass-5', image: { src: glassDesign5, alt: '' } },
]

type GlassSelectorProps = {
  transitionStatus: TransitionStatus
  goToDesigner: () => void
}

const GlassSelector: FC<GlassSelectorProps> = ({ transitionStatus, goToDesigner }) => {
  const setStencilId = usePaintStore((state) => state.setStencilId)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    setStencilId(GLASS_DESIGNS[activeIndex].id)
  }, [activeIndex, setStencilId])

  useGSAP(() => {
    gsap.set(['#title *', '#carousel > *', '#select'], {
      opacity: 0,
      scale: 1.2,
    })
  }, [])

  useGSAP(() => {
    if (transitionStatus === 'entering') {
      gsap.to(['#title *', '#carousel > *', '#select'], {
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        delay: 0.25,
      })
    }

    if (transitionStatus === 'exiting') {
      gsap.to(['#title *', '#carousel > *', '#select'], {
        opacity: 0,
        stagger: (i) => -0.25,
        y: (i) => (i + 1) * 16,
      })
    }
  }, [transitionStatus])

  const handleSelectClick = () => {
    localStorage.removeItem(PAINT_ACTIONS_STORAGE_KEY)
    goToDesigner()
  }

  return (
    <div className={styles.container}>
      <PageTitle id="title" title="Paint your pint" subtitle="Choose your design" />

      <Carousel
        id="carousel"
        panels={GLASS_DESIGNS.map((design, index) => {
          return (
            <div key={'slide-' + index} className={styles.slide}>
              <Image key={'slide-' + index} src={design.image.src} alt={design.image.alt} />
            </div>
          )
        })}
        activeIndex={activeIndex}
        onIndexChanged={setActiveIndex}
        pagination
        navigation
        containerClassName={styles.carouselContainer}
      />

      <Button id="select" variant="primary" className={styles.select} onClick={handleSelectClick}>
        Select
      </Button>
    </div>
  )
}

export default GlassSelector
