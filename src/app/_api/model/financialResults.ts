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
import { WeightedFigure } from './weightedFigure';
import { WeightedPositiveFigure } from './weightedPositiveFigure';


/**
 * Résultats financiers d\'une personne morale, sur les trois dernières années. Profits représente le CA et turnover les bénéfices (forcément positifs donc).
 */
export interface FinancialResults { 
    profits_Nminus1?: WeightedFigure;
    profits_Nminus2?: WeightedFigure;
    profits_Nminus3?: WeightedFigure;
    turnover_Nminus1?: WeightedPositiveFigure;
    turnover_Nminus2?: WeightedPositiveFigure;
    turnover_Nminus3?: WeightedPositiveFigure;
}

