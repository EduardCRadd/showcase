'use client'
import type { LottieRefCurrentProps } from 'lottie-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { type FC, useRef } from 'react'

import artistImg from '@/assets/conectada25/images/artist.webp'
import headerImg from '@/assets/conectada25/images/artist-modal-header.webp'
import arrowSVG from '@/assets/icons/arrow-back.svg'
import Button from '@/components/button/Button'
import LottieHands from '@/components/conectada25/lottieHands/LottieHands'
import Modal from '@/components/modals/Modal'
import useAnalyticsEvent from '@/hooks/useAnalyticsEvent'
import useModalsStore from '@/hooks/useModalStore'
import { EventName } from '@/resources/analytics'

import styles from './AboutArtistModal.module.scss'

const AboutArtistModal: FC = () => {
  const show = useModalsStore((s) => s.showAboutArtistModal)
  const close = useModalsStore((s) => s.closeAboutArtistModal)

  return (
    <Modal show={show} close={close}>
      <AboutArtistModalContent />
    </Modal>
  )
}

export default AboutArtistModal

const AboutArtistModalContent = () => {
  const handsLottieRef = useRef<LottieRefCurrentProps>(null)
  const logAnalyticsEvent = useAnalyticsEvent()
  const pathname = usePathname()

  const onEnterNow = useModalsStore((s) => s.onEnterNow)
  const close = useModalsStore((s) => s.closeAboutArtistModal)

  const handleClose = () => {
    logAnalyticsEvent(EventName.TapGoBack, pathname)
    close()
  }

  const handleEnterNow = () => {
    logAnalyticsEvent(EventName.TapGetStarted, pathname)
    close()
    onEnterNow?.()
  }
  return (
    <div className={styles.contentBox}>
      <button onClick={handleClose} className={styles.navigation}>
        <Image src={arrowSVG} alt="arrow icon" />
      </button>
      <div className={styles.contentWrapper}>
        <Image src={headerImg} className={styles.headerImg} alt="artist header" />
        <h1>About the artist</h1>
        <div className={styles.content}>
          <p>
            Jamēl is an Urban Contemporary Artist specialising in surreal paintings, sculptures and street art. Born in
            the ancient city of Babylon in the Middle East in 1984, Jamēl is now based in the vibrant city of Bristol,
            UK.
            <br />
            <br />A variety of mediums and techniques are used in each piece of art, with the use of spray and acrylic
            paints; often also using recycled wood cuts salvaged from the city which embodies his environmental ethos.
          </p>
          <Image src={artistImg} className={styles.artistImg} alt="artist" />
          <p>
            Each piece takes influence from an eclectic mix of muses from graffiti, skateboard graphics, islamic
            patterns, social and environmental justice. His artwork brings together vibrant psychedelic colours and
            abstract forms within his subject matter to disorient you into a subversive dream-like dimension.
            <br />
            <br />A well established artist, Jamēl has exhibited in galleries around the world, and created unique
            artwork and murals for a variety of clients. Some of whom have included BBC Radio 6 Music, BBC Proms, Royal
            Albert Hall, TATE Britain, Teenage Cancer Trust, Rip Curl, Posca, BBC, Collective Arts Brewing, Red Bull &
            Madrí.
          </p>
          <Button onClick={handleEnterNow} variant="secondary" arrowRight={true}>
            Enter now
          </Button>
        </div>
      </div>
      <LottieHands ref={handsLottieRef} autoPlay={true} />
    </div>
  )
}
