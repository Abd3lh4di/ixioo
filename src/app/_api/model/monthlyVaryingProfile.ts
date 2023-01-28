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


/**
 * Prêt ou plan progressif variant mensuellement.
 */
export interface MonthlyVaryingProfile { 
    /**
     * Type de profil de remboursement.
     */
    type: MonthlyVaryingProfile.TypeEnum;
    /**
     * Montant de la mensualité de départ.
     */
    initial_monthly_payment?: number;
    /**
     * Pourcentage de variation mensuel.
     */
    variation?: number;
}
export namespace MonthlyVaryingProfile {
    export type TypeEnum = 'MONTHLY';
    export const TypeEnum = {
        Monthly: 'MONTHLY' as TypeEnum
    };
}


