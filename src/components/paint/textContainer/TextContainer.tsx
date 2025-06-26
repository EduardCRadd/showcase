import classNames from 'classnames'
import React, { type FC, HTMLAttributes, PropsWithChildren } from 'react'

import styles from './TextContainer.module.scss'

type TextContainerProps = HTMLAttributes<HTMLDivElement>

const TextContainer: FC<PropsWithChildren<TextContainerProps>> = ({ children, className, ...props }) => {
  return (
    <div className={classNames(styles.container, className)} {...props}>
      <span className={styles.gradient} />
      <div>{children}</div>
      <span className={styles.gradient} />
    </div>
  )
}

export default TextContainer
