import * as _moment from 'moment';

const moment = _moment;

export const RiskModalData = [
  {
    id: '43303030363632',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    claimantInformation: {
      claimantSSN: '135543584',
      claimantName: 'Bob Newby',
      claimantAge: 35,
      dateOfBirth: '01/01/1984',
      address: '13 Mindflayer Pkwy',
      employerName: 'Hawkins National Laboratory',
      claimMME: 90,
      riskLevel: { riskIncreased: true, trendScoreDuration: 4 },
      claimNumber: 'DEF489',
      riskFactors: 6
    },
    monthlyRiskGraphData: {
      name: 'Monthly Risk Level',
      series: [
        {
          value: 0,
          name: '05/01/2018'
        },
        { value: 1, name: '06/01/2018' },
        { value: 1, name: '07/01/2018' },
        {
          value: 2,
          name: '08/01/2018'
        },
        { value: 3, name: '09/01/2018' },
        { value: 3, name: '10/01/2018' },
        {
          value: 2,
          name: '11/01/2018'
        },
        { value: 0, name: '12/01/2018' }
      ]
    },
    quarterlyRiskGraphData: {
      name: 'Quarterly Risk Level',
      series: [
        {
          value: 0,
          name: '01/01/2018'
        },
        { value: 3, name: '04/01/2018' },
        { value: 3, name: '07/01/2018' },
        { value: 2, name: '10/01/2018' }
      ]
    },
    riskDetails: [
      {
        riskLevel: 'Lowest',
        riskLevelNumber: 1,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'Opioids + Benzodiazepine',
        riskDescription: 'High Risk combination therapy',
        atRiskOf:
          'Adverse medication effects, long term use, polypharmacy, dependence, addiction, overdose'
      },
      {
        riskLevel: 'High',
        riskLevelNumber: 4,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      },
      {
        riskLevel: 'Medium',
        riskLevelNumber: 3,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      },
      {
        riskLevel: 'Low',
        riskLevelNumber: 2,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      },
      {
        riskLevel: 'Lowest',
        riskLevelNumber: 1,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      }
    ]
  },
  {
    id: '444546343839',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    claimantInformation: {
      claimantSSN: '135543584',
      claimantName: 'Bob Newby',
      claimantAge: 35,
      dateOfBirth: '01/01/1984',
      address: '13 Mindflayer Pkwy',
      employerName: 'Hawkins National Laboratory',
      claimMME: 90,
      riskLevel: { riskIncreased: true, trendScoreDuration: 4 },
      claimNumber: 'DEF489',
      riskFactors: 6
    },
    monthlyRiskGraphData: {
      name: 'Monthly Risk Level',
      series: [
        {
          value: 0,
          name: '05/01/2018'
        },
        { value: 1, name: '06/01/2018' },
        { value: 1, name: '07/01/2018' },
        {
          value: 2,
          name: '08/01/2018'
        },
        { value: 3, name: '09/01/2018' },
        { value: 3, name: '10/01/2018' },
        {
          value: 2,
          name: '11/01/2018'
        },
        { value: 0, name: '12/01/2018' }
      ]
    },
    quarterlyRiskGraphData: {
      name: 'Quarterly Risk Level',
      series: [
        {
          value: 0,
          name: '01/01/2018'
        },
        { value: 3, name: '04/01/2018' },
        { value: 3, name: '07/01/2018' },
        { value: 2, name: '10/01/2018' }
      ]
    },
    riskDetails: [
      {
        riskLevel: 'Lowest',
        riskLevelNumber: 1,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'Opioids + Benzodiazepine',
        riskDescription: 'High Risk combination therapy',
        atRiskOf:
          'Adverse medication effects, long term use, polypharmacy, dependence, addiction, overdose'
      },
      {
        riskLevel: 'High',
        riskLevelNumber: 4,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      },
      {
        riskLevel: 'Medium',
        riskLevelNumber: 3,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      },
      {
        riskLevel: 'Low',
        riskLevelNumber: 2,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      },
      {
        riskLevel: 'Lowest',
        riskLevelNumber: 1,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      }
    ]
  },
  {
    id: '414243313233',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    claimantInformation: {
      claimantSSN: '135543584',
      claimantName: 'Bob Newby',
      claimantAge: 35,
      dateOfBirth: '01/01/1984',
      address: '13 Mindflayer Pkwy',
      employerName: 'Hawkins National Laboratory',
      claimMME: 90,
      riskLevel: { riskIncreased: true, trendScoreDuration: 4 },
      claimNumber: 'ABC123',
      riskFactors: 6
    },
    monthlyRiskGraphData: {
      name: 'Monthly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '05/01/2018'
        },
        { value: 1, name: '06/01/2018' },
        { value: 1, name: '07/01/2018' },
        {
          value: 2,
          name: '08/01/2018'
        },
        { value: 3, name: '09/01/2018' },
        { value: 3, name: '10/01/2018' },
        {
          value: 4,
          name: '11/01/2018'
        },
        { value: 5, name: '12/01/2018' }
      ]
    },
    quarterlyRiskGraphData: {
      name: 'Quarterly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '01/01/2018'
        },
        { value: 3, name: '04/01/2018' },
        { value: 3, name: '07/01/2018' },
        { value: 2, name: '10/01/2018' }
      ]
    },

    riskDetails: [
      {
        riskLevel: 'Highest',
        riskLevelNumber: 5,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      }
    ]
  },
  {
    id: '444546343536',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    claimantInformation: {
      claimantSSN: '135543584',
      claimantName: 'Bob Newby',
      claimantAge: 35,
      dateOfBirth: '01/01/1984',
      address: '13 Mindflayer Pkwy',
      employerName: 'Hawkins National Laboratory',
      claimMME: 90,
      riskLevel: { riskIncreased: true, trendScoreDuration: 4 },
      claimNumber: 'DEF456',
      riskFactors: 6
    },
    monthlyRiskGraphData: {
      name: 'Monthly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '05/01/2018'
        },
        { value: 1, name: '06/01/2018' },
        { value: 1, name: '07/01/2018' },
        {
          value: 1,
          name: '08/01/2018'
        },
        { value: 3, name: '09/01/2018' },
        { value: 3, name: '10/01/2018' },
        {
          value: 4,
          name: '11/01/2018'
        },
        { value: 5, name: '12/01/2018' }
      ]
    },
    quarterlyRiskGraphData: {
      name: 'Quarterly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '01/01/2018'
        },
        { value: 3, name: '04/01/2018' },
        { value: 3, name: '07/01/2018' },
        { value: 1, name: '10/01/2018' }
      ]
    },
    riskDetails: [
      {
        riskLevel: 'Highest',
        riskLevelNumber: 5,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      }
    ]
  },
  {
    id: '444546343538',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    claimantInformation: {
      claimantSSN: '135543584',
      claimantName: 'Bob Newby',
      claimantAge: 35,
      dateOfBirth: '01/01/1984',
      address: '13 Mindflayer Pkwy',
      employerName: 'Hawkins National Laboratory',
      claimMME: 90,
      riskLevel: { riskIncreased: true, trendScoreDuration: 4 },
      claimNumber: 'DEF458',
      riskFactors: 6
    },
    monthlyRiskGraphData: {
      name: 'Monthly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '05/01/2018'
        },
        { value: 1, name: '06/01/2018' },
        { value: 1, name: '07/01/2018' },
        {
          value: 1,
          name: '08/01/2018'
        },
        { value: 3, name: '09/01/2018' },
        { value: 3, name: '10/01/2018' },
        {
          value: 4,
          name: '11/01/2018'
        },
        { value: 5, name: '12/01/2018' }
      ]
    },
    quarterlyRiskGraphData: {
      name: 'Quarterly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '01/01/2018'
        },
        { value: 3, name: '04/01/2018' },
        { value: 3, name: '07/01/2018' },
        { value: 1, name: '10/01/2018' }
      ]
    },
    riskDetails: [
      {
        riskLevel: 'Highest',
        riskLevelNumber: 5,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      }
    ]
  },
  {
    id: '444546343539',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    claimantInformation: {
      claimantSSN: '135543584',
      claimantName: 'Bob Newby',
      claimantAge: 35,
      dateOfBirth: '01/01/1984',
      address: '13 Mindflayer Pkwy',
      employerName: 'Hawkins National Laboratory',
      claimMME: 90,
      riskLevel: { riskIncreased: true, trendScoreDuration: 4 },
      claimNumber: 'DEF459',
      riskFactors: 6
    },
    monthlyRiskGraphData: {
      name: 'Monthly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '05/01/2018'
        },
        { value: 1, name: '06/01/2018' },
        { value: 1, name: '07/01/2018' },
        {
          value: 1,
          name: '08/01/2018'
        },
        { value: 3, name: '09/01/2018' },
        { value: 3, name: '10/01/2018' },
        {
          value: 4,
          name: '11/01/2018'
        },
        { value: 5, name: '12/01/2018' }
      ]
    },
    quarterlyRiskGraphData: {
      name: 'Quarterly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '01/01/2018'
        },
        { value: 3, name: '04/01/2018' },
        { value: 3, name: '07/01/2018' },
        { value: 1, name: '10/01/2018' }
      ]
    },
    riskDetails: [
      {
        riskLevel: 'Highest',
        riskLevelNumber: 5,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      }
    ]
  },
  {
    id: '444546343532',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    claimantInformation: {
      claimantSSN: '135543584',
      claimantName: 'Bob Newby',
      claimantAge: 35,
      dateOfBirth: '01/01/1984',
      address: '13 Mindflayer Pkwy',
      employerName: 'Hawkins National Laboratory',
      claimMME: 90,
      riskLevel: { riskIncreased: true, trendScoreDuration: 4 },
      claimNumber: 'DEF452',
      riskFactors: 6
    },
    monthlyRiskGraphData: {
      name: 'Monthly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '05/01/2018'
        },
        { value: 1, name: '06/01/2018' },
        { value: 1, name: '07/01/2018' },
        {
          value: 1,
          name: '08/01/2018'
        },
        { value: 3, name: '09/01/2018' },
        { value: 3, name: '10/01/2018' },
        {
          value: 4,
          name: '11/01/2018'
        },
        { value: 5, name: '12/01/2018' }
      ]
    },
    quarterlyRiskGraphData: {
      name: 'Quarterly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '01/01/2018'
        },
        { value: 3, name: '04/01/2018' },
        { value: 3, name: '07/01/2018' },
        { value: 1, name: '10/01/2018' }
      ]
    },
    riskDetails: [
      {
        riskLevel: 'Highest',
        riskLevelNumber: 5,
        riskCategory: 'Strangness',
        riskSubcategory: 'Interplanar beings',
        riskIndicator: 'That hole to another dimension',
        riskDescription:
          "Some young nerds can't handle this alone, we need the government!",
        atRiskOf: 'Death'
      }
    ]
  },
  {
    id: '444753343232',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    claimantInformation: {
      claimantSSN: '135543584',
      claimantName: 'Bob Newby',
      claimantAge: 35,
      dateOfBirth: '01/01/1984',
      address: '13 Mindflayer Pkwy',
      employerName: 'Hawkins National Laboratory',
      claimMME: 90,
      riskLevel: { riskIncreased: true, trendScoreDuration: 4 },
      claimNumber: 'DGS422',
      riskFactors: 6
    },
    monthlyRiskGraphData: {
      name: 'monthlyRiskGraphDataSeriesName-monthly-DGS422',
      series: [
        { name: 'point1Name', value: 1 },
        { name: 'point2Name', value: 2 },
        { name: 'point3Name', value: 3 }
      ]
    },
    quarterlyRiskGraphData: {
      name: 'Quarterly Risk Level',
      series: [
        {
          value: 'No Risk Identified',
          name: '01/01/2018'
        },
        { value: 3, name: '04/01/2018' },
        { value: 3, name: '07/01/2018' },
        { value: 1, name: '10/01/2018' }
      ]
    },
    riskDetails: {
      riskLevel: 'Highest',
      riskLevelNumber: 5,
      riskCategory: 'Strangness',
      riskSubcategory: 'Interplanar beings',
      riskIndicator: 'That hole to another dimension',
      riskDescription:
        "Some young nerds can't handle this alone, we need the government!",
      atRiskOf: 'Death'
    }
  }
];

export const RiskLevelOverTime = [
  {
    id: 'DEF489',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'monthly',
    name: 'Monthly Risk Level',
    series: [
      {
        value: 'No Risk Identified',
        name: '05/01/2018'
      },
      { value: 1, name: '06/01/2018' },
      { value: 1, name: '07/01/2018' },
      {
        value: 1,
        name: '08/01/2018'
      },
      { value: 3, name: '09/01/2018' },
      { value: 3, name: '10/01/2018' },
      {
        value: 4,
        name: '11/01/2018'
      },
      { value: 5, name: '12/01/2018' }
    ]
  },
  {
    id: 'DEF489',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'quarterly',
    name: 'Monthly Risk Level',
    series: [
      {
        value: 'No Risk Identified',
        name: '01/01/2018'
      },
      { value: 1, name: '03/01/2018' },
      { value: 1, name: '06/01/2018' },
      {
        value: 1,
        name: '12/01/2018'
      },
      { value: 3, name: '09/01/2019' },
      { value: 3, name: '12/01/2018' },
      {
        value: 4,
        name: '03/01/2019'
      },
      { value: 5, name: '06/01/2019' }
    ]
  },
  {
    id: 'ABC123',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'monthly',
    name: 'monthlyRiskGraphDataSeriesName-monthly-ABC123',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'ABC123',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'quarterly',
    name: 'monthlyRiskGraphDataSeriesName-quarterly-ABC123',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DEF456',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'monthly',
    name: 'monthlyRiskGraphDataSeriesName-monthly-DEF456',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DEF456',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'quarterly',
    name: 'monthlyRiskGraphDataSeriesName-quarterly-DEF456',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DEF458',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'monthly',
    name: 'monthlyRiskGraphDataSeriesName-monthly-DEF458',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DEF458',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'quarterly',
    name: 'monthlyRiskGraphDataSeriesName-quarterly-DEF458',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DEF459',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'monthly',
    name: 'monthlyRiskGraphDataSeriesName-monthly-DEF459',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DEF459',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'quarterly',
    name: 'monthlyRiskGraphDataSeriesName-quarterly-DEF459',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DEF452',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'monthly',
    name: 'monthlyRiskGraphDataSeriesName-monthly-DEF452',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DEF452',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'quarterly',
    name: 'monthlyRiskGraphDataSeriesName-quarterly-DEF452',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DGS422',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'monthly',
    name: 'monthlyRiskGraphDataSeriesName-monthly-DGS422',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  },
  {
    id: 'DGS422',
    fromDate: moment().format('YYYY-MM-DD'),
    toDate: moment()
      .add(-6, 'months')
      .format('YYYY-MM-DD'),
    interval: 'quarterly',
    name: 'monthlyRiskGraphDataSeriesName-quarterly-DGS422',
    series: [
      { name: 'point1Name', value: 1 },
      { name: 'point2Name', value: 2 },
      { name: 'point3Name', value: 3 }
    ]
  }
];
