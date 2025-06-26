import {
  arrow,
  FloatingArrow,
  offset,
  Placement,
  useDismiss,
  useFloating,
  useInteractions,
  useTransitionStyles,
} from '@floating-ui/react'
import Image from 'next/image'
import React, { type FC, type PropsWithChildren, type ReactNode, useRef, useState } from 'react'

import closeIcon from '@/assets/paint/close.svg'

import styles from './Picker.module.scss'

type Props = {
  icon: ReactNode
  closeButtonPlacement?: 'top' | 'bottom'
  placement?: Placement
  show: boolean
  setShow: (show: boolean) => void
}

const Picker: FC<PropsWithChildren<Props>> = ({
  children,
  icon,
  placement = 'top',
  closeButtonPlacement = 'top',
  show,
  setShow,
}) => {
  const arrowRef = useRef(null)

  const { refs, context } = useFloating({
    open: show,
    placement: placement,
    middleware: [offset(16), arrow({ element: arrowRef })],
  })

  const dismiss = useDismiss(context, {
    outsidePress() {
      setShow(false)
      return true
    },
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss])

  const { isMounted, styles: floatingStyles } = useTransitionStyles(context, {
    common: { transformOrigin: placement === 'top-start' ? 'bottom left' : 'bottom center' },
    initial: {
      opacity: 0,
      transform: 'scale(0.8)',
    },
  })

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps({
          onClick() {
            if (isMounted) return
            setShow(true)
          },
        })}>
        {icon}
      </button>

      {isMounted && (
        <div
          ref={refs.setFloating}
          className={styles.picker}
          style={{ position: context.strategy, top: context.y ?? 0, left: context.x ?? 0, ...floatingStyles }}
          {...getFloatingProps()}>
          {closeButtonPlacement === 'top' && (
            <button
              onClick={() => {
                setShow(false)
              }}
              className={styles.close}>
              <Image src={closeIcon} alt="" />
            </button>
          )}

          {children}

          {closeButtonPlacement === 'bottom' && (
            <button
              onClick={() => {
                setShow(false)
              }}
              className={styles.close}>
              <Image src={closeIcon} alt="" />
            </button>
          )}

          <FloatingArrow ref={arrowRef} context={context} fill="white" width={20} height={10} />
        </div>
      )}
    </>
  )
}

export default Picker
