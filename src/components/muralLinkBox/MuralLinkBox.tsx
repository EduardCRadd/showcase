import Image from 'next/image'
import Link from 'next/link'
import { type FC } from 'react'

import arrowImg from '@/assets/icons/arrow.svg'
import muralBoxImg from '@/assets/images/mural-box.png'
import { Pathname } from '@/resources/pathname'

import styles from './MuralLinkBox.module.scss'

const MURAL_EVENT_ID = '5vnHyKavjc7mgWJda8cIsi'

const MuralLinkBox: FC = () => {
  return (
    <Link href={`${Pathname.Events}/${MURAL_EVENT_ID}`}>
      <div className={styles.container}>
        <Image src={muralBoxImg} className={styles.muralBoxImg} alt="Madri Mural Box" width={88} height={88} />
        <div className={styles.linkContainer}>
          <p>Don’t forget to check out The Soul of Madrid Mural in Manchester</p>
          <Image src={arrowImg} className={styles.arrow} alt="Madri arrow" />
        </div>
      </div>
    </Link>
  )
}

export default MuralLinkBox
