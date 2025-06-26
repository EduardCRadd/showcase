import classNames from 'classnames'
import { forwardRef, type InputHTMLAttributes } from 'react'

import styles from './DateInput.module.scss'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean
}

const DateInput = forwardRef<HTMLInputElement, Props>(({ className, error = false, ...props }, ref) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <input ref={ref} className={classNames(styles.input, error && styles.error, className)} {...props} />
    </div>
  )
})

DateInput.displayName = 'DateInput'

export default DateInput
