'use client'
import gsap from 'gsap'
import { type FC, useEffect, useState } from 'react'

import { Microphone } from '@/components/microphone/Microphone'
import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'
import { PhraseDef } from '@/resources/phrases'

import { Phrase } from './phrase/Phrase'
import styles from './PhrasePlayer.module.scss'

type Props = {
  isPractice: boolean
  phrase: PhraseDef
  onCompleted: () => void
}

export enum PlayerStatus {
  Idle = 'idle',
  Listening = 'listening',
  Started = 'started',
  Finished = 'finished',
  Restarted = 'restarted',
  Disabled = 'disabled',
}

const PhrasePlayer: FC<Props> = ({ isPractice, phrase, onCompleted }) => {
  const { trackEvent } = useGTMEvent()
  const [status, setStatus] = useState<PlayerStatus>(PlayerStatus.Idle)

  const cardName = phrase.phrase
    .map((wordArray) => wordArray.join(''))
    .join(' ')
    .toLowerCase()

  useEffect(() => {
    const resetStyles = () => {
      const selector = gsap.utils.selector('#player-container')
      const mic = selector('#microphone')
      const tapToSpeak = selector('#tap-to-speak')
      const helpText = selector('p')
      gsap.set(mic, { opacity: 0, y: 24, rotate: 400, scale: 0.3 })
      gsap.set([helpText], { opacity: 0, y: 24 })
      gsap.set([tapToSpeak], { opacity: 0, y: -4 })

      gsap
        .timeline()
        .to(helpText, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'back.out(1.5)',
          stagger: 0.1,
          delay: 1,
        })

        .to(mic, {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.5)',
        })
        .to(tapToSpeak, {
          opacity: 1,
          y: 0,
          duration: 1.7,
          ease: 'back.out(1.5)',
          delay: 0.3,
        })
    }
    resetStyles()
  }, [phrase])

  const startListening = () => {
    setStatus(PlayerStatus.Listening)
  }

  const startPhrase = () => {
    setStatus(PlayerStatus.Started)
  }

  const finish = () => {
    setStatus(PlayerStatus.Finished)

    trackEvent({ event: EventName.SubmitRecording, cardName })

    setTimeout(() => {
      onCompleted()
      isPractice && setStatus(PlayerStatus.Idle)
    }, 2000)
  }

  const refreshPhrase = () => {
    onCompleted()
    setStatus(PlayerStatus.Idle)
  }

  return (
    <div id="player-container" className={styles.container}>
      <p>{isPractice ? 'Practise your Spanish' : 'TO ENTER, SAY'}</p>
      <div className={styles.phraseWrapper}>
        <Phrase status={status} isPractice={isPractice} phraseData={phrase} finishPhrase={finish} />
        {!isPractice && <p className={styles.definition}>{phrase.explanation}</p>}
      </div>
      <Microphone
        status={status}
        isPractice={isPractice}
        startListening={startListening}
        startPhrase={startPhrase}
        finishPhrase={finish}
        cardName={cardName}
      />
      {!isPractice && <p className={styles.helpText}>or tap the syllables above to enter</p>}
      {isPractice && (
        <p className={styles.helpText} onClick={refreshPhrase}>
          Refresh
        </p>
      )}
    </div>
  )
}

export default PhrasePlayer
