'use client'

import { _Object } from '@aws-sdk/client-s3'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useMemo, useState } from 'react'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'
import { Transition } from 'react-transition-group'

import closeIcon from '@/assets/icons/close-black.svg'
import shareIcon from '@/assets/icons/share-large.svg'
import Button from '@/components/button/Button'
import LoadingSpinner from '@/components/loading/LoadingSpinner'
import PageTitle from '@/components/pageTitle/PageTitle'
import PaintedGlassCard from '@/components/paint/paintedGlassCard/PaintedGlassCard'
import useAsset from '@/hooks/useAsset'
import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'

import styles from './page.module.scss'

const InfiniteScroller = dynamic(() => import('@/components/paint/infiniteScroller/InfiniteScroller'), {
  loading: () => <p>Loading...</p>,
})

gsap.registerPlugin(ScrollToPlugin)

export default function PintGlassGallery() {
  const { push } = useRouter()
  const { trackEvent } = useGTMEvent()

  const [show, setShow] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [focusedObject, setFocusedObject] = useState<_Object>()
  const { url: focusedUrl } = useAsset(focusedObject?.Key)

  const { contextSafe } = useGSAP()

  const fetchObjects = async ({ pageParam }: QueryFunctionContext<'glasses', any>) => {
    const res = await fetch(
      pageParam
        ? `${process.env.BASE_PATH}/api/asset/list?startFromKey=${pageParam}`
        : `${process.env.BASE_PATH}/api/asset/list`,
    )
    return res.json()
  }

  const { status, data, error, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery(
    'glasses',
    fetchObjects,
    {
      getNextPageParam: (data) => {
        return data.isTruncated ? data.contents?.[data.contents?.length - 1].Key : undefined
      },
    },
  )

  const allGlasses = useMemo(() => (data ? data.pages.flatMap((d) => d.contents) : []), [data])

  useEffect(() => {
    setShow(!!allGlasses.length)
  }, [allGlasses])

  const onEnter = contextSafe(() => {
    gsap.set('#title, #carousel > *, #action', { opacity: 0, y: 16 })
    gsap.set('#action', { opacity: 0, y: 100 })
  })

  const onEntering = contextSafe(() => {
    gsap.to('#title, #carousel > *, #action', { opacity: 1, y: 0, stagger: 0.3 })
  })

  const onExiting = contextSafe(() => {
    gsap.to('#title, #carousel > *, #action', {
      opacity: 0,
      y: 16,
      stagger: -0.15,
      onComplete: () => push(Pathname.EventsMap),
    })
  })

  const onModalEnter = contextSafe(() => {
    gsap.set('#gallery-focus ', { opacity: 0 })
    gsap.set('#gallery-focus > *', { opacity: 0, y: 16 })
  })

  const onModalEntering = contextSafe(() => {
    gsap.to('#gallery-focus, #gallery-focus > *', { opacity: 1, y: 0, stagger: 0.3 })
  })

  const onModalExiting = contextSafe(() => {
    gsap
      .timeline()
      .to(' #gallery-focus > *', {
        opacity: 0,
        y: 16,
        stagger: -0.1,
      })
      .to('#gallery-focus ', {
        opacity: 0,
        onComplete: () => setFocusedObject(undefined),
      })
  })

  const onShareClick = async (imageKey?: string) => {
    if (!imageKey) return

    const key = imageKey.split('glasses/')[1].split('.')[0]

    const shareData: ShareData = {
      title: 'Paint Your Pint',
      url: `${window.location.origin}${process.env.BASE_PATH ?? ''}${Pathname.PaintGallery}/${key}`,
    }

    // trackEvent(EventName.ClickShare)

    try {
      await navigator.share(shareData)
    } catch (err) {
      console.error(`Error: ${err}`)
      // window.open(`mailto:?subject=${shareData.title}&body=${shareData.url ?? ''}`, '_blank')
    }
  }

  const onLetsGoClick = () => {
    // trackEvent(EventName.PypLetsGo)
    setShow(false)
  }

  return (
    <main className={styles.main}>
      <Transition
        in={show}
        appear
        timeout={800}
        mountOnEnter
        unmountOnExit
        onEnter={onEnter}
        onEntering={onEntering}
        onExiting={onExiting}>
        <>
          <PageTitle id="title" title="Paint your pint" />

          <div id="carousel" className={styles.carouselContainer}>
            <h2>The gallery</h2>

            <InfiniteScroller
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onScrollToPanelComplete={(index) => {
                setFocusedObject(allGlasses[index])
                setShowModal(true)
              }}
              preventAutoScroll={!show || showModal}>
              {allGlasses.map((glass, index) => {
                return <ItemPanel key={'item-panel-' + index} item={glass} />
              })}
            </InfiniteScroller>

            <div id="action" className={styles.actionBanner}>
              <p>Explore Madrí Bars and Events</p>
              <Button arrowRight onClick={onLetsGoClick}>
                Let’s go!
              </Button>
            </div>

            <Transition
              in={showModal}
              timeout={800}
              appear
              mountOnEnter
              unmountOnExit
              onEnter={onModalEnter}
              onEntering={onModalEntering}
              onExit={onModalExiting}>
              <div id="gallery-focus" className={styles.focus}>
                <PaintedGlassCard
                  imageSrc={
                    // mockImg
                    focusedObject ? focusedUrl : ''
                  }
                />

                <button className={styles.share} onClick={() => onShareClick(focusedObject?.Key)}>
                  <span>
                    <Image src={shareIcon} alt="" />
                  </span>
                  <span>Share</span>
                </button>

                <button
                  className={styles.close}
                  onClick={() => {
                    setShowModal(false)
                  }}>
                  <Image src={closeIcon} alt="Close" />
                </button>
              </div>
            </Transition>
          </div>
        </>
      </Transition>
    </main>
  )
}

type ItemPanelProps = {
  item?: _Object
}

const ItemPanel: FC<ItemPanelProps> = ({ item }) => {
  const { url, isLoading } = useAsset(item?.Key)

  if (isLoading)
    return (
      <LoadingSpinner
        style={{
          // @ts-ignore
          '--spinner-fill': 'white',
        }}
      />
    )

  return (
    <div className={styles.scrollerItem}>
      <Image src={url} alt="Painted Madri Pint" width={130} height={300} />
    </div>
  )
}
