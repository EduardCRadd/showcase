'use client'
import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'

import useLocaleStore from '@/hooks/useLocaleStore'
import { Locale } from '@/resources/locale'

// Irish landing page

export default function IrishLanding() {
  const { push } = useRouter()
  const setLocale = useLocaleStore((state) => state.setLocale)

  useLayoutEffect(() => {
    setLocale(Locale.Ireland)
    push('/')
  }, [push, setLocale])

  return null
}
