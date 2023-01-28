import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from './auth.guard';
import { FileCreationComponent } from './case/file-creation.component';
import { HomeComponent } from './home/home.component';
import { PartnersComponent } from './partners/partners.component';
import { PartnerComponent } from './partners/partner/partner.component';

export const APP_ROUTES: Routes = [
  { path: 'case/household', component: FileCreationComponent, canActivate: [AuthGuard] },
  { path: 'case/legalperson', component: FileCreationComponent, canActivate: [AuthGuard] },
  { path: 'case/legal_person', component: FileCreationComponent, canActivate: [AuthGuard] },
  { path: 'case/household/:id', component: FileCreationComponent, canActivate: [AuthGuard] },
  { path: 'case/legalperson/:id', component: FileCreationComponent, canActivate: [AuthGuard] },
  { path: 'case/legal_person/:id', component: FileCreationComponent, canActivate: [AuthGuard] },
  { path: 'partners', component: PartnersComponent, canActivate: [AuthGuard] },
  { path: 'partner', component: PartnerComponent, canActivate: [AuthGuard] },
  { path: 'partner/:id', component: PartnerComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '**', redirectTo: 'login'},
];

export const ROUTING_OPTIONS: ExtraOptions = {
    useHash: false,
    relativeLinkResolution: 'legacy'
};


@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, ROUTING_OPTIONS)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
