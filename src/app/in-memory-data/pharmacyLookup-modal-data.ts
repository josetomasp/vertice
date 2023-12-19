import { Pharmacy } from '@shared/models/pharmacy';

export const pharmacyData: Pharmacy = {
  nabp: '0105521',
  name: 'DEANS DRUGS INC',
  address: ['Suite 101', '699 Cedar Bluff Rd.', 'Centre, AL 35960'],
  affiliationCode: '841',
  phoneNumber: '(256) 927-5569',
  faxNumber: '(256) 927-2440',
  h24Flag: false,
  providerHours: '11318208203082040820508206082070818',
  inNetwork: true,
  npi: '1417021403',
  latitude: '34.160927',
  longitude: '-85.667463',
  timezone: 'Central',
  dailyHours: [
    {
      dayOfWeek: 'SUNDAY',
      openHour: '13',
      closeHour: '18'
    },
    {
      dayOfWeek: 'MONDAY',
      openHour: '08',
      closeHour: '20'
    },
    {
      dayOfWeek: 'TUESDAY',
      openHour: '08',
      closeHour: '20'
    },
    {
      dayOfWeek: 'WEDNESDAY',
      openHour: '08',
      closeHour: '20'
    },
    {
      dayOfWeek: 'THURSDAY',
      openHour: '08',
      closeHour: '20'
    },
    {
      dayOfWeek: 'FRIDAY',
      openHour: '08',
      closeHour: '20'
    },
    {
      dayOfWeek: 'SATURDAY',
      openHour: '08',
      closeHour: '18'
    }
  ],
  mailOrderPharmacy: false
};
