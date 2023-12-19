import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { ReferralSearchBoxComponent } from './referral-search-box.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgControl,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDrpModule } from '@healthe/vertice-library';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxMaskModule } from 'ngx-mask';

describe('ReferralSearchBoxComponent', () => {
  async function setup() {
    return await render(ReferralSearchBoxComponent, {
      declarations: [],
      imports: [
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatOptionModule,
        FlexLayoutModule,
        MatTooltipModule,
        FontAwesomeModule,
        MatInputModule,
        NgxMatDrpModule,
        MatButtonModule,
        NgxMaskModule.forRoot(),
        MatExpansionModule
      ],
      providers: [
        { provide: NgControl, useValue: { control: new FormControl() } }
      ],
      componentProperties: {
        username: 'default',
        defaultStatus: 'All',
        defaultServiceType: 'HH',
        defaultAssignedAdjuster: 'All',
        helperText: '',
        title: 'Referral Activity Search',
        serviceTypes: [{ label: 'Home Health', value: 'HH' }],
        statuses: [{ label: 'All', value: 'All' }],
        users: [],
        form: new FormGroup({
          referralId: new FormControl(''),
          claimNumber: new FormControl('', Validators.required),
          claimantLastName: new FormControl(''),
          claimantFirstName: new FormControl(''),
          doiStartDate: new FormControl(''),
          doiEndDate: new FormControl(''),
          assignedTo: new FormControl(''),
          status: new FormControl(''),
          serviceType: new FormControl(''),
        })
      }
    });
  }

 /* test.skip('render', async () => {
    await setup();
  });

  test.skip('empty form helper text', async () => {
    await setup();
    expect(screen.queryByTestId('filterbox-summary-error')).toBe(null);
    await userEvent.click(screen.getByTestId('filterbox-search-button'));
    screen.getByTestId('filterbox-summary-error');
  });

  test.skip('reset should empty inputs', async () => {
      await setup();
      const input = <HTMLInputElement>screen.queryByTestId('data-referralID-input')
       expect(input.value).toBe("");
      input.value = "42";
      expect(input.value).toBe("42");

  });

   test.skip('reset should empty inputs', async () => {
      await setup();
      //const input = <HTMLInputElement>screen.queryByTestId('data-referralID-input');
      //expect(input.value).toBe(undefined);
      await userEvent.type(screen.getByTestId('data-referralID-input'), '42');
      //expect(input.value).toBe("42");
      expect(input).toHaveValue('42')
      /*const input2 = <HTMLInputElement>screen.queryByTestId('data-referralID-input');
      //expect(input2.value).toBe("42");
      await userEvent.click(screen.getByTestId('filterbox-reset-button'));
      const input3 = <HTMLInputElement>screen.queryByTestId('data-referralID-input');
      expect(input2.value).toBe(undefined);
  });
 */
   test('render', async () => {
    await setup();
    await userEvent.click(screen.getByTestId('data-advancedFiltersButton'));
    const input = <HTMLInputElement>screen.getByTestId('data-status-select');
    expect(input.value).toBe('All');
    /*screen.getByTestId('data-status-label');
    screen.getByTestId('data-serviceType-select');
    await userEvent.click(screen.getByTestId('data-advancedFiltersButton'));
    screen.getByTestId('data-status-label');
    screen.getByTestId('data-serviceType-select');
    await userEvent.click(screen.getByTestId('data-advancedFiltersButton'));
    screen.getByTestId('data-status-label');
    screen.getByTestId('data-serviceType-select');*/
  });

});
