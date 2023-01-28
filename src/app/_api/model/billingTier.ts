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
 * Modèle de facturation: par tranches.  Si from_amount et to_amount ne sont pas remplis, le modèle de facturation s\'appliquera sur l\'intégralité du montant du prêt, comme: flat_fee + montant_du_prêt * rate  Sinon, la facturation pour cette tranche sera calculée comme: flat_fee + (min(montant_du_prêt, to_amount) - from_amount) * rate  
 */
export interface BillingTier { 
    /**
     * Limite basse (incluse) du montant de prêt sur lequel s\'applique ce modèle de facturation.
     */
    from_amount: number;
    /**
     * Limite haute (exclue) du montant de prêt sur lequel s\'applique ce modèle de facturation.
     */
    to_amount: number;
    /**
     * Part fixe, à appliquer sur la tranche [0; to_amount - from_amount[.
     */
    flat_fee: number;
    /**
     * Part variable, à appliquer sur la tranche [0; to_amount - from_amount[.
     */
    rate: number;
}
