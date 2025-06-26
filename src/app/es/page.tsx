'use client'
import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'

import useLocaleStore from '@/hooks/useLocaleStore'
import { Locale } from '@/resources/locale'
import { Pathname } from '@/resources/pathname'

// Spanish landing page

export default function SpanishLanding() {
  const { push } = useRouter()
  const setLocale = useLocaleStore((state) => state.setLocale)

  useLayoutEffect(() => {
    setLocale(Locale.Spain)
    push(Pathname.SpanishStory)
  }, [push, setLocale])

  return null
}
