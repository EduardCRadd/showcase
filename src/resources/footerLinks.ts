import { Locale } from '@/resources/locale'

const UK_AND_IE_LINKS = [
  {
    translationKey: 'terms-and-conditions',
    link: 'https://www.molsoncoors.com/terms-and-conditions',
  },
  {
    translationKey: 'cookie-notice',
    link: 'https://www.molsoncoors.com/privacy-policy#trackingtech',
  },
  {
    translationKey: 'privacy-policy',
    link: 'https://www.molsoncoors.com/privacy-policy',
  },
  {
    translationKey: 'modern-slavery-act',
    link: 'https://www.molsoncoors.com/sites/molsonco/files/Molson%20Coors%20Brewing%20Company%20%28UK%29%20Limited%202020_2.pdf',
  },
  {
    translationKey: 'nutritional-infomation',
    link: 'https://www.molsoncoors.com/en-GB/av?url=https://www.molsoncoors.com/nutritional-information',
  },
]

export const LINKS = {
  [Locale.UK]: UK_AND_IE_LINKS,
  [Locale.Ireland]: UK_AND_IE_LINKS,
  [Locale.Spain]: [
    {
      translationKey: 'terms-and-conditions',
      link: 'https://www.molsoncoors.com/sites/molsonco/files/2020-02/TermsAndConditions-ES-Spain-202001.pdf',
    },
    {
      translationKey: 'cookie-notice',
      link: 'https://www.molsoncoors.com/privacy-policy/es-xl#trackingtech',
    },
    {
      translationKey: 'privacy-policy',
      link: 'https://www.molsoncoors.com/privacy-policy/es-xl',
    },
    {
      translationKey: 'nutritional-infomation',
      link: 'https://www.molsoncoors.com/nutritional-information',
    },
  ],
}
