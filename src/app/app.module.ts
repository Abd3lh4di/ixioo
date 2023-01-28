import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


import { UiComponentsModule } from '@toaztr/ui-components'


import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { OAuthModule } from 'angular-oauth2-oidc';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';

import { HomeComponent } from './home/home.component';
import { FileCreationComponent } from './case/file-creation.component';
import { FileCreationPersonComponent } from './case/file-creation-person/file-creation-person.component';
import { FileCreationMenageComponent } from './case/file-creation-menage/file-creation-menage.component';
import { FileCreationBankDialogComponent } from './case/file-creation-bank-dialog/file-creation-bank-dialog.component';

import { FileCreationProfessionComponent } from './case/file-creation-profession/file-creation-profession.component';
import { SimulationResultsComponent } from './simulation/simulation-results/simulation-results.component';
import { FundingResultsComponent } from './simulation/simulation-results/funding-results/funding-results.component';
import { FundingSummaryComponent } from './simulation/simulation-results/funding-results/funding-summary/funding-summary.component';
import { ResultsTabsDirective } from './simulation/simulation-results/results-tabs.directive';
import { BudgetResultsComponent } from './simulation/simulation-results/budget-results/budget-results.component';
import { BudgetSummaryComponent } from './simulation/simulation-results/budget-results/budget-summary/budget-summary.component';
import { LoansAndBurdensSummaryComponent } from './simulation/simulation-results/loans-and-burdens-summary/loans-and-burdens-summary.component';
import { AmortizationTableComponent } from './simulation/simulation-results/amortization-table/amortization-table.component';
import { CostsDistributionChartComponent } from './simulation/simulation-results/simulation-graph/costs-distribution-chart/costs-distribution-chart.component';
import { ProfileChartComponent } from './simulation/simulation-results/simulation-graph/profile-chart/profile-chart.component';
import { FileCreationLegalPersonComponent } from './case/file-creation-legal-person/file-creation-legal-person.component';

import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { DepartmentInputComponent } from './utils/department-input/department-input.component';
import { StringAutoCompleteComponent } from './utils/string-auto-complete/string-auto-complete.component';
import { FileCreationRevenueComponent } from './case/file-creation-revenue/file-creation-revenue.component';
import { FileCreationBurdensComponent } from './case/file-creation-burdens/file-creation-burdens.component';
import { FileCreationPatrimoineComponent } from './case/file-creation-patrimoine/file-creation-patrimoine.component';
import { FileCreationBurdensDialogComponent } from './case/file-creation-burdens/file-creation-burdens-dialog/file-creation-burdens-dialog.component';
import { FileCreationLoansComponent } from './case/file-creation-loans/file-creation-loans.component';
import { FileCreationLoansDialogComponent } from './case/file-creation-loans/file-creation-loans-dialog/file-creation-loans-dialog.component';
import { FileCreationPatrimonyDialogComponent } from './case/file-creation-patrimoine/file-creation-patrimony-dialog/file-creation-patrimony-dialog.component';
import { FileCreationFundingsComponent } from './case/file-creation-fundings/file-creation-fundings.component';
import { FileCreationFundingsDialogComponent } from './case/file-creation-fundings/file-creation-fundings-dialog/file-creation-fundings-dialog.component';
import { FileCreationRevenueDialogComponent } from './case/file-creation-revenue/file-creation-revenue-dialog/file-creation-revenue-dialog.component';
import { CaseSearchComponent, ConfirmDeleteDialogComponent } from './case/case-search/case-search.component';
import { OpenCaseDialogComponent } from './case/open-case-dialog/open-case-dialog.component';
import { FileCreationProjectComponent } from './case/file-creation-project/file-creation-project.component';
import { ApiModule, Configuration, ConfigurationParameters } from './_api';

import { FileCreationFundingsGrandiozProfileDialogComponent } from './case/file-creation-fundings/file-creation-fundings-profiles-dialog/file-creation-fundings-grandioz-profile-dialog.component';
import { FileCreationFundingsMonthlyProfileDialogComponent } from './case/file-creation-fundings/file-creation-fundings-profiles-dialog/file-creation-fundings-monthly-profile-dialog.component';
import { FileCreationFundingsYearlyProfileDialogComponent } from './case/file-creation-fundings/file-creation-fundings-profiles-dialog/file-creation-fundings-yearly-profile-dialog.component';
import { FileCreationFundingsCustomProfileDialogComponent } from './case/file-creation-fundings/file-creation-fundings-profiles-dialog/file-creation-fundings-custom-profile-dialog.component';

import { LocationInputComponent } from './utils/location-input/location-input.component';
import { FileCreationProjectBudgetComponent } from './case/file-creation-project/file-creation-project-budget/file-creation-project-budget.component';
import { AppConfigService } from './_services/app-config.service';
import { appInitializerFn } from './appInitializerFn';
import { FileCreationPersonTabsComponent } from './case/file-creation-person-tabs/file-creation-person-tabs.component';
import { LoadingComponent } from './loading/loading.component';
import { FileCreationFundingsBanksDialogComponent } from './case/file-creation-fundings/file-creation-fundings-banks-dialog/file-creation-fundings-banks-dialog.component';
import { LoansAndBurdensSummaryDialogComponent } from './simulation/simulation-results/loans-and-burdens-summary/loans-and-burdens-summary-dialog/loans-and-burdens-summary-dialog.component';
import { ProfileChartDialogComponent } from './simulation/simulation-results/simulation-graph/profile-chart-dialog/profile-chart-dialog.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LimitNumberDirective } from './_directives/limit-number.directive';
import { InfiniteScrollTriggerDirective } from './_directives/infinite-scroll-trigger.directive';
import { FileCreationProjectLandComponent } from './case/file-creation-project/file-creation-project-land/file-creation-project-land.component';
import { FileCreationProjectOldpropertyComponent } from './case/file-creation-project/file-creation-project-oldproperty/file-creation-project-oldproperty.component';
import { AdministrativeInformationComponent } from './utils/administrative-information/administrative-information.component';
import { FileCreationProjectNewpropertyComponent } from './case/file-creation-project/file-creation-project-newproperty/file-creation-project-newproperty.component';
import { FileCreationProjectWorksComponent } from './case/file-creation-project/file-creation-project-works/file-creation-project-works.component';
import { FileCreationProjectHouseconstructionComponent } from './case/file-creation-project/file-creation-project-houseconstruction/file-creation-project-houseconstruction.component';
import { WorksSummaryComponent } from './simulation/simulation-results/funding-results/funding-summary/works-summary/works-summary.component';
import { FileCreationProjectPinelComponent } from './case/file-creation-project/file-creation-project-pinel/file-creation-project-pinel.component';
import { FileCreationProjectDebtConsolidationComponent } from './case/file-creation-project/file-creation-project-debt-consolidation/file-creation-project-debt-consolidation.component';
import { OldpropertySummaryComponent } from './simulation/simulation-results/funding-results/funding-summary/oldproperty-summary/oldproperty-summary.component';
import { NewpropertySummaryComponent } from './simulation/simulation-results/funding-results/funding-summary/newproperty-summary/newproperty-summary.component';
import { ConstructionSummaryComponent } from './simulation/simulation-results/funding-results/funding-summary/construction-summary/construction-summary.component';
import { LandSummaryComponent } from './simulation/simulation-results/funding-results/funding-summary/land-summary/land-summary.component';
import { ErrorDisplayComponent } from './error-display/error-display.component';
import { PinelResultsComponent } from './simulation/simulation-results/pinel-results/pinel-results.component';
import { PinelSummaryComponent } from './simulation/simulation-results/pinel-results/pinel-summary/pinel-summary.component';
import { PinelDetailsComponent } from './simulation/simulation-results/pinel-results/pinel-details/pinel-details.component';
import { DebtResultsComponent } from './simulation/simulation-results/debt-results/debt-results.component';
import { DebtConsolidationSummaryComponent } from './simulation/simulation-results/debt-results/debt-consolidation-summary/debt-consolidation-summary.component';
import { LoanToConsolidateCaracteristicsComponent } from './simulation/simulation-results/debt-results/loan-to-consolidate-caracteristics/loan-to-consolidate-caracteristics.component';
import { PartnerSearchComponent, ConfirmDeletePatnerDialogComponent } from './partners/partner-search/partner-search.component';
import { PartnersComponent } from './partners/partners.component';
import { PartnerComponent } from './partners/partner/partner.component';
import { FileCreationPartnersComponent } from './case/file-creation-partners/file-creation-partners.component';
import { FileCreationPartnersDialogComponent } from './case/file-creation-partners/file-creation-partners-dialog/file-creation-partners-dialog.component';
import { FileCreationProjectBalancingAdjustmentComponent } from './case/file-creation-project/file-creation-project-balancing-adjustment/file-creation-project-balancing-adjustment.component';
import { FileCreationProjectLMNPComponent } from './case/file-creation-project/file-creation-project-lmnp/file-creation-project-lmnp.component';
import { BalancingAdjustmentSummaryComponent } from './simulation/simulation-results/funding-results/funding-summary/balancingadjustment-summary/balancingadjustment-summary.component';
import { CallsForFundsDialogComponent } from './utils/calls-for-funds/calls-for-funds.component';
import { CaseKanbanComponent } from './case/case-kanban/case-kanban.component';
import { CaseKanbanChangeStatusDialogComponent } from './case/case-kanban/case-kanban-change-status-dialog/case-kanban-change-status-dialog.component';
import { CaseKanbanViewDialogComponent } from './case/case-kanban/case-kanban-view-dialog/case-kanban-view-dialog.component';
import { CaseCommentsBottomSheetComponent } from './case/case-comments-bottom-sheet';

registerLocaleData(localeFr);

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: AppConfigService.serverConfig.apiServerUrl
  };
  return new Configuration(params);
}

export const MY_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AmortizationTableComponent,
    ProfileChartComponent,
    CostsDistributionChartComponent,
    SimulationResultsComponent,
    FundingResultsComponent,
    FundingSummaryComponent,
    BudgetResultsComponent,
    PinelResultsComponent,
    PinelSummaryComponent,
    PinelDetailsComponent,
    BudgetSummaryComponent,
    ResultsTabsDirective,
    LoansAndBurdensSummaryComponent,
    HomeComponent,
    FileCreationComponent,
    FileCreationPersonComponent,
    // FileCreationPersonDialogComponent,
    FileCreationMenageComponent,
    FileCreationBankDialogComponent,
    // FileCreationAcquisitionComponent,
    FileCreationProfessionComponent,
    FileCreationLegalPersonComponent,
    DepartmentInputComponent,
    StringAutoCompleteComponent,
    FileCreationRevenueComponent,
    FileCreationPatrimoineComponent,
    FileCreationBurdensComponent,
    FileCreationBurdensDialogComponent,
    FileCreationLoansComponent,
    FileCreationLoansDialogComponent,
    FileCreationFundingsGrandiozProfileDialogComponent,
    FileCreationFundingsMonthlyProfileDialogComponent,
    FileCreationFundingsYearlyProfileDialogComponent,
    FileCreationPatrimonyDialogComponent,
    FileCreationFundingsComponent,
    FileCreationFundingsDialogComponent,
    FileCreationRevenueDialogComponent,
    CaseSearchComponent,
    CaseCommentsBottomSheetComponent,
    ConfirmDeleteDialogComponent,
    OpenCaseDialogComponent,
    FileCreationProjectComponent,
    LocationInputComponent,
    FileCreationProjectBudgetComponent,
    FileCreationPersonTabsComponent,
    LoadingComponent,
    CallsForFundsDialogComponent,
    FileCreationFundingsBanksDialogComponent,
    LoansAndBurdensSummaryDialogComponent,
    ProfileChartDialogComponent,
    LimitNumberDirective,
    InfiniteScrollTriggerDirective,
    FileCreationProjectBalancingAdjustmentComponent,
    FileCreationProjectLMNPComponent,
    FileCreationProjectLandComponent,
    FileCreationProjectOldpropertyComponent,
    AdministrativeInformationComponent,
    FileCreationProjectNewpropertyComponent,
    FileCreationProjectWorksComponent,
    FileCreationProjectHouseconstructionComponent,
    FileCreationProjectPinelComponent,
    FileCreationProjectDebtConsolidationComponent,
    DebtResultsComponent,
    DebtConsolidationSummaryComponent,
    LoanToConsolidateCaracteristicsComponent,
    WorksSummaryComponent,
    OldpropertySummaryComponent,
    NewpropertySummaryComponent,
    ConstructionSummaryComponent,
    BalancingAdjustmentSummaryComponent,
    LandSummaryComponent,
    ErrorDisplayComponent,
    PartnerSearchComponent,
    ConfirmDeletePatnerDialogComponent,
    PartnersComponent,
    PartnerComponent,
    FileCreationPartnersComponent,
    FileCreationPartnersDialogComponent,
    CaseKanbanComponent,
    CaseKanbanViewDialogComponent,
    CaseKanbanChangeStatusDialogComponent,
    FileCreationFundingsCustomProfileDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModalModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbCollapseModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatBadgeModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    DragDropModule,
    MatTabsModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    FormsModule,
    ReactiveFormsModule,
    UiComponentsModule,
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    }),
    OAuthModule.forRoot({
      resourceServer: {
          sendAccessToken: true
      }
    }),
    ApiModule.forRoot(apiConfigFactory),
    NgbModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    FormGroupDirective,
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFn,
      multi: true,
      deps: [AppConfigService]
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}


