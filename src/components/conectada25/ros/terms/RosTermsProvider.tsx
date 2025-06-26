'use client'
import { createContext, type FC, type PropsWithChildren, useContext, useState } from 'react'
import { Transition } from 'react-transition-group'

import Legal from '@/components/legal/Legal'

type ContextValue = {
  setShowTerms: (show: boolean) => void
}

const INITIAL_STATE: ContextValue = {
  setShowTerms: () => {},
}

export const Context = createContext<ContextValue>(INITIAL_STATE)

export const RosTermsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showTerms, setShowTerms] = useState(false)

  return (
    <Context.Provider value={{ setShowTerms }}>
      {children}

      <Transition in={showTerms} timeout={200} mountOnEnter unmountOnExit>
        {(transitionStatus) => (
          <Legal
            heading="Terms & Conditions"
            markdownFilePath="/ros/terms.md"
            transitionStatus={transitionStatus}
            dismiss={() => setShowTerms(false)}
          />
        )}
      </Transition>
    </Context.Provider>
  )
}

export function useRosTerms() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useRosTerms must be used within an RosTermsProvider')
  }
  return context
}
