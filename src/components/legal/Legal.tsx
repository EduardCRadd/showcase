import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import React, { type FC, PropsWithChildren, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { type TransitionStatus } from 'react-transition-group'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import closeIcon from '@/assets/icons/close-black.svg'

import styles from './Legal.module.scss'

type Props = {
  heading: string
  markdownFilePath: string
  transitionStatus: TransitionStatus
  dismiss: () => void
}

const Legal: FC<Props> = ({ transitionStatus, heading, markdownFilePath, dismiss }) => {
  const container = useRef<HTMLDivElement>(null)
  const [text, setText] = useState<string>('') // Markdown text

  useEffect(() => {
    async function getMarkdownText(filePath: string) {
      try {
        const pathWithBasePath = `${process.env.BASE_PATH ?? ''}${filePath}`
        const res = await fetch(pathWithBasePath)
        if (!res.ok) throw new Error()
        const text = await res.text()
        setText(text)
      } catch (error) {
        console.error(error)
        setText('**Error loading legal file**')
      }
    }
    getMarkdownText(markdownFilePath)
  }, [markdownFilePath])

  useGSAP(() => {
    if (transitionStatus === 'entered') {
      gsap.fromTo(container.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
    }
    if (transitionStatus === 'exiting') {
      gsap.to(container.current, { opacity: 0, duration: 0.3 })
    }
  }, [transitionStatus])

  return (
    <section ref={container} className={styles.container}>
      <header>
        <button onClick={dismiss}>
          <Image className={styles.close} src={closeIcon} alt="close" />
        </button>
      </header>
      <ReactMarkdown
        className={styles.markdown}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{ table: Table }}>
        {text}
      </ReactMarkdown>
    </section>
  )
}

export default Legal

const Table: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles.tableWrapper}>
      <span>{'< >'}</span>
      <div>
        <table>{children}</table>
      </div>
    </div>
  )
}
