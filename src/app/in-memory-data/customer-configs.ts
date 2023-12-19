import { CustomerConfigs } from '../customer-configs/customer-configs';

export const customerConfigs: CustomerConfigs[] = [
  {
    elementsToRemove: [
      {
        componentGroupName: 'claim-search-filter-box',
        elements: [
          {
            name: 'assignedAdjuster',
            value: false
          },
          {
            name: 'exportButton',
            value: false
          },
          {
            name: 'riskLevel',
            value: false
          },
          {
            name: 'riskCategory',
            value: false
          }
        ]
      },
      {
        componentGroupName: 'claim-search-results-table',
        elements: []
      },
      {
        componentGroupName: 'claim-view-icd-code-tab-icd-code-table',
        elements: [
          {
            name: 'compensabilityDescription',
            value: false
          }
        ]
      },
      {
        componentGroupName: 'activity',
        elements: [
          {
            name: 'ancillaryActivityTab',
            value: false
          }
        ]
      },
      {
        componentGroupName: 'claimant',
        elements: [
          {
            name: 'gender',
            value: false
          }
        ]
      },
      {
        componentGroupName: 'banner',
        elements: [
          {
            name: 'pbmActivePill',
            value: false
          },
          {
            name: 'preferences',
            value: false
          },
          {
            name: 'riskWidget',
            value: true
          }
        ]
      },
      {
        componentGroupName: 'claim-view',
        elements: [
          {
            name: 'claimCloseDate',
            value: false
          },
          {
            name: 'apportionment',
            value: false
          },
          {
            name: 'stateOfVenue',
            value: false
          },
          {
            name: 'requestButton',
            value: false
          }
        ]
      },
      {
        componentGroupName: 'eligibility',
        elements: [
          {
            name: 'ancillaryClaimDates',
            value: false
          },
          {
            name: 'paymentCoverageIndicator',
            value: true
          },
          {
            name: 'pbmInactiveDate',
            value: false
          },
          {
            name: 'abmInactiveDate',
            value: false
          },
          {
            name: 'apportionmentEditLink',
            value: false
          },
          {
            name: 'heightEditLink',
            value: false
          },
          {
            name: 'weightEditLink',
            value: false
          },
          {
            name: 'longTermCareEditLink',
            value: false
          },
          {
            name: 'abmTerminatedDateEditLink',
            value: false
          },
          {
            name: 'pbmTerminatedDateEditLink',
            value: false
          }
        ]
      }
    ],
    elementsToDisable: [
      {
        componentGroupName: 'claim-search-filter-box',
        elements: [
          {
            name: 'resetButton',
            value: false
          },
          {
            name: 'riskLevel',
            value: false
          }
        ]
      },
      {
        componentGroupName: 'claimTrendingModal',
        elements: [
          {
            name: 'actionSelect',
            value: false
          }
        ]
      },
      {
        componentGroupName: 'claim-view',
        elements: [
          {
            name: 'longTermCare',
            value: true
          }
        ]
      },
      {
        componentGroupName: 'sideNav',
        elements: [
          {
            name: 'dashboard',
            value: false
          },
          {
            name: 'claims',
            value: false
          },
          {
            name: 'claims_claimSearch',
            value: false
          },
          {
            name: 'drugSearch',
            value: true
          }
        ]
      }
    ],
    labelChanges: [
      {
        name: 'claimantFirstName',
        value: 'Claimant First Name'
      },
      {
        name: 'claimantName',
        value: 'CLAIMANT NAME'
      },
      {
        name: 'claimantDOB',
        value: 'Claimant DOB'
      },
      {
        name: 'claimantLastName',
        value: 'Claimant Last Name'
      },
      {
        name: 'claimantTab',
        value: 'Claimant'
      },
      {
        name: 'claimantInformationLabel',
        value: 'Claimant Information'
      },
      {
        name: 'actionButton',
        value: 'AUTHORIZE / DENY'
      },
      {
        name: 'actionLabel',
        value: 'ACTION'
      },
      {
        name: 'stateOfVenue',
        value: 'Benefit State'
      },
      {
        name: 'clinicalActivityTab',
        value: 'RX Clinical'
      }
    ],
    routesToDisable: [
      {
        name: '/claimview/activity/clinical',
        value: false
      },
      {
        name: '/claims/claimSearch',
        value: false
      },
      {
        name: '/dashboard',
        value: false
      }
    ],
    services: ['Ancillary', 'Pharmacy', 'Clinical']
  }
];
