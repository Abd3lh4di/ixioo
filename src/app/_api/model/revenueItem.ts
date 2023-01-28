/**
 * Toaztr API
 * # Introduction  Les API **Toaztr** sont documentées au format [OpenAPI](https://www.openapis.org/). Elles sont **accessibles depuis n\'importe quel site ou serveur**, toutes les réponses incluant un header Cross-Origin Resource Sharing adapté, comme spécifié sur la [spécification W3C](https://fetch.spec.whatwg.org/).
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { WeightedPositiveFigure } from './weightedPositiveFigure';


/**
 * Revenu mensuel, ainsi que sa pondération pour le calcul de l\'endettement.
 */
export interface RevenueItem { 
    /**
     * Type de revenu.
     */
    type: RevenueItem.TypeEnum;
    monthly_amount: WeightedPositiveFigure;
    /**
     * Commentaire éventuel.
     */
    comment?: string;
}
export namespace RevenueItem {
    export type TypeEnum = 'SALARY' | 'DIVIDENDS' | 'BONUS' | 'FRENCH_PARTICIPATION' | 'PROFESSIONAL_PROFITS_BIC_BNC_BA' | 'RENTAL_INCOMES' | 'MAINTENANCE' | 'FAMILY_ALLOWANCE' | 'OTHER_ALLOWANCES_LIKE_AEH_AAH_AEEH' | 'APL_AL' | 'SOCIAL' | 'RETIREMENT_PENSION' | 'ANNUITY' | 'OTHER';
    export const TypeEnum = {
        Salary: 'SALARY' as TypeEnum,
        Dividends: 'DIVIDENDS' as TypeEnum,
        Bonus: 'BONUS' as TypeEnum,
        FrenchParticipation: 'FRENCH_PARTICIPATION' as TypeEnum,
        ProfessionalProfitsBicBncBa: 'PROFESSIONAL_PROFITS_BIC_BNC_BA' as TypeEnum,
        RentalIncomes: 'RENTAL_INCOMES' as TypeEnum,
        Maintenance: 'MAINTENANCE' as TypeEnum,
        FamilyAllowance: 'FAMILY_ALLOWANCE' as TypeEnum,
        OtherAllowancesLikeAehAahAeeh: 'OTHER_ALLOWANCES_LIKE_AEH_AAH_AEEH' as TypeEnum,
        AplAl: 'APL_AL' as TypeEnum,
        Social: 'SOCIAL' as TypeEnum,
        RetirementPension: 'RETIREMENT_PENSION' as TypeEnum,
        Annuity: 'ANNUITY' as TypeEnum,
        Other: 'OTHER' as TypeEnum
    };
}


