'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import introGlass from '@/assets/images/intro-glass.png'
import artistImg from '@/assets/paint/behind-our-glass-artist.jpg'
import artistImg2 from '@/assets/paint/behind-our-glass-artwork.jpg'
import Button from '@/components/button/Button'
import { Footer } from '@/components/footer/Footer'
import { OverlayScreen, useOverlays } from '@/components/overlays/OverlaysProvider'
import PageTitle from '@/components/pageTitle/PageTitle'
import BackButton from '@/components/paint/backButton/BackButton'
import { Pathname } from '@/resources/pathname'

import styles from './page.module.scss'

function BehindOurGlass() {
  const { push } = useRouter()
  const { overlay } = useOverlays()
  const { contextSafe } = useGSAP()

  useGSAP(() => {
    gsap.set(['#back', 'main > *', 'article > *'], { opacity: 0, y: 16 })

    gsap.to(['#back', 'main > *', 'article > *'], { opacity: 1, y: 0, stagger: 0.15 })
  }, [])

  const goToIntroPage = contextSafe(() => {
    gsap.to(['#back', 'main > *', 'article > *'], {
      opacity: 0,
      y: 16,
      stagger: -0.1,
      onComplete: () => push(Pathname.Paint),
    })
  })

  if (overlay !== OverlayScreen.None) return null

  return (
    <>
      <main className={styles.main}>
        <BackButton id="back" onClick={goToIntroPage} />
        <PageTitle title="Paint your pint" />
        <Image src={introGlass} alt="Madri Pint Glass" />
        <span className={styles.overline}>The story</span>
        <h2>
          Behind <span>our glass</span>
        </h2>
        <Image src={artistImg} alt="Street Artist Sokram" />
        <article>
          <h3>
            Designed by Madridian Street Artist Sokram, Madri Excepcional&apos;s new limited edition glass design, fuses
            together the cultural energies of Madrid and the UK.
          </h3>
          <p>
            Taking inspiration from the streets of Madrid, Sokram has used the brand name and interspersed the letters
            of Madri with different elements that allude to the Madrid Street scene and the art that lives in the
            streets, e.g., a hand with a spray can. Sokram has also included elements from his previous murals that he
            created for Madri experiential events in Manchester and London in Summer 2023.
          </p>
          <Image src={artistImg2} alt="Street Artist Sokram painting a mural" />
          <p>
            Madrid for Sokram means, dynamism, the melting of cultures and meeting of many different people. He hopes
            that this glass conveys that meaning.
          </p>
          <p>
            Experience the Soul of Madrid for yourself and pick up a limitied edition Madri Excepcional glass in pubs,
            restuarants and all major retailers across the UK and Ireland.
          </p>

          <Button arrowRight url={Pathname.PaintDesigner} fullWidth variant="primary">
            Paint your pint
          </Button>

          <p className={styles.disclaimer}>Terms and Conditions apply. Please drink responsibly. Brewed in the UK.</p>
        </article>
        <Footer />
      </main>
    </>
  )
}

export default BehindOurGlass
