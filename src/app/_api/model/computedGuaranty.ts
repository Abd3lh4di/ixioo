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
import { GuarantyType } from './guarantyType';


/**
 * Garantie calculée du prêt.
 */
export interface ComputedGuaranty { 
    type: GuarantyType;
    /**
     * Montant de la commission de la garantie: frais de dossier en général, à fond perdu.
     */
    guaranty_commission?: number;
    /**
     * Montant de la contribution au fond mutuel de garantie. Dans le cas d\'une Hypothèque ou IPPD par exemple, ce montant n\'a pas de sens.
     */
    mutualized_guaranty_contribution?: number;
}

