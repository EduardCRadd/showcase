import classNames from 'classnames'
import { type FC } from 'react'

import useGTMEvent from '@/hooks/useGTMEvent'
import useLocale from '@/hooks/useLocale'
import useTranslation from '@/hooks/useTranslation'
import { EventName } from '@/resources/analytics'
import { LINKS } from '@/resources/footerLinks'
import { Locale } from '@/resources/locale'

import styles from './FooterLinks.module.scss'

type Props = {
  className?: string
}

const FooterLinks: FC<Props> = ({ className }) => {
  const { trackEvent } = useGTMEvent()
  const t = useTranslation()
  const { locale } = useLocale()
  const localLinks = LINKS[locale ?? Locale.UK]

  const onCookieSettingsClick = () => {
    window?.truste?.eu.reopenBanner()
    trackEvent({ event: EventName.TapFooterOptions, footerCategory: 'cookie-settings' })
  }

  return (
    <div className={classNames(styles.container, className)}>
      <p>
        {localLinks.map(({ link, translationKey }, idx) => {
          return (
            <span key={idx}>
              <a
                href={link}
                onClick={() => trackEvent({ event: EventName.TapFooterOptions, footerCategory: translationKey })}
                target="_blank"
                className={styles.link}>
                {t(translationKey)}
              </a>
              {'|'}
            </span>
          )
        })}

        {/* @ts-ignore */}
        <button onClick={onCookieSettingsClick} className={styles.link}>
          Cookie settings
        </button>

        <br />
        {t('brewed-in-the-uk')}
        <br />
        {t('copyright')}
      </p>
    </div>
  )
}

export default FooterLinks
