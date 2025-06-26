import { format } from 'date-fns'
import Image from 'next/image'
import { type FC } from 'react'

import styles from './Item.module.scss'

type Props = {
  name: string
  address: string
  date: string
  imageUrl: string
  onClick: () => void
}

const EventItem: FC<Props> = ({ name, address, date, imageUrl, onClick }) => {
  return (
    <button className={`${styles.container} list-item`} onClick={onClick}>
      <Image src={`https:${imageUrl}`} alt="event image" width={88} height={88} />
      <div className={styles.details}>
        {!!date && <span>{format(new Date(date), 'EE MMM d')}</span>}
        <span>{name}</span>
        <span>{address}</span>
      </div>
    </button>
  )
}

export default EventItem
