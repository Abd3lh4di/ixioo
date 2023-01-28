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
 * Prêt ou plan progressif variant annuellement.
 */
export interface YearlyVaryingProfile { 
    /**
     * Type de profil de remboursement.
     */
    type: YearlyVaryingProfile.TypeEnum;
    /**
     * Montant de la mensualité de départ.
     */
    initial_monthly_payment?: number;
    /**
     * Pourcentage de variation annuel.
     */
    variation?: number;
}
export namespace YearlyVaryingProfile {
    export type TypeEnum = 'YEARLY';
    export const TypeEnum = {
        Yearly: 'YEARLY' as TypeEnum
    };
}

