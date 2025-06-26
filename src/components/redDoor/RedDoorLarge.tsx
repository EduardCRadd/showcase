'use client'

import gsap from 'gsap'
import { type FC, type PropsWithChildren, type ReactNode, useRef } from 'react'
import { Transition } from 'react-transition-group'

import styles from './RedDoorLarge.module.scss'

type Props = PropsWithChildren<{
  show: boolean
  hideDoor: () => void
  mainContent?: ReactNode
  section?: 'map' | 'pint' | 'hunt'
}>

// There are 2 door videos, one small and one large
// The large one is positioned absolute and centered in the middle of the screen
// When exitig, the large image is positioned over the small image and animated to it's final position
const RedDoorLargeIntro: FC<PropsWithChildren<Props>> = ({
  mainContent,
  children,
  show,
  hideDoor,
  section = 'pint',
}) => {
  const container = useRef<HTMLDivElement>(null)

  const onEnter = () => {
    // Pause the video
    // Hack for Safari to show first frame
    const largeDoor = document.getElementById('door-large') as HTMLVideoElement
    largeDoor.currentTime = 0.01
    largeDoor.pause()

    // Animate the door in
    gsap
      .timeline()
      .set('#main-content-wrapper', {
        maskImage: 'linear-gradient(transparent,transparent)',
      })
      .to('#door-large', { opacity: 1, scale: 1.2, duration: 0.4 })
      .call(
        () => {
          const door = document.getElementById('door-large') as HTMLVideoElement
          door.play()
        },
        undefined,
        0.4,
      )
      .addLabel('reveal-content')

      .to(
        '#main-content-wrapper',
        {
          duration: 1.5,
          opacity: 1,
        },
        'reveal-content',
      )
      .to('#main-content-wrapper', { maskImage: 'linear-gradient(black, black)', duration: 1 })
      .to('#door-large', { opacity: 0, scale: 1.3, duration: 1.6 }, 'reveal-content')
      .call(hideDoor)
  }

  return (
    <>
      <Transition appear in={show} timeout={500} unmountOnExit onEnter={onEnter}>
        <div ref={container} className={styles.container}>
          <RedDoorVideo id="door-large" className={styles.doorLarge} />
        </div>
      </Transition>

      <div className={styles.main} id="main-content-wrapper">
        {mainContent}
      </div>
    </>
  )
}

export default RedDoorLargeIntro

type VidProps = {
  id: string
  className?: string
}

const RedDoorVideo: FC<VidProps> = ({ id, className }) => {
  return (
    <video
      id={id}
      autoPlay
      muted
      playsInline
      className={className}
      preload="auto"
      poster={process.env.BASE_PATH + '/videos/red-door.jpg'}>
      <source src={process.env.BASE_PATH + '/videos/red-door.mov'} type='video/mp4; codecs="hvc1"' />
      <source src={process.env.BASE_PATH + '/videos/red-door.webm'} type="video/webm" />
    </video>
  )
}
