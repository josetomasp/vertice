import {
  LocationType,
  MakeReferralOptions,
  ReferralBodyPart,
  ReferralManagementTransportationType,
  RequestorInformationOptions,
  SelectableService,
  VendorSelectionMode
} from 'src/app/claims/abm/referral/store/models/make-a-referral.models';
import { AncilliaryServiceCode } from '../../claims/abm/referral/make-a-referral/make-a-referral-shared';
import {
  FusionApprovedLocation,
  FusionICDCode,
  FusionVendorAllocation
} from '../../claims/abm/referral/store/models/fusion/fusion-make-a-referral.models';
import { LANGUAGE_ARCH_TYPE } from 'src/app/claims/abm/referral/make-a-referral/language/language-step-definitions';

export const makeReferralData: SelectableService[] = [
  {
    domain: 'REFERRAL_MANAGEMENT',
    serviceCode: 'TRP',
    serviceType: 'Transportation',
    activeReferrals: [
      {
        referralId: 409592,
        serviceType: 'Sedan',
        datesOfService: '09/01/2018 - 10/01/2018',
        vendor: 'Homelink',
        status: 'Awaiting authorization',
        submittedBy: 'Adjuster',
        url:
          '/claims/54524156454c455253/43303030363632/referral/32323235363139/transportation/activity/grid'
      },
      {
        referralId: 789,
        serviceType: 'Dirigible',
        datesOfService: '10/01/2018',
        vendor: 'Homelink',
        status: 'Authorizated',
        submittedBy: 'Adjuster',
        url:
          '/claims/54524156454c455253/43303030363632/referral/32323235363139/transportation/activity/grid'
      },
      {
        referralId: 456,
        serviceType: 'Air Travel',
        datesOfService: '09/15/2018',
        vendor: 'One Call Care Mgmt',
        status: 'Scheduling',
        submittedBy: 'Vendor',
        url:
          '/claims/54524156454c455253/43303030363632/referral/32323235363139/transportation/activity/grid'
      },
      {
        referralId: 101,
        serviceType: 'Horse Drawn Carriage Return',
        datesOfService: '10/40/2000',
        vendor: 'Homelink',
        status: 'Authorizated',
        submittedBy: 'Comptroller',
        url:
          '/claims/54524156454c455253/43303030363632/referral/32323235363139/legacyTransportation/activity/grid'
      }
    ]
  },
  {
    domain: 'FUSION_REFERRAL_MANAGEMENT',
    serviceCode: 'DX',
    serviceType: 'Diagnostics',
    activeReferrals: [
      {
        referralId: 987,
        serviceType: 'Elbow Hammer',
        datesOfService: '10/31/2000',
        vendor: 'Homelink',
        status: 'Authorizated',
        submittedBy: 'Dr. Arm',
        url:
          '/claims/54524156454c455253/43303030363632/referral/31303839353632/diagnostics/activity/grid'
      },
      {
        referralId: 654,
        serviceType: 'Visual Inspection',
        datesOfService: '10/13/2000',
        vendor: 'Homelink',
        status: 'Authorizated',
        submittedBy: 'Dr. Eyes',
        url:
          '/claims/54524156454c455253/43303030363632/referral/31303839353632/diagnostics/activity/grid'
      }
    ]
  },
  {
    domain: 'FUSION_REFERRAL_MANAGEMENT',
    serviceCode: 'LAN',
    serviceType: 'Language',
    activeReferrals: []
  },
  {
    domain: 'FUSION_REFERRAL_MANAGEMENT',
    serviceCode: 'DME',
    serviceType: 'DME',
    activeReferrals: []
  },
  {
    domain: 'FUSION_REFERRAL_MANAGEMENT',
    serviceCode: 'IMP',
    serviceType: 'Implants',
    activeReferrals: []
  },
  {
    domain: 'FUSION_REFERRAL_MANAGEMENT',
    serviceCode: 'PM',
    serviceType: 'Physical Medicine',
    activeReferrals: [
      {
        referralId: 35321,
        serviceType: 'Physical Medicine',
        datesOfService: '04/02/2020 - 01/04/2021',
        vendor: 'Home Link LLC',
        status: 'Not Authorized',
        submittedBy: 'AliceAdjuster',
        url:
          '/claims/54524156454c455253/43303030363632/referral/31303839353632/physicalMedicine/activity/grid'
      },
      {
        referralId: 409595,
        serviceType: 'Physical Medicine',
        datesOfService: '04/02/2020 - 02/28/2021',
        vendor: 'Home Link LLC',
        status: 'Not Authorized',
        submittedBy: 'AliceAdjuster',
        url:
          '/claims/54524156454c455253/43303030363632/referral/31303839353632/physicalMedicine/activity/grid'
      },
      {
        referralId: 353231,
        serviceType: 'Physical Medicine',
        datesOfService: '04/02/2020 - 01/27/2021',
        vendor: 'Home Link LLC',
        status: 'Not Authorized',
        submittedBy: 'AliceAdjuster',
        url:
          '/claims/54524156454c455253/43303030363632/referral/31303839353632/physicalMedicine/activity/grid'
      },
      {
        referralId: 354321,
        serviceType: 'Physical Medicine',
        datesOfService: '04/02/2020 - 05/05/2020',
        vendor: 'Home Link LLC',
        status: 'Not Authorized',
        submittedBy: 'AliceAdjuster',
        url:
          '/claims/54524156454c455253/43303030363632/referral/31303839353632/physicalMedicine/activity/grid'
      }
    ]
  },
  {
    domain: 'FUSION_REFERRAL_MANAGEMENT',
    serviceCode: 'HH',
    serviceType: 'Home Health',
    activeReferrals: []
  }
];

export const referralTransportationTypes: ReferralManagementTransportationType[] = [
  {
    id: 1,
    code: 'Sedan',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Sedan'
  },
  {
    id: 2,
    code: 'Wheelchair Transport',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Wheelchair Transport'
  },
  {
    id: 3,
    code: 'Flight',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Flight'
  },
  {
    id: 4,
    code: 'Lodging',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Lodging'
  },
  {
    id: 5,
    code: 'Air Ambulance',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Other'
  },
  {
    id: 6,
    code: 'ALS',
    description: 'Advanced Lifesaving services',
    insurancePayer: 'Travelers ',
    group: 'Other'
  },
  {
    id: 7,
    code: 'BLS',
    description: 'Basic Lifesaving Services',
    insurancePayer: 'Travelers ',
    group: 'Other'
  },
  {
    id: 8,
    code: 'Stretcher',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Other'
  },
  {
    id: 9,
    code: 'Bus',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Other'
  },
  {
    id: 10,
    code: 'Boat',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Other'
  },
  {
    id: 11,
    code: 'Other',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Other'
  },
  {
    id: 11,
    code: 'In Memory Marker',
    description: '',
    insurancePayer: 'Travelers ',
    group: 'Other'
  }
];

export const getLocationsForClaim: FusionApprovedLocation[] = [
  {
    claimInfoAddressId: '0',
    type: '1',
    name: 'Claimant Address',
    streetAddress1: '25 Theodoric Avenue',
    streetAddress2: null,
    city: 'HAZELWOOD',
    state: 'MO',
    zipCode: '63042',
    phoneNumber: '3143046259',
    locationTypeDescription: 'Home'
  },
  {
    claimInfoAddressId: '70113',
    type: '1',
    name: 'Home',
    streetAddress1: '1010 Main St',
    streetAddress2: 'Bldg A',
    city: 'Tampa',
    state: 'FL',
    zipCode: '33610-4910',
    phoneNumber: '8139921478',
    locationTypeDescription: 'Home'
  },
  {
    claimInfoAddressId: '70117',
    type: '1',
    name: 'Mariano Beeche',
    streetAddress1: '85 Brainerd Rd',
    streetAddress2: 'Apt 12',
    city: 'Allston',
    state: 'MA',
    zipCode: '01886-1450',
    phoneNumber: '(999)999-999',
    locationTypeDescription: 'Home'
  },
  {
    claimInfoAddressId: '70117',
    type: '1',
    name: 'Doc 123',
    streetAddress1: '85 Brainerd Rd',
    streetAddress2: 'Apt 12',
    city: 'Allston',
    state: 'MA',
    zipCode: '01886-1450',
    phoneNumber: '(999)999-999',
    locationTypeDescription: 'Doctor'
  }
];

export const fusionIcdCodes: FusionICDCode[] = [
  {
    code: 'F17.210',
    desc: 'Nicotine dependence, cigarettes, uncomplicated',
    version: 9
  },
  {
    code: 'S16.1XXA',
    desc:
      'Strain of muscle, fascia and tendon at neck level, initial encounter',
    version: 9
  },
  {
    code: 'S29.012A',
    desc:
      'Strain of muscle and tendon of back wall of thorax, initial encounter',
    version: 9
  },
  {
    code: 'S39.012A',
    desc:
      'Strain of muscle, fascia and tendon of lower back, initial encounter',
    version: 9
  }
];

export const fusionIcdCodeSearch: FusionICDCode[] = [
  {
    code: '010.03',
    desc:
      'PRIMARY TUBERCULOUS COMPLEX TUBERCLE BACILLI FOUND (IN SPUTUM) BY MICROSCOPY',
    version: 9
  },
  {
    code: '011.86',
    desc:
      'OTHER SPECIFIED PULMONARY TUBERCULOSIS TUBERCLE BACILLI NOT FOUND BY BACTERIOLOGICAL OR HISTOLOGICAL EXAMINATION BUT TUBERCULOSIS CONFIRMED BY OTHER METHODS (INOCULATION OF ANIMALS)',
    version: 9
  }
];
export const createLocationForClaim: string = '201';

export const fusionVendorAllocations: FusionVendorAllocation = {
  allocatedVendors: [
    {
      code: 'WAL',
      name: 'Walmart LLC',
      status: null
    },
    {
      code: 'PUB',
      name: 'Publix',
      status: null
    },
    {
      code: 'JPL',
      name: 'JPL',
      status: null
    },
    {
      code: 'NASA',
      name: 'NASA',
      status: null
    }
  ],
  autoPopulation: true,
  vendorMode: VendorSelectionMode.REORDER_SELECT,
  serviceType: LANGUAGE_ARCH_TYPE
};

export const locationTypes: LocationType[] = [
  {
    code: 'DEFA',
    description: 'Default'
  },
  {
    code: 'HOME',
    description: 'Home'
  },
  {
    code: 'DR',
    description: 'Doctor'
  },
  {
    code: 'XRAY',
    description: 'X-Ray'
  },
  {
    code: 'PT',
    description: 'Physical Therapy'
  },
  {
    code: 'PHAR',
    description: 'Pharmacy'
  },
  {
    code: 'LAB',
    description: 'Lab'
  },
  {
    code: 'OTHR',
    description: 'Other'
  },
  {
    code: 'LEGL',
    description: 'Legal Appt'
  },
  {
    code: 'WORK',
    description: 'Work'
  },
  {
    code: 'DENT',
    description: 'Dentist'
  }
];

export const fusionBodyPartsForClaim: ReferralBodyPart[] = [
  {
    ncciCode: '61',
    desc: 'Abdomen Including Groin',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '55',
    desc: 'Ankle - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '55',
    desc: 'Ankle - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '64',
    desc: 'Artificial Appliance',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '47',
    desc: 'Back - Spinal Cord',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '43',
    desc: 'Back Disc',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '12',
    desc: 'Brain',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '62',
    desc: 'Buttocks - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '62',
    desc: 'Buttocks - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '44',
    desc: 'Chest',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '13',
    desc: 'Ear(s) - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '13',
    desc: 'Ear(s) - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '32',
    desc: 'Elbow - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '32',
    desc: 'Elbow - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '14',
    desc: 'Eye(s) - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '14',
    desc: 'Eye(s) - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '19',
    desc: 'Facial Bones',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '36',
    desc: 'Finger(s) - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '36',
    desc: 'Finger(s) - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '56',
    desc: 'Foot - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '56',
    desc: 'Foot - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '58',
    desc: 'Great Toe - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '58',
    desc: 'Great Toe - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '35',
    desc: 'Hand - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '35',
    desc: 'Hand - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '18',
    desc: 'Head - Soft Tissue',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '49',
    desc: 'Heart',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '51',
    desc: 'Hip - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '51',
    desc: 'Hip - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '48',
    desc: 'Internal Organs',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '53',
    desc: 'Knee - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '53',
    desc: 'Knee - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '24',
    desc: 'Larynx',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '33',
    desc: 'Lower Arm - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '33',
    desc: 'Lower Arm - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '42',
    desc: 'Lower Back Area',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '54',
    desc: 'Lower Leg - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '54',
    desc: 'Lower Leg - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '63',
    desc: 'Lumbar and or Sacral Vertebrae (Vertebra NOC Trunk)',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '60',
    desc: 'Lungs',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '17',
    desc: 'Mouth',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '10',
    desc: 'Multiple Head Injury',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '50',
    desc: 'Multiple Lower Extremities - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '50',
    desc: 'Multiple Lower Extremities - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '20',
    desc: 'Multiple Neck Injury',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '40',
    desc: 'Multiple Trunk',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '30',
    desc: 'Multiple Upper Extremities - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '30',
    desc: 'Multiple Upper Extremities - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '22',
    desc: 'Neck - Disc',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '25',
    desc: 'Neck - Soft Tissue',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '23',
    desc: 'Neck - Spinal Cord',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '66',
    desc: 'No Physical Injury',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '15',
    desc: 'Nose',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '46',
    desc: 'Pelvis',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '45',
    desc: 'Sacrum and Coccyx',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '38',
    desc: 'Shoulder(s) - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '38',
    desc: 'Shoulder(s) - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '11',
    desc: 'Skull',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '16',
    desc: 'Teeth',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '37',
    desc: 'Thumb - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '37',
    desc: 'Thumb - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '57',
    desc: 'Toes - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '57',
    desc: 'Toes - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '26',
    desc: 'Trachea',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '31',
    desc: 'Upper Arm - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '31',
    desc: 'Upper Arm - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '41',
    desc: 'Upper Back Area',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '52',
    desc: 'Upper Leg - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '52',
    desc: 'Upper Leg - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '21',
    desc: 'Vertebrae',
    sideOfBody: '',
    selected: false
  },
  {
    ncciCode: '34',
    desc: 'Wrist - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '34',
    desc: 'Wrist - Right',
    sideOfBody: 'Right',
    selected: false
  },
  {
    ncciCode: '39',
    desc: 'Wrist(s) and Hand(s) - Left',
    sideOfBody: 'Left',
    selected: false
  },
  {
    ncciCode: '39',
    desc: 'Wrist(s) and Hand(s) - Right',
    sideOfBody: 'Right',
    selected: false
  }
];

export const referralLanguages: string[] = [
  'American Sign Language',
  'Arabic',
  'Armenian',
  'Cantonese',
  'Chinese',
  'Creole',
  'English',
  'French',
  'German',
  'Greek',
  'Gujarathi',
  'Hebrew',
  'Hindi',
  'Italian',
  'Japanese',
  'Korean',
  'Mandarin',
  'Navajo',
  'Other',
  'Persian',
  'Polish',
  'Portuguese',
  'Russian',
  'Spanish',
  'Tagalog',
  'Thai',
  'Urdu',
  'Vietnamese'
];

export const makeReferralOptions: MakeReferralOptions = {
  appointmentTypes: ['Do Not Know', 'Other', 'FCE', 'Legal', 'Post-Op'],
  languages: [
    'American Sign Language',
    'Arabic',
    'Armenian',
    'Cantonese',
    'Chinese',
    'Creole',
    'English',
    'French',
    'German',
    'Greek',
    'Gujarathi',
    'Hebrew',
    'Hindi',
    'Italian',
    'Japanese',
    'Korean',
    'Mandarin',
    'Navajo',
    'Other',
    'Persian',
    'Polish',
    'Portuguese',
    'Russian',
    'Spanish',
    'Tagalog',
    'Thai',
    'Urdu',
    'Vietnamese'
  ],
  locationTypes: [
    {
      code: 'DEFA',
      description: 'Default'
    },
    {
      code: 'HOME',
      description: 'Home'
    },
    {
      code: 'DR',
      description: 'Doctor'
    },
    {
      code: 'XRAY',
      description: 'X-Ray'
    },
    {
      code: 'PT',
      description: 'Physical Therapy'
    },
    {
      code: 'PHAR',
      description: 'Pharmacy'
    },
    {
      code: 'LAB',
      description: 'Lab'
    },
    {
      code: 'OTHR',
      description: 'Other'
    },
    {
      code: 'LEGL',
      description: 'Legal Appt'
    },
    {
      code: 'WORK',
      description: 'Work'
    },
    {
      code: 'DENT',
      description: 'Dentist'
    }
  ],
  physicianSpecialties: [
    'Primary',
    'Ortho',
    'Neuro',
    'Surgeon',
    'Radiologist',
    'Pain Mgmt.',
    'Psychiatrist',
    'Internist',
    'Dentist',
    'Dermatologist'
  ],
  approvedLocations: [
    {
      id: '0',
      name: 'My house',
      address: '123 Fake Street',
      type: 'Home'
    },
    {
      id: '1',
      name: 'Dr Jan Itor',
      address: '987 Something Square',
      type: 'Doctor'
    },
    {
      id: '2',
      name: 'Dr John Smith',
      address: '654 Nothing Triangle',
      type: 'Doctor'
    },
    {
      id: '3',
      name: 'Select PT',
      address: '321 Anything Line',
      type: 'Physical Therapy'
    },
    {
      id: '4',
      name: 'Rose Radiology',
      address: '741 Everything Point',
      type: 'Physical Therapy'
    },
    {
      id: '5',
      name: 'CVS',
      address: '852 Artifical Pentagon',
      type: 'Pharmacy'
    },
    {
      id: '6',
      name: 'Walgreens',
      address: '963 Organic Hexagon',
      type: 'Pharmacy'
    },
    {
      id: '7',
      name: `Pizzas 'r' us`,
      address: '147 Superficial Octagon',
      type: 'Other'
    },
    {
      id: '8',
      name: 'Home Guys',
      address: '258 Subficial Nonagon',
      type: 'Other'
    },
    {
      id: '9',
      name: 'Flat Health',
      address: '369 Hyperficial Decagon',
      type: 'Other'
    },
    {
      id: '10',
      name: 'Web MD',
      address: '456 Real Circle',
      type: 'Other'
    },
    {
      id: '11',
      name: 'iMeds',
      address: '798 Imaginary Lane',
      type: 'Other'
    }
  ],
  vendors: [
    {
      code: 'NASA',
      name: 'NASA'
    },
    {
      code: 'JPL',
      name: 'JPL'
    },
    {
      code: 'PUB',
      name: 'Publix'
    },
    {
      code: 'WAL',
      name: 'Walmart'
    }
  ],
  vendorMode: VendorSelectionMode.REORDER_SELECT,
  vendorAutoPopulation: false
};

export const languageCustomerServiceConfiguration = {
  id: AncilliaryServiceCode.LAN,
  data: [
    {
      serviceId: 4,
      serviceName: 'Language',
      groupConfigurations: [
        {
          groupName: 'On-Site Interpretation',
          subTypes: [
            {
              customerSubTypeId: 1904,
              customerTypeId: 352,
              subTypeDescription: 'Certified'
            },
            {
              customerSubTypeId: 0,
              customerTypeId: 450,
              subTypeDescription: 'Non-Certified'
            },
            {
              customerSubTypeId: 0,
              customerTypeId: 451,
              subTypeDescription: 'Legal-Certified'
            }
          ]
        },
        { groupName: 'Document Translation', subTypes: [] }
      ]
    }
  ]
};

export const diagnosticsCustomerServiceConfiguration = {
  id: AncilliaryServiceCode.DX,
  data: [
    {
      serviceName: 'Diagnostics',
      serviceId: 11,
      groupConfigurations: [
        {
          groupName: 'CT',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 429,
              customerSubTypeId: 2107
            },
            {
              subTypeDescription: 'CT With And Without Contrast',
              customerTypeId: 429,
              customerSubTypeId: 2108
            },
            {
              subTypeDescription: 'CT With Contrast',
              customerTypeId: 429,
              customerSubTypeId: 2109
            },
            {
              subTypeDescription: 'CT Without Contrast',
              customerTypeId: 429,
              customerSubTypeId: 2110
            }
          ]
        },
        {
          groupName: 'EMG/NCS',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 430,
              customerSubTypeId: 2111
            }
          ]
        },
        {
          groupName: 'MRI',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 431,
              customerSubTypeId: 2103
            },
            {
              subTypeDescription: 'MRI With And Without Contrast',
              customerTypeId: 431,
              customerSubTypeId: 2104
            },
            {
              subTypeDescription: 'MRI With Contrast',
              customerTypeId: 431,
              customerSubTypeId: 2105
            },
            {
              subTypeDescription: 'MRI Without Contrast',
              customerTypeId: 431,
              customerSubTypeId: 2106
            }
          ]
        },
        {
          groupName: 'Other Tests',
          subTypes: [
            {
              subTypeDescription: 'Arthrogram',
              customerTypeId: 432,
              customerSubTypeId: 2114
            },
            {
              subTypeDescription: 'Bone Density',
              customerTypeId: 432,
              customerSubTypeId: 2115
            },
            {
              subTypeDescription: 'Bone Scan',
              customerTypeId: 432,
              customerSubTypeId: 2116
            },
            {
              subTypeDescription: 'Discogram',
              customerTypeId: 432,
              customerSubTypeId: 2117
            },
            {
              subTypeDescription: 'Fluoroscopy',
              customerTypeId: 432,
              customerSubTypeId: 2120
            },
            {
              subTypeDescription: 'Mammogram',
              customerTypeId: 432,
              customerSubTypeId: 2121
            },
            {
              subTypeDescription: 'MRA',
              customerTypeId: 432,
              customerSubTypeId: 2122
            },
            {
              subTypeDescription: 'MRV',
              customerTypeId: 432,
              customerSubTypeId: 2123
            },
            {
              subTypeDescription: 'Myleogram',
              customerTypeId: 432,
              customerSubTypeId: 2124
            },
            {
              subTypeDescription: 'PET',
              customerTypeId: 432,
              customerSubTypeId: 2125
            },
            {
              subTypeDescription: '',
              customerTypeId: 432,
              customerSubTypeId: 2126
            }
          ]
        },
        {
          groupName: 'Ultrasound',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 433,
              customerSubTypeId: 2112
            }
          ]
        },
        {
          groupName: 'Xray',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 434,
              customerSubTypeId: 2113
            }
          ]
        }
      ]
    }
  ]
};

export const physicalMedicineCustomerServiceConfiguration = {
  id: AncilliaryServiceCode.PM,
  data: [
    {
      serviceName: 'Physical Medicine',
      serviceId: 9,
      groupConfigurations: [
        {
          groupName: 'Functional Capacity Evaluation',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 272,
              customerSubTypeId: 1606
            }
          ]
        },
        {
          groupName: 'Occupational Therapy',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 274,
              customerSubTypeId: 1608
            }
          ]
        },
        {
          groupName: 'Other',
          subTypes: [
            {
              subTypeDescription: 'Chiropractic',
              customerTypeId: 271,
              customerSubTypeId: 1605
            },
            {
              subTypeDescription: 'Massage Therapy',
              customerTypeId: 273,
              customerSubTypeId: 1607
            },
            {
              subTypeDescription: 'Work Conditioning (PRP)',
              customerTypeId: 277,
              customerSubTypeId: 1611
            },
            {
              subTypeDescription: 'Work Hardening',
              customerTypeId: 278,
              customerSubTypeId: 0
            },
            {
              subTypeDescription: 'Aquatic Therapy',
              customerTypeId: 377,
              customerSubTypeId: 0
            }
          ]
        },
        {
          groupName: 'Physical Therapy',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 276,
              customerSubTypeId: 1610
            }
          ]
        }
      ]
    }
  ]
};

export const homeHealthCustomerServiceConfiguration = {
  id: AncilliaryServiceCode.HH,
  data: [
    {
      serviceName: 'Home Health',
      serviceId: 2,
      groupConfigurations: [
        {
          groupName: 'Aides',
          subTypes: [
            {
              subTypeDescription: 'Home Health Aide',
              customerTypeId: 292,
              customerSubTypeId: 1738
            },
            {
              subTypeDescription: 'Evaluation',
              customerTypeId: 311,
              customerSubTypeId: 1756
            }
          ]
        },
        {
          groupName: 'In-Home Therapy',
          subTypes: [
            {
              subTypeDescription: 'Occupational Therapist',
              customerTypeId: 296,
              customerSubTypeId: 1742
            },
            {
              subTypeDescription: 'Physical Therapist',
              customerTypeId: 297,
              customerSubTypeId: 1743
            },
            {
              subTypeDescription: 'Speech Therapist',
              customerTypeId: 301,
              customerSubTypeId: 1746
            }
          ]
        },
        {
          groupName: 'Infusion',
          subTypes: [
            {
              subTypeDescription: 'Home Infusion Therapy',
              customerTypeId: 293,
              customerSubTypeId: 1739
            },
            {
              subTypeDescription: 'Home Injection Therapy',
              customerTypeId: 294,
              customerSubTypeId: 1740
            }
          ]
        },
        {
          groupName: 'Nursing',
          subTypes: [
            {
              subTypeDescription: 'LPN',
              customerTypeId: 295,
              customerSubTypeId: 1741
            },
            {
              subTypeDescription: 'RN',
              customerTypeId: 298,
              customerSubTypeId: 1744
            },
            {
              subTypeDescription: 'RN -High Tech',
              customerTypeId: 299,
              customerSubTypeId: 1745
            }
          ]
        },
        {
          groupName: 'Other',
          subTypes: [
            {
              subTypeDescription: 'Attendant Care',
              customerTypeId: 291,
              customerSubTypeId: 1737
            },
            {
              subTypeDescription: 'Social Worker',
              customerTypeId: 300,
              customerSubTypeId: 0
            },
            {
              subTypeDescription: 'Total Parenteral Nutrition',
              customerTypeId: 302,
              customerSubTypeId: 1747
            }
          ]
        }
      ]
    }
  ]
};

export const dmeCustomerServiceConfiguration = {
  id: AncilliaryServiceCode.DME,
  data: [
    {
      serviceName: 'DME',
      serviceId: 1,
      groupConfigurations: [
        {
          groupName: 'Assistive Devices',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 279,
              customerSubTypeId: 1612
            },
            {
              subTypeDescription: '3-n-1 Commode',
              customerTypeId: 279,
              customerSubTypeId: 1613
            },
            {
              subTypeDescription: 'Cane - Large Base Quad Cane',
              customerTypeId: 279,
              customerSubTypeId: 1614
            },
            {
              subTypeDescription: 'Cane - Single Point',
              customerTypeId: 279,
              customerSubTypeId: 1615
            },
            {
              subTypeDescription: 'Crutches',
              customerTypeId: 279,
              customerSubTypeId: 1616
            },
            {
              subTypeDescription: 'Forearm Crutches',
              customerTypeId: 279,
              customerSubTypeId: 1617
            },
            {
              subTypeDescription: 'Grab Bar 16"',
              customerTypeId: 279,
              customerSubTypeId: 1618
            },
            {
              subTypeDescription: 'Grab Bar 18"',
              customerTypeId: 279,
              customerSubTypeId: 1619
            },
            {
              subTypeDescription: 'Grab Bar 24"',
              customerTypeId: 279,
              customerSubTypeId: 1620
            },
            {
              subTypeDescription: 'Grab Bar 32"',
              customerTypeId: 279,
              customerSubTypeId: 1621
            },
            {
              subTypeDescription: 'Hand Held Shower',
              customerTypeId: 279,
              customerSubTypeId: 1622
            },
            {
              subTypeDescription: 'Long Handled Sponge',
              customerTypeId: 279,
              customerSubTypeId: 1623
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 279,
              customerSubTypeId: 1624
            },
            {
              subTypeDescription: 'Raised Toilet Seat',
              customerTypeId: 279,
              customerSubTypeId: 1625
            },
            {
              subTypeDescription: 'Reacher - 26"',
              customerTypeId: 279,
              customerSubTypeId: 1626
            },
            {
              subTypeDescription: 'Reacher - 28"',
              customerTypeId: 279,
              customerSubTypeId: 1627
            },
            {
              subTypeDescription: 'Scooter',
              customerTypeId: 279,
              customerSubTypeId: 1628
            },
            {
              subTypeDescription: 'Shower Chair with Back',
              customerTypeId: 279,
              customerSubTypeId: 1629
            },
            {
              subTypeDescription: 'Shower Chair without Back',
              customerTypeId: 279,
              customerSubTypeId: 1630
            },
            {
              subTypeDescription: 'Tub Transfer Bench',
              customerTypeId: 279,
              customerSubTypeId: 1631
            },
            {
              subTypeDescription: 'Walker - Front Wheeled',
              customerTypeId: 279,
              customerSubTypeId: 1632
            },
            {
              subTypeDescription: 'Walker - Heavy Duty',
              customerTypeId: 279,
              customerSubTypeId: 1633
            },
            {
              subTypeDescription: 'Walker - Standard',
              customerTypeId: 279,
              customerSubTypeId: 1634
            }
          ]
        },
        {
          groupName: 'Beds & Accessories',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 280,
              customerSubTypeId: 1635
            },
            {
              subTypeDescription: 'Air-Fluidized Bed',
              customerTypeId: 280,
              customerSubTypeId: 1636
            },
            {
              subTypeDescription: 'Alternating Pressure Pad - Mattress',
              customerTypeId: 280,
              customerSubTypeId: 1637
            },
            {
              subTypeDescription: 'Alternating Pressure Padd - Overlay',
              customerTypeId: 280,
              customerSubTypeId: 1638
            },
            {
              subTypeDescription: 'Fracture Frame',
              customerTypeId: 280,
              customerSubTypeId: 1639
            },
            {
              subTypeDescription: 'Hospital Bed - Semi-Electric',
              customerTypeId: 280,
              customerSubTypeId: 1640
            },
            {
              subTypeDescription: 'Hospital Bed - Total Electric',
              customerTypeId: 280,
              customerSubTypeId: 1641
            },
            {
              subTypeDescription: 'Low Airloss Mattress',
              customerTypeId: 280,
              customerSubTypeId: 1642
            },
            {
              subTypeDescription: 'Low Airloss Overlay',
              customerTypeId: 280,
              customerSubTypeId: 1643
            },
            {
              subTypeDescription: 'Mattress Overlay',
              customerTypeId: 280,
              customerSubTypeId: 1644
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 280,
              customerSubTypeId: 1645
            },
            {
              subTypeDescription: 'Overbed Table',
              customerTypeId: 280,
              customerSubTypeId: 1646
            },
            {
              subTypeDescription: 'Trapeze Bar - Attached',
              customerTypeId: 280,
              customerSubTypeId: 1647
            },
            {
              subTypeDescription: 'Trapeze Bar - Free Standing',
              customerTypeId: 280,
              customerSubTypeId: 1648
            }
          ]
        },
        {
          groupName: 'CPM Machine',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 281,
              customerSubTypeId: 1649
            },
            {
              subTypeDescription: 'Ankle',
              customerTypeId: 281,
              customerSubTypeId: 1650
            },
            {
              subTypeDescription: 'Elbow',
              customerTypeId: 281,
              customerSubTypeId: 1651
            },
            {
              subTypeDescription: 'Hand',
              customerTypeId: 281,
              customerSubTypeId: 1652
            },
            {
              subTypeDescription: 'Knee',
              customerTypeId: 281,
              customerSubTypeId: 1653
            },
            {
              subTypeDescription: 'Shoulder',
              customerTypeId: 281,
              customerSubTypeId: 1654
            },
            {
              subTypeDescription: 'Wrist',
              customerTypeId: 281,
              customerSubTypeId: 1655
            }
          ]
        },
        {
          groupName: 'Medical Supplies',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 282,
              customerSubTypeId: 1656
            },
            {
              subTypeDescription: 'Catheters',
              customerTypeId: 282,
              customerSubTypeId: 1657
            },
            {
              subTypeDescription: 'Compression Stocking',
              customerTypeId: 282,
              customerSubTypeId: 1658
            },
            {
              subTypeDescription: 'Drainable Pouches',
              customerTypeId: 282,
              customerSubTypeId: 1659
            },
            {
              subTypeDescription: 'Gauze - Pads',
              customerTypeId: 282,
              customerSubTypeId: 1660
            },
            {
              subTypeDescription: 'Gauze - Specialty (Xeroform, Adaptic, etc)',
              customerTypeId: 282,
              customerSubTypeId: 1661
            },
            {
              subTypeDescription: 'Gauze Roll',
              customerTypeId: 282,
              customerSubTypeId: 1662
            },
            {
              subTypeDescription: 'Gloves',
              customerTypeId: 282,
              customerSubTypeId: 1663
            },
            {
              subTypeDescription: 'Negative Pressure Wound Therapy Pump',
              customerTypeId: 282,
              customerSubTypeId: 1664
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 282,
              customerSubTypeId: 1665
            },
            {
              subTypeDescription: 'Protective Barrier Wipe',
              customerTypeId: 282,
              customerSubTypeId: 1666
            },
            {
              subTypeDescription: 'Saline and Sterile Water Solution',
              customerTypeId: 282,
              customerSubTypeId: 1667
            },
            {
              subTypeDescription: 'Stoma Paste',
              customerTypeId: 282,
              customerSubTypeId: 1668
            },
            {
              subTypeDescription: 'Tape',
              customerTypeId: 282,
              customerSubTypeId: 1669
            },
            {
              subTypeDescription: 'Wafers/Skin Barriers',
              customerTypeId: 282,
              customerSubTypeId: 1670
            }
          ]
        },
        {
          groupName: 'Respiratory Equipment',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 283,
              customerSubTypeId: 1671
            },
            {
              subTypeDescription: 'Cpap/Bi-Level',
              customerTypeId: 283,
              customerSubTypeId: 1672
            },
            {
              subTypeDescription: 'Nebulizer - Standard',
              customerTypeId: 283,
              customerSubTypeId: 1673
            },
            {
              subTypeDescription: 'Nebulizer - Ultrasonic',
              customerTypeId: 283,
              customerSubTypeId: 1674
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 283,
              customerSubTypeId: 1675
            },
            {
              subTypeDescription: 'Oxygen - Concentrator',
              customerTypeId: 283,
              customerSubTypeId: 1676
            },
            {
              subTypeDescription: 'Oxygen - Portable',
              customerTypeId: 283,
              customerSubTypeId: 1677
            }
          ]
        },
        {
          groupName: 'Orthotics',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 284,
              customerSubTypeId: 1678
            },
            {
              subTypeDescription: 'Ankle',
              customerTypeId: 284,
              customerSubTypeId: 1679
            },
            {
              subTypeDescription: 'Arm',
              customerTypeId: 284,
              customerSubTypeId: 1680
            },
            {
              subTypeDescription: 'Back',
              customerTypeId: 284,
              customerSubTypeId: 1681
            },
            {
              subTypeDescription: 'Elbow',
              customerTypeId: 284,
              customerSubTypeId: 1682
            },
            {
              subTypeDescription: 'Finger',
              customerTypeId: 284,
              customerSubTypeId: 1683
            },
            {
              subTypeDescription: 'Foot',
              customerTypeId: 284,
              customerSubTypeId: 1684
            },
            {
              subTypeDescription: 'Hand',
              customerTypeId: 284,
              customerSubTypeId: 1685
            },
            {
              subTypeDescription: 'Knee',
              customerTypeId: 284,
              customerSubTypeId: 1686
            },
            {
              subTypeDescription: 'Leg',
              customerTypeId: 284,
              customerSubTypeId: 1687
            },
            {
              subTypeDescription: 'Neck (Cervical)',
              customerTypeId: 284,
              customerSubTypeId: 1688
            },
            {
              subTypeDescription: 'Orthopedic Shoes',
              customerTypeId: 284,
              customerSubTypeId: 1689
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 284,
              customerSubTypeId: 1690
            },
            {
              subTypeDescription: 'Shoulder',
              customerTypeId: 284,
              customerSubTypeId: 1691
            },
            {
              subTypeDescription: 'Wrist',
              customerTypeId: 284,
              customerSubTypeId: 1692
            }
          ]
        },
        {
          groupName: 'Electromedical',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 285,
              customerSubTypeId: 1693
            },
            {
              subTypeDescription: 'Batteries',
              customerTypeId: 285,
              customerSubTypeId: 1694
            },
            {
              subTypeDescription: 'Electrodes',
              customerTypeId: 285,
              customerSubTypeId: 1695
            },
            {
              subTypeDescription: 'Galvanic Stimulators',
              customerTypeId: 285,
              customerSubTypeId: 1696
            },
            {
              subTypeDescription: 'Interferential Stimulator',
              customerTypeId: 285,
              customerSubTypeId: 1697
            },
            {
              subTypeDescription: 'Leadwires',
              customerTypeId: 285,
              customerSubTypeId: 1698
            },
            {
              subTypeDescription: 'Muscle Stimulator',
              customerTypeId: 285,
              customerSubTypeId: 1699
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 285,
              customerSubTypeId: 1700
            },
            {
              subTypeDescription: 'Pens',
              customerTypeId: 285,
              customerSubTypeId: 1701
            },
            {
              subTypeDescription: 'Supplies',
              customerTypeId: 285,
              customerSubTypeId: 1702
            },
            {
              subTypeDescription: 'Tens',
              customerTypeId: 285,
              customerSubTypeId: 1703
            }
          ]
        },
        {
          groupName: 'Wheelchairs',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 286,
              customerSubTypeId: 1704
            },
            {
              subTypeDescription: 'Electric Wheelchair',
              customerTypeId: 286,
              customerSubTypeId: 1705
            },
            {
              subTypeDescription: 'Elevated Leg Rest',
              customerTypeId: 286,
              customerSubTypeId: 1706
            },
            {
              subTypeDescription: 'Heavy Duty Wheelchair',
              customerTypeId: 286,
              customerSubTypeId: 1707
            },
            {
              subTypeDescription: 'Hemi Wheelchair',
              customerTypeId: 286,
              customerSubTypeId: 1708
            },
            {
              subTypeDescription: 'Lightweight Wheelchair',
              customerTypeId: 286,
              customerSubTypeId: 1709
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 286,
              customerSubTypeId: 1710
            },
            {
              subTypeDescription: 'Standard Footrest',
              customerTypeId: 286,
              customerSubTypeId: 1711
            },
            {
              subTypeDescription: 'Standard Wheelchair',
              customerTypeId: 286,
              customerSubTypeId: 1712
            }
          ]
        },
        {
          groupName: 'Other DME',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 287,
              customerSubTypeId: 1713
            },
            {
              subTypeDescription: 'Cervical Pillow or Cushion',
              customerTypeId: 287,
              customerSubTypeId: 1714
            },
            {
              subTypeDescription: 'Dynamic Splinting (i.e. DynaSplints)',
              customerTypeId: 287,
              customerSubTypeId: 1715
            },
            {
              subTypeDescription: 'Game Ready Unit',
              customerTypeId: 287,
              customerSubTypeId: 1716
            },
            {
              subTypeDescription: 'Hot/Cold Therapy',
              customerTypeId: 287,
              customerSubTypeId: 1717
            },
            {
              subTypeDescription: 'Lumbar Pillow or Cushion',
              customerTypeId: 287,
              customerSubTypeId: 1718
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 287,
              customerSubTypeId: 1719
            },
            {
              subTypeDescription: 'Patient Lift',
              customerTypeId: 287,
              customerSubTypeId: 1720
            },
            {
              subTypeDescription:
                'Static Progressive Stretch (i.e. JAS Splints)',
              customerTypeId: 287,
              customerSubTypeId: 1721
            },
            {
              subTypeDescription: 'Traction - Cervical',
              customerTypeId: 287,
              customerSubTypeId: 1722
            },
            {
              subTypeDescription: 'Traction - Lumbar',
              customerTypeId: 287,
              customerSubTypeId: 1723
            }
          ]
        },
        {
          groupName: 'Bone Growth Stimulator',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 288,
              customerSubTypeId: 1724
            },
            {
              subTypeDescription: 'Cervical',
              customerTypeId: 288,
              customerSubTypeId: 1725
            },
            {
              subTypeDescription: 'Implantable',
              customerTypeId: 288,
              customerSubTypeId: 1726
            },
            {
              subTypeDescription: 'Long/Short Bone',
              customerTypeId: 288,
              customerSubTypeId: 1727
            },
            {
              subTypeDescription: 'Spinal',
              customerTypeId: 288,
              customerSubTypeId: 1728
            }
          ]
        },
        {
          groupName: 'Implantable Devices',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 289,
              customerSubTypeId: 1729
            },
            {
              subTypeDescription: 'Infusion Pump',
              customerTypeId: 289,
              customerSubTypeId: 1730
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 289,
              customerSubTypeId: 1731
            }
          ]
        },
        {
          groupName: 'Prosthetics',
          subTypes: [
            {
              subTypeDescription: '',
              customerTypeId: 290,
              customerSubTypeId: 1732
            },
            {
              subTypeDescription: 'Lower Limb',
              customerTypeId: 290,
              customerSubTypeId: 1733
            },
            {
              subTypeDescription: 'Modification or Repair',
              customerTypeId: 290,
              customerSubTypeId: 1734
            },
            {
              subTypeDescription: 'Other',
              customerTypeId: 290,
              customerSubTypeId: 1735
            },
            {
              subTypeDescription: 'Upper Limb',
              customerTypeId: 290,
              customerSubTypeId: 1736
            },
            {
              subTypeDescription: 'Peer Review',
              customerTypeId: 290,
              customerSubTypeId: 2191
            },
            {
              subTypeDescription: 'Bill Review',
              customerTypeId: 290,
              customerSubTypeId: 2192
            }
          ]
        },
        {
          groupName: 'Hearing Aids',
          subTypes: [
            {
              subTypeDescription: 'New',
              customerTypeId: 446,
              customerSubTypeId: 2164
            },
            {
              subTypeDescription: 'Replacement',
              customerTypeId: 446,
              customerSubTypeId: 2165
            }
          ]
        }
      ]
    }
  ]
};

export const requestorInformationOptions: RequestorInformationOptions = {
  roles: [
    {
      code: 'TRPAUT',
      description: 'Transportation Auto Auth'
    },
    {
      code: 'MSPRV',
      description: 'Medical/Service Provider'
    },
    {
      code: 'CLMNCN',
      description: 'Nurse Case Manager'
    },
    {
      code: 'PASSPT',
      description: 'Passport provider'
    },
    {
      code: 'CLMUS',
      description: 'Claim User'
    },
    {
      code: 'VEND',
      description: 'Vendor'
    },
    {
      code: 'INJWRK',
      description: 'Injured Worker'
    },
    {
      code: 'TRTPH',
      description: 'Treating Physician'
    },
    {
      code: 'CLMUA',
      description: 'Claim Adjuster'
    },
    {
      code: 'TRAN',
      description: 'Transitional Referrals'
    },
    {
      code: 'AME',
      description: 'Agreed Medical Examiner'
    },
    {
      code: 'DISPL',
      description: 'Discharge Planner'
    },
    {
      code: 'CLMSCS',
      description: 'SF CSC Telephonic Interp'
    },
    {
      code: 'QME',
      description: 'Qualified Medical Examiner'
    },
    {
      code: 'URG',
      description: 'URG'
    },
    {
      code: 'Uro',
      description: 'Uro'
    }
  ],
  providers: [
    'Gateway Urgent Care Center - 200852247',
    'Kaiser on the Job (North) - 942728480',
    'Saddleback Family & Urgent Care - 330775483',
    'A&C Urgent Care (formerly Golden West Medical Center) - 821892838',
    'Kaiser on the Job (South) - 951750445',
    'Concentra Medical Centers - 770469725',
    'Sharp Rees-Stealy - 330106028',
    'Doctors on Duty - 77-0439213',
    'Vista Medical Group - 330697381',
    'Pomona Valley Medical Centers - 954709950',
    'Playa Vista Medical Center - 412231173',
    'COMP (Central Occupational Medicine Provider) - 330902021',
    'Palomar Pomerado Health System - 956003843',
    'Sand Canyon Urgent Care - 261557226'
  ],
  uros: [],
  intakeMethods: ['Email', 'Phone', 'EFile', 'Fax']
};
