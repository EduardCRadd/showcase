export enum Pathname {
  // UK and IE Always On Flow
  Landing = '/',
  Phrases = '/phrases',
  Rewards = '/rewards',
  Claim = '/rewards/claim',
  Story = '/story',
  SignUp = '/signup',
  EventsMap = '/events/map',
  EventsList = '/events/list',
  Events = '/events',
  TermsAndConditions = '/terms-and-conditions',

  Paint = '/paint',
  PaintDesigner = '/paint/designer',
  PaintBehindOurGlass = '/paint/behind-our-glass',
  PaintGallery = '/paint/gallery',

  PaintEvent = '/paint/event',
  PaintEventComingSoon = '/paint/event/coming-soon',
  PaintEventBehindOurGlass = '/paint/event/behind-our-glass',

  // OOH - Featured Event
  InTheCity = '/inthecity',

  // Spanish
  SpanishStory = '/es/story',
  SpanishEventsMap = '/es/events/map',
  SpanishEventsList = '/es/events/list',

  Terms = '/terms',

  ScavengerHunt = '/hunt',
  ScavengerHuntComplete = '/hunt/complete',
  ScavengerHuntPrizes = '/hunt/prizes',

  // Madrid Trip
  MadridTrip = '/madrid-trip',

  // Conectada 25
  Win = '/win',
  // TODO: provisional route, to be updated once decided
  RateOfSale = '/rate-of-sale',
}

export const PAGE_TITLES: Record<Pathname, string | null> = {
  [Pathname.Landing]: null,
  [Pathname.Phrases]: 'Learn',
  [Pathname.Rewards]: 'Rewards',
  [Pathname.SignUp]: 'Signup',
  [Pathname.Claim]: 'Claim',
  [Pathname.Story]: 'Our Story',
  [Pathname.SpanishStory]: 'Our story',
  [Pathname.EventsMap]: null,
  [Pathname.EventsList]: null,
  [Pathname.Events]: null,
  [Pathname.PaintBehindOurGlass]: 'Behind Our Glass',
  [Pathname.Paint]: 'Paint Your Pint',
  [Pathname.PaintDesigner]: 'Paint Your Pint',
  [Pathname.PaintGallery]: 'The Gallery - Paint Your Pint',
  [Pathname.PaintEvent]: 'Paint Your Pint',
  [Pathname.PaintEventBehindOurGlass]: 'Behind Our Glass',
  [Pathname.PaintEventComingSoon]: 'Coming soon - Paint Your Pint',
  [Pathname.InTheCity]: null,
  [Pathname.Terms]: null,
  [Pathname.SpanishEventsMap]: null,
  [Pathname.SpanishEventsList]: null,
  [Pathname.TermsAndConditions]: 'Terms and Conditions',

  [Pathname.ScavengerHunt]: 'Scavenger Hunt',
  [Pathname.ScavengerHuntComplete]: 'Scavenger Hunt',
  [Pathname.ScavengerHuntPrizes]: 'Prizes',

  // Madrid Trip
  [Pathname.MadridTrip]: 'Win a trip to Madrid',

  // Conectada 25
  // TODO: to be updated once we have metadata copy
  [Pathname.Win]: 'Win festival tickets',
  [Pathname.RateOfSale]: 'Win festival tickets',
}

export enum FlowName {
  AlwaysOn = 'Always On',
  OutOfHome = 'Out of Home',
}
