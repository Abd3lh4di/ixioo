import { Component, Input, OnInit } from '@angular/core';
import { LocaleUtils } from 'src/app/utils/locale-utils';
import { TaxModeMap } from 'src/app/utils/strings';
import { PinelParameters, PinelResults } from 'src/app/_api';
import { Summary } from '../../summary';

@Component({
  selector: 'app-pinel-details',
  templateUrl: './pinel-details.component.html',
  styleUrls: ['./pinel-details.component.scss']
})
export class PinelDetailsComponent extends Summary implements OnInit {

  @Input() pinelPlanTable: any[];
  @Input() parameters: PinelParameters;
  @Input() results: PinelResults;

  pinelTableHeader = LocaleUtils.pinelTableHeader;
  pinelTable: any;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.pinelTable = LocaleUtils.buildPinelTable(this.pinelPlanTable);
    console.log(this.pinelTable);
  }

  toTaxModeMap(taxMode) {
    return TaxModeMap.toString(taxMode);
  }

}
