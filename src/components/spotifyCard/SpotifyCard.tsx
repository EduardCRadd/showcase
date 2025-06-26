import { Entry } from 'contentful'
import Image from 'next/image'
import React, { type FC } from 'react'

import pattern from '@/assets/images/houndstooth-pattern.png'
import spotify from '@/assets/images/spotify.png'
import { MadriEvent } from '@/model/map'

import styles from './SpotifyCard.module.scss'

type SpotifyCardProps = {
  event: Entry<MadriEvent> | undefined
}

const SpotifyCard: FC<SpotifyCardProps> = ({ event }) => {
  return (
    <div className={styles.container}>
      <a href="https://open.spotify.com/playlist/5UzCsiH1vI5EHFfUcdKmUP" target="_blank" rel="noreferrer">
        <div className={styles.spotifyContainer}>
          <Image src={spotify} alt="Spotify logo" quality={100} className={styles.spotifyImage} />
          <div>
            <p className={styles.text}>Listen to the Soul of Madrid on Spotify</p>
            <p className={styles.textSmall}>While you enjoy Madrí Excepcional</p>
          </div>
        </div>
      </a>
      <div className={styles.line} />
      <Image src={pattern} alt="hounds tooth pattern" quality={75} className={styles.pattern} />
    </div>
  )
}

export default SpotifyCard
