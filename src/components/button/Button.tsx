'use client'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { forwardRef, HTMLAttributes, type PropsWithChildren } from 'react'

import arrow from '@/assets/icons/arrow.svg'
import arrowWhite from '@/assets/icons/arrow-white.svg'

import LoadingSpinner from '../loading/LoadingSpinner'
import styles from './Button.module.scss'

type Props = HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> & {
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
  url?: string
  type?: 'reset' | 'submit' | 'button'
  disabled?: boolean
  onClick?: () => any
  arrowRight?: boolean
  loading?: boolean
}

const VARIANT_CLASSES = {
  primary: styles.primary,
  secondary: styles.secondary,
}

const Button = forwardRef<any, PropsWithChildren<Props>>(
  (
    {
      children,
      className,
      onClick = () => {},
      url,
      fullWidth = false,
      variant = 'primary',
      type = 'button',
      arrowRight,
      loading,
      ...props
    },
    ref,
  ) => {
    const classes = classNames(styles.button, VARIANT_CLASSES[variant], fullWidth && styles.fullWidth, className)

    // Regular button
    if (!url) {
      return (
        <button ref={ref} className={classes} type={type} {...props} onClick={onClick}>
          {children}
          {loading ? (
            <LoadingSpinner className={styles.icon} />
          ) : arrowRight ? (
            <Image src={variant === 'primary' ? arrow : arrowWhite} alt="arrow" className={styles.icon} width={32} />
          ) : null}
        </button>
      )
    }

    // External link
    const isExternalLink = url ? url.indexOf('://') > 0 || url.indexOf('//') === 0 : false

    if (isExternalLink) {
      return (
        <a ref={ref} href={url} className={classes} target="_blank" rel="noreferrer" {...props} onClick={onClick}>
          {children}
          {loading ? (
            <LoadingSpinner className={styles.icon} />
          ) : arrowRight ? (
            <Image src={variant === 'primary' ? arrow : arrowWhite} alt="arrow" className={styles.icon} width={32} />
          ) : null}
        </a>
      )
    }

    // Internal link
    return (
      <Link ref={ref} href={url ?? ''} className={classes} passHref={true} {...props} onClick={onClick}>
        {children}
        {loading ? (
          <LoadingSpinner className={styles.icon} />
        ) : arrowRight ? (
          <Image src={variant === 'primary' ? arrow : arrowWhite} alt="arrow" className={styles.icon} width={32} />
        ) : null}
      </Link>
    )
  },
)

Button.displayName = 'Button'
export default Button
