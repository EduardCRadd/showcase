'use client'

import { usePathname, useRouter } from 'next/navigation'
import { type ChangeEvent, type FC, useEffect, useState } from 'react'

import useLocale from '@/hooks/useLocale'
import useTranslation from '@/hooks/useTranslation'
import { Locale } from '@/resources/locale'
import { Pathname } from '@/resources/pathname'

import styles from './ViewToggle.module.scss'

const ViewToggle: FC = () => {
  const { locale } = useLocale()
  const pathname = usePathname()
  const { push } = useRouter()
  const t = useTranslation()

  const [isMap, setIsMap] = useState<boolean>(true)
  const listPathname = locale === Locale.Spain ? Pathname.SpanishEventsList : Pathname.EventsList
  const mapPathname = locale === Locale.Spain ? Pathname.SpanishEventsMap : Pathname.EventsMap

  useEffect(() => {
    setIsMap(!pathname.includes(listPathname))
  }, [listPathname, pathname])

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsMap(!isMap)
    if (isMap) push(listPathname)
    else push(mapPathname)
  }

  return (
    <label className={styles.switch}>
      <input type="checkbox" checked={!isMap} className={styles.input} onChange={onChange} />

      <div className={styles.labels}>
        <span>{t('map')}</span>
        <span>Events</span>
      </div>

      <span className={styles.slider}>{isMap ? t('map') : 'Events'}</span>
    </label>
  )
}

export default ViewToggle
