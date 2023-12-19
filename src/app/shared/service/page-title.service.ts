import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { select, Store } from '@ngrx/store';
import { RootState } from '../../store/models/root.models';
import { combineLatest, Observable } from 'rxjs';
import {
  getDecodedAuthorizationId,
  getDecodedClaimNumber
} from '../../store/selectors/router.selectors';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private VERTICE = 'Vertice 3.0';

  private decodedClaimNumber$: Observable<string> = this.store$.pipe(
    select(getDecodedClaimNumber)
  );

  private authorizationId$: Observable<string> = this.store$.pipe(
    select(getDecodedAuthorizationId)
  );

  constructor(private titleService: Title, private store$: Store<RootState>) {}

  public setTitleWithClaimNumber(
    primarySectionTitle: string,
    subsectionTitle?: string
  ) {
    this.decodedClaimNumber$.pipe(first()).subscribe((claimNumber) => {
      if (subsectionTitle) {
        this.titleService.setTitle(
          this.VERTICE +
            ' - ' +
            primarySectionTitle +
            ': ' +
            claimNumber +
            ' - ' +
            subsectionTitle
        );
      } else {
        this.titleService.setTitle(
          this.VERTICE + ' - ' + primarySectionTitle + ': ' + claimNumber
        );
      }
    });
  }

  public setTitleWithClaimNumberAndAuthorizationId(
    primarySectionTitle: string,
    subsectionTitle?: string
  ) {
    combineLatest([this.decodedClaimNumber$, this.authorizationId$])
      .pipe(first())
      .subscribe(([claimNumber, authorizationId]) => {
        if (subsectionTitle) {
          this.titleService.setTitle(
            this.VERTICE +
              ' - ' +
              primarySectionTitle +
              ' - ' +
              subsectionTitle +
              ': ' +
              claimNumber +
              ' - ' +
              authorizationId
          );
        } else {
          this.titleService.setTitle(
            this.VERTICE +
              ' - ' +
              primarySectionTitle +
              ': ' +
              claimNumber +
              ' - ' +
              authorizationId
          );
        }
      });
  }

  public setTitle(primarySectionTitle: string, subsectionTitle?: string) {
    if (subsectionTitle) {
      this.titleService.setTitle(
        this.VERTICE + ' - ' + primarySectionTitle + ' - ' + subsectionTitle
      );
    } else {
      this.titleService.setTitle(this.VERTICE + ' - ' + primarySectionTitle);
    }
  }
}
