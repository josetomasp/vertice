import { SearchOptions } from '../../search-nav/store/models/search-options.model';

export const searchNavReferrals = [
  {
    id: 1,
    referralId: '97652411',
    claimNumber: 'C000662',
    claimantName: 'Jessi Uribe',
    dateReceived: '12/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 2,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Paola Jara',
    dateReceived: '01/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 3,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Marco Antonio Solis',
    dateReceived: '03/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 4,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Christian Nodal',
    dateReceived: '04/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 5,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Vicente Fernandez',
    dateReceived: '04/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 6,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Isidoro Camacho',
    dateReceived: '04/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 7,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Bill Arthur',
    dateReceived: '04/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 8,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Jax Georgene',
    dateReceived: '04/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 9,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Dudley Normina',
    dateReceived: '04/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 10,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Paul Potter',
    dateReceived: '04/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    id: 11,
    referralId: '1141232',
    claimNumber: 'EYL5821',
    claimantName: 'Andrei Morera',
    dateReceived: '04/30/2020',
    requestorRoleName: 'Contracted provider/John Doe',
    status: 'Submitted',
    serviceType: 'DME',
    vendor: 'Homelink'
  }
];

export const searchNavOptions: SearchOptions = {
  assignedAdjustersAllAuthByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'travelersdefault',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'travelersdefault',
              value: 'travelersdefault'
            },
            {
              label: 'travelersSpecificAdjuster1',
              value: 'travelersSpecificAdjuster1'
            },
            {
              label: 'travelersSpecificAdjuster2',
              value: 'travelersSpecificAdjuster2'
            }
          ]
        }
      }
    }
  },
  assignedAdjustersPOSAuthByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'travelersdefault',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'travelersdefault',
              value: 'travelersdefault'
            },
            {
              label: 'travelersSpecificAdjuster1',
              value: 'travelersSpecificAdjuster1'
            },
            {
              label: 'travelersSpecificAdjuster2',
              value: 'travelersSpecificAdjuster2'
            }
          ]
        }
      }
    }
  },
  assignedAdjustersPaperBillByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'travelersdefault',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'travelersdefault',
              value: 'travelersdefault'
            },
            {
              label: 'travelersSpecificAdjuster1',
              value: 'travelersSpecificAdjuster1'
            },
            {
              label: 'travelersSpecificAdjuster2',
              value: 'travelersSpecificAdjuster2'
            }
          ]
        }
      }
    }
  },
  assignedAdjustersClinicalByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'travelersdefault',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'travelersdefault',
              value: 'travelersdefault'
            },
            {
              label: 'travelersSpecificAdjuster1',
              value: 'travelersSpecificAdjuster1'
            },
            {
              label: 'travelersSpecificAdjuster2',
              value: 'travelersSpecificAdjuster2'
            }
          ]
        }
      }
    }
  },
  assignedAdjustersMailOrderAuthByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'travelersdefault',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'travelersdefault',
              value: 'travelersdefault'
            },
            {
              label: 'travelersSpecificAdjuster1',
              value: 'travelersSpecificAdjuster1'
            },
            {
              label: 'travelersSpecificAdjuster2',
              value: 'travelersSpecificAdjuster2'
            }
          ]
        }
      }
    }
  },
  customerIds: {
    valuesByScreen: {
      ALL: {
        defaultValue: 'TRAVELERS',
        values: [
          {
            label: '6000AMER',
            value: '6000AMER'
          },
          {
            label: '6000BRAC',
            value: '6000BRAC'
          },
          {
            label: '6000CBRS',
            value: '6000CBRS'
          },
          {
            label: '6000CSOK',
            value: '6000CSOK'
          },
          {
            label: '6000EMRM',
            value: '6000EMRM'
          },
          {
            label: '6000FCCI',
            value: '6000FCCI'
          },
          {
            label: '6000JECO',
            value: '6000JECO'
          },
          {
            label: '6000LWCC',
            value: '6000LWCC'
          },
          {
            label: '6000MIAM',
            value: '6000MIAM'
          },
          {
            label: '6000SCFA',
            value: '6000SCFA'
          },
          {
            label: '6000SCIF',
            value: '6000SCIF'
          },
          {
            label: '6000SENT',
            value: '6000SENT'
          },
          {
            label: '6000WEST',
            value: '6000WEST'
          },
          {
            label: 'Acuity',
            value: 'Acuity'
          },
          {
            label: 'AIMS',
            value: 'AIMS'
          },
          {
            label: 'AMC',
            value: 'AMC'
          },
          {
            label: 'AMCALAM',
            value: 'AMCALAM'
          },
          {
            label: 'AMCSACR',
            value: 'AMCSACR'
          },
          {
            label: 'DEMO',
            value: 'DEMO'
          },
          {
            label: 'GALLAGHER',
            value: 'GALLAGHER'
          },
          {
            label: 'HARTFORD',
            value: 'HARTFORD'
          },
          {
            label: 'LIBERTY',
            value: 'LIBERTY'
          },
          {
            label: 'MIDWEST',
            value: 'MIDWEST'
          },
          {
            label: 'PARADIGM',
            value: 'PARADIGM'
          },
          {
            label: 'TRAVELERS',
            value: 'TRAVELERS'
          },
          {
            label: 'TRISTAR',
            value: 'TRISTAR'
          },
          {
            label: 'Zurich',
            value: 'Zurich'
          }
        ]
      }
    }
  },
  statesOfVenue: {
    valuesByScreen: {
      ALL: {
        defaultValue: 'All',
        values: [
          {
            label: 'All',
            value: 'All'
          },
          {
            label: 'AK',
            value: 'AK'
          },
          {
            label: 'AL',
            value: 'AL'
          },
          {
            label: 'AR',
            value: 'AR'
          },
          {
            label: 'AZ',
            value: 'AZ'
          },
          {
            label: 'CA',
            value: 'CA'
          },
          {
            label: 'CO',
            value: 'CO'
          },
          {
            label: 'CT',
            value: 'CT'
          },
          {
            label: 'DC',
            value: 'DC'
          },
          {
            label: 'DE',
            value: 'DE'
          },
          {
            label: 'FL',
            value: 'FL'
          },
          {
            label: 'GA',
            value: 'GA'
          },
          {
            label: 'HI',
            value: 'HI'
          },
          {
            label: 'IA',
            value: 'IA'
          },
          {
            label: 'ID',
            value: 'ID'
          },
          {
            label: 'IL',
            value: 'IL'
          },
          {
            label: 'IN',
            value: 'IN'
          },
          {
            label: 'KS',
            value: 'KS'
          },
          {
            label: 'KY',
            value: 'KY'
          },
          {
            label: 'LA',
            value: 'LA'
          },
          {
            label: 'MA',
            value: 'MA'
          },
          {
            label: 'MD',
            value: 'MD'
          },
          {
            label: 'ME',
            value: 'ME'
          },
          {
            label: 'MI',
            value: 'MI'
          },
          {
            label: 'MN',
            value: 'MN'
          },
          {
            label: 'MO',
            value: 'MO'
          },
          {
            label: 'MS',
            value: 'MS'
          },
          {
            label: 'MT',
            value: 'MT'
          },
          {
            label: 'NC',
            value: 'NC'
          },
          {
            label: 'ND',
            value: 'ND'
          },
          {
            label: 'NE',
            value: 'NE'
          },
          {
            label: 'NH',
            value: 'NH'
          },
          {
            label: 'NJ',
            value: 'NJ'
          },
          {
            label: 'NM',
            value: 'NM'
          },
          {
            label: 'NV',
            value: 'NV'
          },
          {
            label: 'NY',
            value: 'NY'
          },
          {
            label: 'OH',
            value: 'OH'
          },
          {
            label: 'OK',
            value: 'OK'
          },
          {
            label: 'OR',
            value: 'OR'
          },
          {
            label: 'PA',
            value: 'PA'
          },
          {
            label: 'RI',
            value: 'RI'
          },
          {
            label: 'SC',
            value: 'SC'
          },
          {
            label: 'SD',
            value: 'SD'
          },
          {
            label: 'TN',
            value: 'TN'
          },
          {
            label: 'TX',
            value: 'TX'
          },
          {
            label: 'UT',
            value: 'UT'
          },
          {
            label: 'VA',
            value: 'VA'
          },
          {
            label: 'VT',
            value: 'VT'
          },
          {
            label: 'WA',
            value: 'WA'
          },
          {
            label: 'WI',
            value: 'WI'
          },
          {
            label: 'WV',
            value: 'WV'
          },
          {
            label: 'WY',
            value: 'WY'
          }
        ]
      }
    }
  },
  vendorsByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'All',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Homelink',
              value: 'Homelink'
            },
            {
              label: 'Vendor2',
              value: 'Vendor2'
            },
            {
              label: 'Vendor3',
              value: 'Vendor3'
            }
          ]
        }
      }
    }
  },
  abmServiceTypesByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'All',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'DME',
              value: 'DME'
            },
            {
              label: 'Language',
              value: 'Language'
            },
            {
              label: 'DX',
              value: 'DX'
            },
            {
              label: 'Home Health',
              value: 'Home Health'
            },
            {
              label: 'Transportation',
              value: 'Transportation'
            },
            {
              label: 'Physical Medicine',
              value: 'Physical Medicine'
            }
          ]
        }
      }
    }
  },
  allServiceTypesByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'All',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'These sample values my be completely wrong',
              value: 'test'
            },
            {
              label: 'ePaq',
              value: 'ePaq'
            },
            {
              label: 'Paper Bill Roster',
              value: 'Paper Bill Roster'
            },
            {
              label: 'Mail Order',
              value: 'Mail Order'
            },
            {
              label: 'Claim Resolution',
              value: 'Claim Resolution'
            },
            {
              label: 'TA Letter',
              value: 'TA Letter'
            },
            {
              label: 'IPE',
              value: 'IPE'
            },
            {
              label: 'DME',
              value: 'DME'
            },
            {
              label: 'Language',
              value: 'Language'
            },
            {
              label: 'DX',
              value: 'DX'
            },
            {
              label: 'Home Health',
              value: 'Home Health'
            },
            {
              label: 'Transportation',
              value: 'Transportation'
            },
            {
              label: 'Physical Medicine',
              value: 'Physical Medicine'
            }
          ]
        }
      }
    }
  },
  epaqStatusQueuesByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'Pending',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Pending',
              value: 'Pending'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Waiting on ePAQ stuff',
              value: 'Waiting on ePAQ stuff'
            }
          ]
        }
      }
    }
  },
  paperBillStatusQueuesByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'Pending',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Pending',
              value: 'Pending'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Waiting on paper relations',
              value: 'Waiting on paper relations'
            }
          ]
        }
      }
    }
  },
  pbmReconsiderations: {
    valuesByScreen: {
      ALL: {
        defaultValue: 'All',
        values: [
          {
            label: 'All',
            value: 'All'
          },
          {
            label: 'Reconsideration',
            value: 'Reconsideration'
          },
          {
            label: 'CA Lien',
            value: 'CA Lien'
          },
          {
            label: 'No',
            value: 'No'
          }
        ]
      }
    }
  },
  pbmClinicalServiceTypes: {
    valuesByScreen: {
      ALL: {
        defaultValue: 'All',
        values: [
          {
            label: 'All',
            value: 'All'
          },
          {
            label: 'IPE',
            value: 'IPE'
          },
          {
            label: 'TA',
            value: 'TA'
          },
          {
            label: 'Teleconsult',
            value: 'Teleconsult'
          }
        ]
      }
    }
  },
  claimResolutionStatusQueuesByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'Claim Resolution',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Claim Resolution',
              value: 'Claim Resolution'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Waiting on decision',
              value: 'Waiting on decision'
            }
          ]
        }
      }
    }
  },
  clinicalServiceStatusQueuesByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'All',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Not started',
              value: 'Not started'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Waiting on clinics',
              value: 'Waiting on clinics'
            }
          ]
        }
      }
    }
  },
  referralStatusQueuesByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        'Referral Authorization Search': {
          defaultValue: 'Awaiting authorization',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Not started',
              value: 'Not started'
            },
            {
              label: 'Pend to Vendor',
              value: 'Pend to Vendor'
            },
            {
              label: 'Draft',
              value: 'Draft'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Awaiting authorization',
              value: 'Awaiting authorization'
            },
            {
              label: 'Authorization Required',
              value: 'Authorization Required'
            }
          ]
        },
        'Referral Activity': {
          defaultValue: 'All',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Not started',
              value: 'Not started'
            },
            {
              label: 'Pend to Vendor',
              value: 'Pend to Vendor'
            },
            {
              label: 'Draft',
              value: 'Draft'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Awaiting authorization',
              value: 'Awaiting authorization'
            },
            {
              label: 'Authorization Required',
              value: 'Authorization Required'
            }
          ]
        },
        'Pending Referrals': {
          defaultValue: 'Pend to Vendor',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Not started',
              value: 'Not started'
            },
            {
              label: 'Pend to Vendor',
              value: 'Pend to Vendor'
            },
            {
              label: 'Draft',
              value: 'Draft'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Awaiting authorization',
              value: 'Awaiting authorization'
            },
            {
              label: 'Authorization Required',
              value: 'Authorization Required'
            }
          ]
        },
        'Draft Referrals': {
          defaultValue: 'Draft',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Not started',
              value: 'Not started'
            },
            {
              label: 'Pend to Vendor',
              value: 'Pend to Vendor'
            },
            {
              label: 'Draft',
              value: 'Draft'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Awaiting authorization',
              value: 'Awaiting authorization'
            },
            {
              label: 'Authorization Required',
              value: 'Authorization Required'
            }
          ]
        },
        'Paper Bill Roster Authorization Search': {
          defaultValue: 'Awaiting authorization',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Not started',
              value: 'Not started'
            },
            {
              label: 'Pend to Vendor',
              value: 'Pend to Vendor'
            },
            {
              label: 'Draft',
              value: 'Draft'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Awaiting authorization',
              value: 'Awaiting authorization'
            },
            {
              label: 'Authorization Required',
              value: 'Authorization Required'
            }
          ]
        },
        'Clinical Services Authorization Search': {
          defaultValue: 'Awaiting authorization',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'Started',
              value: 'Started'
            },
            {
              label: 'Not started',
              value: 'Not started'
            },
            {
              label: 'Pend to Vendor',
              value: 'Pend to Vendor'
            },
            {
              label: 'Draft',
              value: 'Draft'
            },
            {
              label: 'Authorized',
              value: 'Authorized'
            },
            {
              label: 'Awaiting authorization',
              value: 'Awaiting authorization'
            },
            {
              label: 'Authorization Required',
              value: 'Authorization Required'
            }
          ]
        }
      }
    }
  },
  referralAdjustersByCustomer: {
    TRAVELERS: {
      valuesByScreen: {
        ALL: {
          defaultValue: 'travelersdefault',
          values: [
            {
              label: 'All',
              value: 'All'
            },
            {
              label: 'travelersdefault',
              value: 'travelersdefault'
            },
            {
              label: 'travelersSpecificAdjuster1',
              value: 'travelersSpecificAdjuster1'
            },
            {
              label: 'travelersSpecificAdjuster2',
              value: 'travelersSpecificAdjuster2'
            }
          ]
        }
      }
    }
  },
  isOptionsLoading: false,
  hasSearchOptionsAttemptedToLoadOnce: false,
  errors: []
};

export const searchAllAuthorizationsIMDB = [
  {
    allServiceType: 'DME Referral',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'ePAQ',
    rush: 'No',
    claimNumber: '223',
    claimantName: 'Jerry Lewis2',
    stateOfVenue: 'TX',
    dateOfInjury: '10/05/2019',
    assignedAdjuster: 'B. Handler',
    dateReceived: '02/02/2020',
    status: 'Pending',
    vendor: 'Worklink'
  },
  {
    allServiceType: 'Home Health Referral',
    rush: 'Yes',
    claimNumber: '1253',
    claimantName: 'Jerry Lewis3',
    stateOfVenue: 'FL',
    dateOfInjury: '02/02/2019',
    assignedAdjuster: 'C. Handler',
    dateReceived: '05/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'DME Referral',
    rush: 'No',
    claimNumber: '1253',
    claimantName: 'Jerry Lewiss',
    stateOfVenue: 'FL',
    dateOfInjury: '11/02/2019',
    assignedAdjuster: 'D. Handler',
    dateReceived: '04/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'Paper Bill Roster',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'Mail Order',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'Claim Resolution',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'TA Letter',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'IPE',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'Language Referral',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'DX Referral',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Homelink'
  },
  {
    allServiceType: 'Transportation Referral',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Worksync'
  },
  {
    allServiceType: 'Physical Medicine Referral',
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    vendor: 'Placeconnect'
  }
];

export const searchEpaqAuthorizationsIMDB = [
  {
    epaqId: '1',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'Pending',
    pending: 'No'
  },
  {
    epaqId: '2',
    claimNumber: '223',
    claimantName: 'Jerry Lewis2',
    stateOfVenue: 'TX',
    assignedAdjuster: 'B. Handler',
    dateAdded: '10/05/2019',
    dateModified: '02/02/2020',
    modifiedBy: 'joleary',
    status: 'Pending',
    pending: 'No'
  },
  {
    epaqId: '3',
    claimNumber: '1253',
    claimantName: 'Jerry Lewis3',
    stateOfVenue: 'FL',
    assignedAdjuster: 'C. Handler',
    dateAdded: '02/02/2019',
    dateModified: '05/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'Pending',
    pending: 'Yes'
  },
  {
    epaqId: '4',
    claimNumber: '1253',
    claimantName: 'Jerry Lewiss',
    stateOfVenue: 'FL',
    assignedAdjuster: 'D. Handler',
    dateAdded: '11/02/2019',
    dateModified: '04/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'Not Pending',
    pending: 'No'
  },
  {
    epaqId: '5',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'All Mocked',
    pending: 'No'
  },
  {
    epaqId: '6',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'Pending',
    pending: 'No'
  },
  {
    epaqId: '7',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'Pending',
    pending: 'No'
  },
  {
    epaqId: '8',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'Pending',
    pending: 'Yes'
  },
  {
    epaqId: '9',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'Pending',
    pending: 'No'
  },
  {
    epaqId: '10',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'Pending',
    pending: 'No'
  },
  {
    epaqId: '11',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'travelersdefault',
    status: 'Pending',
    pending: 'No'
  },
  {
    epaqId: '12',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'chandler',
    status: 'Pending',
    pending: 'No'
  },
  {
    epaqId: '13',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    assignedAdjuster: 'A. Handler',
    dateAdded: '10/02/2019',
    dateModified: '02/03/2020',
    modifiedBy: 'thandler',
    status: 'Pending',
    pending: 'No'
  }
];

export const searchPaperAuthorizationsIMDB = [
  {
    paperBillId: 1,
    claimNumber: 'C000662',
    claimantName: 'Tom Dolton',
    stateOfVenue: 'FL',
    assignedAdjuster: 'Billy Bob Thorton',
    dateAdded: '10/22/2020',
    dateModified: '10/23/2020',
    modifiedBy: 'Captain BoJangles',
    status: 'Pending',
    locked: 'No',
    dateOfService: '10/20/2020',
    providerName: 'Donald Duck',
    dateBillReceived: '10/21/2020',
    dateActionBy: '10/31/2020',
    reconsideration: 'Y'
  },
  {
    paperBillId: 2,
    claimNumber: 'C000663',
    claimantName: 'Justin Smith',
    stateOfVenue: 'VA',
    assignedAdjuster: 'Rex Tillerson',
    dateAdded: '03/22/2020',
    dateModified: '03/23/2020',
    modifiedBy: 'Captain Kirk',
    status: 'Started',
    locked: 'Yes',
    dateOfService: '03/20/2020',
    providerName: 'Daffy Duck',
    dateBillReceived: '03/21/2020',
    dateActionBy: '03/31/2020',
    reconsideration: ''
  },
  {
    paperBillId: 3,
    claimNumber: 'C000664',
    claimantName: 'Sarah Conner',
    stateOfVenue: 'TX',
    assignedAdjuster: 'Texas Pete',
    dateAdded: '09/22/2020',
    dateModified: '09/23/2020',
    modifiedBy: 'Captain Planet',
    status: 'Approved',
    locked: 'No',
    dateOfService: '09/20/2020',
    providerName: 'Darkwing Duck',
    dateBillReceived: '09/21/2020',
    dateActionBy: '09/31/2020',
    reconsideration: ''
  }
];

export const searchClinicalAuthorizationsIMDB = [
  {
    type: 'TA Letter',
    claimNumber: 'C000662',
    claimantName: 'Tom Dolton',
    stateOfVenue: 'FL',
    assignedAdjuster: 'Billy Bob Thorton',
    dateAdded: '10/22/2020',
    dateModified: '10/23/2020',
    modifiedBy: 'Captain BoJangles',
    status: 'Pending',
    locked: 'No',
    prescriber: 'Donald Duck',
    fieldOffice: 'Alpha',
    exParteCopy: 'Some long legal text, blah, blah, blah'
  },
  {
    type: 'Blue',
    claimNumber: 'C000663',
    claimantName: 'Justin Smith',
    stateOfVenue: 'VA',
    assignedAdjuster: 'Rex Tillerson',
    dateAdded: '03/22/2020',
    dateModified: '03/23/2020',
    modifiedBy: 'Captain Kirk',
    status: 'Started',
    locked: 'Yes',
    prescriber: 'Daffy Duck',
    fieldOffice: 'Zeta',
    exParteCopy: 'Legal Stuff goes here.'
  },
  {
    type: 'Piano',
    claimNumber: 'C000664',
    claimantName: 'Sarah Conner',
    stateOfVenue: 'TX',
    assignedAdjuster: 'Texas Pete',
    dateAdded: '09/22/2020',
    dateModified: '09/23/2020',
    modifiedBy: 'Captain Planet',
    status: 'Approved',
    locked: 'No',
    prescriber: 'Darkwing Duck',
    fieldOffice: 'Delta',
    exParteCopy: ''
  }
];

export const searchReferralAuthorizationsIMDB = [
  {
    referralId: 4,
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    referralId: 5,
    rush: 'No',
    claimNumber: '223',
    claimantName: 'Jerry Lewis2',
    stateOfVenue: 'TX',
    dateOfInjury: '10/05/2019',
    assignedAdjuster: 'B. Handler',
    dateReceived: '02/02/2020',
    status: 'Pending',
    serviceType: 'Homehealth',
    vendor: 'Worklink'
  },
  {
    referralId: 7,
    rush: 'Yes',
    claimNumber: '1253',
    claimantName: 'Jerry Lewis3',
    stateOfVenue: 'FL',
    dateOfInjury: '02/02/2019',
    assignedAdjuster: 'C. Handler',
    dateReceived: '05/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    referralId: 7,
    rush: 'No',
    claimNumber: '1253',
    claimantName: 'Jerry Lewiss',
    stateOfVenue: 'FL',
    dateOfInjury: '11/02/2019',
    assignedAdjuster: 'D. Handler',
    dateReceived: '04/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    referralId: 4,
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    referralId: 4,
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    referralId: 4,
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    referralId: 4,
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    referralId: 4,
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    referralId: 4,
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  },
  {
    referralId: 4,
    rush: 'No',
    claimNumber: '123',
    claimantName: 'Jerry Lewis',
    stateOfVenue: 'FL',
    dateOfInjury: '10/02/2019',
    assignedAdjuster: 'A. Handler',
    dateReceived: '02/03/2020',
    status: 'Pending',
    serviceType: 'DME',
    vendor: 'Homelink'
  }
];

export const searchDraftReferralsIMDB = [
  {
    draftId: '1001',
    claimNumber: 'C000662',
    adjuster: 'Alice Adjuster',
    saveDate: '10/02/2019',
    status: 'Draft',
    serviceType: 'DME'
  },
  {
    draftId: '1002',
    claimNumber: 'C000663',
    adjuster: 'Alice Adjuster',
    saveDate: '10/04/2019',
    status: 'Draft',
    serviceType: 'TRANS'
  },
  {
    draftId: '1801',
    claimNumber: 'C000664',
    adjuster: 'Alice Adjuster',
    saveDate: '11/11/2019',
    status: 'Draft',
    serviceType: 'LAN'
  },
  {
    draftId: '927551',
    claimNumber: 'C000664',
    adjuster: 'Alice Adjuster',
    saveDate: '11/11/2019',
    status: 'Draft',
    serviceType: 'DX'
  },
  {
    draftId: '927893',
    claimNumber: 'C000664',
    adjuster: 'Alice Adjuster',
    saveDate: '11/11/2019',
    status: 'Draft',
    serviceType: 'HH'
  },
  {
    draftId: '927958',
    claimNumber: 'C000664',
    adjuster: 'Alice Adjuster',
    saveDate: '11/11/2019',
    status: 'Draft',
    serviceType: 'DME'
  }
];

export const pendingAuthorizationsDashboardIMDB = [
  {
    assignedAdjuster: 'All',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 6
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 1
          },
          {
            age: 'Day 4 and greater',
            count: 12
          }
        ]
      },
      {
        authorizationType: 'ABM-DME',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 1
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 4
          }
        ]
      },
      {
        authorizationType: 'IPE',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      },
      {
        authorizationType: 'Paper',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      },
      {
        authorizationType: 'EPAQ',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      },
      {
        authorizationType: 'Mail Order',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'mleiser@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 6
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 1
          },
          {
            age: 'Day 4 and greater',
            count: 12
          }
        ]
      },
      {
        authorizationType: 'ABM-DME',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 1
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 4
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'mshockle@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 1
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'kmolson@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-DME',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 1
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 0
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'swoodley@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 1
          },
          {
            age: 'Day 4 and greater',
            count: 0
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'scowan@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'mleiser@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 1
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 2
          }
        ]
      },
      {
        authorizationType: 'ABM-DME',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'mleiser@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 1
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 2
          }
        ]
      },
      {
        authorizationType: 'ABM-DME',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'mshockle@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 1
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'sherbols@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'mleiser@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'ABM-TRP',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 1
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 2
          }
        ]
      },
      {
        authorizationType: 'ABM-DME',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'mrobins7@travelers.com',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'IPE',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: '',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'Paper',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'SLSPAYD',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'EPAQ',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  },
  {
    assignedAdjuster: 'MDSTACK',
    pendingAuthorizationDashboardDataByType: [
      {
        authorizationType: 'Mail Order',
        pendingAuthorizationDashboardData: [
          {
            age: 'Day 1',
            count: 0
          },
          {
            age: 'Day 2',
            count: 0
          },
          {
            age: 'Day 3',
            count: 0
          },
          {
            age: 'Day 4 and greater',
            count: 1
          }
        ]
      }
    ]
  }
];

export const MAIL_ORDER_AUTHORIZATION_SEARCH_RESULTS_DATA_IMDB = [
  {
    referralId: 43998,
    claimNumber: 'C000662',
    claimantName: 'Devante, Shirkey',
    denialReason: 'Just No',
    assignedAdjuster: 'Leiser, Margo',
    dateAdded: '06/21/2016',
    dateModified: '02/13/2018',
    modifiedBy: 'PHAYES',
    lockedBy: '',
    notes:
      '02/13/18 - EXHAUSTED EFFORTS - SENT EMAIL TO ADJ -PHAYES\r\n02/05/18 - LEFT VM FOR NURSE @ DR VU 337-433-6500 - PHAYES\r\n01/25/17 - 2ND FAX SENT TO DR VU @ 337-214-4435 - PHAYES\r\n01/12/18 - 1ST FAX SENT TO DR VU @ 337-214-4435 - PHAYES\r\n01/09/18 - CONTACT PRESCRIBER FOR RXS. PHAYES\r\n\r\n**EST**\r\n12/22/2017 @14:29 - **REGISTER IW**\r\n\r\nDICLOFENAC GEL 1%,  LIDODERM DIS 5%, CYCLOBENZAPR TAB 10MG, CLONAZEPAM TAB 0.5MG, TRAZODONE TAB 50MG-VANCHI VU (318) 272-7926 \r\n\r\nVER ADDRESS - PHONE # - NO EMAIL \r\n\r\n**ALLERGIES:  NONE & MEDICAL CONDITIONS: RSD** - AREVERON\r\n\r\n\r\n10/24/17 @12:23 - NEGATIVE ID VM GREETING @   - LVM FOR IW - ELOTT'
  },
  {
    referralId: 65487,
    claimNumber: 'C000662',
    claimantName: 'Devante, Shirkey',
    denialReason: 'Submitted too late',
    assignedAdjuster: 'Leiser, Margo',
    dateAdded: '08/21/2016',
    dateModified: '04/13/2018',
    modifiedBy: 'PHAYES',
    lockedBy: '',
    notes: ''
  },
  {
    referralId: 12354,
    claimNumber: 'C000662',
    claimantName: 'Devante, Shirkey',
    denialReason: 'Missing required information',
    assignedAdjuster: 'Leiser, Margo',
    dateAdded: '06/26/2016',
    dateModified: '02/15/2018',
    modifiedBy: 'PHAYES',
    lockedBy: 'nbody',
    notes:
      '**ALLERGIES:  NONE & MEDICAL CONDITIONS: RSD** - AREVERON\r\n\r\n\r\n10/24/17 @12:23 - NEGATIVE ID VM GREETING @   - LVM FOR IW - ELOTT'
  }
];
