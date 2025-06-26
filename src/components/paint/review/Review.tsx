import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRouter } from 'next/navigation'
import React, { type FC, useEffect, useState } from 'react'
import { TransitionStatus } from 'react-transition-group'

import Button from '@/components/button/Button'
import PageTitle from '@/components/pageTitle/PageTitle'
import useGTMEvent from '@/hooks/useGTMEvent'
import usePaintStore from '@/hooks/usePaintStore'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'
import { generateUID } from '@/utils/generateUID'

import PaintedGlassCard from '../paintedGlassCard/PaintedGlassCard'
import styles from './Review.module.scss'

type ReviewProps = {
  transitionStatus: TransitionStatus
  goToDesigner: () => void
  goToEntered: (imageKey: string) => void
}

const Review: FC<ReviewProps> = ({ transitionStatus, goToDesigner, goToEntered }) => {
  const { push } = useRouter()
  const { contextSafe } = useGSAP()
  const { trackEvent } = useGTMEvent()
  const imageSrc = usePaintStore((state) => state.getImageSrc())
  const imageFile = usePaintStore((state) => state.imageFile)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onEnter = contextSafe(() => {
    gsap.set('#review > *, #review button', { opacity: 0, scale: 1.2 })
  })

  const onEntering = contextSafe(() => {
    gsap.to('#review > *, #review button', { opacity: 1, scale: 1, stagger: 0.2, delay: 0.25 })
  })

  const onExiting = contextSafe((onComplete?: () => void) => {
    gsap.to('#review > *, #review button', { opacity: 0, stagger: (i) => -0.25, y: (i) => (i + 1) * 16, onComplete })
  })

  useEffect(() => {
    onEnter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (transitionStatus === 'entering') {
      onEntering()
    }

    if (transitionStatus === 'exiting') {
      onExiting()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionStatus])

  if (!imageSrc || !imageFile) {
    push(Pathname.PaintDesigner)
    return null
  }

  const saveImageInBucket = async () => {
    setError('')

    setIsSubmitting(true)

    try {
      const fileKey = (new Date('9999-12-31T23:59:59.999Z').getTime() - Date.now()).toString() + '-' + generateUID(4)
      const filePath = 'glasses/' + fileKey + '.png'
      const file = new File([imageFile], fileKey, { type: imageFile.type })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileKey', filePath)

      const response = await fetch(`${process.env.BASE_PATH}/api/asset`, { method: 'POST', body: formData })
      const { url } = await response.json()

      if (url) goToEntered(fileKey)
      else setError('An error occurred')
    } catch (error: any) {
      console.error(error)
      if (error?.error) setError(error.error)
      else setError('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSaveAndSubmit = () => {
    // trackEvent(EventName.ClickSaveAndSubmit)
    saveImageInBucket()
  }

  return (
    <div id="review" className={styles.container}>
      <PageTitle title="Paint your pint" subtitle="Review your design" />
      <PaintedGlassCard imageSrc={imageSrc} />
      <div className={styles.actions}>
        <Button onClick={goToDesigner}>Back</Button>
        <Button arrowRight fullWidth onClick={onSaveAndSubmit} loading={isSubmitting}>
          Save and submit
          {!!error && <p className={styles.error}>{error}</p>}
        </Button>
      </div>
    </div>
  )
}

export default Review
