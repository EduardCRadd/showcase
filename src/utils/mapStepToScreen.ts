/**
 * Maps a numeric step (`st` query param) to the corresponding Screen
 * in the Win and RateOfSale Conectada 2025 flows.
 */
import { TicketFlow } from '@/types/ticketFlow'

export enum Screen {
  Landing,
  PubSelector,
  Pin,
  UserDetails,
  Entered,
}

// Define mappings for each flow using an array lookup
const stepToScreenMap: Record<TicketFlow, Screen[]> = {
  [TicketFlow.Win]: [Screen.Landing, Screen.Pin, Screen.UserDetails, Screen.Entered],
  [TicketFlow.RateOfSale]: [Screen.Landing, Screen.PubSelector, Screen.UserDetails, Screen.Entered],
}

/**
 * Returns the corresponding Screen for a given TicketFlow and step.
 */
export function mapStepToScreen(flow: TicketFlow, step: number): Screen {
  return stepToScreenMap[flow]?.[step] ?? Screen.Landing
}
