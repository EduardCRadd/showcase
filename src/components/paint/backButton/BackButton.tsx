import classNames from 'classnames'
import Image from 'next/image'
import React, { FC, HTMLAttributes } from 'react'

import arrowBack from '@/assets/icons/arrow-back.svg'

import styles from './BackButton.module.scss'

const BackButton: FC<HTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
  return (
    <button id="back" className={classNames(styles.back, className)} {...props}>
      <Image src={arrowBack} alt="Back" />
    </button>
  )
}

export default BackButton
