'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

import Button from '@/components/button/Button'
import LoadingSpinner from '@/components/loading/LoadingSpinner'
import PageTitle from '@/components/pageTitle/PageTitle'
import PaintedGlassCard from '@/components/paint/paintedGlassCard/PaintedGlassCard'
import useAsset from '@/hooks/useAsset'
import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'

import styles from './page.module.scss'

const SharedGlassPage = () => {
  const { push } = useRouter()
  const { contextSafe } = useGSAP()
  const { trackEvent } = useGTMEvent()
  const params = useParams()
  const { url, isLoading } = useAsset(params?.image_key ? `glasses/${params.image_key}.png` : undefined)

  useGSAP(() => {
    gsap.set('#container > *', { opacity: 0, y: 16 })

    gsap.to('#container > *', { opacity: 1, y: 0, stagger: 0.3 })
  })

  const onExit = contextSafe(() => {
    // trackEvent(EventName.PaintYourPintAndWin)
    gsap.to('#container > *', {
      opacity: 0,
      y: 0,
      stagger: -0.4,
      onComplete: () => {
        push(Pathname.Paint)
      },
    })
  })

  return (
    <main id="container" className={styles.main}>
      <PageTitle title="Paint your pint" />
      {isLoading ? (
        <LoadingSpinner
          style={{
            // @ts-ignore
            '--spinner-fill': 'white',
          }}
        />
      ) : (
        <PaintedGlassCard imageSrc={url} />
      )}
      <Button arrowRight fullWidth onClick={onExit}>
        Paint your pint and win
      </Button>
    </main>
  )
}

export default SharedGlassPage
