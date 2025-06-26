import React, { FC } from 'react'

import styles from './Switch.module.scss'

type Props = {
  checked?: boolean
  disabled?: boolean
  onChange?: () => void
}

const Switch: FC<Props> = ({ checked = false, disabled = false, onChange }) => {
  return (
    <label className={`${styles.switch} ${disabled ? styles.disabled : ''}`}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
      <span className={styles.slider} />
    </label>
  )
}

export default Switch
