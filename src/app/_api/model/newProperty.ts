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
import { AdministrativeInformation } from './administrativeInformation';
import { NewPropertyExpenses } from './newPropertyExpenses';
import { CallsForFunds } from './callsForFunds';
import { DpeRate } from './dpeRate';
import { Surfaces } from './surfaces';
import { ProjectState } from './projectState';
import { ConstructionNorms } from './constructionNorms';


/**
 * Projet d\'acquisition d\'un logement neuf.
 */
export interface NewProperty { 
    type: NewProperty.TypeEnum;
    project_state?: ProjectState;
    administrative_information?: AdministrativeInformation;
    calls_for_funds?: CallsForFunds;
    surfaces?: Surfaces;
    /**
     * Date de livraison, dans le cas d\'une construction ou d\'une VEFA.
     */
    delivery_date?: string;
    dpe_rate?: DpeRate;
    construction_norm?: ConstructionNorms;
    /**
     * Numéro de lot.
     */
    lot_number?: string;
    /**
     * Nombre de pièces.
     */
    rooms_count?: number;
    /**
     * Nom du programme neuf.
     */
    program?: string;
    expenses?: NewPropertyExpenses;
}
export namespace NewProperty {
    export type TypeEnum = 'NEW_PROPERTY';
    export const TypeEnum = {
        NewProperty: 'NEW_PROPERTY' as TypeEnum
    };
}

