// import useAmplitudeEvent from "@/hooks/useAmplitudeEvent";
// import { EventName } from "@/resources/analytics";
import Image from 'next/image'
import { type FC, useEffect, useMemo, useRef } from 'react'

import drinkAware from '@/assets/icons/drinkaware.svg'
import drinkAwareIE from '@/assets/icons/drinkaware-ie.svg'
import useLocale from '@/hooks/useLocale'
import useTranslation from '@/hooks/useTranslation'

import styles from './TooYoung.module.scss'

type Props = {}

const TooYoung: FC<Props> = () => {
  const t = useTranslation()
  const container = useRef<HTMLDivElement>(null)
  const { isIrish, isSpanish } = useLocale()

  const redirectUrl = useMemo(() => {
    if (isIrish) return 'drinkaware.ie'
    if (isSpanish) return ''
    return 'drinkaware.co.uk'
  }, [isIrish, isSpanish])

  useEffect(() => {
    if (!redirectUrl) return
    const timeout = setTimeout(() => {
      window.location.replace(`https://www.${redirectUrl}/`)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [redirectUrl])

  return (
    <div ref={container} className={styles.container}>
      <p>
        {t('legal-drinking-age')}
        {!isSpanish && (
          <>
            You are now being redirected to{' '}
            <a href={`https://www.${redirectUrl}/`} target="_blank" rel="noreferrer">
              <u>{redirectUrl}</u>
            </a>
          </>
        )}
      </p>
      {!isSpanish && (
        <Image
          src={!isIrish ? drinkAware : drinkAwareIE}
          alt="Drink aware logo"
          priority={true}
          loading="eager"
          quality={100}
          className={styles.drinkAware}
        />
      )}
    </div>
  )
}

export default TooYoung
