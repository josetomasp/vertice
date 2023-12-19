export const REFERRAL_976527 = {
  // id is purely for imdb
  id: '393736353237',
  referralType: null,
  referralId: '976525',
  dateCreated: '08/23/2019',
  status: 'AUTHORIZED',
  vendorName: 'One Call Care Mgmt',
  vendorCode: 'MSC',
  prescriberName: 'N/A',
  prescriberPhone: 'N/A',
  requestorName: null,
  requestorRoleAndTitle: 'Claim User Adjuster / Alice Adjustor',
  requestorEmail: 'alice.adjustor@workplace.com',
  requestorPhone: '813-555-3852',
  vendorModal: {
    title: 'Vendor - One Call Care Mgmt',
    vendorPrimaryAddress: ['222 South St', 'San Diego, CA 11223-1234'],
    email: 'al.jones@msc.com',
    phone: '800-834-5360',
    fax: '357-845-8588'
  },
  displayReferralLocationsLink: true,
  authorizedLocationsModalData: {
    startDate: '09/13/2019',
    endDate: '09/17/2019',
    serviceType: 'Sedan',
    unlimitedTrips: false,
    tripsAuthorized: 54,
    noLocationRestrictions: false,
    specifyTripsByLocation: true,
    authorizedLocationsByType: [
      {
        locationType: 'HOME',
        locations: [
          {
            id: 662100,
            name: 'Home',
            type: 'Home',
            locationCreationRecord: {
              timeCreated: '2018-02-13T16:03:00.00',
              createdBy: 'VickiVendor'
            },
            phone: '343-555-9377',
            address: '1255 Westmore Ave., Tampa 33611',
            tripsAuthorized: 14
          },
          {
            id: 662100,
            name: 'Home 2',
            type: 'Home',
            locationCreationRecord: {
              timeCreated: '2018-02-13T16:03:00.00',
              createdBy: 'VickiVendor'
            },
            phone: '343-555-9377',
            address: '1255 Westmore Ave., Tampa 33611',
            tripsAuthorized: 15
          }
        ]
      },
      {
        locationType: 'HOSPITAL',
        locations: [
          {
            id: 662200,
            name: 'Tampa General',
            type: 'Location Description Not Found',
            locationCreationRecord: {
              timeCreated: '2018-02-13T16:03:00.00',
              createdBy: 'VickiVendor'
            },
            phone: '813-545-3323',
            address: '1 Tampa General Cir, Tampa 33611',
            tripsAuthorized: 25
          }
        ]
      }
    ]
  },
  diagnosisCodeAndDescription: [
    'S92.012A - Displaced fracture of body of left calcaneus, initial encounter for closed fracture',
    'S90.31XA - Contusion of right foot, initial encounter'
  ],
  documents: [],
  icdCodes: [
    {
      icdCode: 'S92.012A',
      icdDescription:
        'Displaced fracture of body of left calcaneus, initial encounter for closed fracture',
      icdVersion: 10
    },
    {
      icdCode: 'S90.31XA',
      icdDescription: 'Contusion of right foot, initial encounter',
      icdVersion: 10
    }
  ],
  notes: [
    {
      referralId: '976525',
      noteOrigination: 'CUSTOMER',
      note:
        'Patient is scheduled for surgery with Dr. Jane Jones on 09/13/2019 at 12:00PM',
      userCreated: 'AliceAdjuster',
      dateCreated: '08/23/2019',
      timeCreated: '01:10 PM'
    },
    {
      referralId: '976525',
      noteOrigination: 'CUSTOMER',
      note: 'Patient will need 2 PT visits after surgery',
      userCreated: 'AliceAdjuster',
      dateCreated: '08/23/2019',
      timeCreated: '01:30 PM'
    },
    {
      referralId: '976525',
      noteOrigination: 'VENDOR',
      note: 'Is IW scheduled for PT Visits on 9/16/2019 and 9/17/2019?',
      userCreated: 'VickiVendor',
      dateCreated: '08/24/2019',
      timeCreated: '09:44 AM'
    },
    {
      referralId: '976525',
      noteOrigination: 'CUSTOMER',
      note: "Correct, IW's PT Visits will be on 9/16/2019 and 9/17/2019",
      userCreated: 'AliceAdjustor',
      dateCreated: '08/25/2019',
      timeCreated: '2019-08-25T16:86:01.00'
    }
  ]
};
