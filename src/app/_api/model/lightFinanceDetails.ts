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
import { ChargeItem } from './chargeItem';
import { CurrentLoan } from './currentLoan';
import { LightIncomeTax } from './lightIncomeTax';
import { RevenueItem } from './revenueItem';


/**
 * Détails sur les finances de l\'emprunteur.  La capacité de remboursement est calculée comme: Somme(revenu * pondération) - Somme(charge * pondération) - Somme(CréditsPersistants * pondération).
 */
export interface LightFinanceDetails { 
    /**
     * Apport personnel consacré au financement du projet.
     */
    personal_funding?: number;
    income_tax?: LightIncomeTax;
    /**
     * Liste des revenus persistants après le projet. Le reste à vivre est calculé comme: sum(revenu * pondération) - sum(charge * pondération).
     */
    revenues?: Array<RevenueItem>;
    /**
     * Liste des charges persistantes après le projet. Le reste à vivre est calculé comme: sum(revenu * pondération) - sum(charge * pondération).
     */
    charges?: Array<ChargeItem>;
    /**
     * Prêt(s) existant(s): immobilier, consommation ou autres
     */
    current_loans?: Array<CurrentLoan>;
}

