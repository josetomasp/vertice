export const C000662ClaimV2 = {
  claimNumber: '43303030363632',
  customerId: '54524156454c455253',
  header: {
    transactionId: 'FCCI0000000000123456',
    customerCode: '6000FCCI',
    hesClaimNumber: 'ABC1234',
    dateTimeStamp: '2019-02-21T15:08:32.887'
  },
  stateOfVenue: 'FL',
  injuryDate: '2019-02-21',
  phiMemberId: '123456789',
  modifiedDateTime: '2019-02-17',
  createdDateTime: '2019-02-16',
  claimOpenDate: '2019-02-18',
  claimReopenDate: '2019-02-19',
  claimClosedDate: '2019-02-20',
  claimReclosedDate: '2019-02-21',
  claimStatuses: [
    {
      productType: 'PBM',
      claimStatus: 'ACTIVE',
      productTypeEffectiveDate: '2019-02-16',
      productTypeTerminationDate: '2019-02-17',
      productTypeHesInactiveDate: '2019-02-18'
    },
    {
      productType: 'ABM',
      claimStatus: 'ACTIVE',
      productTypeEffectiveDate: '2019-02-19',
      productTypeTerminationDate: '2019-02-20',
      productTypeHesInactiveDate: '2019-02-21'
    }
  ],
  drugFormulary: 'FCCI1234',
  accidentDescription:
    'Slipped and fell into ellipses for science so that this is long enough to demonstrate ellipses here',
  injuryDescription: 'Knee Issues',
  apportionmentFlag: true,
  apportionmentPercent: 20,
  claimantPercent: 10,
  otherApportionmentPercent: 5,
  otherApportionmentDescription: 'Street Pharmacist has a vested interest',
  controvertedClaimIndicator: 'N',
  coverageIndicator: 'N',
  lockedClaimIndicator: 'Y',
  maintenanceOnlyIndicator: 'N',
  sensitivityFlag: false,
  longTermCareFlag: true,
  manuallyLockedUntilDate: '2019-02-22',
  claimLossDesignation: 'X',
  customerProvidedFileStatus: 'X',
  customerProvidedStatusIndicator: 'XXXX',
  customerProvidedStatusText: 'XXXX',
  customerProvidedDispositionCode: 'X',
  naicNumber: '987',
  ncciCarrierCode: '123',
  medicalSettlementType: 'FAF',
  medicalBenefitTerminationDate: '2019-02-21',
  medicalSettlementDate: '2019-02-21',
  policyCoverageEffectiveDate: '2019-02-20',
  policyCoverageTerminationDate: '2019-02-23',
  coveragePaymentType: '01',
  policyNumberIdentifier: '00312551',
  altClaimIdentifiers: [
    {
      identifierValue: '123456789',
      identifierType: 'AGENCY_CLAIM_NUMBER'
    },
    {
      identifierValue: '000000201278',
      identifierType: 'ACQUISITION_CLAIM_NUMBER'
    }
  ],
  claimant: {
    address: {
      address1: '4123 Bakers Street',
      address2: 'Unit 145',
      city: 'New York City',
      state: 'NY',
      zip: '10342'
    },
    communications: [
      {
        type: 'HOME',
        communicationValue: '5553451945'
      },
      {
        type: 'CELL',
        communicationValue: '7648769876'
      },
      {
        type: 'EMAIL',
        communicationValue: 'gfreeman@gmail.com'
      }
    ],
    weight: 160,
    height: 58,
    birthDate: '2019-02-21',
    deathDate: '2019-02-21',
    gender: 'MALE',
    language: 'ENGLISH',
    ssn: '055341432',
    fullName: 'Gordon B Freeman'
  },
  customer: {
    accountCode: 'X',
    clientCode: 'X',
    officeCode: 'X',
    groupCode: 'X'
  },
  employer: {
    address: {
      address1: '253 Workers Lane',
      address2: 'Suite #32',
      city: 'New York City',
      state: 'NY',
      zip: '10234'
    },
    communications: [
      {
        type: 'WORK',
        communicationValue: '7864544432'
      },
      {
        type: 'EMAIL',
        communicationValue: 'support@acme.com'
      }
    ],
    accountId: '1324',
    orgFEIN: '451487124',
    name: 'ACME INC'
  },
  insurer: {
    address: {
      address1: '453 Smiley Ave',
      city: 'Chicago',
      state: 'IL',
      zip: '60345'
    },
    communications: [
      {
        type: 'WORK',
        communicationValue: '7630983445'
      },
      {
        type: 'EMAIL',
        communicationValue: 'someone@coolsville.com'
      }
    ],
    insurerCode: '0146',
    orgFEIN: '451784154',
    name: 'Coolsville Insurance'
  },
  adjuster: {
    address: {
      address1: '1348 Woodstock Lane',
      city: 'Los Angeles',
      state: 'CA',
      zip: '45218'
    },
    communications: [
      {
        type: 'HOME',
        communicationValue: '3256547458'
      },
      {
        type: 'WORK',
        communicationValue: '5554714576'
      },
      {
        type: 'FAX',
        communicationValue: '2341627546'
      },
      {
        type: 'CELL',
        communicationValue: '4872541584'
      },
      {
        type: 'EMAIL',
        communicationValue: 'jsmith@travelers.com'
      }
    ],
    adjusterIdentifier: '321654987',
    fullName: 'John S Smith'
  },
  supervisor: {
    address: {
      address1: '1234 Tomorrowland Way',
      city: 'Tampa',
      state: 'FL',
      zip: '33614'
    },
    communications: [
      {
        type: 'WORK',
        communicationValue: '5421674581'
      },
      {
        type: 'EMAIL',
        communicationValue: 'jharmon@travelers.com'
      }
    ],
    supervisorIdentifier: '89542',
    fullName: 'Jared R Harmon'
  },
  caseManagers: [
    {
      address: {
        address1: '1488 Sunset Drive',
        city: 'Prattsville',
        state: 'AR',
        zip: '72129'
      },
      communications: [
        {
          type: 'WORK',
          communicationValue: '6452788845'
        },
        {
          type: 'EMAIL',
          communicationValue: 'lvega@travelers.com'
        }
      ],
      caseManagerIdentifier: '3452',
      fullName: 'Linda B Vega',
      caseManagerRoleCode: 'U',
      caseManagerRoleDescription: 'Nurse consultant'
    },
    {
      address: {
        address1: '2611 Sherwood Circle',
        city: 'Loreauville',
        state: 'LA',
        zip: '70552'
      },
      communications: [
        {
          type: 'UNKNOWN',
          communicationValue: '5478661245'
        },
        {
          type: 'UNKNOWN',
          communicationValue: 'kgregory@travelers.com'
        }
      ],
      caseManagerIdentifier: '7856432',
      fullName: 'Kellie C Gregory',
      caseManagerRoleCode: '',
      caseManagerRoleDescription: ''
    }
  ],
  tpa: {
    address: {
      address1: '335 Jackson Street',
      city: 'Minnesota City',
      zip: '20973'
    },
    communications: [
      {
        type: 'WORK',
        communicationValue: '8134569874'
      },
      {
        type: 'EMAIL',
        communicationValue: 'service@travelers.com'
      }
    ],
    tpaCode: '0451',
    orgFEIN: '448645451',
    name: 'Travelers Insurance'
  },
  attorney: {
    address: {
      address1: '65 North South Ave',
      address2: 'Suite 306',
      city: '1997 Quarry Drive',
      state: 'WV',
      zip: '36303'
    },
    communications: [
      {
        type: 'WORK',
        communicationValue: '5421647549'
      },
      {
        type: 'EMAIL',
        communicationValue: 'adean@suehappy.com'
      }
    ],
    attorneyIdentifier: '1234',
    firmName: 'Sue Happy, LLC',
    fullName: 'Angelina Beth Dean'
  },
  claimPolicy: {
    claimPolicyTypeByCustomerCode: 'UNKNOWN'
  },
  icdCodes: [
    { icdCode: '100', version: '9', compensabilityDescription: 'Active' }
  ],
  miscData: {
    claimSystem: 'Claim Suite',
    fcciCompanyCode: 'AB12345',
    mco: '1234',
    wcdNumber: '1'
  }
};
