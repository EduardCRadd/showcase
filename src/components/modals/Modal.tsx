'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'

import styles from './Modal.module.scss'

type Props = PropsWithChildren<{
  show: boolean
  className?: string
  modalClassName?: string
  close: () => void
}>

const Modal: FC<Props> = ({ children, show, className, modalClassName, close }) => {
  const container = useRef<HTMLDivElement>(null)
  const modal = useRef<HTMLDivElement>(null)

  const { contextSafe } = useGSAP({ scope: container })

  const onEnter = contextSafe(() => {
    const timeline = gsap
      .timeline({ defaults: { ease: 'power2.out' } })
      .fromTo(modal.current, { opacity: 0, y: 500 }, { opacity: 1, y: 0, duration: 0.25 })
  })

  const onExit = contextSafe(() => {
    const timeline = gsap
      .timeline({ defaults: { duration: 0.15, opacity: 0, ease: 'power2.in' } })
      .to(modal.current, { y: 500 })
  })

  // Prevents SSR error
  if (typeof document === 'undefined') return null

  return createPortal(
    <Transition
      in={show}
      timeout={{ enter: 0, exit: 400 }}
      appear
      mountOnEnter
      unmountOnExit
      nodeRef={container}
      onEnter={onEnter}
      onExit={onExit}>
      <div ref={container} className={styles.modalContainer}>
        <section ref={modal} className={styles.modal}>
          {children}
        </section>
      </div>
    </Transition>,
    document.body,
  )
}

export default Modal
