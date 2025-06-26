import gsap from 'gsap'
import { type FC, type PropsWithChildren, useRef } from 'react'
import { SwitchTransition, Transition } from 'react-transition-group'

import styles from './MultiScreen.module.scss'

type Props = PropsWithChildren & {
    transitionKey: string
}

const MultiScreen: FC<Props> = ({ children, transitionKey }) => {
    const container = useRef<HTMLDivElement>(null)

    const onEnter = () => {
        // gsap.to(container.current, { left: 0 }) MF: Don't animate left. Animate X transform instead.
        gsap.set(container.current, { xPercent: 100, opacity: 0 })
        gsap.to(container.current, { xPercent: 0, opacity: 1 })
    }

    const onExiting = () => {
        gsap.to(container.current, { xPercent: -100, opacity: 0, duration: 0.4, ease: 'power2.inOut' })
    }

    return (
        <SwitchTransition mode="out-in">
            <Transition
                key={transitionKey}
                appear={true}
                onEnter={onEnter}
                onExiting={onExiting}
                timeout={500}
                nodeRef={container}>
                <main ref={container} id="container" className={styles.container}>
                    {children}
                </main>
            </Transition>
        </SwitchTransition>
    )
}

export default MultiScreen
