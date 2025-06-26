// https://docs.google.com/spreadsheets/d/1uwmMUIAdSL1Jtuzchiwpu2BcFGcxfC7vLPmMlsMRTvE/edit?gid=0#gid=0
// https://docs.google.com/spreadsheets/d/10SU3K-82jY_N8COSgsb5FidUwGrNyuVM2zBdFaLGCGw/edit?pli=1&gid=576016141#gid=576016141

export enum EventName {
  SubmitAgeGate = 'submitAgeGate',

  // Paint your Pint
  // StartPaintYourPint = 'start_paint_your_pint',
  // ClickAboutTheDesign = 'click_about_the_design',
  // ClickSaveAndSubmit = 'click_save_and_submit',
  // ClickShare = 'click_share',
  // ViewGallery = 'view_gallery',
  // PypLetsGo = 'pyp_lets_go',
  // PaintYourPintAndWin = 'paint_your_pint_and_win',

  TapToSpeak = 'tapToSpeak',
  SubmitRecording = 'submitRecording',
  SwipeUp = 'swipeUp',
  SwipeDown = 'swipeDown',

  // Rate of Sale
  // StartRateOfSale = 'start_rate_of_sale',
  // StartForm = 'start_form',
  // RateOfSaleFormSubmitted = 'rate_of_sale_form_submitted',
  // RateOfSaleLetsGo = 'rate_of_sale_lets_go',

  // Conectada 25
  ViewedPage = 'viewedPage',
  TapFooterOptions = 'tapFooterOptions',
  TapGetStarted = 'tapGetStarted',
  TapAboutTheArtist = 'tapAboutTheArtist',
  TapGoBack = 'tapGoBack',
  SubmitEnterDraw = 'submitEnterDraw',
  YouAreInTheDraw = 'youAreInTheDraw',
  TapExploreMadri = 'tapExploreMadri',
  TapAboutAllPointsEast = 'tapAboutAllPointsEast',
  SubmitCode = 'submitCode',
  TapWhereIsMyCode = 'tapWhereIsMyCode',
  AlertCode = 'alertCode',
  TapTryAgain = 'tapTryAgain',
  TapGotIt = 'tapGotIt',
  TapBuyMadri = 'tapBuyMadri',
  TapDrinkAware = 'tapDrinkAware',
  TapFindMadri = 'tapFindMadri',
  TapLocation1 = 'tapLocation1',
  TapLocation2 = 'tapLocation2',
  GetPreciseLocation = 'getPreciseLocation',
  EnterPubName = 'enterPubName',
  TapOnVamos = 'tapOnVamos',

  // conectada 25/menu events
  TapBurgerMenu = 'tapBurgerMenu',
  TapMenuOption = 'tapMenuOption',
  TapSocialIcon = 'tapSocialIcon',
}

export const EVENT_MAPPING: Partial<Record<EventName, string>> = {
  [EventName.SubmitAgeGate]: 'submitAgeGate',

  // [EventName.StartPaintYourPint]: 'madri_interaction',
  // [EventName.ClickAboutTheDesign]: 'madri_interaction',
  // [EventName.ClickSaveAndSubmit]: 'madri_interaction',
  // [EventName.ClickShare]: 'madri_interaction',
  // [EventName.ViewGallery]: 'madri_interaction',
  // [EventName.PypLetsGo]: 'madri_interaction',
  // [EventName.PaintYourPintAndWin]: 'madri_interaction',
  // [EventName.StartRateOfSale]: 'madri_interaction',
  // [EventName.StartForm]: 'madri_interaction',
  // [EventName.RateOfSaleFormSubmitted]: 'madri_interaction',
  // [EventName.RateOfSaleLetsGo]: 'madri_interaction',

  [EventName.TapToSpeak]: 'tapToSpeak',
  [EventName.SubmitRecording]: 'submitRecording',
  [EventName.SwipeUp]: 'swipeUp',
  [EventName.SwipeDown]: 'swipeDown',

  // Conectada 25
  [EventName.ViewedPage]: 'viewedPage',
  [EventName.TapFooterOptions]: 'tapFooterOptions',
  [EventName.TapGetStarted]: 'tapGetStarted',
  [EventName.TapAboutTheArtist]: 'tapAboutTheArtist',
  [EventName.TapGoBack]: 'tapGoBack',
  [EventName.SubmitEnterDraw]: 'submitEnterDraw',
  [EventName.YouAreInTheDraw]: 'youAreInTheDraw',
  [EventName.TapExploreMadri]: 'tapExploreMadri',
  [EventName.TapAboutAllPointsEast]: 'tapAboutAllPointsEast',
  [EventName.SubmitCode]: 'submitCode',
  [EventName.TapWhereIsMyCode]: 'tapWhereIsMyCode',
  [EventName.AlertCode]: 'alertCode',
  [EventName.TapTryAgain]: 'tapTryAgain',
  [EventName.TapGotIt]: 'tapGotIt',
  [EventName.TapBuyMadri]: 'tapBuyMadri',
  [EventName.TapDrinkAware]: 'tapDrinkAware',
  [EventName.TapFindMadri]: 'tapFindMadri',
  [EventName.TapLocation1]: 'tapLocation1',
  [EventName.TapLocation2]: 'tapLocation2',
  [EventName.GetPreciseLocation]: 'getPreciseLocation',
  [EventName.EnterPubName]: 'enterPubName',
  [EventName.TapOnVamos]: 'tapOnVamos',

  // conectada 25/menu events
  [EventName.TapBurgerMenu]: 'tapBurgerMenu',
  [EventName.TapMenuOption]: 'tapMenuOption',
  [EventName.TapSocialIcon]: 'tapSocialIcon',
}

export type CommonEventProperties = {
  environment: 'development' | 'staging' | 'production'
  pageURL: string
  flowName: string
  experienceName: string
}

export type CustomEventProperties = {
  event: EventName
  button?: string
  venue?: string

  // Conectada 25
  pageName?: string
  pointOfSale?: string
  pubDetails?: string
  alertType?: string
  packType?: string

  footerCategory?: string
  retailerDropDown?: string
  menuCategory?: string
  socialIcon?: string
  postCode?: string
  locationName?: string
  cardName?: string
  ageGatePassed?: boolean
}
