'use client'

import { useState } from 'react'

import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import PhrasePlayer from '@/components/phrases/PhrasePlayer'
import usePhraseStore from '@/hooks/usePhraseStore'
import { type PhraseDef } from '@/resources/phrases'

import styles from './phrases.module.scss'

// G1a Phrases

export default function PhrasesPage() {
  const { overlay } = useOverlays()
  const getPhrase = usePhraseStore((state) => state.getPhrase)
  const [phrase, setPhrase] = useState<PhraseDef>(() => getPhrase())

  const onPassPhrase = () => {
    // Ensure that the next phrase is different to the current phrase
    let isSame = true
    do {
      const nextPhrase = getPhrase()
      if (nextPhrase.id !== phrase.id) {
        isSame = false
        setPhrase(nextPhrase)
      } else {
        isSame = true
      }
    } while (isSame)
  }

  if (overlay !== OverlayScreen.None) return null

  return (
    <main className={styles.main}>
      <PhrasePlayer onCompleted={onPassPhrase} isPractice={true} phrase={phrase} />
    </main>
  )
}
