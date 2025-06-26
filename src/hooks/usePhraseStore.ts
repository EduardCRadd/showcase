import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DAILYPHRASES, type PhraseDef } from '@/resources/phrases'

type Store = {
  seenPhraseIds: string[]
  getPhrase: () => PhraseDef
}

function getNextPhrase(seenIds: string[]): PhraseDef {
  let phrasesToChooseFrom = DAILYPHRASES
  const unseenPhrases = DAILYPHRASES.filter(({ id }) => !seenIds.includes(id))
  if (unseenPhrases.length > 0) phrasesToChooseFrom = unseenPhrases
  const randomIndex = Math.floor(Math.random() * phrasesToChooseFrom.length)
  return phrasesToChooseFrom[randomIndex]
}

const usePhrasesStore = create(
  persist<Store>(
    (set, get) => ({
      seenPhraseIds: [],
      getPhrase: () => {
        const { seenPhraseIds } = get()
        const nextPhrase = getNextPhrase(seenPhraseIds)
        if (seenPhraseIds.includes(nextPhrase.id)) return nextPhrase
        set({ seenPhraseIds: [...seenPhraseIds, nextPhrase.id] })
        return nextPhrase
      },
    }),
    {
      name: 'phrase-store', // unique name
      // storage: 'localStorage' is used
    },
  ),
)

export default usePhrasesStore
