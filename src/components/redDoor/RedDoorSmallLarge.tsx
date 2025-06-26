'use client'

import gsap from 'gsap'
import Flip from 'gsap/Flip'
import { type FC, type PropsWithChildren, type ReactNode, useRef } from 'react'
import { Transition } from 'react-transition-group'

import styles from './RedDoorSmallLarge.module.scss'

type Props = PropsWithChildren<{
  show: boolean
  mainContent?: ReactNode
  onDoorTransitionOut?: () => void
}>

const HIDDEN_CLIP_PATH = `inset(50% 50% 50% 50%)`

// There are 2 door videos, one small and one large
// The large one is positioned absolute and centered in the middle of the screen
// When exitig, the large image is positioned over the small image and animated to it's final position
const RedDoorSmallLargeIntro: FC<PropsWithChildren<Props>> = ({ mainContent, children, show, onDoorTransitionOut }) => {
  const container = useRef<HTMLDivElement>(null)

  const onEnter = () => {
    // Pause the videos
    // Hack for Safari to show first frame
    const smallDoor = document.getElementById('door-small') as HTMLVideoElement
    smallDoor.currentTime = 0.01
    smallDoor.pause()

    const largeDoor = document.getElementById('door-large') as HTMLVideoElement
    largeDoor.currentTime = 0.01
    largeDoor.pause()

    // Animate the door in
    gsap
      .timeline()
      .fromTo('#door-underline', { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.4 })
      .fromTo('#door-small', { opacity: 0, yPercent: 100 }, { opacity: 1, yPercent: 0, duration: 0.5 })
  }

  const onExit = () => {
    // Position the large door over the small door and then animate it to it's starting position
    const largeDoorState = Flip.getState('#door-large')
    const smallDoorState = Flip.getState('#door-small')
    Flip.fit('#door-large', smallDoorState, { absolute: true, scale: true })
    const t = Flip.to(largeDoorState, { duration: 1, absolute: true, scale: true })
    gsap.set('#door-large', { opacity: 1 })
    gsap.set('#door-small', { opacity: 0 })

    gsap
      .timeline()
      // Hide the intro content (e.g fun fact)
      .to('#intro', { duration: 0.4, opacity: 0, scale: 1.25 })
      .to('#door-underline', { opacity: 0, duration: 0.2 }, 0)
      // Start opening the door and reveal the main content
      .call(() => {
        const door = document.getElementById('door-large') as HTMLVideoElement
        door.play()
      })
      // Move the door to it's central position
      .to(t, {}, 0)
      .addLabel('reveal-content')
      .to('#main-content-wrapper', { opacity: 1, clipPath: `inset(0%)`, duration: 2 }, 'reveal-content')
      .to('#door-large', { opacity: 0, scale: 2, duration: 2 }, 'reveal-content')
      .set('#main-content-wrapper', { clipPath: `none` })
      .call(() => onDoorTransitionOut?.())
  }

  return (
    <>
      <Transition
        appear
        in={show}
        timeout={5000}
        unmountOnExit={true}
        mountOnEnter={false}
        onEnter={onEnter}
        onExit={onExit}>
        <div ref={container} className={styles.container}>
          <div className={styles.menuMask}></div>
          <div className={styles.smallDoorContainer}>
            <RedDoorVideo id="door-small" className={styles.doorSmall} />
            <div id="door-underline" />
          </div>

          <RedDoorVideo id="door-large" className={styles.doorLarge} />

          <div id="intro" className={styles.children}>
            {children}
          </div>
        </div>
      </Transition>

      <div className={styles.main} id="main-content-wrapper" style={{ opacity: 0, clipPath: HIDDEN_CLIP_PATH }}>
        {mainContent}
      </div>
    </>
  )
}

export default RedDoorSmallLargeIntro

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
