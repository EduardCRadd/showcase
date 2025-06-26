'use client'

import '@egjs/react-flicking/dist/flicking.css'
import '@egjs/flicking-plugins/dist/flicking-plugins.css'

import { Fade } from '@egjs/flicking-plugins'
import Flicking from '@egjs/react-flicking'
import { type ChangedEvent } from '@egjs/react-flicking'
import classNames from 'classnames'
import Image from 'next/image'
import React, { type FC, type ReactNode, useEffect, useRef } from 'react'

import arrowBack from '@/assets/icons/arrow-back.svg'

import Pagination from '../pagination/Pagination'
import styles from './Carousel.module.scss'

// https://naver.github.io/egjs-flicking/docs

const SWIPE_THRESHOLD = 50 // Larger number requires more swipe to move to next slide

type Props = {
  panels: ReactNode[]
  activeIndex: number
  onIndexChanged: (index: number) => void
  pagination?: boolean
  navigation?: boolean
  id?: string
  containerClassName?: string
}

const Carousel: FC<Props> = ({
  panels,
  activeIndex = 0,
  onIndexChanged,
  pagination,
  navigation,
  id,
  containerClassName,
}) => {
  const plugins = useRef([new Fade('', 0.5)])
  const flicking = useRef<Flicking | null>(null)

  const onChanged = (e: ChangedEvent) => {
    const isUserSwipe = e.isTrusted
    onIndexChanged(e.index)
  }

  useEffect(() => {
    if (!flicking.current) return
    if (activeIndex === flicking.current.index) return
    flicking.current.moveTo(activeIndex, 400)
  }, [activeIndex])

  return (
    <div id={id} className={classNames(styles.container, containerClassName)}>
      <Flicking
        ref={flicking}
        align="center"
        plugins={plugins.current}
        circular
        panelsPerView={1.1}
        resizeOnContentsRead
        inputType={['pointer']}
        onChanged={onChanged}
        threshold={SWIPE_THRESHOLD}>
        {panels.map((panel, index) => {
          return (
            <div key={index} className="panel">
              {panel}
            </div>
          )
        })}
      </Flicking>

      {navigation && (
        <>
          <button
            className={styles.prev}
            onClick={() => {
              const prevIndex = activeIndex === 0 ? panels.length - 1 : activeIndex - 1
              flicking.current?.moveTo(prevIndex, 400)
            }}>
            <Image src={arrowBack} alt="back" />
          </button>
          <button
            className={styles.next}
            onClick={() => {
              const nextIndex = activeIndex === panels.length - 1 ? 0 : activeIndex + 1
              flicking.current?.moveTo(nextIndex, 400)
            }}>
            <Image src={arrowBack} alt="back" />
          </button>
        </>
      )}

      {pagination && <Pagination activeIndex={activeIndex} length={panels.length} className={styles.pagination} />}
    </div>
  )
}

export default Carousel
