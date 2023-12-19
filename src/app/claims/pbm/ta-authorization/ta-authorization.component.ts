import {
  Component,
  Inject,
  OnInit,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import { TaAuthorizationStore } from './ta-authorization.store';
import { FormValidationExtractorService } from '@modules/form-validation-extractor';
import { ServerErrorOverlayAnchorDirective } from '@modules/server-error-overlay/server-error-overlay-anchor.directive';

@Component({
  selector: 'healthe-ta-authorization',
  templateUrl: './ta-authorization.component.html',
  styleUrls: ['./ta-authorization.component.scss'],
  providers: [FormValidationExtractorService, TaAuthorizationStore]
})
export class TaAuthorizationComponent implements OnInit {

  constructor(public taLetterStore: TaAuthorizationStore) {}
  viewModel$ = this.taLetterStore.select(
    ({
      decodedClaimNumber,
      decodedTaAuthorizationId,
      claimViewLink,
      pbmClaimStatus,
      abmClaimStatus,
      riskLevelNumber,
      riskLevel,
      showFooter,
      selectedTabIndex,
      isTaAuthorizationLoading,
      isExParteMessageLoading
    }) => ({
      decodedClaimNumber,
      decodedTaAuthorizationId,
      claimViewLink,
      pbmClaimStatus,
      abmClaimStatus,
      riskLevelNumber,
      riskLevel,
      showFooter: showFooter && !isTaAuthorizationLoading,
      selectedTabIndex,
      isLoading: isTaAuthorizationLoading || isExParteMessageLoading
    })
  );
  ngOnInit(): void {

    this.taLetterStore.init();
  }
}
