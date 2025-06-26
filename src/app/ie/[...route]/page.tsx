'use client'
import { useRouter } from 'next/navigation'
import { useLayoutEffect } from 'react'

import useLocaleStore from '@/hooks/useLocaleStore'
import { Locale } from '@/resources/locale'

// Irish landing page

export default function IrishLanding({ params }: { params: { route: string[] } }) {
  const { push } = useRouter()
  const setLocale = useLocaleStore((state) => state.setLocale)

  useLayoutEffect(() => {
    setLocale(Locale.Ireland)
    push(`/${params.route.join('/')}`)
  }, [params.route, push, setLocale])

  return null
}
