import classNames from 'classnames'
import React, { type FC } from 'react'

import styles from './ZigZagCircle.module.scss'

type ZigZagCircleProps = {
  id?: string
  onClick?: () => void
  overline?: string
  label?: string
  className?: string
}
const ZigZagCircle: FC<ZigZagCircleProps> = ({ id, onClick, overline, label, className }) => {
  return (
    <button id={id} className={classNames(styles.prizesSticker, className)} onClick={onClick}>
      <span role="presentation" className={styles.mask} />
      <span className={styles.label}>
        {overline && <span>{overline}</span>}
        {label && <span>{label}</span>}
      </span>
    </button>
  )
}

export default ZigZagCircle
