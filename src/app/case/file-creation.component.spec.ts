import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import { AppRoutingModule } from '../app-routing.module';
import { AuthenticationService, CaseFormService } from '../_services';
import { FileCreationComponent } from './file-creation.component';

class MockAuthenticationService  {
  public userName$: BehaviorSubject<string>;
  public userId$: BehaviorSubject<string>;
  constructor() {
    this.userName$ = new BehaviorSubject<string>(undefined);
    this.userName$.next('name');
    this.userId$ = new BehaviorSubject<string>(undefined);
    this.userId$.next('ID');
  }
}


describe('FileCreationComponent', () => {
  let component: FileCreationComponent;
  let fixture: ComponentFixture<FileCreationComponent>;
  let caseFormService: CaseFormService;

  beforeEach(async () => {
    const mockAuthenticationService = new MockAuthenticationService();
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule,
        AppRoutingModule,
        MatBottomSheetModule,
      ],
      declarations: [ FileCreationComponent ],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthenticationService }
      ]
    })
    .compileComponents();
  });

  beforeEach( () => {
    caseFormService = TestBed.inject(CaseFormService);
    fixture = TestBed.createComponent(FileCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    expect(component.selectedTab).toEqual(0);
    expect(component.casesName).toEqual(['Personne 1']);
    expect(component.entityName).toEqual('Ménage');
    expect(component.activeBorrower).toEqual(0);
    expect(component.entitySelected).toBeFalse();

    expect(caseFormService.persons.length).toEqual(1);
    expect(caseFormService.actor.get('type').value).toEqual('HOUSEHOLD');

  });

  it('should change case name', () => {
    caseFormService.persons.at(0).get('civil').get('first_name').setValue('Hello');
    expect(component.casesName).toEqual(['Hello']);
    caseFormService.persons.at(0).get('civil').get('last_name').setValue('World');
    expect(component.casesName).toEqual(['Hello World']);
  });

  it('should update relation person', () => {

    component.addBorrower();

    const familySituation = caseFormService.persons.at(0).get('civil').get('family_situation');
    familySituation.patchValue({
      marital_status: 'MARRIED',
      marital_status_since: 'marital_status_since',
      matrimony_regime: 'matrimony_regime',
      divorce_procedure: 'divorce_procedure',
      marital_country: 'marital_country',
      is_in_relation_with: '1'
    });

    component.updateRelationPerson({ relationIdx: 1 });
    const relationFamilySituation = caseFormService.persons.at(1).get('civil').get('family_situation');
    expect(relationFamilySituation.value).toEqual({
      marital_status: 'MARRIED',
      marital_status_since: 'marital_status_since',
      matrimony_regime: 'matrimony_regime',
      divorce_procedure: 'divorce_procedure',
      marital_country: 'marital_country',
      is_in_relation_with: '0'
    });

    component.addBorrower();

    familySituation.patchValue({
      marital_status: 'MARRIED',
      marital_status_since: 'marital_status_since',
      matrimony_regime: 'matrimony_regime',
      divorce_procedure: 'divorce_procedure',
      marital_country: 'marital_country',
      is_in_relation_with: '2'
    });
    component.updateRelationPerson({ relationIdx: 2 });
    expect(relationFamilySituation.value).toEqual({
      marital_status: 'SINGLE',
      marital_status_since: null,
      matrimony_regime: null,
      divorce_procedure: null,
      marital_country: null,
      is_in_relation_with: null
    });

    let lastRelationFamilySituation = caseFormService.persons.at(2).get('civil').get('family_situation');
    expect(lastRelationFamilySituation.value).toEqual({
      marital_status: 'MARRIED',
      marital_status_since: 'marital_status_since',
      matrimony_regime: 'matrimony_regime',
      divorce_procedure: 'divorce_procedure',
      marital_country: 'marital_country',
      is_in_relation_with: '0'
    });

    component.deleteCurrent();

    expect(caseFormService.persons.length).toEqual(2);

    lastRelationFamilySituation = caseFormService.persons.at(1).get('civil').get('family_situation');
    expect(lastRelationFamilySituation.value).toEqual({
      marital_status: 'SINGLE',
      marital_status_since: null,
      matrimony_regime: null,
      divorce_procedure: null,
      marital_country: null,
      is_in_relation_with: null
    });

  });



});
