import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FreeLoan, Loan, GracePeriod } from 'src/app/_api';
import { TypedFormArray } from 'src/app/typed-form-array';
import { GracePeriodTypeMap, LoanTypeMap } from 'src/app/utils/strings';

@Component({
  selector: 'app-file-creation-fundings-dialog',
  templateUrl: './file-creation-fundings-dialog.component.html',
  styleUrls: ['./file-creation-fundings-dialog.component.scss']
})
export class FileCreationFundingsDialogComponent {

  get insurances() { return this.data.loan.get('insurances') as TypedFormArray; }
  get loan() { return this.data.loan; }
  get gracePeriod() { return this.data.loan.get('grace_period'); }
  get guaranty() { return this.data.loan.get('guaranty'); }
  get currentLoans() { return this.data.currentLoans; }


  constructor(public dialogRef: MatDialogRef<FileCreationFundingsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { loan: FormGroup, personNames: string[], currentLoans: any } ) {

    // This permits to get synchronized the min_amount and max_amount, in order to have the value of the loan fixed,
    // when the field amount is filled
    if (this.loan.get('type').value === 'FREE_LOAN') {
      const minAmount = this.loan.get('min_amount');
      const maxAmount = this.loan.get('max_amount');
      maxAmount.valueChanges.subscribe(v => minAmount.setValue(v, { emitEvent: false }));
    }

    if (this.loan.get('type').value === 'BRIDGE_LOAN' && this.loan.get('grace_period_type').value !== 'TOTAL') {
      this.loan.get('grace_period_type').setValue('PARTIAL');
    }

  }

  addInsurance() {
    this.insurances.pushValue();
  }
  removeInsurrance(idx) {
    this.insurances.removeAt(idx);
  }

  showDuration(type: Loan.TypeEnum) {
    return type === Loan.TypeEnum.BridgeLoan
  }
  showMaxDuration(type: Loan.TypeEnum) {
    switch (type) {
      case Loan.TypeEnum.BridgeLoan:
      case Loan.TypeEnum.BossLoan:
      case Loan.TypeEnum.PtzLoan: return false;
      default: return true;
    }
  }

  showRate(type: Loan.TypeEnum) {
    switch (type) {
      case Loan.TypeEnum.PtzLoan:
      case Loan.TypeEnum.BossLoan: return false;
      default: return true;
    }
  }
  showMaxAmount(type: Loan.TypeEnum) {
    const freeLoansNumber = this.currentLoans.value.filter(loan => loan.type === FreeLoan.TypeEnum.FreeLoan).length;
    const freeLoansNumberWithMaxAmountDefined = this.currentLoans.value.filter(loan => loan.max_amount??false).length;
    const permitAmountEdition = (freeLoansNumber - freeLoansNumberWithMaxAmountDefined) > 1 ? true : false

    if(type === Loan.TypeEnum.PtzLoan || type === Loan.TypeEnum.BridgeLoan || type === Loan.TypeEnum.BossLoan) {
      return false;
    }
    if(permitAmountEdition === true || (type === Loan.TypeEnum.FreeLoan && this.loan.get('max_amount').value !== null && this.loan.get('max_amount').value !== undefined)) {
      return true;
    }
    if (permitAmountEdition === false) {
      return false;
    }
    return true;
  }

  showAmountOrGracePeriodType(type: Loan.TypeEnum) {
    return type === Loan.TypeEnum.BridgeLoan;
  }
  showGracePeriod(type: Loan.TypeEnum) {
    switch (type) {
      case Loan.TypeEnum.PtzLoan:
      case Loan.TypeEnum.BridgeLoan:
      case Loan.TypeEnum.BossLoan: return false;
      default: return true;
    }
  }

  /*showGracePeriodLength(gracePeriod: GracePeriod) {
    switch (gracePeriod.type) {
      case GracePeriod.TypeEnum.Partial:
      case GracePeriod.TypeEnum.Total:
        return true;
      default:
        this.gracePeriod.get('type').setValue(null);
        return false;
    }
  }*/

  onGuarantyTypeChanged() {
    this.guaranty.get('value').setValue(null);
  }

  getLoanName(type) {
    return LoanTypeMap.toString(type);
  }

}



