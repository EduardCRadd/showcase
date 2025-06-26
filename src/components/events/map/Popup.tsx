import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { type FC, type HTMLAttributes } from 'react'
import { getDirectionsUrl } from 'src/utils/helpers'

import arrow from '@/assets/icons/arrow.svg'
import shopImg from '@/assets/images/map/bottle.png'
import barImg from '@/assets/images/map/glass.png'
import madriZeroImg from '@/assets/images/map/zero-bottle.png'
import eventImg from '@/assets/images/red-door.png'
import useGTMEvent from '@/hooks/useGTMEvent'
import useLocale from '@/hooks/useLocale'
import useMapStore from '@/hooks/useMapStore'
import { EventName } from '@/resources/analytics'
import { Pathname } from '@/resources/pathname'
import { MarkerType } from '@/utils/map'

import styles from './Popup.module.scss'

type Props = HTMLAttributes<HTMLDivElement>

const Popup: FC<Props> = () => {
  const { popupData, setPopupData, preciseLoc } = useMapStore()
  const { trackEvent } = useGTMEvent()
  const {
    id,
    date,
    type,
    name,
    postcode,
    location: locationFromJSONList,
    address,
    latitude,
    longitude,
  } = popupData || {}
  const { locale } = useLocale()

  if (!name) return null

  const directionsUrl = getDirectionsUrl({
    locale,
    location: { lat: latitude, lng: longitude },
    preciseLoc,
    venue: name + ' ' + (address ?? '') + ' ' + (locationFromJSONList ?? ''),
  })
  const href = !!id ? `${Pathname.Events}/${id}` : null

  const image =
    type === MarkerType.Event ? (
      <Image src={eventImg} alt="Madri event door" width={44} height={64} style={{ objectFit: 'contain' }} />
    ) : type === MarkerType.Bar ? (
      <Image src={barImg} alt="Madri bar glass" width={28} height={64} style={{ objectFit: 'contain' }} />
    ) : type === MarkerType.MadriZero ? (
      <Image
        src={madriZeroImg}
        alt="Madri Zero bottle"
        width={66}
        height={110}
        style={{ objectFit: 'contain', marginTop: -44 }}
      />
    ) : (
      <Image src={shopImg} alt="Madri bottle" width={24} height={64} style={{ objectFit: 'contain' }} />
    )

  const card = (
    <div className={styles.card}>
      {image}
      <div className={styles.details}>
        {date && <span className={styles.date}>{format(new Date(date), 'EE MMM d')}</span>}
        <h3>{name}</h3>
        <span>{address}</span>
      </div>

      {!href && <Image src={arrow} alt="arrow" className={styles.directionsIcon} width={24} height={24} />}
    </div>
  )

  return (
    <div className={styles.container} onClick={() => setPopupData(undefined)}>
      {href ? (
        <Link href={href} onClick={(e) => e.stopPropagation()}>
          {card}
        </Link>
      ) : (
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            trackEvent({ event: EventName.TapLocation2, locationName: name, postCode: postcode })
            e.stopPropagation()
          }}>
          {card}
        </a>
      )}
    </div>
  )
}

export default Popup
