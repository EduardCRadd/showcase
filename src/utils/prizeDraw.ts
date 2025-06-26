import { format } from 'date-fns'

import { EnterDrawFormData } from '@/hooks/useFormStore'

type InitialEntry = {
  CompetitionToken: string
  IsPrizeDraw: boolean
  PrizeTypeId: number
  ForeName: string
  Surname: string
  AddressLine1: string
  AddressLine2: string
  AddressLine3: string
  Town: string
  County: string
  CountryId: number
  PostCode: string
  DateOfBirth: string
  EmailAddress: string
  RetailerId?: number
  OptIn: boolean
  RedemptionType: string
  UserName: string
  Personlisation: string
  ContactNumber: string
  Var1: string
  Var2: string
  Var3: string
  Username: string
}

export const mapDataToInitialEntry = (data: EnterDrawFormData): InitialEntry => {
  return {
    CompetitionToken: data.competitionToken || '',
    IsPrizeDraw: true,
    // unique PrizeTypeId
    PrizeTypeId: data.prizeTypeId,
    ForeName: data.firstName,
    Surname: data.lastName,
    AddressLine1: data.address1,
    AddressLine2: data.address2,
    AddressLine3: data.address3,
    Town: data.city,
    County: data.county,
    CountryId: data.countryId,
    PostCode: data.postcode,
    DateOfBirth: data.dob, //  yyyy-MM-dd ,
    EmailAddress: data.email,
    // RetailerId: undefined,
    OptIn: true,
    RedemptionType: 'ONLINE',
    UserName: '',
    Personlisation: '',
    ContactNumber: data.phone,
    Var1: data.var1 || '',
    Var2: '',
    Var3: '',
    Username: '',
  }
}
