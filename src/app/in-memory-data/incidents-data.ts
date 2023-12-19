import { IncidentsResponse } from '../claim-view/store/models/incidents-tab.model';

export const incidentsData: IncidentsResponse = {
  incidents: [
    {
      claimNumber: 'C000662',
      customerCode: 'Travelers Insurance',
      productType: 'Ancillary',
      incidentNumber: 390,
      incidentType: 'Delivery Delay',
      dateSubmitted: '01/11/2018',
      referralID: 468338,
      vendor: 'TechHealth',
      service: 'DME',
      incidentDate: '11/21/2017',
      incidentStatus: 'Open',
      submittedBy: 'Karuna Pendyala',
      submittedEmail: 'kpendyala@healthesystems.com',
      submittedPhone: '',
      claimantName: 'Fabron Kennicot',
      dateOfLoss: '10/30/2002',
      incidentDesc: 'dd',
      incidentResolution: '',
      vendorIssue: 'true'
    },
    {
      claimNumber: 'C000662',
      customerCode: 'Travelers Insurance',
      productType: 'Ancillary',
      incidentNumber: 389,
      incidentType: 'Delivery Delay',
      dateSubmitted: '01/11/2018',
      referralID: 468338,
      vendor: 'TechHealth',
      service: 'DME',
      incidentDate: '01/10/2018',
      incidentStatus: 'Open',
      submittedBy: 'Karuna Pendyala',
      submittedEmail: 'kpendyala@healthesystems.com',
      submittedPhone: '',
      claimantName: 'Fabron Kennicot',
      dateOfLoss: '10/30/2002',
      incidentDesc: 'delayed',
      incidentResolution: '',
      vendorIssue: 'true'
    }
  ],
  totalIncidents: 2
};
