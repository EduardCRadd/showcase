import React, { type FC } from 'react'

import AboutArtistModal from '@/components/modals/aboutArtistModal/AboutArtistModal'
import AboutFestivalModal from '@/components/modals/aboutFestivalModal/AboutFestivalModal'
import HelpModal from '@/components/modals/helpModal/HelpModal'

const Modals: FC = ({}) => {
  return (
    <>
      <AboutArtistModal />
      <AboutFestivalModal />
      <HelpModal />
    </>
  )
}

export default Modals
