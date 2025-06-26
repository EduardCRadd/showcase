import classNames from 'classnames'
import React, { FC } from 'react'

import styles from './Pagination.module.scss'

type PaginationProps = {
  length: number
  activeIndex: number
  className?: string
}

const Pagination: FC<PaginationProps> = ({ length, activeIndex, className }) => {
  return (
    <div className={classNames(className, styles.pagination)}>
      {[...Array(length)].map((_, index) => (
        <div key={index} className={classNames(activeIndex === index ? styles.active : '')} />
      ))}
    </div>
  )
}

export default Pagination
