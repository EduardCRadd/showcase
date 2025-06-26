import classNames from 'classnames'
import gsap from 'gsap'
import { type FC, Fragment, useEffect, useState } from 'react'

import { PlayerStatus } from '@/components/phrases/PhrasePlayer'
import { type PhraseDef } from '@/resources/phrases'
import { DARKEST_RED, GOLD } from '@/styles/colours'

import styles from './Phrase.module.scss'

export type PhraseProps = {
  phraseData: PhraseDef
  status: PlayerStatus
  isPractice: boolean // Either practice (on the Phrases page) or introduction to the app
  finishPhrase: () => void
}

export const Phrase: FC<PhraseProps> = ({ status, phraseData, isPractice, finishPhrase }) => {
  const { phrase, phonetics, definition } = phraseData
  const [clickedPhonetics, setClickedPhonetics] = useState<number[]>([])

  const phraseTextColour = isPractice ? '#fff' : DARKEST_RED

  function getAnimationElements() {
    const phraseSelector = gsap.utils.selector('#phrase-container')
    const phoneticsSelector = gsap.utils.selector('#phonetics-container')
    const phraseParts = phraseSelector('span')
    const phoneticsParts = phoneticsSelector('span')
    return { phraseParts, phoneticsParts }
  }

  useEffect(() => {
    const resetStylesAndTransitionIn = () => {
      const { phraseParts, phoneticsParts } = getAnimationElements()
      gsap.set(phraseParts, { color: phraseTextColour, opacity: 0 })
      gsap.set(phoneticsParts, { color: DARKEST_RED, opacity: 0, y: 24 })
      gsap.to([phraseParts, phoneticsParts], {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'back.out(1.8)',
        delay: 1.2,
      })
    }

    const resetState = () => {
      setClickedPhonetics([])
    }

    resetStylesAndTransitionIn()
    resetState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase])

  useEffect(() => {
    // if (status === PlayerStatus.Idle) return
    // if (status === PlayerStatus.Listening) return
    if (status === PlayerStatus.Started) {
      const animatePhraseParts = () => {
        const { phraseParts, phoneticsParts } = getAnimationElements()
        gsap.to(phraseParts, { duration: 0.3, color: GOLD, ease: 'none', stagger: 0.5 })
        gsap.to(phoneticsParts, { duration: 0.3, color: GOLD, ease: 'none', stagger: 0.5 })
      }
      animatePhraseParts()
    }
  }, [status])

  const onPhoneticClick = (syllableIndex1: number, index?: number) => {
    let syllableIndex = 0
    if (index !== undefined) {
      let countSyllablesInWords = 0
      for (let i = 0; i < index; i++) {
        if (index !== 0) {
          countSyllablesInWords += phrase[i].length
        }
      }
      syllableIndex = countSyllablesInWords + syllableIndex1
    } else {
      syllableIndex = syllableIndex1
    }
    if (clickedPhonetics.includes(syllableIndex)) return
    // Updated state, finish phrase
    const newClickedPhonetics = [...clickedPhonetics, syllableIndex]
    setClickedPhonetics(newClickedPhonetics)

    const isFinished = newClickedPhonetics.length === phonetics.length
    if (isFinished) finishPhrase()
    // Animate the clicked phonetic
    const { phraseParts, phoneticsParts } = getAnimationElements()
    gsap.to(phraseParts[syllableIndex], { duration: 0.3, color: '#d9c786', ease: 'none' })
    gsap.to(phoneticsParts[syllableIndex], { duration: 0.3, color: '#d9c786', ease: 'none' })
  }

  return (
    <div className={classNames(styles.container, isPractice && styles.border, isPractice && styles.practiseContainer)}>
      {isPractice && <span className={styles.translation}>{definition}</span>}
      <div className={styles.phrase} id="phrase-container">
        {/* TODO: Why is this not called syllables?  */}
        {phrase.map((syllables: string[], index) => {
          return (
            <div key={index}>
              {syllables.map((syllable: string, syllableIndex) => {
                return (
                  <span key={syllableIndex} id={syllable} onClick={() => onPhoneticClick(syllableIndex, index)}>
                    {syllable}
                  </span>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className={styles.phonetics} id="phonetics-container">
        {phonetics.map((phonetic: string, index) => {
          return (
            <Fragment key={index}>
              <span onClick={() => onPhoneticClick(index)}>{phonetic}</span>
              {index < phonetics.length - 1 && <div className={styles.separator}>-</div>}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
