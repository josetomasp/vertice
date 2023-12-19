import { AuthorizationInformation } from 'src/app/claims/pbm/authorization/store/models/pbm-authorization-information.model';

export const authorizationInformation: AuthorizationInformation = {
  authorizationAlerts: [
    {
      alertSummary: 'NY Formulary Phase B - 2nd line drug requirements.',
      alertModalHTML: `
<div>
           <h3 class="text-primary">NY Formulary Phase B - 2nd line drug requirements</h3>
           <p>per NYS Workers' Comp formulary, as of December 5, 2019, any newly prescribed drug must be for a Drug Formulary medication.
           On or after June 5, 2020, all refills or renewals of prescriptions must use a Drug Formulary medication unless prior authorization
           has been obtained before the date of the refill or renewal. The following also applies:</p>
           <ul>
           <li>This medication is a <b>Phase B Drug</b>, requiring a prior authorization if not prescribed and dispensed after the first
           30 days following injury or until the claim is accepted.</li>
           <li>May be prescribed and dispensed during the perioperative period (four days before through four days following surgery)</li>
           <li><b>2nd line drug</b>: may be filled following a trial of a first-line drug prescribed in accordance with Phase B</li>
</ul>
<p>Consult NYS  formulary to determine medical appropriateness</p>
<a href="http://www.wcb.ny.gov/drug-formulary-regulation/NYS-drugformulary.pdf">http://www.wcb.ny.gov/drug-formulary-regulation/NYS-drugformulary.pdf</a>
</div>
    `
    },
    {
      alertSummary: 'Drug conflict w/ previous prescription',
      alertModalHTML: `
<div>
           <h4 class="text-primary">Drug conflict w/ previous prescription</h4>
           <p>This isn't a real alert. This is here just to look like a real alert.
           Please ignore this because I just need some more text on the screen to make it a realistic example</p>
</div>
    `
    },
    {
      alertSummary: 'Drug conflict w/ previous prescription',
      alertModalHTML: `
<div>
           <h4 class="text-primary">Drug conflict w/ previous prescription</h4>
           <p>This isn't a real alert. This is here just to look like a real alert.
           Please ignore this because I just need some more text on the screen to make it a realistic example</p>
</div>
    `
    }
  ],
  riskInformation: {
    estimatedPillCountOnHand: 60,
    mmeAfterRX: 34,
    mmeBeforeRX: 24,
    prescriptionMME: 32
  },
  prescriptionDetails: {
    alertMessage: 'This is an alert message',
    numberOfAlerts: 1,
    prescriberName: 'Donald Duck',
    prescriberId: '134',
    serviceDate: '10/20/2018',
    reasonRejected: ['patient is dead', 'Some Other Reason'],
    dispensedPrescName: 'Miricial Cure',
    dispensedPrescNameID: '1',
    fullPrescName: 'Miricial Cure (no really, it even cures dead people)',
    fullPrescNameID: '1',
    brandGenericStatus: 'Yes',
    inDrugPlan: 'Yes',
    quantity: 30,
    totalAWP: '$12.45',
    deaDrugClass: 'Awesome',
    daysSupply: 30,
    daw: 10,
    previousDecision: 'None',
    previousDecisionDate: '04/26/2011'
  }
};
