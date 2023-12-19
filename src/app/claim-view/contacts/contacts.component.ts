import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getContacts } from '@shared/store/selectors/claim.selectors';
import { Observable } from 'rxjs';
import { RootState } from '../../store/models/root.models';
import { Contact } from '../store/models/contacts.models';
import { PageTitleService } from '@shared/service/page-title.service';

export interface ContactsCardListColumnsDef {
  label: string;
  name: string;
}

@Component({
  selector: 'healthe-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  contactsCardListColumns: ContactsCardListColumnsDef[] = [
    {
      label: 'CONTACT TYPE',
      name: 'contactType'
    },
    {
      label: 'NAME',
      name: 'name'
    },
    {
      label: 'PHONE',
      name: 'phone'
    },
    {
      label: 'EMAIL',
      name: 'email'
    },
    {
      label: 'ADDRESS',
      name: 'address'
    }
  ];
  contactsCardListData$: Observable<Array<Contact>> = this.store$.pipe(
    select(getContacts)
  );

  constructor(
    public store$: Store<RootState>,
    private pageTitleService: PageTitleService
  ) {
    this.pageTitleService.setTitleWithClaimNumber('Claim View', 'Contacts');
  }
}
