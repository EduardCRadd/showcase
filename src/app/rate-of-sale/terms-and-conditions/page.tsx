'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Transition } from 'react-transition-group'

import Legal from '@/components/legal/Legal'

function TermsAndConditionsPage() {
  const router = useRouter()
  return (
    <main>
      <Transition in={true} timeout={200} mountOnEnter unmountOnExit>
        {(transitionStatus) => (
          <Legal
            heading="Terms & Conditions"
            markdownFilePath="/ros/terms.md"
            transitionStatus={transitionStatus}
            dismiss={() => {
              router.back()
            }}
          />
        )}
      </Transition>
    </main>
  )
}

export default TermsAndConditionsPage
