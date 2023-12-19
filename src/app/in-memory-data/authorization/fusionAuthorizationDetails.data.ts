import {
  AuthorizationReasonsResponse,
  DocumentsFusionFormState,
  FusionAuthorizationLocationStatus,
  FusionAuthorizationResponse
} from '../../claims/abm/referral/store/models/fusion/fusion-authorizations.models';

export const LAN_AUTHORIZATION_ALL_TYPES: FusionAuthorizationResponse = {
  rush: false,
  clinicalAlerts: [],
  noteList: [
    {
      createdDate: '2020-06-26T10:44:03.8622232',
      createdBy: 'snelson',
      description: 'Test detail auth header'
    }
  ],
  authorizations: [
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776655,
        allowCancel: true,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 10,
        locations: [
          {
            status: FusionAuthorizationLocationStatus.UnderReview,
            serviceLevelTypeDesc: 'Medical Appointment',
            numAppointments: 5,
            locationId: 4435612,
            locationDetails: [
              { locationTypeDesc: 'Doctor', locationDetailName: 'Medcheck' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          },
          {
            serviceLevelTypeDesc: 'Other',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 5,
            locationId: 4435614,
            locationDetails: [
              { locationTypeDesc: 'Home', locationDetailName: 'Home' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: null,
        categoryDesc: 'On-site Translation'
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: 5,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: 15,
          locationSummary: null
        },
        {
          changeType: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          newStartDate: '2020-10-19T06:00:00.000Z',
          newEndDate: '2021-11-10T06:00:00.000Z',
          originalEndDate: '2021-02-18',
          quantityRequested: null,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: null,
          locationSummary: null
        },
        {
          changeType: 'OPEN_AUTHORIZATION_LOCATION_CHANGE',
          locationSummary: [
            {
              locationId: 4435612,
              remainingQuantity: 4,
              totalQuantity: 8
            },
            {
              locationId: 4435614,
              remainingQuantity: 3,
              totalQuantity: 7
            }
          ]
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'interpretation appointment(s)',
          limitValue: 0,
          originalLimit: 10,
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'interpretation appointment(s)',
          limitValue: 8,
          originalLimit: 10,
          newTotalLimit: 15,
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null
        },
        {
          type: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          actionDescriptor: 'are being asked to change',
          originalEndDate: '2021-02-18',
          quantityDescriptor: 'interpretation appointment(s)',
          limitValue: 8,
          originalLimit: 10,
          startDate: '2020-10-19',
          endDate: '2021-11-10',
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776655,
        allowCancel: false,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 1,
            locationId: 4435612,
            locationDetails: [
              { locationTypeDesc: 'Doctor', locationDetailName: 'Medcheck' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: null,
        categoryDesc: 'On-site Translation'
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          newStartDate: '2020-10-19T06:00:00.000Z',
          newEndDate: '2021-11-10T06:00:00.000Z',
          originalEndDate: '2021-02-18',
          quantityRequested: null,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: null,
          locationSummary: null
        },
        {
          changeType: 'OPEN_AUTHORIZATION_LOCATION_CHANGE',
          locationSummary: [
            {
              locationId: 4435612,
              remainingQuantity: 2,
              totalQuantity: 10
            }
          ]
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'interpretation appointment(s)',
          limitValue: 8,
          originalLimit: 10,
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          actionDescriptor: 'are being asked to change',
          originalEndDate: '2021-02-18',
          quantityDescriptor: 'interpretation appointment(s)',
          limitValue: 8,
          originalLimit: 10,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-11-10T06:00:00.000Z',
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776656,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 1,
            locationId: 4435612,
            locationDetails: [
              { locationTypeDesc: 'Doctor', locationDetailName: 'Medcheck' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: null,
        categoryDesc: 'On-site Translation'
      },
      authorizationChangeSummary: [
        {
          changeType: 'NEW_OPEN_AUTHORIZATION',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: null,
          quantityCompleted: null,
          previousQuantityApproved: null,
          newTotalQuantityApproved: null,
          locationSummary: null
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'NEW_OPEN_AUTHORIZATION',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'interpretation appointment(s)',
          limitValue: 8,
          originalLimit: 10,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-11-10T06:00:00.000Z',
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776657,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 1,
            locationId: 4435612,
            locationDetails: [
              { locationTypeDesc: 'Doctor', locationDetailName: 'Medcheck' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: null,
        categoryDesc: 'On-site Translation'
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: 5,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: 15,
          locationSummary: null
        },
        {
          changeType: 'OPEN_AUTHORIZATION_LOCATION_CHANGE',
          locationSummary: [
            {
              locationId: 4435612,
              remainingQuantity: 7,
              totalQuantity: 15
            }
          ]
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'interpretation appointment(s)',
          limitValue: 8,
          originalLimit: 10,
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'interpretation appointment(s)',
          limitValue: 8,
          originalLimit: 10,
          newTotalLimit: 15,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-10-31T06:00:00.000Z',
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776658,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 5,
            locationId: 4435612,
            locationDetails: [
              { locationTypeDesc: 'Doctor', locationDetailName: 'Medcheck' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          },
          {
            serviceLevelTypeDesc: 'Other',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 5,
            locationId: 4435614,
            locationDetails: [
              { locationTypeDesc: 'Home', locationDetailName: 'Home' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: null,
        categoryDesc: 'Document Translation'
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: 5,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: 15,
          locationSummary: null
        },
        {
          changeType: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          newStartDate: '2020-10-19T06:00:00.000Z',
          newEndDate: '2021-11-10T06:00:00.000Z',
          originalEndDate: '2021-02-18',
          quantityRequested: null,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: null,
          locationSummary: null
        },
        {
          changeType: 'OPEN_AUTHORIZATION_LOCATION_CHANGE',
          locationSummary: [
            {
              locationId: 4435612,
              remainingQuantity: 3,
              totalQuantity: 8
            },
            {
              locationId: 4435614,
              remainingQuantity: 4,
              totalQuantity: 7
            }
          ]
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'document translation service(s)',
          limitValue: 8,
          originalLimit: 10,
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'document translation service(s)',
          limitValue: 8,
          originalLimit: 10,
          newTotalLimit: 15,
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null
        },
        {
          type: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          actionDescriptor: 'are being asked to change',
          originalEndDate: '2021-02-18',
          quantityDescriptor: 'document translation service(s)',
          limitValue: 8,
          originalLimit: 10,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-11-10T06:00:00.000Z',
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776659,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 1,
            locationId: 4435612,
            locationDetails: [
              { locationTypeDesc: 'Doctor', locationDetailName: 'Medcheck' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: null,
        categoryDesc: 'Document Translation'
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          newStartDate: '2020-10-19T06:00:00.000Z',
          newEndDate: '2021-11-10T06:00:00.000Z',
          originalEndDate: '2021-02-18',
          quantityRequested: null,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: null,
          locationSummary: null
        },
        {
          changeType: 'OPEN_AUTHORIZATION_LOCATION_CHANGE',
          locationSummary: [
            {
              locationId: 4435612,
              remainingQuantity: 2,
              totalQuantity: 10
            }
          ]
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'document translation service(s)',
          limitValue: 8,
          originalLimit: 10,
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          actionDescriptor: 'are being asked to change',
          originalEndDate: '2021-02-18',
          quantityDescriptor: 'document translation service(s)',
          limitValue: 8,
          originalLimit: 10,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-11-10T06:00:00.000Z',
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776660,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 8,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 4,
            locationId: 4435612,
            locationDetails: [
              { locationTypeDesc: 'Doctor', locationDetailName: 'Medcheck' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          },
          {
            serviceLevelTypeDesc: 'Other',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 4,
            locationId: 4435614,
            locationDetails: [
              { locationTypeDesc: 'Home', locationDetailName: 'Home' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: null,
        categoryDesc: 'Document Translation'
      },
      authorizationChangeSummary: [
        {
          changeType: 'NEW_OPEN_AUTHORIZATION',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: null,
          quantityCompleted: null,
          previousQuantityApproved: null,
          newTotalQuantityApproved: null,
          locationSummary: null
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'NEW_OPEN_AUTHORIZATION',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'document translation service(s)',
          limitValue: 8,
          originalLimit: 10,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-11-10T06:00:00.000Z',
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776661,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 1,
            locationId: 4435612,
            locationDetails: [
              { locationTypeDesc: 'Doctor', locationDetailName: 'Medcheck' },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: null,
        categoryDesc: 'Document Translation'
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: 5,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: 15,
          locationSummary: null
        },
        {
          changeType: 'OPEN_AUTHORIZATION_LOCATION_CHANGE',
          locationSummary: [
            {
              locationId: 4435612,
              remainingQuantity: 7,
              totalQuantity: 15
            }
          ]
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'document translation service(s)',
          limitValue: 8,
          originalLimit: 10,
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'document translation service(s)',
          limitValue: 8,
          originalLimit: 10,
          newTotalLimit: 15,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-10-31T06:00:00.000Z',
          locationIdList: null,
          limitChange: null,
          locationId: null,
          originalLocationLimits: null
        }
      ]
    }
  ]
};

export const DX_AUTHORIZATION_ALL_TYPES: FusionAuthorizationResponse = {
  rush: true,
  clinicalAlerts: [],
  noteList: [
    {
      createdDate: '2020-06-26T10:44:03.8622232',
      createdBy: 'snelson',
      description: 'Test detail auth header'
    }
  ],
  authorizations: [
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776655,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        authorizationAmount: 655.2,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 2,
            locationId: 4435612,
            locationDetails: [
              {
                locationTypeDesc: 'Doctor',
                locationDetailName: 'Medcheck'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          },
          {
            serviceLevelTypeDesc: 'Other',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 1,
            locationId: 4435614,
            locationDetails: [
              {
                locationTypeDesc: 'Home',
                locationDetailName: 'Home'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: [
          {
            id: '55',
            description: 'Ankle - Left',
            sideOfBody: 'Left',
            lastActionDate: '2019-10-04T06:00:00.000Z',
            status: null
          },
          {
            id: '42',
            description: 'Lower Back Area',
            sideOfBody: '',
            lastActionDate: '2019-10-04T06:00:00.000Z',
            status: null
          },
          {
            id: '34',
            description: 'Wrist - Right',
            sideOfBody: 'Right',
            lastActionDate: '2019-10-04T06:00:00.000Z',
            status: null
          }
        ],
        categoryDesc: 'MRI Without Contrast',
        authSubType: null
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: 5,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: 15,
          locationSummary: null
        },
        {
          changeType: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          newStartDate: '2020-10-19T06:00:00.000Z',
          newEndDate: '2021-11-10T06:00:00.000Z',
          originalEndDate: '2021-02-18',
          quantityRequested: null,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: null,
          locationSummary: null
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'service(s)',
          limitValue: 8,
          originalLimit: 10,
          locationId: null,
          limitChange: null,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'service(s)',
          limitValue: 8,
          originalLimit: 10,
          newTotalLimit: 15,
          locationId: null,
          limitChange: null,
          locationIdList: null,
          originalLocationLimits: null
        },
        {
          type: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          actionDescriptor: 'are being asked to change',
          originalEndDate: '2021-02-18',
          quantityDescriptor: 'service(s)',
          limitValue: 8,
          originalLimit: 10,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-11-10T06:00:00.000Z',
          locationId: null,
          limitChange: null,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'test pend',
      reasonForAction: 'test action reason',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776655,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19',
        endDate: '2021-10-31',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        authorizationAmount: 2155.66,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 2,
            locationId: 4435613,
            locationDetails: [
              {
                locationTypeDesc: 'Doctor',
                locationDetailName: 'Medcheck'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: [
          {
            id: '61',
            description: 'Abdomen Including Groin',
            sideOfBody: '',
            lastActionDate: '04/10/2019'
          },
          {
            id: '64',
            description: 'Artificial Appliance',
            sideOfBody: '',
            lastActionDate: '04/10/2019'
          }
        ],
        categoryDesc: 'MRI Without Contrast',
        authSubType: null
      },
      authorizationChangeSummary: [
        {
          changeType: 'NEW_OPEN_AUTHORIZATION',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: null,
          quantityCompleted: null,
          previousQuantityApproved: null,
          newTotalQuantityApproved: null,
          locationSummary: null
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'NEW_OPEN_AUTHORIZATION',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'service(s)',
          limitValue: 3,
          startDate: '2020-10-19',
          endDate: '2021-10-31',
          locationId: null,
          limitChange: null,
          originalLimit: null,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'test pend',
      reasonForAction: 'test action reason',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776655,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19',
        endDate: '2021-10-31',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        authorizationAmount: 355.66,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 2,
            locationId: 4435613,
            locationDetails: [
              {
                locationTypeDesc: 'Doctor',
                locationDetailName: 'Medcheck'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: [
          {
            id: '61',
            description: 'Abdomen Including Groin',
            sideOfBody: '',
            lastActionDate: '04/10/2019'
          }
        ],
        categoryDesc: 'MRI Without Contrast',
        authSubType: null
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          newStartDate: '2020-10-19T06:00:00.000Z',
          newEndDate: '2021-11-10T06:00:00.000Z',
          originalEndDate: '2021-02-18',
          quantityRequested: null,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: null,
          locationSummary: null
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'service(s)',
          limitValue: 8,
          originalLimit: 10,
          locationId: null,
          limitChange: null,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          actionDescriptor: 'are being asked to change',
          originalEndDate: '2021-02-18',
          quantityDescriptor: 'service(s)',
          limitValue: 8,
          originalLimit: 10,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-11-10T06:00:00.000Z',
          locationId: null,
          limitChange: null,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'test pend',
      reasonForAction: 'test action reason',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 776655,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19',
        endDate: '2021-10-31',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        authorizationAmount: 235.99,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 2,
            locationId: 4435613,
            locationDetails: [
              {
                locationTypeDesc: 'Doctor',
                locationDetailName: 'Medcheck'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: [
          {
            id: '61',
            description: 'Abdomen Including Groin',
            sideOfBody: '',
            lastActionDate: '05/10/2019'
          }
        ],
        categoryDesc: 'MRI Without Contrast',
        authSubType: null
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: 5,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: 15,
          locationSummary: null
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'service(s)',
          limitValue: 8,
          originalLimit: 10,
          locationId: null,
          limitChange: null,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'service(s)',
          limitValue: 8,
          originalLimit: 10,
          newTotalLimit: 15,
          startDate: '2020-10-19',
          endDate: '2021-10-31',
          locationId: null,
          limitChange: null,
          locationIdList: null,
          originalLocationLimits: null
        }
      ]
    }
  ]
};

export const PM_AUTHORIZATION_ALL_TYPES: FusionAuthorizationResponse = {
  rush: false,
  clinicalAlerts: [],
  noteList: [
    {
      createdDate: '2020-06-26T10:44:03.8622232',
      createdBy: 'snelson',
      description: 'Test detail auth header'
    }
  ],
  authorizations: [
    {
      action: 'Approve',
      pendType: 'test pend',
      reasonForAction: 'test action reason',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        categoryDesc: 'Physical Therapy',
        authorizationId: 776655,
        rush: false,
        perDiem: 4,
        quantityCompleted: '0',
        requestorName: 'Jane Deoname',
        requestorRole: 'Contracted Provider',
        authorizationAmount: 655.4,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19',
        endDate: '2021-10-31',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 2,
            locationId: 4435613,
            locationDetails: [
              {
                locationTypeDesc: 'Doctor',
                locationDetailName: 'Medcheck'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: [
          {
            id: '61',
            description: 'Abdomen Including Groin',
            sideOfBody: '',
            lastActionDate: '04/10/2019'
          },
          {
            id: '64',
            description: 'Artificial Appliance',
            sideOfBody: '',
            lastActionDate: '04/10/2019'
          }
        ]
      },
      authorizationChangeSummary: [
        {
          changeType: 'NEW_OPEN_AUTHORIZATION'
        }
      ],
      narrativeTextList: [
        {
          type: 'NEW_OPEN_AUTHORIZATION',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'visit(s)',
          limitValue: 3,
          startDate: '2020-10-19',
          endDate: '2021-10-31',
          locationId: null,
          limitChange: null,
          originalLimit: null,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.']
    },
    {
      action: 'Approve',
      pendType: 'test pend',
      reasonForAction: 'test action reason',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        categoryDesc: 'Occupational Therapy',
        authorizationId: 776655,
        rush: false,
        perDiem: 4,
        quantityCompleted: '0',
        requestorName: 'Jane Deoname',
        requestorRole: 'Contracted Provider',
        authorizationAmount: 655.4,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 15,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 2,
            locationId: 4435613,
            locationDetails: [
              {
                locationTypeDesc: 'Doctor',
                locationDetailName: 'Medcheck'
              },
              {
                locationTypeDesc: 'Occupational Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: [
          {
            id: '61',
            description: 'Abdomen Including Groin',
            sideOfBody: '',
            lastActionDate: '04/10/2019'
          },
          {
            id: '64',
            description: 'Artificial Appliance',
            sideOfBody: '',
            lastActionDate: '04/10/2019'
          }
        ]
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          quantityRequested: 5,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: 15
        }
      ],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'visit(s)',
          limitValue: 8,
          startDate: null,
          endDate: null,
          locationId: null,
          limitChange: null,
          originalLimit: 10,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE_WITH_DATE',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'visit(s)',
          limitValue: 8,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-10-31T06:00:00.000Z',
          locationId: null,
          limitChange: null,
          originalLimit: 10,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: 15
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.']
    },
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        categoryDesc: 'Physical Therapy',
        authorizationId: 776655,
        rush: false,
        perDiem: 4,
        quantityCompleted: '0',
        requestorName: 'Jane Deoname',
        requestorRole: 'Contracted Provider',
        authorizationAmount: 655.4,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 10,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 2,
            locationId: 4435612,
            locationDetails: [
              {
                locationTypeDesc: 'Doctor',
                locationDetailName: 'Medcheck'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          },
          {
            serviceLevelTypeDesc: 'Other',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 1,
            locationId: 4435614,
            locationDetails: [
              {
                locationTypeDesc: 'Home',
                locationDetailName: 'Home'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: [
          {
            id: '55',
            description: 'Ankle - Left',
            sideOfBody: 'Left',
            lastActionDate: '04/10/2019'
          },
          {
            id: '42',
            description: 'Lower Back Area',
            sideOfBody: '',
            lastActionDate: '04/10/2019'
          },
          {
            id: '34',
            description: 'Wrist - Right',
            sideOfBody: 'Right',
            lastActionDate: '04/10/2019'
          }
        ]
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          newStartDate: '2020-10-19T06:00:00.000Z',
          newEndDate: '2021-11-10T06:00:00.000Z',
          originalEndDate: '2021-02-18',
          quantityCompleted: 8,
          previousQuantityApproved: 10
        }
      ],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'visit(s)',
          limitValue: 8,
          startDate: null,
          endDate: null,
          locationId: null,
          limitChange: null,
          originalLimit: 10,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          actionDescriptor: 'are being asked to change',
          originalEndDate: '2021-02-18',
          quantityDescriptor: 'visit(s)',
          limitValue: 8,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-11-10T06:00:00.000Z',
          locationId: null,
          limitChange: null,
          originalLimit: 10,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.']
    },
    {
      action: 'Approve',
      pendType: 'Pend Test New Open',
      reasonForAction: 'Reason for new open',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        categoryDesc: 'Physical Therapy',
        authorizationId: 776655,
        rush: false,
        perDiem: 4,
        quantityCompleted: '0',
        requestorName: 'Jane Deoname',
        requestorRole: 'Contracted Provider',
        authorizationAmount: 655.4,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19T06:00:00.000Z',
        endDate: '2021-10-31T06:00:00.000Z',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        locations: [
          {
            serviceLevelTypeDesc: 'Medical Appointment',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 2,
            locationId: 4435612,
            locationDetails: [
              {
                locationTypeDesc: 'Doctor',
                locationDetailName: 'Medcheck'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          },
          {
            serviceLevelTypeDesc: 'Other',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 1,
            locationId: 4435614,
            locationDetails: [
              {
                locationTypeDesc: 'Home',
                locationDetailName: 'Home'
              },
              {
                locationTypeDesc: 'Physical Therapy',
                locationDetailName: 'ATI'
              }
            ]
          }
        ],
        bodyParts: [
          {
            id: '55',
            description: 'Ankle - Left',
            sideOfBody: 'Left',
            lastActionDate: '04/10/2019'
          },
          {
            id: '42',
            description: 'Lower Back Area',
            sideOfBody: '',
            lastActionDate: '04/10/2019'
          },
          {
            id: '34',
            description: 'Wrist - Right',
            sideOfBody: 'Right',
            lastActionDate: '04/10/2019'
          }
        ]
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          quantityRequested: 5,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: 15
        },
        {
          changeType: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          newStartDate: '2020-10-19T06:00:00.000Z',
          newEndDate: '2021-11-10T06:00:00.000Z',
          originalEndDate: '2021-02-18',
          quantityCompleted: 8,
          previousQuantityApproved: 10
        }
      ],
      narrativeTextList: [
        {
          type: 'QUANTITY_USED',
          actionDescriptor: 'attended',
          quantityDescriptor: 'visit(s)',
          limitValue: 8,
          startDate: null,
          endDate: null,
          locationId: null,
          limitChange: null,
          originalLimit: 10,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_DATE_CHANGE',
          actionDescriptor: 'are being asked to change',
          originalEndDate: '2021-02-18',
          quantityDescriptor: 'visit(s)',
          limitValue: 8,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-11-10T06:00:00.000Z',
          locationId: null,
          limitChange: null,
          originalLimit: 10,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null
        },
        {
          type: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'visit(s)',
          limitValue: 8,
          startDate: '2020-10-19T06:00:00.000Z',
          endDate: '2021-10-31T06:00:00.000Z',
          locationId: null,
          limitChange: null,
          originalLimit: 10,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: 15
        }
      ],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.']
    }
  ]
};
export const HH_AUTHORIZATION_ALL_TYPES: FusionAuthorizationResponse = {
  rush: false,
  noteList: [],
  clinicalAlerts: [],
  authorizations: [
    {
      action: '',
      pendType: '',
      reasonForAction: 'Authorization Required',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 91173640,
        rush: false,
        noteList: [],
        startDate: '2020-03-05',
        endDate: '2021-05-01',
        lastServiceDate: '01-15-2021',
        quantity: 64,
        authorizationAmount: 0,
        quantityCompleted: null,
        authMaxQty: null,
        authorizedPrice: '3352.9600',
        feeUcrAmt: null,
        requestedByRole: null,
        requestedByName: null,
        dateOfService: null,
        uom: 'visit(s)',
        anticipatedDeliveryDate: null,
        locations: [
          {
            serviceLevelTypeDesc: 'Home Health Aide (HHA) Per Hour, Overtime',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 64,
            locationId: 0,
            locationDetails: []
          }
        ],
        bodyParts: null,
        categoryDesc: 'Home Health Aide (HHA) Per Hour, Overtime',
        authSubType: null,
        icdCodes: null
      },
      authorizationChangeSummary: [
        {
          changeType: 'NEW_OPEN_AUTHORIZATION',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: null,
          quantityCompleted: null,
          previousQuantityApproved: null,
          newTotalQuantityApproved: null,
          locationSummary: null
        }
      ],
      reasonsReviewNeeded: [
        'Home Health exceeds 6 weeks',
        'Unauthorized source',
        'Please pay amount requested - No service is available at the contracted rate'
      ],
      narrativeTextList: [
        {
          type: 'NEW_OPEN_AUTHORIZATION',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'visit(s)',
          limitValue: 64,
          startDate: null,
          endDate: null,
          serviceDate: '2020-05-05',
          locationId: null,
          limitChange: null,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null,
          originalLimit: null
        }
      ]
    },
    {
      action: '',
      pendType: '',
      reasonForAction: 'Authorization Required',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        authorizationId: 91173635,
        rush: false,
        noteList: [],
        startDate: '2020-03-05',
        endDate: '2021-05-01',
        quantity: 672,
        authorizationAmount: 0,
        quantityCompleted: null,
        authMaxQty: null,
        authorizedPrice: '23520.0000',
        feeUcrAmt: null,
        requestedByRole: null,
        requestedByName: null,
        uom: 'visit(s)',
        dateOfService: null,
        anticipatedDeliveryDate: null,
        locations: [
          {
            serviceLevelTypeDesc: 'Home Health Aide (HHA) Per Hour',
            status: FusionAuthorizationLocationStatus.UnderReview,
            numAppointments: 672,
            locationId: 0,
            locationDetails: []
          }
        ],
        bodyParts: null,
        categoryDesc: 'Home Health Aide (HHA) Per Hour, Overtime',
        authSubType: null,
        icdCodes: null
      },
      authorizationChangeSummary: [
        {
          changeType: 'NEW_OPEN_AUTHORIZATION',
          newStartDate: null,
          newEndDate: null,
          quantityRequested: null,
          quantityCompleted: null,
          previousQuantityApproved: null,
          newTotalQuantityApproved: null,
          locationSummary: null
        }
      ],
      reasonsReviewNeeded: [
        'Home Health exceeds 6 weeks',
        'Unauthorized source',
        'Authorization Required',
        'Please pay amount requested - No service is available at the contracted rate'
      ],
      narrativeTextList: [
        {
          type: 'NEW_OPEN_AUTHORIZATION',
          actionDescriptor: 'are being asked to authorize',
          quantityDescriptor: 'visit(s)',
          limitValue: 672,
          startDate: '2020-03-05',
          endDate: '2021-05-01',
          locationId: null,
          limitChange: null,
          locationIdList: null,
          originalLocationLimits: null,
          newTotalLimit: null,
          originalLimit: null
        }
      ]
    }
  ]
};

export const DME_AUTHORIZATION_ALL_TYPES: FusionAuthorizationResponse = {
  rush: false,
  clinicalAlerts: [
    {
      hesReferralDetailId: 22605212,
      authorizationId: 776755,
      id: 1560,
      name: 'Main Alert Name',
      message:
        'This is where we would place details about the alert.  this text could be very long, so we should plan to have the real estate for lots of words.',
      attachmentName: 'Bone Growth updated 09_19.pdf',
      type: 'Alert',
      attachmentUrl:
        '/StaticWeb/drr/HesAdmin/Preview/Bone Growth updated 09_19.pdf'
    }
  ],
  noteList: [
    {
      createdDate: '2020-06-26T10:44:03.8622232',
      createdBy: 'snelson',
      description: 'Test detail auth header'
    }
  ],
  authorizations: [
    {
      action: 'Approve',
      pendType: 'test pend',
      reasonForAction: 'test action reason',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        categoryDesc: 'Custom Orthotic Test',
        authorizationId: 776755,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19',
        endDate: '2021-10-31',
        lastServiceDate: '01-15-2021',
        quantity: 3,
        authorizationAmount: 2155.66,
        authMaxQty: 1,
        quantityCompleted: '0',
        authorizedPrice: '578.40',
        feeUcrAmt: '738.18',
        requestedByRole: 'Medical/Serivce Provider',
        requestedByName: 'Foot Specialists of Milpitas 408-227-4777',
        locations: [],
        bodyParts: [],
        isSubstitution: true,
        substitutionApproved: true,
        substitutionAuthorizationUnderReview: {
          feeUcrAmt: '216.00',
          startDate: '2020-10-19',
          endDate: '2021-10-31',
          authMaxQty: 2,
          authorizedPrice: '100.82'
        }
      },
      authorizationChangeSummary: [
        {
          changeType: 'NEW_OPEN_AUTHORIZATION'
        }
      ],
      narrativeTextList: [],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.'],
      alertInfoList: [
        {
          alertDescription: 'Thermal Compression',
          alertModalBody:
            'Heat of compression reflects the basic inefficiency of compressed air or gas with regard to energy used to compress it compared to work energy actually delivered. For example: in a 100 psig-class (seven bar) air system, the air compressor uses about eight horsepower (hp) to deliver one hp worth of work. This concept is also true for other gases and at other pressures with variable answers. The 100 psig-class air compressed air is the largest sector in many commercial industrial, construction and other markets worldwide. These values may vary under different atmospheric operating conditions and will also be very site specific. A discussion about heat of compression requires a look at the basic law of energy. It says that energy can neither be created nor destroyed. Therefore, energy input to compression not used in final work energy will be converted to heat within the system. This heat is expressed in Btu/hours. As an example, if work energy used by the process is one hp = 2,546 Btu/hr., for example, then the total power input to produce the eight hp leaves a total of seven hp not used in process work – or  seven hp x 2,546 Btu/hour = 17, 522 Btu/hour of heat left in the compressed air cooling system. (Note: Power over time = energy. In electrical terms, kW is power and kWh is energy.) Heat of compression comes from the unused energy at the process –  heat that is left in the air system is usually referred to as “free” because it is a by-product of compressed air or gas and is covered by the cost of operating the air compressor.  If you don’t take advantage of this heat source (which is free) you will not only lose the available energy but may have to cool the air compressor system using more energy to avoid other issues. Recovered heat will offer the plant another heat source and the opportunity taken may well reduce plant operating energy costs.',
          alertDate: '2020-10-19',
          attachmentId: '5569',
          url: ''
        },
        {
          alertDescription: 'Hi-Wave Therapy',
          alertModalBody: 'Hi-Wave Therapy long description.',
          alertDate: '2020-10-25',
          attachmentId: '5567',
          url: ''
        }
      ]
    },
    {
      action: 'Approve',
      pendType: 'test pend',
      reasonForAction: 'test action reason',
      authorizationUnderReview: {
        authType: 'OPEN_AUTHORIZATION',
        categoryDesc: 'Custom Orthotic',
        authorizationId: 776756,
        rush: false,
        noteList: [
          {
            createdDate: '2020-06-26T10:44:03.8622232',
            createdBy: 'snelson',
            description: 'Test new open auth'
          }
        ],
        startDate: '2020-10-19',
        endDate: '2021-10-31',
        lastServiceDate: '01-15-2021',
        quantity: 15,
        authMaxQty: 1,
        quantityCompleted: '0',
        authorizedPrice: '578.40',
        feeUcrAmt: '738.18',
        requestedByRole: 'Medical/Serivce Provider',
        requestedByName: 'Foot Specialists of Milpitas 408-227-4777',
        locations: [],
        bodyParts: []
      },
      authorizationChangeSummary: [
        {
          changeType: 'OPEN_AUTHORIZATION_QUANTITY_CHANGE',
          quantityRequested: 5,
          quantityCompleted: 8,
          previousQuantityApproved: 10,
          newTotalQuantityApproved: 15
        }
      ],
      narrativeTextList: [],
      reasonsReviewNeeded: ['1. Reason 1.', '2. Reason 2.']
    }
  ]
};

export const AUTHENTICATION_REASONS_FOR_CUSTOMER_DATA: AuthorizationReasonsResponse = {
  headerActions: [
    {
      actionDescription: 'AUTHORIZE All',
      actionId: [4, 7, 29],
      actionGroupCode: 'APPR    '
    },
    {
      actionDescription: 'CANCEL All',
      actionId: [6],
      actionGroupCode: 'DENY    '
    },
    {
      actionDescription: 'PEND ALL',
      actionId: [18],
      actionGroupCode: 'PEND '
    },
    {
      actionDescription: 'PEND - MED-NES/UR/PRE-AUTH All',
      actionId: [27],
      actionGroupCode: 'PENDINT ',
      actionConfig: {
        expirationDateMaxDate: '2021-03-19T10:05:28.838-06:00',
        expirationDateNeeded: true
      }
    },
    {
      actionDescription: 'PEND TO VENDOR All',
      actionId: [17],
      actionGroupCode: 'PENDVEND'
    },
    {
      actionDescription: 'PEND-COMPENSABILITY DECISION All',
      actionId: [30],
      actionGroupCode: 'PENDINT '
    }
  ],
  detailActions: [
    {
      explanationId: 152,
      explanationDescription:
        'Error in Claim status; Claim status has been updated',
      actionDescription: 'APPROVE ORIGINAL',
      actionId: 8,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 153,
      explanationDescription: 'Coverage has now been verified',
      actionDescription: 'APPROVE ORIGINAL',
      actionId: 8,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 154,
      explanationDescription: 'Claim has now been accepted',
      actionDescription: 'APPROVE ORIGINAL',
      actionId: 8,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 155,
      explanationDescription: 'Other, please enter reason',
      actionDescription: 'APPROVE ORIGINAL',
      actionId: 8,
      isOtherReason: 'Y',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 156,
      explanationDescription:
        'Payment issue on claim â€“ none related to ancillary medical services',
      actionDescription: 'APPROVE ORIGINAL',
      actionId: 8,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 157,
      explanationDescription: 'Court Ordered',
      actionDescription: 'APPROVE ORIGINAL',
      actionId: 8,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 152,
      explanationDescription:
        'Error in Claim status; Claim status has been updated',
      actionDescription: 'APPROVE SUBSTITUTION',
      actionId: 7,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 153,
      explanationDescription: 'Coverage has now been verified',
      actionDescription: 'APPROVE SUBSTITUTION',
      actionId: 7,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 154,
      explanationDescription: 'Claim has now been accepted',
      actionDescription: 'APPROVE SUBSTITUTION',
      actionId: 7,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 155,
      explanationDescription: 'Other, please enter reason',
      actionDescription: 'APPROVE SUBSTITUTION',
      actionId: 7,
      isOtherReason: 'Y',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 156,
      explanationDescription:
        'Payment issue on claim â€“ none related to ancillary medical services',
      actionDescription: 'APPROVE SUBSTITUTION',
      actionId: 7,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 157,
      explanationDescription: 'Court Ordered',
      actionDescription: 'APPROVE SUBSTITUTION',
      actionId: 7,
      isOtherReason: 'N',
      actionGroupCode: 'APPRSUB '
    },
    {
      explanationId: 152,
      explanationDescription:
        'Error in Claim status; Claim status has been updated',
      actionDescription: 'AUTHORIZE',
      actionId: 4,
      isOtherReason: 'N',
      actionGroupCode: 'APPR    '
    },
    {
      explanationId: 153,
      explanationDescription: 'Coverage has now been verified',
      actionDescription: 'AUTHORIZE',
      actionId: 4,
      isOtherReason: 'N',
      actionGroupCode: 'APPR    '
    },
    {
      explanationId: 154,
      explanationDescription: 'Claim has now been accepted',
      actionDescription: 'AUTHORIZE',
      actionId: 4,
      isOtherReason: 'N',
      actionGroupCode: 'APPR    '
    },
    {
      explanationId: 155,
      explanationDescription: 'Other, please enter reason',
      actionDescription: 'AUTHORIZE',
      actionId: 4,
      isOtherReason: 'Y',
      actionGroupCode: 'APPR    '
    },
    {
      explanationId: 156,
      explanationDescription:
        'Payment issue on claim â€“ none related to ancillary medical services',
      actionDescription: 'AUTHORIZE',
      actionId: 4,
      isOtherReason: 'N',
      actionGroupCode: 'APPR    '
    },
    {
      explanationId: 157,
      explanationDescription: 'Court Ordered',
      actionDescription: 'AUTHORIZE',
      actionId: 4,
      isOtherReason: 'N',
      actionGroupCode: 'APPR    '
    },
    {
      explanationId: 15,
      explanationDescription: 'Not Medically Necessary',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 18,
      explanationDescription: 'Claim is Closed, Settled or Denied',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 19,
      explanationDescription: 'Item/Service Already Provided',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 21,
      explanationDescription: 'Claim Adjuster Requests Better Pricing',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 22,
      explanationDescription: 'Item/Service Is Not Related To WC Injury',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 438,
      explanationDescription: 'Request Is On Incorrect Claim Number',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 496,
      explanationDescription: 'Substitutions Not Authorized.',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 497,
      explanationDescription: 'Prescriber/Requester Is Not Authorized.',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 498,
      explanationDescription: 'Employee Declined.',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 499,
      explanationDescription: 'Prescriber Declined.',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 500,
      explanationDescription: 'Item/Service Was Changed To Rental.',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 718,
      explanationDescription: 'This is a Texas Non-HCN claim',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 3521,
      explanationDescription: 'Employer/Insured Declined',
      actionDescription: 'CANCEL',
      actionId: 6,
      isOtherReason: 'N',
      actionGroupCode: 'DENY    '
    },
    {
      explanationId: 15,
      explanationDescription: 'Not Medically Necessary',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 18,
      explanationDescription: 'Claim is Closed, Settled or Denied',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 19,
      explanationDescription: 'Item/Service Already Provided',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 21,
      explanationDescription: 'Claim Adjuster Requests Better Pricing',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 22,
      explanationDescription: 'Item/Service Is Not Related To WC Injury',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 438,
      explanationDescription: 'Request Is On Incorrect Claim Number',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 496,
      explanationDescription: 'Substitutions Not Authorized.',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 497,
      explanationDescription: 'Prescriber/Requester Is Not Authorized.',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 498,
      explanationDescription: 'Employee Declined.',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 499,
      explanationDescription: 'Prescriber Declined.',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 500,
      explanationDescription: 'Item/Service Was Changed To Rental.',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 718,
      explanationDescription: 'This is a Texas Non-HCN claim',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 3521,
      explanationDescription: 'Employer/Insured Declined',
      actionDescription: 'CANCEL',
      actionId: 14,
      isOtherReason: 'N',
      actionGroupCode: 'CANC    '
    },
    {
      explanationId: 0,
      explanationDescription: 'PENDED',
      actionDescription: 'PENDED TO VENDOR',
      actionId: 17,
      isOtherReason: 'N',
      actionGroupCode: 'PEND'
    }
  ]
};

export const AUTHORIZATION_REFERRAL_DOCUMENTS: DocumentsFusionFormState = {
  documents: [
    {
      fileName: 'Test file 1.docx',
      fileSize: 18,
      submittedBy: 'OTISDATE@example.com',
      submitDate: '09/17/2020',
      fileURL: '/#',
      file: undefined
    },
    {
      fileName: 'Test file 2.csv',
      fileSize: 5,
      submittedBy: 'OTISDATE@example.com',
      submitDate: '09/17/2020',
      fileURL: '/#',
      file: undefined
    }
  ]
};
