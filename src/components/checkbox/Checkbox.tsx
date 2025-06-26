import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import { ChangeEvent, type FC, ReactNode, useEffect, useRef } from 'react'

import Tick from '@/assets/icons/tick-white.svg'

import styles from './Checkbox.module.scss'

type CheckBoxType = {
  id?: string
  name: string
  label: string | ReactNode
  isChecked?: boolean
  className?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
}

const CheckBox: FC<CheckBoxType> = ({ id = '', name, label, isChecked, className, onChange, error, required }) => {
  const inputField = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (error) gsap.to(inputField.current, { x: '+=20', yoyo: true, repeat: 5, duration: 0.1 })
  }, [id, error])

  return (
    <div ref={inputField} className={classNames(styles.checkBoxContainer, className)} id={id}>
      <div
        style={{
          background: isChecked ? '#d9c786' : 'rgba(0, 0, 0, 0.05)',
          border: '1px solid #d9c786',
        }}>
        <input type="checkbox" checked={isChecked} onChange={onChange} id={name} required={required} />
        {isChecked ? <Image src={Tick} alt="Madri checkbox" /> : null}
      </div>
      <label htmlFor={name}>{label}</label>
    </div>
  )
}

export default CheckBox
