import classNames from 'classnames'
import gsap from 'gsap'
import Image from 'next/image'
import { type FC, useEffect, useRef, useState } from 'react'

import microphone from '@/assets/icons/microphone.svg'
import completedMicrophone from '@/assets/icons/microphone-completed.svg'
import microphoneDisabled from '@/assets/icons/microphone-disabled.svg'
import alertIcon from '@/assets/icons/phrase-unlocked.svg'
import soundwave from '@/assets/icons/soundwave.svg'
import { Alert } from '@/components/alert/Alert'
import { PlayerStatus } from '@/components/phrases/PhrasePlayer'
import useGTMEvent from '@/hooks/useGTMEvent'
import { EventName } from '@/resources/analytics'

import styles from './Microphone.module.scss'

export type MicrophoneProps = {
  status: PlayerStatus
  isPractice?: boolean
  startListening: () => void
  startPhrase: () => void
  finishPhrase: () => void
  cardName?: string
}

type SpeechRecognition = any

export const Microphone: FC<MicrophoneProps> = ({
  startListening,
  startPhrase,
  finishPhrase,
  status,
  isPractice,
  cardName,
}) => {
  const [recognition, setRecognition] = useState<undefined | SpeechRecognition>()
  const [isDisabled, setIsDisabled] = useState(false)
  const { trackEvent } = useGTMEvent()
  const [audioStream, setAudioStream] = useState<MediaStream | undefined>(undefined)

  const isRecognising = useRef(false)

  useEffect(() => {
    //@ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognitionInstance = SpeechRecognition ? new SpeechRecognition() : undefined
    setRecognition(recognitionInstance)
  }, [])

  useEffect(() => {
    if (status === PlayerStatus.Started) return
    gsap.to('.mic-pulse', {
      opacity: 0,
      scale: 1.4,
      stagger: 0.4,
      duration: 1.2,
      repeat: -1,
    })
  }, [status])

  useEffect(() => {
    // Stop the stream when status is finished
    if (status === PlayerStatus.Finished && !!audioStream) {
      audioStream.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }, [audioStream, status])

  const finishAferDelay = () => {
    startPhrase()
    setTimeout(() => {
      finishPhrase()
    }, 3000)
  }

  const start = async () => {
    if (status === PlayerStatus.Started) return

    startListening() // Set the status to started

    const handleRecognitionAudio = () => {
      recognition.lang = 'en-US'
      recognition.continuous = true
      recognition.onsoundstart = () => {
        isRecognising.current = true
        startPhrase()
        finishAferDelay()
      }
      recognition.onsoundend = () => {
        isRecognising.current = false
        recognition.stop()
        finishPhrase()
      }
      recognition.start()

      // If recognition hasn't started after 2 seconds, cleanup and finish the phrase
      setTimeout(() => {
        if (isRecognising.current === true) return
        recognition.stop()
        finishAferDelay()
      }, 2000)
    }

    const handleAudioStream = (stream: MediaStream) => {
      if (!!recognition) handleRecognitionAudio()
      else finishAferDelay()
      setAudioStream(stream)
    }

    await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(handleAudioStream)
      .catch((err) => {
        console.error('Error getting audio stream', err)
        setIsDisabled(true)
      })
  }

  const onMicrophoneClick = () => {
    start()
    trackEvent({ event: EventName.TapToSpeak, cardName: cardName })
  }

  const showInstruction = status === PlayerStatus.Idle && !isDisabled
  const showPulses = status === PlayerStatus.Listening || status === PlayerStatus.Started
  const isFinished = status === PlayerStatus.Finished

  const icon = isDisabled ? (
    <Image src={microphoneDisabled} alt="disabled" />
  ) : status === PlayerStatus.Idle ? (
    <Image src={microphone} alt="ready" />
  ) : status === PlayerStatus.Finished ? (
    <Image src={completedMicrophone} alt="completed" />
  ) : (
    <Image src={soundwave} alt="listening" />
  )

  return (
    <div className={styles.wrapper}>
      {showPulses && (
        <>
          <div className={`${styles.pulse} mic-pulse`} />
          <div className={`${styles.pulse} mic-pulse`} />
        </>
      )}

      <div
        id="microphone"
        className={classNames(styles.icon, isFinished && !isPractice && styles.iconHidden)}
        onClick={onMicrophoneClick}>
        {icon}
      </div>

      {isFinished && !isPractice && (
        <Alert
          bottom={'20vh'}
          hide={() => {}}
          show={true}
          label="You got it!"
          icon={<Image src={alertIcon} alt="unlocked" width={32} height={32} />}
        />
      )}

      {showInstruction && (
        <div className={classNames(styles.instruction, isFinished && styles.instructionHidden)} id="tap-to-speak">
          Tap to speak
        </div>
      )}
    </div>
  )
}
