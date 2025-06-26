import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { type FC } from 'react'
import { Transition } from 'react-transition-group'

import instagram from '@/assets/icons/instagram.svg'
import spotify from '@/assets/icons/spotify.svg'
import drinkAware from '@/assets/images/drinkAware.png'
import drinkAwareIe from '@/assets/images/drinkAwareIe.png'
import { Footer } from '@/components/footer/Footer'
import FooterLinks from '@/components/footerLinks/FooterLinks'
import useAnalyticsEvent from '@/hooks/useAnalyticsEvent'
import useLocale from '@/hooks/useLocale'
import useTranslation from '@/hooks/useTranslation'
import useTicketCompetitionFlowStore from '@/hooks/winFlowStore'
import { EventName } from '@/resources/analytics'
import { Locale } from '@/resources/locale'
import { Pathname } from '@/resources/pathname'

import styles from './Menu.module.scss'

const PATHNAMES_WITH_TICKETS_LINK = [Pathname.RateOfSale, Pathname.Win]

type MenuLink = {
  text: string
  link: string
  hideInSpanishVersion?: boolean
  eventName: EventName
  notification: boolean
}

type Props = {
  isOpen: boolean
  close: () => void
}

const Menu: FC<Props> = ({ isOpen, close }) => {
  const { push } = useRouter()
  const t = useTranslation()
  const { isIrish, isSpanish } = useLocale()
  const logAnalyticsEvent = useAnalyticsEvent()

  const pathname = usePathname()

  const winTicketsLink = {
    text: 'Win Festival Tickets',
    link: pathname, // This will essentially just close the menu keeping them on either /win or /rate-of-sale
    hideInSpanishVersion: true,
    eventName: EventName.TapMenuOption,
    notification: false,
  }

  const paintYourPintLink = {
    text: 'Paint Your Pint',
    link: Pathname.PaintDesigner,
    hideInSpanishVersion: true,
    eventName: EventName.TapMenuOption,
    notification: false,
  }

  const coreMenuLinks: MenuLink[] = [
    {
      text: t('madri-near-you'),
      link: Pathname.EventsMap,
      eventName: EventName.TapMenuOption,
      notification: false,
    },
    {
      text: 'Learn Spanish',
      link: Pathname.Phrases,
      hideInSpanishVersion: true,
      eventName: EventName.TapMenuOption,
      notification: false,
    },
    {
      text: 'Try Madrí 0.0% on us',
      link: Pathname.Landing,
      hideInSpanishVersion: true,
      eventName: EventName.TapMenuOption,
      notification: false,
    },
    {
      text: t('our-story'),
      link: Pathname.Story,
      eventName: EventName.TapMenuOption,
      notification: false,
    },
  ]

  const flowType = useTicketCompetitionFlowStore((s) => s.flowType)
  const hasFlow = flowType === 'win' || flowType === 'rateOfSale'

  const shouldShowWinTicketsLink = PATHNAMES_WITH_TICKETS_LINK.includes(pathname as Pathname) || hasFlow
  // Insert either win tickets or paint your pint link at index 2
  const menuLinks = shouldShowWinTicketsLink
    ? [...coreMenuLinks.slice(0, 2), winTicketsLink, ...coreMenuLinks.slice(2)]
    : [...coreMenuLinks.slice(0, 2), paintYourPintLink, ...coreMenuLinks.slice(2)]

  const onEnter = () => {
    const selector = gsap.utils.selector('#menu-wrapper')
    const links = selector('li')
    const elements = selector('img, p')

    gsap.set('#menu-wrapper', { opacity: 0 })
    gsap.set(links, {
      opacity: 0,
      y: 32,
    })
    gsap.set(elements, {
      opacity: 0,
      y: 16,
    })
  }

  const onEntering = () => {
    const selector = gsap.utils.selector('#menu-wrapper')
    const links = selector('li')
    const elements = selector('img, p')

    gsap
      .timeline()
      .to('#menu-wrapper', { opacity: 1, duration: 0.2 })
      .to(links, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.55,
        ease: 'back.out(1.8)',
      })
      .to(
        elements,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: -0.1,
        },
        0,
      )
  }

  const onExit = () => {
    gsap.to('#menu-wrapper', { opacity: 0, duration: 0.4 })
  }

  return (
    <Transition
      timeout={800}
      in={isOpen}
      mountOnEnter={true}
      unmountOnExit={true}
      onEnter={onEnter}
      onEntering={onEntering}
      onExit={onExit}>
      <section id="menu-wrapper" className={styles.container}>
        <ul>
          {menuLinks.map(
            ({ text, link, hideInSpanishVersion, notification }) =>
              !(isSpanish && hideInSpanishVersion) && (
                <Link
                  key={text}
                  href={isSpanish ? `/${Locale.Spain}${link}` : link}
                  onClick={() => {
                    logAnalyticsEvent(EventName.TapMenuOption, pathname, { menuCategory: text })
                    close()
                  }}>
                  <li onClick={() => push(link)}>
                    {text}
                    {notification && <div>1</div>}
                  </li>
                </Link>
              ),
          )}
        </ul>
        <div className={styles.socialContainer}>
          <a
            href="https://www.instagram.com/madriexcepcional/"
            onClick={() => {
              logAnalyticsEvent(EventName.TapSocialIcon, pathname, { socialIcon: 'Instagram' })
            }}
            target="_blank"
            rel="noreferrer">
            <Image src={instagram} alt="Instagram" />
          </a>
          <a
            href="https://open.spotify.com/playlist/5UzCsiH1vI5EHFfUcdKmUP"
            onClick={() => {
              logAnalyticsEvent(EventName.TapSocialIcon, pathname, { socialIcon: 'Spotify' })
            }}
            target="_blank"
            rel="noreferrer">
            <Image src={spotify} alt="Spofity" />{' '}
          </a>
        </div>

        {!isSpanish && (
          <a
            href="https://revl.co.uk/collections/madri-excepcional"
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              logAnalyticsEvent(EventName.TapBuyMadri, pathname)
            }}
            className={styles.madriText}>
            {/* MF: Wrapped in <p> for GSAP selector */}
            <p>Buy Madrí Excepcional now</p>
          </a>
        )}
        {!isSpanish ? (
          isIrish ? (
            <a
              href={'https://www.drinkaware.ie/'}
              onClick={() => logAnalyticsEvent(EventName.TapDrinkAware, pathname)}
              target="_blank"
              rel="noreferrer">
              <Image
                src={drinkAwareIe}
                alt="Drink Aware"
                priority={true}
                loading="eager"
                quality={100}
                width={150}
                className={styles.drinkAware}
              />
            </a>
          ) : (
            <a
              href={'https://www.drinkaware.co.uk/'}
              onClick={() => logAnalyticsEvent(EventName.TapDrinkAware, pathname)}
              target="_blank"
              rel="noreferrer">
              <Image
                src={drinkAware}
                alt="Drink Aware"
                priority={true}
                loading="eager"
                quality={100}
                width={165}
                className={styles.drinkAware}
              />
            </a>
          )
        ) : null}
        <FooterLinks className={styles.footerLinks} />
        <Footer />
      </section>
    </Transition>
  )
}

export default Menu
