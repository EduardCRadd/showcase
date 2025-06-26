import React, { type FC, ReactNode } from 'react'

import styles from './PageTitle.module.scss'

type PageTitleProps = {
  title: string
  description: ReactNode
}

const PageTitle: FC<PageTitleProps> = ({ title, description }) => {
  return (
    <div className={styles.textBox}>
      <h1 id="cta" className={styles.cta}>
        {title}
      </h1>
      <p id="instructions" className={styles.instructions}>
        {description}
      </p>
    </div>
  )
}

export default PageTitle
