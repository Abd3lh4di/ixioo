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
import { Address } from './address';
import { FinancialResults } from './financialResults';
import { FinanceDetails } from './financeDetails';
import { StructureType } from './structureType';
import { Person } from './person';
import { BankInfo } from './bankInfo';


/**
 * Informations relatives à l\'emprunteur personne morale.
 */
export interface LegalPerson { 
    /**
     * Type d\'emprunteur: personne personne morale.
     */
    type: LegalPerson.TypeEnum;
    /**
     * Dénomination ou raison sociale.
     */
    name?: string;
    /**
     * Numéro au Registre du Commerce et des Sociétés.
     */
    rcs_number?: string;
    /**
     * Numéro de Siret.
     */
    siret?: string;
    creation_date?: string;
    /**
     * Email.
     */
    email?: string;
    /**
     * Numéro de téléphone.
     */
    phone_number?: string;
    address?: Address;
    contact_address?: Address;
    bank_info?: BankInfo;
    structure_type?: StructureType;
    /**
     * Forme juridique (SARL, SA, EURL, auto-entrepreneur, ...).
     */
    legal_status?: string;
    /**
     * Associés de la personne morale.
     */
    persons?: Array<Person>;
    financial_results?: FinancialResults;
    finance?: FinanceDetails;
}
export namespace LegalPerson {
    export type TypeEnum = 'LEGAL_PERSON';
    export const TypeEnum = {
        LegalPerson: 'LEGAL_PERSON' as TypeEnum
    };
}

