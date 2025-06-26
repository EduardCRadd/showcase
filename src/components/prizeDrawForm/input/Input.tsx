import classNames from 'classnames'
import { ChangeEvent, forwardRef, InputHTMLAttributes, useEffect, useState } from 'react'

import styles from './Input.module.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  value?: string
  initialValue?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => any
  checkForError?: (value: string) => string
  onErrorChange?: (error: string, id: string) => void
  errorCheckTrigger?: any
  prefix?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, type, value, onChange, checkForError, onErrorChange, errorCheckTrigger, prefix, ...props }, ref) => {
    const [error, setError] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
    }

    useEffect(() => {
      if (checkForError && !!value) {
        setError(checkForError(value))
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, errorCheckTrigger])

    useEffect(() => {
      onErrorChange?.(error, id || '')
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, id])

    return (
      <div className={styles.container}>
        <div className={classNames(styles.inputContainer, prefix && styles.withPrefix)}>
          {prefix && (
            <div className={styles.prefixWrapper}>
              <span className={styles.prefixText}>{prefix}</span>
              <span role="presentation" className={styles.prefixDivider} />
            </div>
          )}

          <input
            ref={ref}
            id={id}
            className={classNames(styles.input, !isFocused && !!error && styles.error)}
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            {...props}
          />
        </div>

        {!isFocused && error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
