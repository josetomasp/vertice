import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerConfigsGuardService } from 'src/app/customer-configs/customer-configs-guard.service';
import { ClaimResolutionAuthorizationsComponent } from './authorizations/authorization-configs/claim-resolution-authorizations.component';
import { ClinicalAuthorizationsComponent } from './authorizations/authorization-configs/clinical-authorizations.component';
import { EpaqAuthorizationsComponent } from './authorizations/authorization-configs/epaq-authorizations.component';
import { MailOrderAuthorizationsComponent } from './authorizations/authorization-configs/mail-order-authorizations.component';
import { PaperBillRosterAuthorizationsComponent } from './authorizations/authorization-configs/paperBillRoster-authorizations.component';
import { ReferralAuthorizationsComponent } from './authorizations/authorization-configs/referral-authorizations.component';
import { AuthorizationsSearchContainerComponent } from './authorizations/authorizations-search-container.component';
import { PendingReferralsComponent } from './referrals/activity/pending-referrals/pending-referrals.component';
import { ReferralActivityComponent } from './referrals/activity/referral-activity/referral-activity.component';
import { ReferralDraftSearchComponent } from './referrals/activity/referral-draft-search/referral-draft-search.component';
import {
  AllAuthorizationsComponent
} from './authorizations/all-authorizations/all-authorizations.component';
import { PharmacySearchContainerComponent } from './pharmacy-search/pharmacy-search-container.component';

const routes: Routes = [
  {
    path: 'draft-referrals',
    component: ReferralDraftSearchComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'referral-activity',
    component: ReferralActivityComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'referral-search',
    component: ReferralActivityComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'pharmacy-search',
    component: PharmacySearchContainerComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: 'pending-referrals',
    component: PendingReferralsComponent,
    canActivate: [CustomerConfigsGuardService]
  },
  {
    path: '',
    component: AuthorizationsSearchContainerComponent,
    canActivate: [CustomerConfigsGuardService],
    children: [
      {
        path: 'all-authorizations',
        component: AllAuthorizationsComponent
      },
      {
        path: 'epaq-authorizations',
        component: EpaqAuthorizationsComponent
      },
      {
        path: 'paper-authorizations',
        component: PaperBillRosterAuthorizationsComponent
      },
      {
        path: 'mail-order-authorizations',
        component: MailOrderAuthorizationsComponent
      },
      {
        path: 'claim-resolution-authorizations',
        component: ClaimResolutionAuthorizationsComponent
      },
      {
        path: 'clinical-authorizations',
        component: ClinicalAuthorizationsComponent
      },
      {
        path: 'referral-authorizations',
        component: ReferralAuthorizationsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchNavRoutingModule {}
