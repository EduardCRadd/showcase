import classNames from 'classnames'
import React, { type FC, HTMLAttributes } from 'react'

import styles from './PageTitle.module.scss'

type PageTitleProps = HTMLAttributes<HTMLDivElement> & {
  title?: string
  subtitle?: string
  className?: string
}

const PageTitle: FC<PageTitleProps> = ({ title, subtitle, className, ...props }) => {
  return (
    <div className={classNames(className, styles.container)} {...props}>
      {title && <h1>{title}</h1>}
      {subtitle && <span>{subtitle}</span>}
    </div>
  )
}

export default PageTitle
