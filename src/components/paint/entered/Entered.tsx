import { useGSAP } from '@gsap/react'
import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { type FC, useEffect } from 'react'
import { TransitionStatus } from 'react-transition-group'

import shareIcon from '@/assets/icons/share-large.svg'
import Button from '@/components/button/Button'
import PageTitle from '@/components/pageTitle/PageTitle'
import TextContainer from '@/components/paint/textContainer/TextContainer'
import useGTMEvent from '@/hooks/useGTMEvent'
import usePaintStore from '@/hooks/usePaintStore'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'

import styles from './Entered.module.scss'

type EnteredProps = {
  transitionStatus: TransitionStatus
  imageKey: string
}

const Entered: FC<EnteredProps> = ({ transitionStatus, imageKey }) => {
  const { push } = useRouter()
  const imageSrc = usePaintStore((state) => state.getImageSrc())
  const { trackEvent } = useGTMEvent()

  const { contextSafe } = useGSAP()

  const onEnter = contextSafe(() => {
    gsap.set(['#title *', '#pint-glass, #text-container, #share, #cta'], { opacity: 0, scale: 1.2 })
  })

  const onEntering = contextSafe(() => {
    gsap.to(['#title *', '#pint-glass, #text-container, #share, #cta'], {
      opacity: 1,
      scale: 1,
      stagger: 0.2,
      delay: 0.25,
    })
  })

  const onExiting = contextSafe((onComplete?: () => void) => {
    gsap.to(['#title *', '#pint-glass, #text-container, #share, #cta'], {
      opacity: 0,
      stagger: (i) => -0.25,
      y: (i) => (i + 1) * 16,
      onComplete,
    })
  })

  useEffect(() => {
    onEnter()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (transitionStatus === 'entering') onEntering()

    if (transitionStatus === 'exiting') onExiting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transitionStatus])

  const onShareClick = async () => {
    const shareData: ShareData = {
      title: 'Paint Your Pint',
      url: `${window.location.origin}${process.env.BASE_PATH ?? ''}${Pathname.PaintGallery}/${imageKey}`,
    }

    // trackEvent(EventName.ClickShare)

    try {
      await navigator.share(shareData)
    } catch (err) {
      console.error(`Error: ${err}`)
      // console.log(`${window.location.origin}${process.env.BASE_PATH ?? ''}${Pathname.PaintGallery}/${imageKey}`)
      // window.open(`mailto:?subject=${shareData.title}&body=${shareData.url ?? ''}`, '_blank')
    }
  }

  const goToGallery = () => {
    // trackEvent(EventName.ViewGallery)
    onExiting(() => push(Pathname.PaintGallery))
  }

  if (!imageSrc) {
    push(Pathname.Paint)
    return null
  }

  return (
    <div className={styles.container}>
      <PageTitle id="title" title="Paint your pint" />

      <Image
        id="pint-glass"
        src={imageSrc}
        alt="Painted Madri Pint Glass"
        className={styles.glass}
        width={255}
        height={562}
      />

      <TextContainer id="text-container" className={classNames(styles.textContainer, 'card')}>
        <h2>
          You&apos;re <span>in!</span>
        </h2>
        <p>Your pint has been added to the gallery</p>
      </TextContainer>

      <button id="share" className={styles.share} onClick={onShareClick}>
        <span>
          <Image src={shareIcon} alt="" />
        </span>
        <span>Share</span>
      </button>

      <div id="cta" className={styles.ctaWrapper}>
        <Button arrowRight fullWidth onClick={goToGallery}>
          View Gallery
        </Button>
      </div>
    </div>
  )
}

export default Entered
