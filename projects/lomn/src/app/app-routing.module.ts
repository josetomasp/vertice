import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LomnWrapperComponent } from './lomn-wrapper/lomn-wrapper.component';

const routes: Routes = [
  {
    path:
      'claims/:customerId/:claimNumber/pbm/:authorizationId/:serviceType/createLomn',
    component: LomnWrapperComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
