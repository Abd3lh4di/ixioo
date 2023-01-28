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
 * Charge persistante lissable, matérialisée dans le plan de financement.
 */
export interface SmoothableCharge { 
    /**
     * Type.
     */
    type: SmoothableCharge.TypeEnum;
    /**
     * Mois de départ du paiement de la charge lissable, dans le plan de financement.
     */
    start_month: number;
    /**
     * Mois de fin du paiement de la charge lissable, dans le plan de financement.
     */
    end_month: number;
    /**
     * Montant du paiement mensuel de la charge.
     */
    monthly_payment: number;
    charge_name?: string;
}
export namespace SmoothableCharge {
    export type TypeEnum = 'SMOOTHABLE_CHARGE';
    export const TypeEnum = {
        SmoothableCharge: 'SMOOTHABLE_CHARGE' as TypeEnum
    };
}

