import englishJSON from '@/assets/locales/en/common.json'
import spanishJSON from '@/assets/locales/es/common.json'

import useLocale from './useLocale'

// This is a bootstrap to get the translations working
// Next 13 doesn't properly support i18n yet

export default function useTranslation() {
  const { isSpanish } = useLocale()

  const t = (key: string): string => {
    // @ts-expect-error
    if (isSpanish) return spanishJSON[key]
    // @ts-expect-error
    return englishJSON[key]
  }

  return t
}
