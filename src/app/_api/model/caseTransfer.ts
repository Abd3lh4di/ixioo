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
 * Opération de transfert d\'un dossier.
 */
export interface CaseTransfer { 
    /**
     * Type de transfert.
     */
    type?: CaseTransfer.TypeEnum;
    /**
     * ID unique du dossier à transférer.
     */
    case_id?: string;
    /**
     * ID de la souscription de destination.
     */
    subscription_id?: string;
    /**
     * Inclusion des plans de financements dans le transfert.
     */
    include_plans_parameters?: boolean;
    /**
     * Inclusion des simulations dans le transfert.
     */
    include_simulations?: boolean;
    /**
     * Supprime le dossier de la souscription courante après l\'avoir transféré dans la souscription de destination.
     */
    delete_after_completion?: boolean;
}
export namespace CaseTransfer {
    export type TypeEnum = 'CASE';
    export const TypeEnum = {
        Case: 'CASE' as TypeEnum
    };
}

