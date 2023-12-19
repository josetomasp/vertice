export const CLINICAL_HISTORY = {
  clinicalHistory: [
    {
      title: 'Occupational Therapy',
      anticipatedDischargeDate: '01/01/1900',
      mdVisitScheduleDate: '01/01/1900',
      peerReview: [
        {
          peerReviewDate: '12/15/2020',
          reviewer: 'Larry Smith',
          decision: 'Recommended with Modification - Decrease Duration'
        },
        {
          peerReviewDate: '09/17/2019',
          reviewer: 'John Doe',
          decision: 'Recommended with Modification - Decrease Duration'
        }
      ],
      partsOfBody: [
        {
          title: 'Upper Arm',
          subTitle: 'Right',
          columns: [
            {
              columnName: 'evaluationDescription',
              columnLabel: ''
            },
            {
              columnName: '1',
              columnLabel: '10/10/2019'
            },
            {
              columnName: '2',
              columnLabel: '11/20/2019'
            },
            {
              columnName: '3',
              columnLabel: '11/24/2019'
            },
            {
              columnName: '4',
              columnLabel: '11/25/2019'
            },
            {
              columnName: '5',
              columnLabel: '11/26/2019'
            },
            {
              columnName: '6',
              columnLabel: '11/27/2019'
            }
          ],
          tableData: [
            {
              evaluationDescription: 'Pain Frequency',
              '1': '10 - On Fire, In need of extinguishing',
              '2': '10 - On Fire, In need of extinguishing',
              '3':
                '11 - Triggered Nuclear Fusion, This could be written in to Journal Nature and earn someone a PHD, or even a nobel prize, this is wild',
              '4': '10 - On Fire, In need of extinguishing',
              '5': '10 - On Fire, In need of extinguishing'
            }
          ]
        },
        {
          title: 'Elbow',
          subTitle: 'Right',
          columns: [
            {
              columnName: 'evaluationDescription',
              columnLabel: ''
            },
            {
              columnName: '1',
              columnLabel: '10/10/2019'
            },
            {
              columnName: '2',
              columnLabel: '10/30/2019'
            },
            {
              columnName: '3',
              columnLabel: '11/19/2019'
            }
          ],
          tableData: [
            {
              '1': '5 - Moderate Pain',
              '2': '5 - Moderate Pain',
              '3': '5 - Moderate Pain',
              '4': '5 - Moderate Pain',
              '5': '5 - Moderate Pain',
              '6': '5 - Moderate Pain',
              '7': '5 - Moderate Pain',
              '8': '5 - Moderate Pain',
              evaluationDescription: 'Pain Level'
            },
            {
              evaluationDescription: 'Pain Frequency'
            }
          ]
        },
        {
          title: 'Wrist',
          subTitle: 'Right',
          columns: [
            {
              columnName: 'evaluationDescription',
              columnLabel: ''
            },
            {
              columnName: '1',
              columnLabel: '10/10/2019'
            },
            {
              columnName: '2',
              columnLabel: '11/19/2019'
            }
          ],
          tableData: [
            {
              evaluationDescription: 'Pain Frequency'
            }
          ]
        }
      ]
    }
  ]
};
