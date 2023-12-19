import { ClaimSearchResponse } from '@shared/store/models';

export const ClaimSearch: ClaimSearchResponse = {
  totalNumberOfClaimsFound: 240,
  claims: [
    {
      claimNumber: 'C000662',
      dateOfInjury: '08/03/2009',
      claimantName: 'JOSE FIGUEROA HC#2',
      stateAndOfficeID: 'FL-220',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'JEANNETTE FIGUEROA HC#2',
      adjusterEmail: 'JBJOHNS1',
      daysSinceRiskLevelChange: 73,
      riskCategory: ['Patient Safety'],
      previousActions: [
        {
          type: 'OMP',
          status: 'Completed',
          date: '04/04/2018'
        }
      ],
      interventions: [
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=C000662'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: true,
      snoozedUntilDate: '02/02/2020',
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'C000662TRV',
      claimMME: 8080
    },
    {
      claimNumber: 'DEMODAY01',
      dateOfInjury: '09/06/2015',
      claimantName: 'JAMES SULLIVAN DAY 01',
      stateAndOfficeID: 'MD-123',
      riskLevel: 'Lowest',
      riskLevelNumber: 1,
      riskIncreased: true,
      adjusterName: 'Healthe SULLIVAN DAY 01',
      adjusterEmail: 'HSYSTEMS',
      daysSinceRiskLevelChange: 0,
      riskCategory: ['Patient Safety'],
      previousActions: [],
      interventions: [
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=DEMODAY01'
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'DEMODAY01TRV',
      claimMME: 15
    },
    {
      claimNumber: 'DEMODAY62',
      dateOfInjury: '09/06/2015',
      claimantName: 'JAMES SULLIVAN DAY 62',
      stateAndOfficeID: 'MD-123',
      riskLevel: 'Medium',
      riskLevelNumber: 3,
      riskIncreased: true,
      adjusterName: 'Healthe SULLIVAN DAY 62',
      adjusterEmail: 'HSYSTEMS',
      daysSinceRiskLevelChange: 61,
      riskCategory: ['Patient Safety', 'Financial'],
      previousActions: [],
      interventions: [
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=DEMODAY62'
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: true,
      latestActionDate: '02/02/2019',
      phiMemberId: 'DEMODAY62TRV',
      claimMME: 45
    },
    {
      claimNumber: 'DEMODAY90',
      dateOfInjury: '09/06/2015',
      claimantName: 'JAMES SULLIVAN DAY 90',
      stateAndOfficeID: 'MD-123',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'Healthe SULLIVAN DAY 90',
      adjusterEmail: 'HSYSTEMS',
      daysSinceRiskLevelChange: 27,
      riskCategory: ['Patient Safety', 'Financial'],
      previousActions: [],
      interventions: [
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=DEMODAY90'
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: true,
      snoozedUntilDate: '02/02/2020',
      actionOccurred: true,
      latestActionDate: '02/02/2019',
      phiMemberId: 'DEMODAY90TRV',
      claimMME: 60
    },
    {
      claimNumber: 'DEMODAY150',
      dateOfInjury: '09/06/2015',
      claimantName: 'JAMES SULLIVAN DAY 150',
      stateAndOfficeID: 'MD-123',
      riskLevel: '',
      riskLevelNumber: 0,
      riskIncreased: false,
      adjusterName: 'Healthe SULLIVAN DAY 150',
      adjusterEmail: 'HSYSTEMS',
      daysSinceRiskLevelChange: 30,
      riskCategory: [' '],
      previousActions: [
        {
          type: 'IPE+',
          status: 'Completed',
          date: '01/06/2016'
        }
      ],
      interventions: [],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: true,
      latestActionDate: '10/01/2019',
      phiMemberId: 'DEMODAY150TRV',
      claimMME: 0
    },
    {
      claimNumber: 'EYL5821',
      dateOfInjury: '11/25/2009',
      claimantName: 'ESTELITA SAPLAN',
      stateAndOfficeID: 'CA-152',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'CAROLE SAPLAN',
      adjusterEmail: 'CLANPHER',
      daysSinceRiskLevelChange: 42,
      riskCategory: ['Patient Safety', 'Financial'],
      previousActions: [],
      interventions: [
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'On demand TAL',
          type: 'on demand tal',
          url: null
        },
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=EYL5821'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'EYL5821TRV',
      claimMME: 8081
    },
    {
      claimNumber: 'BKV6591',
      dateOfInjury: '01/10/2008',
      claimantName: 'MICHAEL WATTS',
      stateAndOfficeID: 'TN-095',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'ERIN WATTS',
      adjusterEmail: 'EGRAGE',
      daysSinceRiskLevelChange: 42,
      riskCategory: ['Patient Safety', 'Financial'],
      previousActions: [],
      interventions: [
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'On demand TAL',
          type: 'on demand tal',
          url: null
        },
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=BKV6591'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'BKV6591TRV',
      claimMME: null
    },
    {
      claimNumber: 'A4W6100',
      dateOfInjury: '09/29/2015',
      claimantName: 'JOHN SMITH',
      stateAndOfficeID: 'LA-629',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'MELINDA SMITH',
      adjusterEmail: 'MLOISEL2',
      daysSinceRiskLevelChange: 33,
      riskCategory: ['Patient Safety'],
      previousActions: [
        {
          type: 'IPE',
          status: 'Complete',
          date: '09/09/2019'
        },
        {
          type: 'IPE',
          status: 'In Review',
          date: '08/20/2019'
        }
      ],
      interventions: [
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=A4W6100'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'A4W6100TRV',
      claimMME: null
    },
    {
      claimNumber: 'A8Q5663',
      dateOfInjury: '04/09/2008',
      claimantName: 'JAMES SHORT',
      stateAndOfficeID: 'TN-095',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'MORGAN SHORT',
      adjusterEmail: 'MBENOY',
      daysSinceRiskLevelChange: 33,
      riskCategory: ['Medication Selection', 'Patient Safety'],
      previousActions: [
        {
          type: 'LOMN',
          status: 'Complete',
          date: '09/09/2019'
        },
        {
          type: 'LOMN',
          status: 'Complete',
          date: '08/21/2019'
        }
      ],
      interventions: [
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Targeted med review',
          type: 'targeted med review',
          url: null
        },
        {
          action: 'Prescriber consult',
          type: 'prescriber consult',
          url: null
        },
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=A8Q5663'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'A8Q5663TRV',
      claimMME: null
    },
    {
      claimNumber: 'A4W1740',
      dateOfInjury: '10/10/2000',
      claimantName: 'ISSAC JOHN',
      stateAndOfficeID: 'LA-629',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'MEDICAL JOHN',
      adjusterEmail: 'TST629CM',
      daysSinceRiskLevelChange: 33,
      riskCategory: ['Patient Safety'],
      previousActions: [
        {
          type: 'IPE',
          status: 'Complete',
          date: '09/09/2019'
        },
        {
          type: 'LOMN',
          status: 'In Review',
          date: '08/12/2019'
        }
      ],
      interventions: [
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Targeted med review',
          type: 'targeted med review',
          url: null
        },
        {
          action: 'Prescriber consult',
          type: 'prescriber consult',
          url: null
        },
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=A4W1740'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'A4W1740TRV',
      claimMME: null
    },
    {
      claimNumber: 'C000626',
      dateOfInjury: '09/07/2019',
      claimantName: ' ',
      stateAndOfficeID: 'VA-039',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: ' ',
      adjusterEmail: '',
      daysSinceRiskLevelChange: 32,
      riskCategory: ['Patient Safety'],
      previousActions: [
        {
          type: 'LOMN',
          status: 'Complete',
          date: '09/09/2019'
        },
        {
          type: 'LOMN',
          status: 'Complete',
          date: '08/13/2019'
        }
      ],
      interventions: [
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=C000626'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'C000626TRV',
      claimMME: null
    },
    {
      claimNumber: 'A3A3778',
      dateOfInjury: '12/01/1998',
      claimantName: 'JEROME SCHNEIDER',
      stateAndOfficeID: 'MN-095',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'DEBRA SCHNEIDER',
      adjusterEmail: 'DLUND',
      daysSinceRiskLevelChange: 32,
      riskCategory: ['Medication Selection', 'Patient Safety'],
      previousActions: [
        {
          type: 'LOMN',
          status: 'In Process',
          date: '08/16/2019'
        },
        {
          type: 'LOMN',
          status: 'Complete',
          date: '09/09/2019'
        }
      ],
      interventions: [
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Targeted med review',
          type: 'targeted med review',
          url: null
        },
        {
          action: 'Prescriber consult',
          type: 'prescriber consult',
          url: null
        },
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=A3A3778'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'A3A3778TRV',
      claimMME: null
    },
    {
      claimNumber: 'A4N3894',
      dateOfInjury: '01/19/2015',
      claimantName: 'ASDRUBAL OLIVEIRA',
      stateAndOfficeID: 'NY-506',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'KATHLEEN OLIVEIRA',
      adjusterEmail: 'KMCMANUS',
      daysSinceRiskLevelChange: 31,
      riskCategory: ['Patient Safety'],
      previousActions: [
        {
          type: 'TA Letter',
          status: 'Complete',
          date: '08/22/2019'
        },
        {
          type: 'LOMN',
          status: 'Complete',
          date: '09/09/2019'
        }
      ],
      interventions: [
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=A4N3894'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'A4N3894TRV',
      claimMME: null
    },
    {
      claimNumber: 'A3C2836',
      dateOfInjury: '09/01/2019',
      claimantName: 'NATHANIEL HILTON',
      stateAndOfficeID: 'MS-003',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'MARGARET HILTON',
      adjusterEmail: 'MNEAL',
      daysSinceRiskLevelChange: 30,
      riskCategory: ['Patient Safety'],
      previousActions: [
        {
          type: 'IPE',
          status: 'In Process',
          date: '08/13/2019'
        },
        {
          type: 'TA Letter',
          status: 'Complete',
          date: '09/09/2019'
        }
      ],
      interventions: [
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=A3C2836'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'A3C2836TRV',
      claimMME: null
    },
    {
      claimNumber: 'A4Z4151',
      dateOfInjury: '07/22/2009',
      claimantName: 'FOREST HAYES',
      stateAndOfficeID: 'CA-480',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: 'AMY HAYES',
      adjusterEmail: 'ACHERNOF',
      daysSinceRiskLevelChange: 30,
      riskCategory: ['Patient Safety'],
      previousActions: [
        {
          type: 'LOMN',
          status: 'In Process',
          date: '08/19/2019'
        },
        {
          type: 'LOMN',
          status: 'Complete',
          date: '09/09/2019'
        }
      ],
      interventions: [
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=A4Z4151'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: 'A4Z4151TRV',
      claimMME: null
    },
    {
      claimNumber: 'A3C2874',
      dateOfInjury: '09/07/2019',
      claimantName: 'NATHANIEL HODGES',
      stateAndOfficeID: 'AZ-095',
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskIncreased: true,
      adjusterName: ' HODGES',
      adjusterEmail: '',
      daysSinceRiskLevelChange: 29,
      riskCategory: ['Patient Safety'],
      previousActions: [
        {
          type: 'TA Letter',
          status: 'Complete',
          date: '09/09/2019'
        },
        {
          type: 'TA Letter',
          status: 'In Review',
          date: '08/12/2019'
        }
      ],
      interventions: [
        {
          action: 'OMP',
          type: 'omp',
          url: null
        },
        {
          action: 'Prescriber consult',
          type: 'prescriber consult',
          url: null
        },
        {
          action: 'IPE+',
          type: 'ipe+',
          url:
            '/PbmClinical/customer.jsp?#ManualIpe;customerId=TRAVELERS;claimNum=A3C2874'
        },
        {
          action: 'Pt Eng',
          type: 'pt eng',
          url: null
        },
        {
          action: 'Re-evaluate in 30 Days',
          type: 're-evaluate in 30 days',
          url: null
        }
      ],
      snoozed: false,
      snoozedUntilDate: null,
      actionOccurred: false,
      latestActionDate: null,
      phiMemberId: '51C916764ASEN',
      claimMME: 60
    }
  ]
};
