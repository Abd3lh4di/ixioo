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
import { SubscriptionMeteredPath } from './subscriptionMeteredPath';


/**
 * Critères de sélection des appels enregistrés.
 */
export interface SubscriptionMeteredItem { 
    /**
     * Nom de l\'item
     */
    name: string;
    /**
     * Référence de l\'item.
     */
    ref: string;
    paths: Array<SubscriptionMeteredPath>;
}

