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
 * Structure du démembrement.
 */
export interface Breakup { 
    /**
     * Type de démembrement.
     */
    type?: Breakup.TypeEnum;
    /**
     * Pourcentage du bien possédé.
     */
    portion?: number;
}
export namespace Breakup {
    export type TypeEnum = 'PLEINE_PROPRIETE' | 'NUE_PROPRIETE' | 'USUFRUIT';
    export const TypeEnum = {
        PleinePropriete: 'PLEINE_PROPRIETE' as TypeEnum,
        NuePropriete: 'NUE_PROPRIETE' as TypeEnum,
        Usufruit: 'USUFRUIT' as TypeEnum
    };
}


