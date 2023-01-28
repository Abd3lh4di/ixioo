import { FormBuilder } from '@angular/forms';
import { ScenarioStoreService } from 'src/app/_services/scenario-store.service';
import { Acquisition } from './acquisition';
import { Burdens } from './burdens';
import { Fees } from './fees';
import { FundingSlices } from './funding-slices';
import { FreeGrid, BridgeGrid } from './grid';
import { Incomes } from './incomes';
import { Pinel } from './pinel';
import { Ptz } from './ptz';
import { LoansToConsolidate } from './loans-to-consolidate';

export class SimulationParameters {
    public acquisition: Acquisition;
    public incomes: Incomes;
    public freeGrid: FreeGrid;
    public bridgeGrid: BridgeGrid;
    public burdens: Burdens;
    public fees: Fees;
    public fundingSlices: FundingSlices;
    public pinel: Pinel;
    public loansToConsolidate: LoansToConsolidate;
    public ptz: Ptz;

    constructor(private fb: FormBuilder, scenarioStore: ScenarioStoreService) {
        if (scenarioStore.IsPinel()) {
            this.pinel = new Pinel(fb);
        } else {
            this.incomes = new Incomes(fb);
            if (scenarioStore.IsRachatClassique()) {
                this.loansToConsolidate = new LoansToConsolidate(fb);
            } else {
                this.acquisition = new Acquisition(fb);
            }
        }
        this.fees = new Fees(fb);
        this.freeGrid = new FreeGrid(fb);
    }

    addPtz() {
        delete this.ptz;
        this.ptz = new Ptz(this.fb);
    }
    removePtz() {
        delete this.ptz;
        this.ptz = undefined;
    }

    addBridgeLoan() {
        delete this.bridgeGrid;
        this.bridgeGrid = new BridgeGrid(this.fb);
    }
    removeBridgeLoan() {
        delete this.bridgeGrid;
        this.bridgeGrid = undefined;
    }

    addBurdens() {
        delete this.burdens;
        this.burdens = new Burdens(this.fb);
    }
    removeBurdens() {
        delete this.burdens;
        this.burdens = undefined;
    }

    addFundingSlices() {
        delete this.fundingSlices;
        this.fundingSlices = new FundingSlices(this.fb);
    }
    removeFundingSlices() {
        delete this.fundingSlices;
        this.fundingSlices = undefined;
    }
}


