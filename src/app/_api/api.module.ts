import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { BillingService } from './api/billing.service';
import { CaseService } from './api/case.service';
import { IncomeTaxService } from './api/incomeTax.service';
import { InviteService } from './api/invite.service';
import { LicenseService } from './api/license.service';
import { NotaryService } from './api/notary.service';
import { PartnerService } from './api/partner.service';
import { PlanParametersService } from './api/planParameters.service';
import { RequestLogService } from './api/requestLog.service';
import { SimulationService } from './api/simulation.service';
import { StandaloneScoreService } from './api/standaloneScore.service';
import { StandaloneSimulationService } from './api/standaloneSimulation.service';
import { SubscriptionService } from './api/subscription.service';
import { TransferService } from './api/transfer.service';
import { UsageRecordService } from './api/usageRecord.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      [],
  providers: []
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): ModuleWithProviders<ApiModule> {
        return {
            ngModule: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
