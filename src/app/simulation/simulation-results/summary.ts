import * as palette from 'google-palette';
import { LoanUtils } from 'src/app/utils/loan-utils';

export class Summary {

  colormap = palette(['tol-rainbow'], 10);

  // String for display
  totalCostStr = LoanUtils.totalCostStr;
  totalInterestsStr = LoanUtils.totalInterestsStr;
  totalInsurancesStr = LoanUtils.totalInsurancesStr;
  totalCapitalizedInterestsStr = LoanUtils.totalCapitalizedInterestsStr;
  totalInterestsCounterStr = LoanUtils.totalInterestsCounterStr;
  totalGuarantiesStr = LoanUtils.totalGuarantiesStr;
  fileManagementFeesStr = LoanUtils.fileManagementFeesStr;
  brokerFeesStr = LoanUtils.brokerFeesStr;
  otherExpensesStr = LoanUtils.otherExpensesStr;
  notaryFeesStr = LoanUtils.notaryFeesStr;
  maximalInstalementStr = LoanUtils.maximalInstalementStr;
  planLengthStr = LoanUtils.planLengthStr;
  debtRatioStr = LoanUtils.debtRatioStr;
  jumpChargeStr = LoanUtils.jumpChargeStr;
  personalFundingPercentageStr = LoanUtils.personalFundingPercentageStr;
  personalFundingAbsoluteStr = LoanUtils.personalFundingAbsoluteStr;
  remainingForLivingStr = LoanUtils.remainingForLivingStr;


  // String for balancing table table
  balancingMaximalPriceStr = LoanUtils.balancingMaximalPriceStr;
  balancingWorkPriceStr = LoanUtils.balancingWorkPriceStr;
  balancingFurnituresPriceStr = LoanUtils.balancingFurnituresPriceStr;
  balancingPriceStr = LoanUtils.balancingPriceStr;
  balancingBalancingAdjustmentPriceStr = LoanUtils.balancingBalancingAdjustmentPriceStr;
  balancingLandPriceStr = LoanUtils.balancingLandPriceStr;
  balancingConstructionPriceStr = LoanUtils.balancingConstructionPriceStr;
  balancingInfrastructurePriceStr = LoanUtils.balancingInfrastructurePriceStr;
  balancingInsurancePriceStr = LoanUtils.balancingInsurancePriceStr;
  balancingVatStr = LoanUtils.balancingVatStr;
  balancingOtherTaxesStr = LoanUtils.balancingOtherTaxesStr;
  balancingOtherExpensesStr = LoanUtils.balancingOtherExpensesStr;
  balancingBrokerFeesStr = LoanUtils.balancingBrokerFeesStr;
  balancingFileManagementFeesStr = LoanUtils.balancingFileManagementFeesStr;
  balancingNotaryFeesStr = LoanUtils.balancingNotaryFeesStr;
  balancingAgencyFeesStr = LoanUtils.balancingAgencyFeesStr;
  balancingGuarantiesStr = LoanUtils.balancingGuarantiesStr;
  balancingPersonalFundingStr = LoanUtils.balancingPersonalFundingStr;
  balancingMaximalBorrowableStr = LoanUtils.balancingMaximalBorrowableStr;
  balancingBorrowedAmountStr = LoanUtils.balancingBorrowedAmountStr;
  balancingTotalCapitalToBuy = LoanUtils.totalCapitalToBuy;
  balancingIraValue = LoanUtils.iraValue;

  // For DebtConsolidation
  gainStr = LoanUtils.gainStr;
  deficitStr = LoanUtils.deficitStr;
  remainingInterestsStr = LoanUtils.remainingInterestsStr;
  remainingInsuranceStr = LoanUtils.remainingInsuranceStr;
  interestsNewPlanStr = LoanUtils.interestsNewPlanStr;
  insuranceNewPlanStr = LoanUtils.insuranceNewPlanStr;
  iraStr = LoanUtils.iraStr;
  newGuarantyStr = LoanUtils.newGuarantyStr;


  // For Pinel
  pinelDurationStr = LoanUtils.pinelDurationStr;
  monthlyRentValueStr = LoanUtils.monthlyRentValueStr;
  monthlyRentEvolutionStr = LoanUtils.monthlyRentEvolutionStr;
  priceEvolutionStr = LoanUtils.priceEvolutionStr;
  rentChargesStr = LoanUtils.rentChargesStr;
  taxRegimeStr = LoanUtils.taxRegimeStr;
  zoneStr = LoanUtils.zoneStr;
  rentThresholdStr = LoanUtils.rentThresholdStr;

}