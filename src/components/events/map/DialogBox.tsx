import { useGSAP } from '@gsap/react'
import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import React, { type FC, ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'

import arrowRight from '@/assets/icons/arrow.svg'
import closeIcon from '@/assets/icons/close-small.svg'
import LoadingSpinner from '@/components/loading/LoadingSpinner'

import styles from './DialogBox.module.scss'

type Props = {
  show: boolean
  message: string | ReactNode
  onClick: (...params: any) => any
  isLoading?: boolean
  onCloseClick: (...params: any) => any
  className?: string
  portal?: boolean
}

const DialogBox: FC<Props> = ({ show, message, onClick, isLoading, onCloseClick, className, portal }) => {
  const { contextSafe } = useGSAP()
  const dialogRef = useRef<HTMLDivElement>(null)

  const onEnter = contextSafe(() => {
    gsap.set(dialogRef.current, { opacity: 0, y: 100 })
  })

  const onEntering = contextSafe(() => {
    gsap.to(dialogRef.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' })
  })

  const onExiting = contextSafe(() => {
    gsap.to(dialogRef.current, { opacity: 0, y: 100, duration: 0.3, ease: 'power2.in' })
  })

  const dialog = (
    <Transition
      mountOnEnter
      unmountOnExit
      timeout={600}
      in={show}
      onEnter={onEnter}
      onEntering={onEntering}
      onExiting={onExiting}>
      <div ref={dialogRef} role="button" className={classNames(styles.container, className)} onClick={onClick}>
        <div className={styles.wrapper}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCloseClick(e)
            }}
            className={styles.close}>
            <span>
              <Image src={closeIcon} alt={'Close'} />
            </span>
          </button>
          {message}
          <div className={styles.arrowBtn}>{isLoading ? <LoadingSpinner /> : <Image src={arrowRight} alt={''} />}</div>
        </div>
      </div>
    </Transition>
  )

  if (typeof document === 'undefined') return null

  if (portal) return createPortal(dialog, document.body)
  else return dialog
}

export default DialogBox
