'use client'
import { _Object } from '@aws-sdk/client-s3'
import { useGSAP } from '@gsap/react'
import { useIdle } from '@mantine/hooks'
import { useVirtualizer } from '@tanstack/react-virtual'
import classNames from 'classnames'
import gsap from 'gsap'
import React, { Children, type FC, type PropsWithChildren, useEffect, useRef } from 'react'

import styles from './InfiniteScroller.module.scss'

const win = typeof window !== 'undefined' ? window : { innerWidth: 0, innerHeight: 0 }

const PANEL_WIDTH_PERCENT = 0.55
const PADDING = ((1 - PANEL_WIDTH_PERCENT) * win.innerWidth) / 2
const PANEL_WIDTH = PANEL_WIDTH_PERCENT * win.innerWidth

type InfiniteScrollerProps = {
  hasNextPage?: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  preventAutoScroll?: boolean
  onScrollToPanelComplete?: (index: number) => any
}

const InfiniteScroller: FC<PropsWithChildren<InfiniteScrollerProps>> = ({
  children,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  preventAutoScroll,
  onScrollToPanelComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<GSAPTween>()

  const { contextSafe } = useGSAP()

  const items = Children.toArray(children)

  const scrollerVirtualizer = useVirtualizer({
    count: hasNextPage ? items.length + 1 : items.length,
    getScrollElement: () => scrollerRef.current,
    estimateSize: () => PANEL_WIDTH,
    overscan: 5,
    horizontal: true,
  })

  // Load more items when nearing the end
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isFetchingNextPage) return

    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget

    const shouldFetchMoreItems = scrollLeft + clientWidth * 2 >= scrollWidth

    if (shouldFetchMoreItems && hasNextPage) {
      fetchNextPage()
    }
  }

  const startAutoScroll = contextSafe((delay?: number) => {
    if (!viewportRef.current || !scrollerRef.current) return

    const maxScrollValue = viewportRef.current.clientWidth
    const currentScrollValue = scrollerRef.current.scrollLeft
    const remainingDistanceToScroll = maxScrollValue - currentScrollValue

    const duration = (remainingDistanceToScroll / 300) * 6 // 6 sec for every 300px

    autoScrollRef.current?.kill()
    autoScrollRef.current = gsap.to(scrollerRef.current, {
      scrollTo: { x: maxScrollValue },
      duration,
      ease: 'none',
      delay,
      onComplete: () => {
        hasNextPage && startAutoScroll()
      },
    })
  })

  const stopAutoScroll = contextSafe(() => {
    autoScrollRef.current?.kill()
    autoScrollRef.current = undefined
  })

  const isIdle = useIdle(3000)

  useEffect(() => {
    if (preventAutoScroll || !isIdle || autoScrollRef.current) return

    startAutoScroll(2)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preventAutoScroll, isIdle])

  const handlePanelClick = contextSafe((index: number, start: number) => {
    stopAutoScroll()

    gsap.to(scrollerRef.current, {
      scrollTo: {
        x: start,
      },
      ease: 'back.inOut(1.6)',
      duration: 1,
      onComplete: () => {
        onScrollToPanelComplete?.(index)
      },
    })
  })

  return (
    <div
      className={classNames(styles.infiniteScroller, 'hide-scrollbar')}
      ref={scrollerRef}
      onScroll={handleScroll}
      style={{
        width: win.innerWidth,
      }}
      onPointerOver={stopAutoScroll}>
      <div
        ref={viewportRef}
        className={styles.viewport}
        style={{
          width: `${scrollerVirtualizer.getTotalSize() + PADDING * 2}px`,
        }}>
        {scrollerVirtualizer.getVirtualItems().map(({ index, start, size }) => {
          const isLoaderRow = index > items.length - 1
          const item = items[index]

          return (
            <div
              id={'panel-' + index}
              key={index}
              className={styles.panel}
              style={{
                left: start + PADDING,
                width: PANEL_WIDTH,
              }}
              onClick={() => {
                if (!!item) {
                  handlePanelClick(index, start)
                }
              }}>
              {isLoaderRow ? (hasNextPage ? 'Loading more...' : 'Nothing more to load') : item}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default InfiniteScroller
