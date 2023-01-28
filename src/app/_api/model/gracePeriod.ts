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
 * Différé d\'amortissement ou de remboursement.
 */
export interface GracePeriod { 
    /**
     * Type de différé: partiel (différé d\'amortissement uniquement) ou total (différé d\'amortissement et d\'intérets).
     */
    type: GracePeriod.TypeEnum;
    /**
     * Durée du différé en mois.
     */
    length: number;
}
export namespace GracePeriod {
    export type TypeEnum = 'PARTIAL' | 'TOTAL';
    export const TypeEnum = {
        Partial: 'PARTIAL' as TypeEnum,
        Total: 'TOTAL' as TypeEnum
    };
}


