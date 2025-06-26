import gsap from 'gsap'
import { type CSSProperties, type FC, ReactNode, useRef } from 'react'
import { Transition } from 'react-transition-group'

import styles from './Alert.module.scss'

type Props = {
  show: boolean
  label: string
  icon?: ReactNode
  bottom?: CSSProperties['bottom']
  timeout?: number
  hide: () => void
}

export const Alert: FC<Props> = ({ show, icon, bottom = '120px', label = 'You got it', timeout = 5000, hide }) => {
  const container = useRef<HTMLDivElement>(null)

  return (
    <Transition
      in={show}
      appear={true}
      timeout={500}
      mountOnEnter={true}
      unmountOnExit={true}
      nodeRef={container}
      onEnter={() => gsap.set(container.current, { opacity: 0, y: 32 })}
      onEntering={() => {
        gsap.to(container.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.4)',
          onComplete: () => {
            setTimeout(hide, timeout)
          },
        })
      }}
      onExiting={() => gsap.to(container.current, { opacity: 0, y: 32, duration: 0.2 })}>
      <div ref={container} className={styles.alert} onClick={hide} style={{ bottom }}>
        <div style={{ padding: !!icon ? '0 12px 0 2px' : '0 12px' }}>
          {icon}
          <span>{label}</span>
        </div>
      </div>
    </Transition>
  )
}
