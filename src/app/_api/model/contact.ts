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
 * Contact.
 */
export interface Contact { 
    /**
     * Civilité du contact.
     */
    courtesy?: Contact.CourtesyEnum;
    /**
     * Prénom du contact.
     */
    first_name?: string;
    /**
     * Nom de famille du contact.
     */
    last_name?: string;
    /**
     * Email du contact.
     */
    email?: string;
    /**
     * Numéro de téléphone du contact.
     */
    phone_number?: string;
    /**
     * Commentaire.
     */
    comment?: string;
}
export namespace Contact {
    export type CourtesyEnum = 'MR' | 'MRS';
    export const CourtesyEnum = {
        Mr: 'MR' as CourtesyEnum,
        Mrs: 'MRS' as CourtesyEnum
    };
}


