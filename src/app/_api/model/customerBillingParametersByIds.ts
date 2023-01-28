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
 * Ids des paramètres permettant de générer une facture à destination d\'un client.
 */
export interface CustomerBillingParametersByIds { 
    /**
     * Type de paramètres de faturation.
     */
    type: CustomerBillingParametersByIds.TypeEnum;
    /**
     * Id de la simulation.
     */
    simulation_id: string;
    /**
     * Id des paramètres du plan.
     */
    plan_id: string;
    /**
     * Id du dossier.
     */
    case_id: string;
    /**
     * Id du partenaire emettant la facture (courtier en général).
     */
    partner_id: string;
}
export namespace CustomerBillingParametersByIds {
    export type TypeEnum = 'CUSTOMER_BILLING_PARAMETERS_BY_IDS';
    export const TypeEnum = {
        CustomerBillingParametersByIds: 'CUSTOMER_BILLING_PARAMETERS_BY_IDS' as TypeEnum
    };
}


