import { Component } from '@angular/core';
import { isSSOUser } from '@shared/lib/browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'timeout';
  isSSOUser = isSSOUser();

  constructor() {}

  toLogin() {
    window.location.href = '/HesDashboard/';
  }
}
