export const DIAGNOSTICS_DRAFT_927551 = {
  claimNumber: '06050754',
  customerId: '6000SCIF',
  referralId: 927551,
  saveAsDraft: true,
  referralLevelNotes: 'referralNotes',
  formValues: {
    'diagnostics-mri': {
      rush: true,
      schedulingForm: [
        {
          bodyParts: [
            {
              ncciCode: '25',
              desc: 'Neck - Soft Tissue',
              sideOfBody: '',
              selected: true
            }
          ],
          serviceDate: '2021-02-18T23:59:59.000000999',
          notes: '',
          subType: {
            customerSubTypeId: 2104,
            customerTypeId: 431,
            subTypeDescription: 'With And Without Contrast'
          }
        },
        {
          bodyParts: [
            {
              ncciCode: '25',
              desc: 'Neck - Soft Tissue',
              sideOfBody: '',
              selected: true
            },
            {
              ncciCode: '55',
              desc: 'Ankle - Left',
              sideOfBody: 'Left',
              selected: true
            },
            {
              ncciCode: '55',
              desc: 'Ankle - Right',
              sideOfBody: 'Right',
              selected: true
            }
          ],
          serviceDate: '2021-02-28T23:59:59.000000999',
          notes: '',
          subType: {
            customerSubTypeId: 2105,
            customerTypeId: 431,
            subTypeDescription: 'With Contrast'
          }
        }
      ],
      subType: null,
      referralId: null
    },
    'diagnostics-emg': {
      rush: false,
      schedulingForm: [
        {
          bodyParts: [
            {
              ncciCode: '25',
              desc: 'Neck - Soft Tissue',
              sideOfBody: '',
              selected: true
            }
          ],
          serviceDate: '2021-02-18T23:59:59.000000999',
          notes: 'noted',
          subType: {
            customerSubTypeId: 2111,
            customerTypeId: 430,
            subTypeDescription: ''
          }
        },
        {
          bodyParts: [
            {
              ncciCode: '25',
              desc: 'Neck - Soft Tissue',
              sideOfBody: '',
              selected: true
            },
            {
              ncciCode: '55',
              desc: 'Ankle - Left',
              sideOfBody: 'Left',
              selected: true
            },
            {
              ncciCode: '55',
              desc: 'Ankle - Right',
              sideOfBody: 'Right',
              selected: true
            }
          ],
          serviceDate: '2021-02-28T23:59:59.000000999',
          notes: '',
          subType: {
            customerSubTypeId: 2111,
            customerTypeId: 430,
            subTypeDescription: ''
          }
        }
      ],
      subType: null,
      referralId: null
    },
    'diagnostics-xray': {
      rush: false,
      schedulingForm: [
        {
          bodyParts: [
            {
              ncciCode: '25',
              desc: 'Neck - Soft Tissue',
              sideOfBody: '',
              selected: true
            }
          ],
          serviceDate: '2021-02-10T23:59:59.000000999',
          notes: '',
          subType: {
            customerSubTypeId: 2113,
            customerTypeId: 434,
            subTypeDescription: ''
          }
        }
      ],
      subType: null,
      referralId: null
    },
    'diagnostics-ctscan': {
      rush: false,
      schedulingForm: [
        {
          bodyParts: [
            {
              ncciCode: '25',
              desc: 'Neck - Soft Tissue',
              sideOfBody: '',
              selected: true
            }
          ],
          serviceDate: '2021-02-24T23:59:59.000000999',
          notes: '',
          subType: {
            customerSubTypeId: 2110,
            customerTypeId: 429,
            subTypeDescription: 'Without Contrast'
          }
        }
      ],
      subType: null,
      referralId: null
    },
    'diagnostics-ultrasound': {
      rush: false,
      schedulingForm: [
        {
          bodyParts: [
            {
              ncciCode: '25',
              desc: 'Neck - Soft Tissue',
              sideOfBody: '',
              selected: true
            }
          ],
          serviceDate: '2021-02-19T23:59:59.000000999',
          notes: '',
          subType: {
            customerSubTypeId: 2112,
            customerTypeId: 433,
            subTypeDescription: ''
          }
        }
      ],
      subType: null,
      referralId: null
    },
    'diagnostics-other': {
      rush: false,
      schedulingForm: [
        {
          bodyParts: [
            {
              ncciCode: '25',
              desc: 'Neck - Soft Tissue',
              sideOfBody: '',
              selected: true
            },
            {
              ncciCode: '55',
              desc: 'Ankle - Left',
              sideOfBody: 'Left',
              selected: true
            }
          ],
          serviceDate: '2021-02-12T23:59:59.000000999',
          notes: '',
          subType: {
            customerSubTypeId: 2120,
            customerTypeId: 432,
            subTypeDescription: 'Fluoroscopy'
          }
        }
      ],
      subType: null,
      referralId: null
    },
    'diagnostics-vendors': {
      all: [
        {
          code: 'NASA',
          name: 'NASA',
          status: null
        },
        {
          code: 'HL',
          name: 'Homelink',
          status: null
        },
        {
          code: 'PUB',
          name: 'Publix',
          status: null
        }
      ]
    },
    'diagnostics-shared': {
      diagnosisCodes: [
        {
          code: '717.83',
          desc: null,
          version: '9'
        },
        {
          code: '010.03',
          desc: null,
          version: '9'
        }
      ],
      prescriberName: 'John',
      prescriberPhone: '8888888888',
      prescriberAddress: null,
      surgeryDate: '2021-02-18T23:59:59.000000999',
      scheduleNear: null,
      postSurgical: true
    }
  }
};

export const HOME_HEALTH_DRAFT_927893 = {
  claimNumber: 'C000662',
  customerId: 'TRAVELERS',
  referralId: 927893,
  saveAsDraft: true,
  referralLevelNotes: 'Referral note test',
  formValues: {
    'homeHealth-nursing': {
      rush: true,
      schedulingForm: [
        {
          serviceType: {
            customerSubTypeId: 1744,
            customerTypeId: 298,
            subTypeDescription: 'RN'
          },
          serviceAddress: null,
          dynamicDateMode: null,
          appointmentDate: '',
          startDate: '2021-04-01T23:59:59.000000999',
          endDate: '2021-04-28T23:59:59.000000999',
          numberOfVisits: 0,
          notes: ''
        },
        {
          serviceType: {
            customerSubTypeId: 1741,
            customerTypeId: 295,
            subTypeDescription: 'LPN'
          },
          serviceAddress: null,
          dynamicDateMode: null,
          appointmentDate: '2021-04-08T23:59:59.000000999',
          startDate: '',
          endDate: '',
          numberOfVisits: 0,
          notes: ''
        },
        {
          serviceType: {
            customerSubTypeId: 1741,
            customerTypeId: 295,
            subTypeDescription: 'LPN'
          },
          serviceAddress: null,
          dynamicDateMode: null,
          appointmentDate: '',
          startDate: '2021-04-01T23:59:59.000000999',
          endDate: '2021-04-14T23:59:59.000000999',
          numberOfVisits: 0,
          notes: ''
        }
      ],
      referralId: 0
    },
    'homeHealth-inHomeTherapy': {
      rush: false,
      schedulingForm: [
        {
          serviceType: {
            customerSubTypeId: 1743,
            customerTypeId: 297,
            subTypeDescription: 'Physical Therapist'
          },
          serviceAddress: null,
          dynamicDateMode: null,
          appointmentDate: '',
          startDate: '2021-04-01T23:59:59.000000999',
          endDate: '2021-04-01T23:59:59.000000999',
          numberOfVisits: 0,
          notes: 'Test note for draft'
        },
        {
          serviceType: {
            customerSubTypeId: 1742,
            customerTypeId: 296,
            subTypeDescription: 'Occupational Therapist'
          },
          serviceAddress: null,
          dynamicDateMode: null,
          appointmentDate: '',
          startDate: '2021-04-01T23:59:59.000000999',
          endDate: '2021-04-30T23:59:59.000000999',
          numberOfVisits: 0,
          notes: ''
        }
      ],
      referralId: 0
    },
    'homeHealth-aides': {
      rush: false,
      schedulingForm: [
        {
          serviceType: {
            customerSubTypeId: 1738,
            customerTypeId: 292,
            subTypeDescription: 'Home Health Aide'
          },
          serviceAddress: null,
          dynamicDateMode: null,
          appointmentDate: '2021-04-08T23:59:59.000000999',
          startDate: '',
          endDate: '',
          numberOfVisits: 0,
          notes: ''
        }
      ],
      referralId: 0
    },
    'homeHealth-infusion': {
      rush: false,
      schedulingForm: [
        {
          serviceType: {
            customerSubTypeId: 1740,
            customerTypeId: 294,
            subTypeDescription: 'Home Injection Therapy'
          },
          serviceAddress: null,
          dynamicDateMode: null,
          appointmentDate: '',
          startDate: '2021-04-08T23:59:59.000000999',
          endDate: '2021-04-19T23:59:59.000000999',
          numberOfVisits: 0,
          notes: ''
        }
      ],
      referralId: 0
    },
    'homeHealth-other': {
      rush: true,
      schedulingForm: [
        {
          serviceType: {
            customerSubTypeId: 0,
            customerTypeId: 300,
            subTypeDescription: 'Social Worker'
          },
          serviceAddress: null,
          dynamicDateMode: null,
          appointmentDate: '',
          startDate: '2021-04-13T23:59:59.000000999',
          endDate: '2021-04-27T23:59:59.000000999',
          numberOfVisits: 0,
          notes: ''
        },
        {
          serviceType: {
            customerSubTypeId: 0,
            customerTypeId: 300,
            subTypeDescription: 'Social Worker'
          },
          serviceAddress: null,
          dynamicDateMode: null,
          appointmentDate: '2021-04-23T23:59:59.000000999',
          startDate: '',
          endDate: '',
          numberOfVisits: 0,
          notes: ''
        }
      ],
      referralId: 0
    },
    'homeHealth-vendors': {
      all: [
        {
          code: 'HL',
          name: 'Homelink',
          status: null
        },
        {
          code: 'MSC',
          name: 'One Call Care Mgmt',
          status: null
        }
      ]
    },
    'homeHealth-shared': {
      diagnosisCodes: [],
      prescriberName: 'Test pres',
      prescriberPhone: '8888888888',
      prescriberAddress: 'ase',
      surgeryDate: null,
      scheduleNear: {
        id: '90699',
        address: null,
        name: null,
        type: null
      },
      postSurgical: false
    }
  }
};

export const DME_DRAFT_927958 = {
  claimNumber: 'C000662',
  customerId: 'TRAVELERS',
  referralId: 927958,
  saveAsDraft: true,
  referralLevelNotes: 'Referral Level Notes',
  formValues: {
    'dme-equipment': {
      rush: true,
      prescriberName: null,
      prescriberPhone: null,
      prescriberAddress: null,
      schedulingForm: [
        {
          product: {
            customerSubTypeId: 1674,
            customerTypeId: 283,
            subTypeDescription: 'Nebulizer - Ultrasonic'
          },
          dynamicDateMode: 'dateRange',
          productSelectionMode: 'category',
          startDate: '2021-04-09T23:59:59.000000999',
          endDate: '2021-04-22T23:59:59.000000999',
          deliveryDate: '',
          deliveryAddress: {
            id: '70120',
            address: null,
            name: null,
            type: null
          },
          quantity: 5,
          rental: true,
          notes: '',
          hcpc: null
        },
        {
          product: {
            customerSubTypeId: 1734,
            customerTypeId: 290,
            subTypeDescription: 'Modification or Repair'
          },
          dynamicDateMode: 'dateRange',
          productSelectionMode: 'category',
          startDate: '2021-04-27T23:59:59.000000999',
          endDate: '2021-04-29T23:59:59.000000999',
          deliveryDate: '',
          deliveryAddress: {
            id: '70113',
            address: null,
            name: null,
            type: null
          },
          quantity: 2,
          rental: false,
          notes: 'Notes for line item',
          hcpc: null
        },
        {
          product: null,
          dynamicDateMode: 'dateRange',
          productSelectionMode: 'hcpc',
          startDate: '2021-03-09T23:59:59.000000999',
          endDate: '2021-04-30T23:59:59.000000999',
          deliveryDate: '',
          deliveryAddress: {
            id: '70117',
            address: null,
            name: null,
            type: null
          },
          quantity: 9,
          rental: true,
          notes: '',
          hcpc: '12354'
        },
        {
          product: {
            customerSubTypeId: 1706,
            customerTypeId: 286,
            subTypeDescription: 'Elevated Leg Rest'
          },
          dynamicDateMode: 'singleDate',
          productSelectionMode: 'category',
          startDate: '',
          endDate: '',
          deliveryDate: '2021-04-10T23:59:59.000000999',
          deliveryAddress: {
            id: '70113',
            address: null,
            name: null,
            type: null
          },
          quantity: 4,
          rental: true,
          notes: 'Second note line item',
          hcpc: null
        },
        {
          product: null,
          dynamicDateMode: 'singleDate',
          productSelectionMode: 'hcpc',
          startDate: '',
          endDate: '',
          deliveryDate: '2021-02-03T23:59:59.000000999',
          deliveryAddress: {
            id: '70113',
            address: null,
            name: null,
            type: null
          },
          quantity: 22,
          rental: false,
          notes: '',
          hcpc: '1223'
        }
      ],
      referralId: null
    },
    'dme-vendors': {
      all: [
        {
          code: 'NASA',
          name: 'NASA',
          status: null
        },
        {
          code: 'HL',
          name: 'Homelink',
          status: null
        }
      ]
    }
  }
};
