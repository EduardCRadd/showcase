import { Locale } from '../resources/locale'
import useLocaleStore from './useLocaleStore'

const useLocale = () => {
  const locale = useLocaleStore((state) => state.locale)
  const isSpanish = locale === Locale.Spain
  const isIrish = locale === Locale.Ireland
  return { locale, isIrish, isSpanish }
}

export default useLocale
