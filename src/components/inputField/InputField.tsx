import classNames from "classnames";
import gsap from "gsap";
import { type ChangeEvent, type FC, useEffect, useRef } from "react";

import styles from "./InputField.module.scss";

type LargeInputType = {
    label?: string,
    type?: string,
    value: string,
    placeholder: string,
    className?: string,
    id?: string,
    error?: string | undefined,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const LargeInput: FC<LargeInputType> = ({ label, type = "", placeholder, className = "", error, onChange }) => {
    return (
        <div className={classNames(styles.largeInputContainer, className)}>
            <label>{label}</label>
            <input type={type} placeholder={placeholder} onChange={onChange} />
            {error ? <div className={styles.error}>{error}</div> : null}
        </div>
    )
}

export const InlineInput: FC<LargeInputType> = ({ type = "", value = "", placeholder, className = "", onChange, error }) => {
    const inputField = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (error)
            gsap.to(inputField.current, { x: '+=20', yoyo: true, repeat: 5, duration: 0.1 })
    }, [error])

    return (
        <input
            className={classNames(styles.inlineInputContainer, className)}
            ref={inputField}
            value={value}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
        />
    )
}