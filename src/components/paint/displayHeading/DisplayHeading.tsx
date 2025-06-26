import React, { type FC } from 'react'

import styles from './DisplayHeading.module.scss'

const DisplayHeading: FC = () => {
  return (
    <div className={styles.container}>
      <p>
        Paint <span>your pint</span>
      </p>
    </div>
  )
}

export default DisplayHeading
