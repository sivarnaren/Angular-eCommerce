import { HomeComponent } from './home/home.component';
import { LanguageComponent } from './components/language/language.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import {
  LoginComponent,
  MyHomeComponent,
  ProductComponent,
  ResetPasswordComponent,
  AccountDashboardComponent,
  AccountInformationComponent,
  AccountSecurityComponent,
  SignupComponent,
  OnboardingComponent,
  InvoiceGeneratorComponent,
  SignupConfirmComponent,
  RegisterComponent,
  AccountFamilyComponent,
  FamilyEditComponent,
  AddDependentComponent,
  MembershipCardComponent,
  GuestEditComponent,
  PaymentMethodsComponent,
  AccountMyProfileComponent,
  AccountMyAddressesComponent
} from './components/index';
import { MatNativeDateModule, MatDatepickerModule } from '@angular/material';
import { TranslatorTestComponent } from './components/translator-test/translator-test.component';
import { MemberType } from './guards/member-type.guard';

const routes: Routes = [
  {
    path: ':lang',
    component: LanguageComponent,
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'my-home', component: MyHomeComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'account', component: AccountDashboardComponent, canActivate: [AuthGuard] },
      { path: 'account/info', component: AccountInformationComponent, canActivate: [AuthGuard, MemberType] },
      { path: 'account/security', component: AccountSecurityComponent, canActivate: [AuthGuard, MemberType] },
      { path: 'account/family', component: AccountFamilyComponent, canActivate: [MemberType, MemberType] },
      // { path: 'account/family/family-edit', component: FamilyEditComponent, canActivate: [AuthGuard] },
      { path: 'account/my-profile', component: AccountMyProfileComponent, canActivate: [AuthGuard, MemberType] },
      { path: 'account/my-addresses', component: AccountMyAddressesComponent, canActivate: [AuthGuard, MemberType] },
      { path: 'account/family/dependent', component: AddDependentComponent, canActivate: [AuthGuard, MemberType] },
      { path: 'account/payment-methods', component: PaymentMethodsComponent, canActivate: [AuthGuard, MemberType] },
      { path: 'signup', component: SignupComponent },
      { path: 'translator-test', component: TranslatorTestComponent },
      { path: 'signup-confirm', component: SignupConfirmComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register/:uuid', component: RegisterComponent },
      { path: 'reset', component: ResetPasswordComponent },
      { path: 'home', component: HomeComponent },
      { path: 'product', component: ProductComponent },
      { path: 'product/:id', component: ProductComponent },
      { path: 'onboarding', component: OnboardingComponent },
      { path: 'invoice-generator', component: InvoiceGeneratorComponent },
      { path: 'membership-card', component: MembershipCardComponent }
    ]
  },
  { path: '**', redirectTo: '/en', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), MatDatepickerModule, MatNativeDateModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
