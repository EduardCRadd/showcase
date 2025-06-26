'use client'

import classNames from 'classnames'
import { Entry } from 'contentful'
import { format } from 'date-fns'
import gsap from 'gsap'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { type FC, useRef } from 'react'
import { Transition } from 'react-transition-group'
import { getDirectionsUrl } from 'src/utils/helpers'

import arrowBack from '@/assets/icons/arrow-back.svg'
import Button from '@/components/button/Button'
import useLocale from '@/hooks/useLocale'
import { PreciseLoc } from '@/hooks/useMapStore'
import { MadriEvent } from '@/model/map'
import { Pathname } from '@/resources/pathname'

import styles from './EventInfo.module.scss'

type Props = {
  event: Entry<MadriEvent> | undefined
  className?: string
  preciseLoc?: PreciseLoc
  canGoBack?: boolean
}

const EventInfo: FC<Props> = ({ event, className, preciseLoc, canGoBack }) => {
  const { push } = useRouter()
  const { locale } = useLocale()

  const container = useRef<HTMLDivElement>(null)

  const { name, date, image, description, location, venue } = event?.fields || {}
  const imageSrc = image?.fields.file.url ? 'https:' + image?.fields.file.url : ''
  const { width, height } = image?.fields.file.details.image || {}

  const onEnter = () => {
    const selector = gsap.utils.selector(container.current)
    const elements = selector('button, img, span, h1, p, a')
    gsap.set(elements, {
      opacity: 0,
      y: 24,
    })
  }

  const onEntering = () => {
    const selector = gsap.utils.selector(container.current)
    const elements = selector('button, img, span, h1, p, a')
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger: 0.15,
    })
  }

  const onBackClick = () => {
    gsap.to(container.current, {
      opacity: 0,
      y: 24,
      duration: 0.3,
      onComplete: () => {
        push(Pathname.EventsMap)
      },
    })
  }

  const show = Boolean(event?.fields)

  const directionsUrl = getDirectionsUrl({
    locale,
    location,
    venue,
    preciseLoc,
  })

  return (
    <Transition
      timeout={600}
      in={show}
      appear={show}
      mountOnEnter
      unmountOnExit
      nodeRef={container}
      onEnter={onEnter}
      onEntering={onEntering}>
      <div ref={container} className={classNames(styles.container, className)}>
        {imageSrc && <Image src={imageSrc} alt={image?.fields.description || ''} width={width} height={height} />}
        {date && <span>{format(new Date(date), 'EE MMM d')}</span>}
        {name && <h1>{name}</h1>}
        {description && (
          <>
            {description.split('<br/>').map((paragraph, index) => {
              return <p key={'p-' + index}>{paragraph}</p>
            })}
          </>
        )}

        <Button variant="primary" url={directionsUrl} arrowRight>
          Get Directions
        </Button>

        {canGoBack && (
          <button className={styles.backBtn} onClick={onBackClick}>
            <Image src={arrowBack} alt="back" />
          </button>
        )}
      </div>
    </Transition>
  )
}

export default EventInfo
