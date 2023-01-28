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
 * Catégorie socioprofessionnelle des cadres et professions intellectuelles supérieures.
 */
export interface SocioProfessionalGroupCadresProfessionsIntellectuellesSuperieures { 
    type: SocioProfessionalGroupCadresProfessionsIntellectuellesSuperieures.TypeEnum;
    /**
     * Catégorie socio-profesionnelle.
     */
    category?: SocioProfessionalGroupCadresProfessionsIntellectuellesSuperieures.CategoryEnum;
}
export namespace SocioProfessionalGroupCadresProfessionsIntellectuellesSuperieures {
    export type TypeEnum = 'CADRES_PROFESSIONS_INTELLECTUELLES_SUPERIEURES';
    export const TypeEnum = {
        CadresProfessionsIntellectuellesSuperieures: 'CADRES_PROFESSIONS_INTELLECTUELLES_SUPERIEURES' as TypeEnum
    };
    export type CategoryEnum = 'PROFESSIONS_LIBERALES' | 'CADRES_FONCTION_PUBLIQUE' | 'PROFESSEURS_PROFESSIONS_SCIENTIFIQUES' | 'PROFESSIONS_INFORMATION_ARTS_SPECTACLES' | 'CADRES_ADMINISTRATIFS_COMMERCIAUX_ENTREPRISE' | 'INGENIEURS_CADRES_TECHNIQUES_ENTREPRISE';
    export const CategoryEnum = {
        ProfessionsLiberales: 'PROFESSIONS_LIBERALES' as CategoryEnum,
        CadresFonctionPublique: 'CADRES_FONCTION_PUBLIQUE' as CategoryEnum,
        ProfesseursProfessionsScientifiques: 'PROFESSEURS_PROFESSIONS_SCIENTIFIQUES' as CategoryEnum,
        ProfessionsInformationArtsSpectacles: 'PROFESSIONS_INFORMATION_ARTS_SPECTACLES' as CategoryEnum,
        CadresAdministratifsCommerciauxEntreprise: 'CADRES_ADMINISTRATIFS_COMMERCIAUX_ENTREPRISE' as CategoryEnum,
        IngenieursCadresTechniquesEntreprise: 'INGENIEURS_CADRES_TECHNIQUES_ENTREPRISE' as CategoryEnum
    };
}


