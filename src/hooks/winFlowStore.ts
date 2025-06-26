'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type FlowType = 'none' | 'win' | 'rateOfSale'

type WinFlowStore = {
  flowType: FlowType
  setFlowType: (flow: FlowType) => void
}

const useTicketCompetitionFlowStore = create(
  persist<WinFlowStore>(
    (set) => ({
      flowType: 'none',
      setFlowType: (flow) => set({ flowType: flow }),
    }),
    {
      name: 'ticket-competition-flow-store',
    },
  ),
)

export default useTicketCompetitionFlowStore
