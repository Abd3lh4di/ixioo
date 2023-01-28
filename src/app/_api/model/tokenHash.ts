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
 * Le hash d\'un Token
 */
export interface TokenHash { 
    /**
     * Type d\'algorithme
     */
    alg: TokenHash.AlgEnum;
    /**
     * Nombre d\'itération
     */
    it: number;
    /**
     * Hash du code du token associé
     */
    hash: string;
}
export namespace TokenHash {
    export type AlgEnum = 'pbkdf2-sha256';
    export const AlgEnum = {
        Pbkdf2Sha256: 'pbkdf2-sha256' as AlgEnum
    };
}

