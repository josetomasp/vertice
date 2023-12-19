import {
  ReferralAuthorizationArchetype,
  ReferralAuthorizationItem,
  ReferralAuthorizationOptions,
  ReferralAuthorizationSet,
  ReferralAuthorizationType,
  ReferralAuthorizationTypeCode,
  TransportationAuthorizationOpenSedanFormData
} from '../../claims/abm/referral/referralId/referral-authorization/referral-authorization.models';

const imdbDetailedAuthorizationItems: ReferralAuthorizationItem[] = [
  {
    authData: {
      appointmentDate: '04/15/2020',
      appointmentTime: '11:30 AM',
      appointmentType: 'Surgical Repair',
      doctorNameAndSpecialty: 'Dr Jane Jones - Orthopedics',
      flyingFrom: 'Some where',
      flyingTo: 'Elsewhere',
      numberOfTravelers: 3,
      departureDate: '2020-02-02T05:00:00.000Z',
      returnDate: '2020-03-03T05:00:00.000Z',
      relatedAppointmentData: 12345,
      rush: false,
      paidAsExpense: false,
      authorizationTypeCode: ReferralAuthorizationTypeCode.DETAILED_FLIGHT
    },
    narrativeTextList: [],
    reasonsReviewIsNeeded: ['Reason 1', 'Reason 2', 'Reason 3']
  },
  {
    authData: {
      appointmentDate: '04/15/2020',
      appointmentTime: '11:30 AM',
      appointmentType: 'Surgical Repair',
      doctorNameAndSpecialty: 'Dr Jane Jones - Orthopedics',
      destination: 'Holiday Inn Miami',
      numberOfGuests: 4,
      numberOfRooms: 2,
      priceOfRoom: '$$$',
      checkInDate: '2020-02-02T05:00:00.00Z',
      checkOutDate: '2020-02-06T05:00:00.00Z',
      numberOfNights: 4,
      relatedAppointmentData: 12345,
      rush: true,
      paidAsExpense: false,
      authorizationTypeCode: ReferralAuthorizationTypeCode.DETAILED_LODGING
    },
    narrativeTextList: [],
    reasonsReviewIsNeeded: ['Reason 1', 'Reason 2', 'Reason 3']
  },
  {
    authData: {
      appointmentDate: '04/15/2020',
      appointmentType: 'Surgical Repair',
      doctorNameAndSpecialty: 'Dr Jane Jones - Orthopedics',
      appointmentTime: '11:30 AM',
      fromAddress: {
        id: '7',
        name: `Pizzas 'r' us`,
        address: '147 Superficial Octagon',
        type: 'Other'
      },
      toAddress: {
        id: '2',
        name: 'Dr John Smith',
        address: '654 Nothing Triangle',
        type: 'Doctor'
      },
      pickupDate: '2020-04-17T05:00:00.000Z',
      pickupTime: '06:30:00',
      rush: false,
      paidAsExpense: false,
      authorizationTypeCode: ReferralAuthorizationTypeCode.DETAILED_SEDAN
    },
    narrativeTextList: [],
    reasonsReviewIsNeeded: ['Reason 1', 'Reason 2', 'Reason 3']
  },
  {
    authData: {
      appointmentDate: '04/15/2020',
      appointmentTime: '11:30 AM',
      appointmentType: 'Surgical Repair',
      doctorNameAndSpecialty: 'Dr Jane Jones - Orthopedics',
      pickupDate: '2020-04-17T05:00:00.000Z',
      pickupTime: '07:00:00',
      wheelchairType: 'Requires Wheelchair',
      steps: 12,
      fromAddress: {
        id: '0',
        name: 'My house',
        address: '123 Fake Street',
        type: 'Home'
      },
      toAddress: {
        id: '1',
        name: 'Dr Jan Itor',
        address: '987 Something Square',
        type: 'Doctor'
      },
      rush: false,
      paidAsExpense: false,
      authorizationTypeCode: ReferralAuthorizationTypeCode.DETAILED_WHEELCHAIR
    },
    narrativeTextList: [],
    reasonsReviewIsNeeded: ['Reason 1', 'Reason 2', 'Reason 3']
  },
  {
    authData: {
      appointmentDate: '04/15/2020',
      appointmentType: 'Surgical Repair',
      doctorNameAndSpecialty: 'Dr Jane Jones - Orthopedics',
      appointmentTime: '11:30 AM',
      fromAddress: {
        id: '7',
        name: `Pizzas 'r' us`,
        address: '147 Superficial Octagon',
        type: 'Other'
      },
      toAddress: {
        id: '2',
        name: 'Dr John Smith',
        address: '654 Nothing Triangle',
        type: 'Doctor'
      },
      pickupDate: '2020-04-17T05:00:00.000Z',
      pickupTime: '06:30:00',
      typeOfTransportation: 'Air Ambulance',
      rush: false,
      paidAsExpense: false,
      authorizationTypeCode: ReferralAuthorizationTypeCode.DETAILED_OTHER
    },
    narrativeTextList: [],
    reasonsReviewIsNeeded: ['Reason 1', 'Reason 2', 'Reason 3']
  }
];

export const imdbReferralAuthorizationData: ReferralAuthorizationSet = {
  archeType: ReferralAuthorizationArchetype.Transportation,
  authorizationType: ReferralAuthorizationType.DETAILED,
  referralAuthorization: {
    vendorNote: 'This is a vendor note',
    subHeaderNote:
      'May consist of mileage, wait time, or other miscellaneous fees.',
    authorizationItems: imdbDetailedAuthorizationItems,
    originalAuthorizationItems: imdbDetailedAuthorizationItems
  },
  claimLocations: []
};

export const imdbDetailedAuthorization: ReferralAuthorizationSet = {
  archeType: ReferralAuthorizationArchetype.Transportation,
  authorizationType: ReferralAuthorizationType.DETAILED,
  referralAuthorization: {
    vendorNote: 'This is a vendor note',
    subHeaderNote:
      'May consist of mileage, wait time, or other miscellaneous fees.',
    authorizationItems: imdbDetailedAuthorizationItems,
    originalAuthorizationItems: imdbDetailedAuthorizationItems
  },
  claimLocations: []
};

export const imdbIndividualLocationLimitChangesOpenSedanIndividualLocationLimits = {
  archeType: ReferralAuthorizationArchetype.Transportation,
  authorizationType: ReferralAuthorizationType.OPEN,
  referralAuthorization: {
    vendorNote:
      "TODO: Pull these from an API since it's not on the /manual-authorizations endpoint",
    subHeaderNote:
      '`May consist of mileage, wait time, or other miscellaneous fees`, but verbiage may otherwise vary by authorization',
    authorizationItems: [
      {
        reasonsReviewIsNeeded: [
          'INDIVIDUAL_LOCATION_LIMIT_CHANGES-OPEN_SEDAN-INDIVIDUAL_LOCATION_LIMITS',
          'This human is trying to gerrymander their visits.'
        ],
        authData: ({
          authorizationTypeCode: ReferralAuthorizationTypeCode.OPEN_SEDAN,
          authorizationId: 123126,
          rush: false,
          paidAsExpense: true,
          startDate: '2019-02-02',
          endDate: '2019-02-03',
          specifyTripsByLocation: true,
          tripsAuthorized: 35,
          unlimitedTrips: false,
          noLocationRestrictions: false,
          approvedLocations: {
            'Physical Therapy': {
              '5': {
                locationSelected: true,
                locationTripCount: 10
              }
            },
            Pharmacy: {
              '6': {
                locationSelected: false,
                locationTripCount: 0
              },
              '12': {
                locationSelected: false,
                locationTripCount: 0
              }
            },
            Work: {
              '30': {
                locationSelected: true,
                locationTripCount: 0
              },
              '31': {
                locationSelected: true,
                locationTripCount: 0
              }
            },
            Doctor: {
              '1': {
                locationSelected: false,
                locationTripCount: 0
              },
              '2': {
                locationSelected: true,
                locationTripCount: 12
              },
              '3': {
                locationSelected: true,
                locationTripCount: 13
              }
            },
            Home: {
              '0': {
                locationSelected: true,
                locationTripCount: 0
              }
            },
            Other: {
              '7': {
                locationSelected: false,
                locationTripCount: 0
              },
              '8': {
                locationSelected: false,
                locationTripCount: 0
              },
              '9': {
                locationSelected: false,
                locationTripCount: 0
              },
              '10': {
                locationSelected: false,
                locationTripCount: 0
              },
              '11': {
                locationSelected: false,
                locationTripCount: 0
              }
            }
          }
        } as unknown) as TransportationAuthorizationOpenSedanFormData
      }
    ]
  },
  claimLocations: [
    {
      id: '0',
      name: 'My house',
      typeDescription: 'Home',
      type: null,
      address: null
    },
    {
      id: '1',
      name: "Dr Don't Use A Period",
      typeDescription: 'Doctor',
      type: null,
      address: null
    },
    {
      id: '2',
      name: 'Dr Jan Itor',
      typeDescription: 'Doctor',
      type: null,
      address: null
    },
    {
      id: '3',
      name: 'Dr John Smith',
      typeDescription: 'Doctor',
      type: null,
      address: null
    },
    {
      id: '5',
      name: 'Rose Radiology',
      typeDescription: 'Physical Therapy',
      type: null,
      address: null
    },
    {
      id: '12',
      name: 'CVS',
      typeDescription: 'Pharmacy',
      type: null,
      address: null
    },
    {
      id: '6',
      name: 'Walgreens',
      typeDescription: 'Pharmacy',
      type: null,
      address: null
    },
    {
      id: '7',
      name: "Pizzas 'r' us",
      typeDescription: 'Other',
      type: null,
      address: null
    },
    {
      id: '8',
      name: 'Home Guys',
      typeDescription: 'Other',
      type: null,
      address: null
    },
    {
      id: '9',
      name: 'Flat Health',
      typeDescription: 'Other',
      type: null,
      address: null
    },
    {
      id: '10',
      name: 'Web MD',
      typeDescription: 'Other',
      type: null,
      address: null
    },
    {
      id: '11',
      name: 'iMeds',
      typeDescription: 'Other',
      type: null,
      address: null
    },
    {
      id: '30',
      name: 'The guys work place',
      typeDescription: 'Work',
      type: null,
      address: null
    },
    {
      id: '31',
      name: 'His other work place',
      typeDescription: 'Work',
      type: null,
      address: null
    }
  ]
};

export const imdbDateRangeChangeOpenWheelchairUnlimitedTripsAtChosenLocationsTogether = {
  archeType: 'Transportation',
  authorizationType: 'OPEN',
  referralAuthorization: {
    vendorNote:
      "TODO: Pull these from an API since it's not on the /manual-authorizations endpoint",
    subHeaderNote:
      '`May consist of mileage, wait time, or other miscellaneous fees`, but verbiage may otherwise vary by authorization',
    authorizationItems: [
      {
        reasonsReviewIsNeeded: [
          'DATE_RANGE_CHANGE-OPEN_WHEELCHAIR-UNLIMITED_TRIPS_AT_CHOSEN_LOCATIONS_TOGETHER',
          'No more rooms',
          'Date too old'
        ],
        authData: {
          authorizationTypeCode: 'OPEN_WHEELCHAIR',
          authorizationId: 123127,
          rush: false,
          paidAsExpense: false,
          startDate: '2012-02-02',
          endDate: '2012-02-03',
          specifyTripsByLocation: false,
          tripsAuthorized: null,
          unlimitedTrips: true,
          noLocationRestrictions: false,
          approvedLocations: {
            'Physical Therapy': {
              '5': {
                locationSelected: false,
                locationTripCount: 0
              }
            },
            Pharmacy: {
              '6': {
                locationSelected: false,
                locationTripCount: 0
              },
              '12': {
                locationSelected: false,
                locationTripCount: 0
              }
            },
            Work: {
              '30': {
                locationSelected: false,
                locationTripCount: 0
              },
              '31': {
                locationSelected: false,
                locationTripCount: 0
              }
            },
            Doctor: {
              '1': {
                locationSelected: false,
                locationTripCount: 0
              },
              '2': {
                locationSelected: true,
                locationTripCount: 0
              },
              '3': {
                locationSelected: true,
                locationTripCount: 0
              }
            },
            Home: {
              '0': {
                locationSelected: false,
                locationTripCount: 0
              }
            },
            Other: {
              '7': {
                locationSelected: false,
                locationTripCount: 0
              },
              '8': {
                locationSelected: false,
                locationTripCount: 0
              },
              '9': {
                locationSelected: false,
                locationTripCount: 0
              },
              '10': {
                locationSelected: false,
                locationTripCount: 0
              },
              '11': {
                locationSelected: false,
                locationTripCount: 0
              }
            }
          },
          steps: 66,
          wheelchairType: 'Has Power Wheelchair'
        }
      }
    ]
  },
  claimLocations: [
    {
      id: 0,
      name: 'My house',
      typeDescription: 'Home',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '123 Fake Street',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: 1234
      }
    },
    {
      id: 1,
      name: "Dr Don't Use A Period",
      typeDescription: 'Doctor',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: "Can't have a control name including some characters",
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 2,
      name: 'Dr Jan Itor',
      typeDescription: 'Doctor',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '987 Something Square',
        city: 'Tampa',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 3,
      name: 'Dr John Smith',
      typeDescription: 'Doctor',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '654 Nothing Triangle',
        streetAddress2: 'Ste 321',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 5,
      name: 'Rose Radiology',
      typeDescription: 'Physical Therapy',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '741 Everything Point',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 12,
      name: 'CVS',
      typeDescription: 'Pharmacy',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '852 Artifical Pentagon',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 6,
      name: 'Walgreens',
      typeDescription: 'Pharmacy',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '963 Organic Hexagon',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 7,
      name: "Pizzas 'r' us",
      typeDescription: 'Other',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '147 Superficial Octagon',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 8,
      name: 'Home Guys',
      typeDescription: 'Other',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '258 Subficial Nonagon',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 9,
      name: 'Flat Health',
      typeDescription: 'Other',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '369 Hyperficial Decagon',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 10,
      name: 'Web MD',
      typeDescription: 'Other',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '456 Real Circle',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 11,
      name: 'iMeds',
      typeDescription: 'Other',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '798 Imaginary Lane',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 30,
      name: 'The guys work place',
      typeDescription: 'Work',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '654 Weeeeeee Downhill',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    },
    {
      id: 31,
      name: 'His other work place',
      typeDescription: 'Work',
      locationCreationRecord: {
        timeCreated: null,
        createdBy: null
      },
      phone: '555-555-1234',
      address: {
        streetAddress1: '951 Uphill In the Snow Circle',
        city: 'Tampa',
        state: 'FL',
        zipCode: 33609,
        zipCodeExt: -1
      }
    }
  ]
};

export const imdbReferralAuthorizationsData: {}[] = [
  { id: '343039353932', ...imdbDetailedAuthorization },
  {
    id: '343039323032',
    ...imdbIndividualLocationLimitChangesOpenSedanIndividualLocationLimits
  },
  {
    id: '343039323035',
    ...imdbDateRangeChangeOpenWheelchairUnlimitedTripsAtChosenLocationsTogether
  }
];

export const imdbReferralAuthorizationOptions: ReferralAuthorizationOptions = {
  denialReasons: [
    'Not Medically Necessary',
    'Discharged by MD',
    'Claim settled',
    'IW reached maximum medical improvement (MMI)',
    'Service not related to this claim',
    'Patient non-compliance',
    'From IMDB'
  ],
  pendingReasons: ['Pend for Utilization Review', 'Pend to Vendor']
};
