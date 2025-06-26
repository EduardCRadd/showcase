import { type StaticImageData } from 'next/image'

import matOneImg from '@/assets/mats/mat-1.jpg'
import matTwoImg from '@/assets/mats/mat-2.jpg'
import matThreeImg from '@/assets/mats/mat-3.jpg'

export enum BeerMatId {
  One = 'one',
  Two = 'two',
  Three = 'three',
}

export type BeerMat = {
  id: BeerMatId
  imageSrc: StaticImageData
}

export const BEER_MATS: Record<BeerMatId, BeerMat> = {
  [BeerMatId.One]: {
    id: BeerMatId.One,
    imageSrc: matOneImg,
  },
  [BeerMatId.Two]: {
    id: BeerMatId.Two,
    imageSrc: matTwoImg,
  },
  [BeerMatId.Three]: {
    id: BeerMatId.Three,
    imageSrc: matThreeImg,
  },
}

export const BEER_MATS_ARRAY = Object.values(BEER_MATS)
