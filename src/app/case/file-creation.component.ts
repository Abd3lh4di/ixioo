import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import pdfMake from 'pdfmake/build/pdfmake.min';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { BudgetParameters, BudgetResults, DebtConsolidationParameters, DebtConsolidationResults, FundingParameters, FundingResults, Insurance, LegalPerson, PinelParameters, PinelResults, HouseholdDetails, PartnerType, CaseResourceResponse, CaseResource } from 'src/app/_api';

import { CaseService } from '../_services/case.service';

import { IconsSvg } from '../_services/pdf-export/icons-svg';
import { CaseFormService } from '../_services/case-form.service';
import { combineLatest } from 'rxjs';
import { startWith, take, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OpenCaseDialogComponent } from './open-case-dialog/open-case-dialog.component';
import { ErrorDisplayService } from '../_services/error-display.service';
import { FileCreationFundingsComponent } from './file-creation-fundings/file-creation-fundings.component';
import { PlanParametersResource } from '../_api';
import { PlanParametersService } from '../_services/plan-parameters.service';

import { BudgetPDFExportService } from '../_services/pdf-export/budget-pdf-export.service';
import { FundingPDFExportService } from '../_services/pdf-export/funding-pdf-export.service';
import { PinelPDFExportService } from '../_services/pdf-export/pinel-pdf-export.service';
import { MandatePDFExportService } from '../_services/pdf-export/mandate-pdf-export.service';
import { FileCreationProjectComponent } from './file-creation-project/file-creation-project.component';
import { AdvicePDFExportService } from '../_services/pdf-export/advice-pdf-export.service';
import { ProfessionForm } from '../_models/forms/profession-form';
import { LoaderService } from '../_services/loader.service';
import { DebtConsolidationPDFExportService } from '../_services/pdf-export/debt-consolidation-pdf-export.service';
import { HttpClient } from '@angular/common/http';
import { PDFExportService } from '../_services/pdf-export/pdf-export.service';
import { AuthenticationService, SimulationService } from '../_services';
import { MatTabGroup } from '@angular/material/tabs';
import { CaseStatusMap } from '../utils/strings';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CaseCommentsBottomSheetComponent } from './case-comments-bottom-sheet';


@Component({
  selector: 'app-file-creation',
  templateUrl: './file-creation.component.html',
  styleUrls: ['./file-creation.component.scss', './file-creation.component.small.scss']
})
export class FileCreationComponent implements OnInit, OnDestroy {

  selectedTab = 0;
  activeBorrower = 0;
  caseId = 'undefined';
  casesName = [];
  entityName: string;
  entitySelected: boolean;
  caseType = '';

  subscriptions = [];
  namesSubscriptions = [];
  totalFunding = 0;
  totalRevenues = 0;
  totalCharges = 0;
  totalPersonalFunding = 0;
  fundingTabNumber = 9;
  simulationResultsAvailable: boolean;

  @ViewChild('tabs')
  private tabGroup: MatTabGroup;
  @ViewChild('fundingTab')
  private fundingTab: FileCreationFundingsComponent;
  @ViewChild('projectTab')
  private projectTab: FileCreationProjectComponent;

  constructor(public caseForm: CaseFormService,
              public caseService: CaseService,
              public planService: PlanParametersService,
              public simulationService: SimulationService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              public errorService: ErrorDisplayService,
              public budgetPDFExportService: BudgetPDFExportService,
              public fundingPDFExportService: FundingPDFExportService,
              public pinelPDFExportService: PinelPDFExportService,
              public debtConsolidationPDFExportService: DebtConsolidationPDFExportService,
              public mandatePDFExportService: MandatePDFExportService,
              public advicePDFExportService: AdvicePDFExportService,
              public authService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              public loader: LoaderService,
              public httpClient: HttpClient,
              private bottomSheet: MatBottomSheet) {

    const splitUrl = this.router.url.toString().split('/');
    if (splitUrl[2] === 'legalperson' || splitUrl[2] === 'legal_person') {
      console.log('Initializing case type to LEGAL_PERSON');
      this.caseType = LegalPerson.TypeEnum.LegalPerson;
    } else {
      console.log('Initializing case type to HOUSEHOLD');
      this.caseType = HouseholdDetails.TypeEnum.Household;
    }

}

  ngOnInit(): void {

    this.loader.setLoading(true);
    this.caseForm.newCase(this.caseType);

    this.subscriptions.push(
      this.authService.userId$.subscribe( userId => {
      if(userId) {
        this.newCase(userId);
        this.route.params.subscribe(params => {
          this.dialog.closeAll();
          this.selectedTab = 0;
          const caseId = params.id;
          if(caseId) {
            this.loadCase(caseId);
          } else {
            this.loader.setLoading(false);
          }
        });
      }
    })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach( sub => sub.unsubscribe() );
    this.namesSubscriptions.forEach( sub => sub.unsubscribe() );
  }

  duplicateCase() {
    this.caseForm.copied_from.setValue(this.caseForm.id.value);
    this.caseForm.id.reset();
    this.caseForm.meta.reset();
    this.caseForm.fundingsResources?.controls.forEach( funding => {
      funding.get('id').reset();
      funding.get('meta').reset();
    });
    window.history.replaceState({}, '',`/case`);
    this.snackBar.open('Dossier copié, pensez à le sauver !', 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }


  loadCase(caseId) {
    this.loader.setLoading(true);
    this.caseService.retrieve(caseId).pipe(
      take(1),
      map( (resp: CaseResourceResponse) => resp.data)
    ).subscribe( (response: CaseResource) => {

      this.projectTab.selectScenario(response.attributes.project?.type);
      response.attributes.actor.persons.forEach( (person, idx) => {
        if(idx !== 0) {
          this.addBorrower();
        }
        const profession = this.caseForm.persons.at(idx).get('profession') as ProfessionForm;
        profession.patchWorker(person.profession?.status);
      })

      response.attributes.partners?.forEach( (partner) => {
        this.caseForm.partners.pushValue(partner);
      })

      this.caseForm.caseResource.patchValue(response);
      if(response.attributes.candidate_simulations) {
        this.caseForm.candidate_simulations.patchValue(response.attributes.candidate_simulations);
      }

      this.cdRef.detectChanges();

      this.planService.listPlans(caseId).pipe(
        take(1)
      ).subscribe( (resp: any) => {
        if(resp.data.length <= 0) {
          this.loader.setLoading(false);
        }
        this.planService.retrievePlans(caseId, resp.data).pipe(
          take(1),
          map((responses: any) => responses.map( (r: any) => r.data ))
        ).subscribe( async (planResponse: PlanParametersResource[]) => {
          this.caseForm.fundingsResources.patchValue(planResponse);
          this.fundingTab.simulationLaunched = true;
          planResponse.forEach( (plan, idx) => {
            this.fundingTab.selectFunding(idx);
            plan.attributes.loans.forEach( loan => {
              const addedLoan = this.fundingTab.addLoan(loan.type);
              if(loan.hasOwnProperty('insurances')) {
                const insKey = 'insurances';
                const insurances: Array<Insurance> = loan[insKey];
                insurances.forEach(insurance => {
                  addedLoan.get('insurances').pushValue(insurance);
                })
              }
            })
          })
          this.fundingTab.selectFunding(0);
          this.caseForm.fundingsResources.patchValue(planResponse);

          const plansId = [];
          this.caseForm.fundingsResources.value.forEach( (fundingResource) => {
            plansId.push(fundingResource.id);
          });
          this.simulationService.retrieveSimulations(caseId, plansId);
          this.loader.setLoading(false);
        })
      })
    });
  }

  caseSaved() {
    this.loader.setLoading(false);
    this.snackBar.open('Dossier sauvegardé', 'Ok', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  computeTotals() {
    console.log('computeTotals')
    this.totalRevenues = this.caseForm.computeRevenues();
    this.totalCharges = this.caseForm.computeCharges();
    this.totalFunding = this.caseForm.computeTotalFunding();
    this.totalPersonalFunding = this.caseForm.computeTotalPersonalFunding();
  }

  onTabChanged(idx) {
    this.selectedTab = idx;
    if (idx === this.fundingTabNumber) {
      this.computeTotals();
    }
  }

  updateRelationPerson(event) {
    this.caseForm.persons.controls.forEach( (person, index) => {
      const relationIdx = Number(person.get('civil').get('family_situation').get('is_in_relation_with').value);
      if(relationIdx === this.activeBorrower && relationIdx !== Number(event.relationIdx)) {
        this.resetRelation(index);
      }
    });
    if(event.relationIdx !== 'NEW' && event.relationIdx !== 'EXT') {
      const activeFamilySituation = this.caseForm.persons.at(this.activeBorrower).get('civil').get('family_situation');
      const familySituation = this.caseForm.persons.at(Number(event.relationIdx)).get('civil').get('family_situation');
      familySituation.patchValue(activeFamilySituation.value);
      const relationIdx = familySituation.get('is_in_relation_with');
      relationIdx.setValue(this.activeBorrower.toString());
    }
  }
  resetRelation(idx) {
    const familySituation = this.caseForm.persons.at(idx).get('civil').get('family_situation');
    familySituation.reset();
    familySituation.patchValue({
      marital_status: 'SINGLE',
      is_in_relation_with: null
    });
  }

  addBorrower() {
    this.caseForm.addPerson();
    this.watchNames();
  }
  deleteCurrent() {
    this.caseForm.persons.controls.forEach(person => {
      const familySituation = person.get('civil').get('family_situation');
      const relationIdxForm = familySituation.get('is_in_relation_with');
      const relationIdx = Number(relationIdxForm.value);
      if(relationIdx === this.activeBorrower) {
        familySituation.reset();
        familySituation.patchValue({
          marital_status: 'SINGLE',
          is_in_relation_with: null
        });
      } else if (relationIdx > this.activeBorrower) {
        relationIdxForm.patchValue((relationIdx-1).toString());
      }
    });
    this.caseForm.persons.removeAt(this.activeBorrower);
    this.casesName.splice(this.activeBorrower, 1);
    if (this.caseForm.persons.controls.length === 0) {
      this.addBorrower();
    } else {
      if (this.activeBorrower > 0) {
        this.activeBorrower = this.activeBorrower - 1;
      }
    }
    this.watchNames();
  }
  selectPerson(idx) {
    this.activeBorrower = idx;
    this.entitySelected = false;
    this.cdRef.detectChanges();
  }
  selectEntity() {
    this.entitySelected = true;
  }

  watchNames() {
    this.namesSubscriptions.forEach(sub => sub.unsubscribe());

    this.caseForm.persons.controls.forEach((indiv, index) => {
      const latestCivil = indiv.get('civil');
      this.namesSubscriptions.push(combineLatest([
        latestCivil.get('first_name').valueChanges.pipe(startWith(latestCivil.get('first_name').value)),
        latestCivil.get('last_name').valueChanges.pipe(startWith(latestCivil.get('last_name').value))
      ]).subscribe(([firstName, lastName]) => {
        if ((firstName === null || firstName === '') && (lastName === null || lastName === '')) { this.casesName[index] = 'Personne ' + (index+1); return; }
        const formattedFirstName = firstName ? firstName : '';
        const formattedLastName = lastName ? lastName : '';
        const separator = (formattedLastName !== '' && formattedLastName !== '') ? ' ' : '';
        this.casesName[index] = formattedFirstName + separator + formattedLastName;
        if (index === 0) {
          this.caseForm.name.setValue(this.casesName[index]);
        }
      }));
    });
  }

  newCase(userId?: string) {

    if(!userId) {
      userId = this.authService.userId;
    }
    this.projectTab?.init();
    this.caseForm.newCase(this.caseType, userId);
    this.selectedTab = 0;
    this.casesName = [];
    this.entityName = (this.caseType === LegalPerson.TypeEnum.LegalPerson) ? 'Personne morale' : 'Ménage';
    this.selectPerson(0);
    this.watchNames();
  }

  selectProjectTab() {
    this.tabGroup.selectedIndex = this.fundingTabNumber - 1;
  }

  getFundingLabel() {
    switch (this.caseForm.project?.get('type')?.value) {
      case 'BUDGET': return 'Calcul de budget';
      default: return 'Financement';
    }
  }

  showSaveError() {
    this.snackBar.open('Une erreur est survenue. La sauvegarde peut etre corrompue.', 'Ok', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
    this.loader.setLoading(false);
  }

  saveCaseAndRunPlan(planIdx) {
    this.loader.setLoading(true);
    this.caseService.saveCase(this.caseForm.asCase(), this.caseForm.id.value, this.caseForm.etag.value).pipe(
      take(1)
    ).subscribe( () => {
      if(this.caseForm.fundingsResources) {
        this.planService.save(this.caseForm.id.value, this.caseForm.getPlan(planIdx), planIdx).pipe(
          take(1)
        ).subscribe( (planId: any) => {
          this.caseSaved();
          this.fundingTab.runSimulation(planId);
        },
          () => this.showSaveError()
        )
      } else {
        this.caseSaved();
      }
    },
    () => this.showSaveError() )
  }

  back() {
    // TODO: Voulez vous sauver Popup
    this.router.navigateByUrl('/');
  }

  saveCase() {
    this.loader.setLoading(true);
    this.caseService.saveCase(this.caseForm.asCase(), this.caseForm.id.value, this.caseForm.etag.value).pipe(
      take(1)
    ).subscribe( () => {
      if(this.caseForm.fundingsResources) {
        this.planService.saveAll(this.caseForm.id.value, this.caseForm.asPlans()).pipe(
          take(1)
        ).subscribe( () => this.caseSaved(),
          () => this.showSaveError()
        )
      } else {
        this.caseSaved();
      }
    },
    () => this.showSaveError() )
  }

  openCase() {
    const dialogRef = this.dialog.open(OpenCaseDialogComponent, { width: '80%' });
    dialogRef.afterClosed().subscribe(_ => {
      console.log('closed: ' , _);
    });
  }
  setAreSimulationResultsAvailable(simulationResultsAvailable: boolean) {
    this.simulationResultsAvailable = simulationResultsAvailable;
  }


//////////////////////////////////////////////////////////////////////////////////

  genericPDFGeneratorWithLogoManagement(generatePDF) {
    const aPDFExportService = new PDFExportService();

    // Get first broker partner URI, and check that content is not a void string
    const aBrokerPartner = aPDFExportService.extractPartnerContact(PartnerType.Broker, this.caseForm.asCase().partners);
    if (aBrokerPartner && aBrokerPartner.logo_uri && aBrokerPartner.logo_uri !== '') {

      // We get the image format from the chars after the last . in the URI
      const splitLogoUri = aBrokerPartner.logo_uri.split('.');
      const imageType = splitLogoUri[splitLogoUri.length-1];

      // We prepare query with correct response type, depending if the image is a SVG or a PNG/JPEG/JPG, or something else
      if (imageType.toLowerCase() === 'svg') {
        this.httpClient.get(aBrokerPartner.logo_uri, { responseType: 'text' }).toPromise().then(data => {
            generatePDF(data);
        })
        .catch(err => { console.log(err); generatePDF(IconsSvg.toaztrLogo); })
      } else if (imageType.toLowerCase() === 'png' || imageType.toLowerCase() === 'jpeg' || imageType.toLowerCase() === 'jpg') {
        this.httpClient.get(aBrokerPartner.logo_uri, { responseType: 'blob' }).toPromise().then(data => {

          // We convert the blob into base 64 image
          const reader = new FileReader();
          reader.readAsDataURL(data);
          reader.onloadend = () => {
            const base64data = reader.result;
            generatePDF(base64data);
          }
        })
        .catch(err => { console.log(err); generatePDF(IconsSvg.toaztrLogo); })
      }
      else {
        generatePDF(IconsSvg.toaztrLogo);
      }

    }
    else {
      generatePDF(IconsSvg.toaztrLogo);
    }
  }

//////////////////////////////////////////////////////////////////////////////////

  generateMandatePDFInternal(logo) {
    const win = window.open('', '_blank');
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(
      this.mandatePDFExportService.exportToPDF(
        this.caseForm.id.value,
        this.caseForm.name.value,
        this.caseForm,
        this.caseForm.computeTotalFunding(),
        this.caseForm.computeTotalFunding() - this.caseForm.computeTotalPersonalFunding(),
        this.caseForm.asCase().partners,
        logo
      )
    ).open({}, win);
  }

  generateMandate() {
    this.genericPDFGeneratorWithLogoManagement(this.generateMandatePDFInternal.bind(this));
  }

//////////////////////////////////////////////////////////////////////////////////

  generateAdvicePDFInternal(logo) {
    if(!this.simulationResultsAvailable) return;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const results = this.fundingTab.getCurrentResults();
    let aParameters: any;
    let aResults: any;

    if(results.parameters.project) {
      switch(results.parameters.project.type) {
          case 'BUDGET':
              aParameters = results.parameters as BudgetParameters;
              const aTempBudget = results.results as BudgetResults;
              aResults = aTempBudget.funding_plan as FundingResults;
          break;
          case 'HOUSE_CONSTRUCTION':
              aParameters = results.parameters as FundingParameters;
              aResults = results.results as FundingResults;
          break;
          case 'LAND':
              aParameters = results.parameters as FundingParameters;
              aResults = results.results as FundingResults;
          break;
          case 'OLD_PROPERTY':
              aParameters = results.parameters as FundingParameters;
              aResults = results.results as FundingResults;
          break;
          case 'NEW_PROPERTY':
              aParameters = results.parameters as FundingParameters;
              aResults = results.results as FundingResults;
          break;
          case 'WORKS':
              aParameters = results.parameters as FundingParameters;
              aResults = results.results as FundingResults;
          break;
          case 'PINEL':
              aParameters = results.parameters as PinelParameters;
              const aTempPinel = results.results as PinelResults;
              aResults = aTempPinel.funding_plan as FundingResults;
          break;
          case 'DEBT_CONSOLIDATION':
              aParameters = results.parameters as DebtConsolidationParameters;
              const aTempDebtConsolidation = results.results as DebtConsolidationResults;
              aResults = aTempDebtConsolidation.funding_plan as FundingResults;
          break;
          case 'BALANCING_ADJUSTMENT':
              aParameters = results.parameters as FundingParameters;
              aResults = results.results as FundingResults;
          break;
      }
    }

    const consolidatedPartners = this.caseForm.asCase().partners;
    if(aParameters.bank) {
      consolidatedPartners.push(aParameters.bank);
    }

    const win = window.open('', '_blank');
    pdfMake.createPdf(
      this.advicePDFExportService.exportToPDF(
        this.caseForm.id.value,
        this.caseForm.name.value,
        this.caseForm,
        this.caseForm.computeTotalFunding(),
        this.caseForm.computeTotalFunding() - this.caseForm.computeTotalPersonalFunding(),
        consolidatedPartners,
        aParameters,
        aResults,
        logo
      )
    ).open({}, win);
  }

  generateAdvice() {
    this.genericPDFGeneratorWithLogoManagement(this.generateAdvicePDFInternal.bind(this));
  }

//////////////////////////////////////////////////////////////////////////////////

  generateBudgetPDFInternal(logo) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const results = this.fundingTab.getCurrentResults();
    const graph = this.fundingTab.getGraphs();
    const aBudgetParameters = results.parameters as BudgetParameters;
    const aBudgetResults = results.results as BudgetResults;

    const consolidatedPartners = this.caseForm.asCase().partners;
    if(aBudgetParameters.bank) {
      consolidatedPartners.push(aBudgetParameters.bank);
    }

    const win = window.open('', '_blank');
    pdfMake.createPdf(
      this.budgetPDFExportService.exportToPDF(
        this.caseForm.id.value,
        this.caseForm.name.value,
        this.caseForm.asCase(),
        consolidatedPartners,
        aBudgetResults.funding_plan.summary,
        aBudgetParameters,
        aBudgetResults,
        graph.profileChart,
        graph.costsDistributionChart,
        logo
      )
    ).open({}, win);
  }

  generateBudgetPdf() {
    this.genericPDFGeneratorWithLogoManagement(this.generateBudgetPDFInternal.bind(this));
  }

//////////////////////////////////////////////////////////////////////////////////

  generateFundingPDFInternal(logo) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const results = this.fundingTab.getCurrentResults();
    const graph = this.fundingTab.getGraphs();
    const aFundingParameters = results.parameters as FundingParameters;
    const aFundingResults = results.results as FundingResults;

    const consolidatedPartners = this.caseForm.asCase().partners;
    console.log(consolidatedPartners);
    console.log(aFundingParameters.bank);
    if(aFundingParameters.bank) {
      consolidatedPartners.push(aFundingParameters.bank);
    }
    console.log(consolidatedPartners);

    const win = window.open('', '_blank');
    pdfMake.createPdf(
            this.fundingPDFExportService.exportToPDF(
              this.caseForm.id.value,
              this.caseForm.name.value,
              this.caseForm.asCase(),
              consolidatedPartners,
              aFundingResults.summary,
              aFundingParameters,
              aFundingResults,
              graph.profileChart,
              graph.costsDistributionChart,
              logo
            )
        ).open({}, win);
  }

  generateFundingPdf() {
    this.genericPDFGeneratorWithLogoManagement(this.generateFundingPDFInternal.bind(this));
  }

//////////////////////////////////////////////////////////////////////////////////

  generatePinelPDFInternal(logo) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const results = this.fundingTab.getCurrentResults();
    const graph = this.fundingTab.getGraphs();
    const aPinelParameters = results.parameters as PinelParameters;
    const aPinelResults = results.results as PinelResults;

    const consolidatedPartners = this.caseForm.asCase().partners;
    if(aPinelParameters.bank) {
      consolidatedPartners.push(aPinelParameters.bank);
    }

    const win = window.open('', '_blank');
    pdfMake.createPdf(
      this.pinelPDFExportService.exportToPDF(
        this.caseForm.id.value,
        this.caseForm.name.value,
        this.caseForm.asCase(),
        consolidatedPartners,
        aPinelResults.funding_plan.summary,
        aPinelParameters,
        aPinelResults,
        graph.profileChart,
        graph.costsDistributionChart,
        logo
      )
    ).open({}, win);
  }


  generatePinelPdf() {
    this.genericPDFGeneratorWithLogoManagement(this.generatePinelPDFInternal.bind(this));
  }

//////////////////////////////////////////////////////////////////////////////////

  generateDebtConsolidationPDFInternal(logo) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const results = this.fundingTab.getCurrentResults();
    const graph = this.fundingTab.getGraphs();

    const aDebtParameters = results.parameters as DebtConsolidationParameters;
    const aDebtResults = results.results as DebtConsolidationResults;

    const consolidatedPartners = this.caseForm.asCase().partners;
    if(aDebtParameters.bank) {
      consolidatedPartners.push(aDebtParameters.bank);
    }

    const win = window.open('', '_blank');
    pdfMake.createPdf(
      this.debtConsolidationPDFExportService.exportToPDF(
        this.caseForm.id.value,
        this.caseForm.name.value,
        this.caseForm.asCase(),
        consolidatedPartners,
        aDebtResults.funding_plan.summary,
        aDebtParameters,
        aDebtResults,
        graph.profileChart,
        graph.costsDistributionChart,
        logo
      )
    ).open({}, win);
  }

  generateDebtConsolidationPdf() {
    this.genericPDFGeneratorWithLogoManagement(this.generateDebtConsolidationPDFInternal.bind(this));
  }

  generateInvoice() {
    console.log('   generateInvoice ')
    console.log('> getCurrentSimulationId: ' , this.fundingTab.getCurrentSimulationId())
    console.log('> getCurrentPlanId: ' , this.fundingTab.getCurrentPlanId())
  }



  exportToPDF() {

    if(!this.simulationResultsAvailable) return;

    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    switch (this.caseForm.project?.get('type')?.value) {
      case 'BUDGET': {
        console.log('Export budget PDF');
        this.generateBudgetPdf();
        break;
      }

      case 'LAND':
      case 'OLD_PROPERTY':
      case 'NEW_PROPERTY':
      case 'HOUSE_CONSTRUCTION':
      case 'WORKS':
      case 'BALANCING_ADJUSTMENT':
      {
        console.log('Export funding PDF');
        this.generateFundingPdf()
        break;
      }

      case 'DEBT_CONSOLIDATION': {
        console.log('Export debt consolidation PDF');
        this.generateDebtConsolidationPdf();
        break;
      }

      case 'PINEL': {
        console.log('Export Pinel PDF');
        this.generatePinelPdf();
        break;
      }
    }
  }

  caseStatusToString(status) {
    return CaseStatusMap.toString(status);
  }

  openComments() {
    if (this.caseForm.comments.value) {
      this.bottomSheet.open(CaseCommentsBottomSheetComponent, {
        data: { comments: this.caseForm.comments.value?? 'Pas de commentaires' }
      });
    }

  }

}

