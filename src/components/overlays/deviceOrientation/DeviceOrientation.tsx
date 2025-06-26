import { useReducedMotion } from '@mantine/hooks'
import gsap from 'gsap'
import Image from 'next/image'
import { type FC } from 'react'
import { Transition } from 'react-transition-group'

import device from '@/assets/images/device.png'

import styles from './DeviceOrientation.module.scss'

type Props = {
  show: boolean
}

const DeviceOrientation: FC<Props> = ({ show = false }) => {
  const reduceMotion = useReducedMotion()

  function onEnter() {
    gsap.set('#orientation-container', {
      autoAlpha: 0,
      scale: reduceMotion ? 1 : 1.2,
    })
  }

  function onEntering() {
    gsap.to('#orientation-container', {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
    })
  }

  function onExit() {
    gsap.to('#orientation-container', {
      autoAlpha: 0,
      duration: 0.2,
    })
  }

  return (
    <Transition
      in={show}
      appear={show}
      timeout={500}
      mountOnEnter={true}
      unmountOnExit={true}
      onEnter={onEnter}
      onEntering={onEntering}
      onExit={onExit}>
      <div id="orientation-container" className={styles.container}>
        <Image src={device} alt="device orientation image" quality={100} className={styles.image} />
        <span>Please view this experience in portrait mode</span>
      </div>
    </Transition>
  )
}

export default DeviceOrientation
