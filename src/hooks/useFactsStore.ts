import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Fact, FACTS } from '@/resources/facts'

type Store = {
  seenFactIds: string[]
  getFact: () => Fact
}

function getNextFact(seenIds: string[]): Fact {
  let factsToChooseFrom = FACTS

  const unseenFacts = FACTS.filter(({ id }) => !seenIds.includes(id))

  if (unseenFacts.length > 0) factsToChooseFrom = unseenFacts

  const randomIndex = Math.floor(Math.random() * factsToChooseFrom.length)
  return factsToChooseFrom[randomIndex]
}

const useFactsStore = create(
  persist<Store>(
    (set, get) => ({
      seenFactIds: [],
      getFact: () => {
        const { seenFactIds } = get()
        const nextFact = getNextFact(seenFactIds)
        if (seenFactIds.includes(nextFact.id)) return nextFact
        set({ seenFactIds: [...seenFactIds, nextFact.id] })
        return nextFact
      },
    }),
    {
      name: 'facts-store', // unique name
      // storage: 'localStorage' is used
    },
  ),
)

export default useFactsStore
