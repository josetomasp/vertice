import { AfterViewInit, Component, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons';

@Component({
  selector: 'healthe-vertice-help',
  templateUrl: './vertice-help.component.html',
  styleUrls: ['./vertice-help.component.scss']
})
export class VerticeHelpComponent implements AfterViewInit {
  faQuestionCircle = faQuestionCircle;
  isExpanded: boolean = false;
  helpPanelExpandedWidth = { width: '400px' };
  helpPanelClosedWidth = { width: '0px' };

  helpPanelWidth = this.helpPanelClosedWidth;
  feedBackButtonID = 'atlwdg-trigger';
  verticeHelpButtonID = 'verticeHelpButton';
  offsetTimer;

  private defaultHelpUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/help.html'
  );
  srcLink = this.defaultHelpUrl;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.fixHelpButtonVerticeOffset();
  }

  constructor(private router: Router, private sanitizer: DomSanitizer) {}

  ngAfterViewInit() {
    // Sometimes the feedback button is not in the dom yet when this initializes
    // so we will put this in a 'try' loop until it succeeds.
    // Originally done with a recursive setTimeout, but for some reason,
    // that randomly would stop working.
    this.offsetTimer = setInterval(() => {
      this.fixHelpButtonVerticeOffset();
    }, 200);
  }

  clickHelp(): void {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.helpPanelWidth = this.helpPanelExpandedWidth;
      document.getElementById(this.feedBackButtonID).style.visibility =
        'hidden';
      this.setSrcLink();
    } else {
      this.helpPanelWidth = this.helpPanelClosedWidth;
      document.getElementById(this.feedBackButtonID).style.visibility =
        'visible';
    }
  }

  fixHelpButtonVerticeOffset() {
    let feedbackElement: HTMLElement = document.getElementById(
      this.feedBackButtonID
    );

    if (null != feedbackElement) {
      let rect: DOMRect = feedbackElement.getBoundingClientRect() as DOMRect;
      // The last number represents the offset from the Feedback button.
      // Originally this was a well named variable, but for some unknown reason
      // once in a while the result of this math operation was NaN.  Putting in
      // the literal value fixed that issue.
      let verticalOffset = Math.floor(rect.top - 151);
      let marginTop = '' + verticalOffset + 'px';
      let helpElement: HTMLElement = document.getElementById(
        this.verticeHelpButtonID
      );
      helpElement.style.marginTop = marginTop;
      helpElement.style.visibility = 'visible';
      if (0 !== this.offsetTimer) {
        clearInterval(this.offsetTimer);
      }
      this.offsetTimer = 0;
    }
  }
  private setSrcLink(): void {
    const url = this.router.url;
    const regexMakeReferral = /(\/vertice-ui\/vertice)?\/referrals\/make-a-referral-search(\/)?/g;
    const regexMakeReferral2 = /(\/vertice-ui\/vertice)?\/claims\/[A-z0-9]+\/[A-z0-9]+\/referral\/(create|review|serviceSelection)(\/)?/g;
    const regexClaimView = /(\/vertice-ui\/vertice)?\/claimview\/[A-z0-9]+\/[A-z0-9]+\/[A-z0-9]+\/[A-z0-9]+(\/)?/g;
    const regexReferralAuth = /(\/vertice-ui\/vertice)?\/claims\/[A-z0-9]+\/[A-z0-9]+\/referral\/[A-z0-9]+\/(physicalMedicine|language|transportation|dme|homeHealth|diagnostics|legacyTransportation)\/[A-z0-9]+(\/)?/g;
    const regexPOSSearch = /(\/vertice-ui\/vertice)?\/search-nav\/epaq-authorizations(\/)?/g;
    const regexPOSAuth = /(\/vertice-ui\/vertice)?\/claims\/[A-z0-9]+\/[A-z0-9]+\/pbm\/[A-z0-9]+\/pos\/authorizationInformation(\/)?/g;
    const regexLOMNAuth = /(\/vertice-ui\/vertice)?\/claims\/[A-z0-9]+\/[A-z0-9]+\/pbm\/[A-z0-9]+\/pos\/createLomn\/[A-z0-9]+(\/)?/g;
    const regexPaperSearch = /(\/vertice-ui\/vertice)?\/search-nav\/paper-authorizations(\/)?/g;
    const regexMailOrderSearch = /(\/vertice-ui\/vertice)?\/search-nav\/mail-order-authorizations(\/)?/g;
    const regexClinicalSearch = /(\/vertice-ui\/vertice)?\/search-nav\/clinical-authorizations(\/)?/g;

    if (regexMakeReferral.test(url) || regexMakeReferral2.test(url)) {
      this.srcLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/Help-Make-A-Referral.html'
      );
    } else if (regexClaimView.test(url)) {
      this.srcLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/Help-Claim-View.html'
      );
    } else if (regexReferralAuth.test(url)) {
      this.srcLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/Help-Referral-Authorizations.html'
      );
    } else if (regexPOSSearch.test(url) || regexPOSAuth.test(url)) {
      this.srcLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/Help-POS-Authorizations.html'
      );
    } else if (regexLOMNAuth.test(url)) {
      this.srcLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/Help-POS-Authorizations.html#10'
      );
    } else if (regexPaperSearch.test(url)) {
      this.srcLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/Help-Paper-Authorizations.html'
      );
    } else if (regexMailOrderSearch.test(url)) {
      this.srcLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/Help-Mail-Order-Authorizations.html'
      );
    } else if (regexClinicalSearch.test(url)) {
      this.srcLink = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://devvrthelp9501.blob.core.windows.net/devverticehelphes/Help-Clinical-Authorizations.html'
      );
    } else {
      this.srcLink = this.defaultHelpUrl;
    }
  }
}
