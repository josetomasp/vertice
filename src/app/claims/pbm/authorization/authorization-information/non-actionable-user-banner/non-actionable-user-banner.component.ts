import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'healthe-non-actionable-user-banner',
  templateUrl: './non-actionable-user-banner.component.html',
  styleUrls: ['./non-actionable-user-banner.component.scss']
})
export class NonActionableUserBannerComponent implements OnInit {
  hideGoBackButton: boolean = false;
  constructor(private router: Router) {
    // Paper and POS auth screens are not supposed to have the go back button.
    this.hideGoBackButton = router.url.indexOf('/pbm/') !== -1;
  }

  ngOnInit() {}

  goBack() {
    window.history.back();
  }
}
