import { create } from 'zustand'

type BaseUserDetails = {
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  termsAndConditions: boolean
}

export type ROSUserDetailsFormData = BaseUserDetails & {
  barPubAddress: string
}
export type OnPackUserDetailsFormData = BaseUserDetails & {
  code: string
  retailer: string
}
export type TripUserDetailsFormData = BaseUserDetails & AddressDetailsFormData

export type AddressDetailsFormData = {
  address1: string
  address2: string
  address3: string
  city: string
  county: string
  countryId: number
  postcode: string
  hasCheckedTerms: boolean
  var1: string
}
export type CompetitionFormData = {
  competitionToken: string
  prizeTypeId: number
}
export type EnterDrawFormData = OnPackUserDetailsFormData & AddressDetailsFormData & CompetitionFormData

export type Store<T extends object = any> = {
  userDetails: Partial<T>
  setUserDetails: (data: Partial<T>) => void
  updateUserDetails: (data: Partial<T>) => void
}

const createUserDetailsStore = <T extends object>(initial: Partial<T>) =>
  create<Store<T>>((set, get) => ({
    userDetails: initial,
    setUserDetails: (data) => set({ userDetails: data }),
    updateUserDetails: (data) => set({ userDetails: { ...get().userDetails, ...data } }),
  }))

export const useROSStore = createUserDetailsStore<ROSUserDetailsFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  barPubAddress: '',
  termsAndConditions: false,
})

export const useOnPackStore = createUserDetailsStore<OnPackUserDetailsFormData>({
  code: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  retailer: '',
  termsAndConditions: false,
})

export const useMadridTripStore = createUserDetailsStore<TripUserDetailsFormData>({
  // base fields
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  termsAndConditions: false,

  // address fields
  address1: '',
  address2: '',
  address3: '',
  city: '',
  county: '',
  countryId: undefined as unknown as number,
  postcode: '',
  hasCheckedTerms: false,
  var1: '',
})
