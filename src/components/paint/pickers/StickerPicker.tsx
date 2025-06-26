import Image from 'next/image'
import React, { type FC, useState } from 'react'

import stickerPickerIcon from '@/assets/paint/sticker-picker.svg'

import Picker from './Picker'
import styles from './StickerPicker.module.scss'

type Props = {
  onStickerClick: (sticker: string) => void
  selectedStickers: string[]
}

const STICKERS = [
  process.env.BASE_PATH + '/paint/stickers-no/stars-sticker.svg',
  process.env.BASE_PATH + '/paint/stickers-no/beer-glasses-1.svg',
  process.env.BASE_PATH + '/paint/stickers-no/spray-paint.svg',
  process.env.BASE_PATH + '/paint/stickers-no/flower.svg',
  process.env.BASE_PATH + '/paint/stickers-no/madri-bottles.svg',
  process.env.BASE_PATH + '/paint/stickers-no/beer-glasses-2.svg',
  process.env.BASE_PATH + '/paint/stickers-no/chulapo.svg',
  process.env.BASE_PATH + '/paint/stickers-no/madri-door.svg',
]

const StickerPicker: FC<Props> = ({ onStickerClick, selectedStickers }) => {
  const [showPicker, setShowPicker] = useState(false)
  return (
    <Picker
      icon={<Image src={stickerPickerIcon} alt="Sticker Picker" />}
      placement="top-start"
      closeButtonPlacement="bottom"
      show={showPicker}
      setShow={setShowPicker}>
      <div className={styles.container}>
        {STICKERS.map((src, index) => (
          <button
            key={'sticker-option-' + index}
            onClick={() => {
              onStickerClick(src)
              setShowPicker(false)
            }}
            className={styles.sticker}
            disabled={selectedStickers.includes(src)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" />
          </button>
        ))}
      </div>
    </Picker>
  )
}

export default StickerPicker
