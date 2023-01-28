import { AcquisitionDestination, AcquisitionNature, AcquisitionState, ActivePartner, Breakup, Case, CaseStatus, ChargeItem, Courtesy, CurrentLoan, DependentPerson, Employee, FamilySituation, GracePeriod, GuarantyType, Individual, Insurance, LegalPerson, Loan, MaritalStatus, ProfessionDetails, ProfessionStatus, ProjectState, Relationship, RevenueItem, StructureType } from '../_api';
import { Housing, PartnerType } from '../_api';

export class AcquisitionStateMap {
    private static stringMap = {
        VEFA: 'VEFA',
        SOCIAL: 'Acquisition logement social',
        UNDER_CONSTRUCTION: 'Construction',
        RAW_LAND: 'Terrain',
        NEW: 'Neuf',
        OLD_WITH_WORKS: 'Ancien avec travaux',
        OLD: 'Ancien sans travaux',
        WORKS: 'Travaux seuls'
    };
    static toString(acquisitionState: AcquisitionState) {
        return AcquisitionStateMap.stringMap[acquisitionState];
    }
}

export class AcquisitionDestinationMap {
    private static stringMap = {
        MAIN_PROPERTY: 'Résidence principale',
        SECONDARY_PROPERTY: 'Résidence secondaire',
        RENTAL_PROPERTY: 'Investissement locatif',
        PROFESSIONAL_PROPERTY: 'Bien professionnel',
        VIAGER: 'Viager',
        INVESTMENT: 'Investissement',
    };
    static toString(type: AcquisitionDestination) {
        return AcquisitionDestinationMap.stringMap[type];
    }
}

export class AcquisitionNatureMap {
    private static stringMap = {
        FLAT: 'Appartement',
        HOUSE: 'Maison',
        LAND: 'Terrain',
        LAND_AND_CONSTRUCTION_PROJECT: 'Terrain et construction',
        CONSTRUCTION_PROJECT: 'Construction seule',
        PARKING: 'Parking',
        COMMERCIAL_PREMISES: 'Local commercial',
        OFFICES: 'Bureaux',
        BALANCING_ADJUSTMENT: 'Rachat de soulte',
        SCPI: 'Parts de SCPI'
    };
    static toString(nature: AcquisitionNature) {
        return AcquisitionNatureMap.stringMap[nature];
    }
}

export class CaseStatusMap {
    private static stringMap = {
        NEW: 'Nouveau',
        INSTRUCTION: 'Instruction',
        SENT_TO_BANK: 'Envoyé banque',
        GRANTED_BANK: 'Accordé banque',
        CUSTOMER_ACCEPTED: 'Accepté client',
        COMPLETED: 'Réalisé',
        INVOICED: 'Facturé',
        CLOSED: 'Cloturé',
        CANCELED: 'Abandonné'
    };

    static toString(caseStatus: CaseStatus) {
        return CaseStatusMap.stringMap[caseStatus];
    }
}

export class ProjectStateMap {
    private static stringMap = {
        BEFORE_COMPROMIS: 'Avant compromis',
        COMPROMIS_SIGNED: 'Compromis signé',
        SIGNED: 'Signé',
        CANCELED: 'Annulé'
    };
    static toString(projectState: ProjectState) {
        return ProjectStateMap.stringMap[projectState];
    }
}
export class LoanTypeMap {
    private static stringMap = {
        FREE_LOAN: 'Prêt Amortissable',
        BRIDGE_LOAN: 'Prêt Relais',
        PTZ_LOAN: 'Prêt à Taux Zéro',
        BOSS_LOAN: 'Prêt 1% Patronal',
        SMOOTHABLE_CHARGE: 'Charge'
    };
    static toString(loanType: Loan.TypeEnum) {
        return LoanTypeMap.stringMap[loanType];
    }
}

export class GracePeriodTypeMap {
    private static stringMap = {
        PARTIAL: 'Partiel',
        TOTAL: 'Total'
    };
    static toString(type: GracePeriod.TypeEnum) {
        return GracePeriodTypeMap.stringMap[type];
    }
}

export class TaxModeMap {
    private static stringMap = {
        REAL: 'Réel',
        MICRO_BIC: 'Micro BIC',
        MICRO_FONCIER: 'Micro foncier'
    };
    static toString(taxMode: 'REAL' | 'MICRO_BIC' | 'MICRO_FONCIER') {
        return TaxModeMap.stringMap[taxMode];
    }
}

export class GuarantyTypeMap {
    private static stringMap = {
        HYPOTHEQUE: 'Hypothèque',
        IPPD: 'IPPD',
        CASDEN: 'Casden',
        CREDIT_LOGEMENT_CLASSIC: 'Crédit Logement Classic',
        CREDIT_LOGEMENT_INITIO: 'Crédit Logement Initio',
        MGEN: 'Mgen',
        CUSTOM: 'Valeur manuelle',
    };
    static toString(type: GuarantyType) {
        return GuarantyTypeMap.stringMap[type];
    }
}

export class RelationshipMap {
    private static stringMap = {
        HUSBAND: 'Mari',
        'EX-HUSBAND': 'Ex-mari',
        SPOUSE: 'Épouse',
        'EX-SPOUSE': 'Ex-épouse',
        SISTER: 'Soeur',
        BROTHER: 'Frère',
        MOTHER: 'Mère',
        FATHER: 'Père',
        OTHER: 'Autre',
    };
    static toString(type: Relationship) {
        return RelationshipMap.stringMap[type];
    }
}

export class InsuranceTypeMap {
    private static stringMap = {
        INITIAL_CAPITAL: 'Capital initial',
        REMAINING_CAPITAL: 'Capital restant'
    };
    static toString(type: Insurance.TypeEnum) {
        return InsuranceTypeMap.stringMap[type];
    }
}

export class IraTypeMap {
    private static stringMap = {
        LEGAL: 'Légales',
        NEGOCIATED: 'Négociées'
    };
    static toString(type: 'LEGAL' | 'NEGOCIATED') {
        return IraTypeMap.stringMap[type];
    }
}


export class Objective {
    private static stringMap = {
        MINIMIZE_COST: 'Réduire le coût',
        MINIMIZE_INSTALMENT: 'un reste à vivre maximal'
    };
    static toString(objective: 'MINIMIZE_COST' | 'MINIMIZE_INSTALMENT') {
        return Objective.stringMap[objective];
    }
}

export class MaritalStatusMap {
    private static stringMap = {
        SINGLE: { MRS: 'Célibataire', MR: 'Célibataire' },
        MARRIED: { MRS: 'Mariée', MR: 'Marié' },
        PACSED: { MRS: 'Pacsée', MR: 'Pacsé' },
        SEPARATED: { MRS: 'Séparée', MR: 'Séparé' },
        DIVORCED: { MRS: 'Divorcée', MR: 'Divorcé' },
        WIDOWER: { MRS: 'Veuve', MR: 'Veuf' },
        DIVORCE_ONGOING: { MRS: 'En instance de divorce', MR: 'En instance de divorce' },
        LIVING_TOGETHER: { MRS: 'Union libre', MR: 'Union libre' },
    };
    static toString(courtesy: Courtesy, maritalStatus: MaritalStatus ) {
        return MaritalStatusMap.stringMap[maritalStatus][courtesy];
    }
}

export class PinelDuration {
    private static stringMap = {
        SIX: 'six',
        NINE: 'neuf',
        TWELVE: 'douze'
    };
    static toString(duration: 'SIX' | 'NINE' | 'TWELVE') {
        return PinelDuration.stringMap[duration];
    }
}

export class ProfileTypeMap {
    private static stringMap = {
        GRANDIOZ: 'Grandioz',
        MONTHLY: 'Variation mensuelle',
        YEARLY: 'Variation annuelle',
        CUSTOM: 'Personalisé'
    };
    static toString(type: 'GRANDIOZ' | 'MONTHLY' | 'YEARLY' | 'CUSTOM') {
        return ProfileTypeMap.stringMap[type];
    }
}

export class ActorStringMap {
    private static stringMap = {
        HOUSEHOLD: 'Ménage',
        LEGAL_PERSON: 'Personne morale',
    };
    static toString(actor: 'HOUSEHOLD' | 'LEGAL_PERSON') {
        return ActorStringMap.stringMap[actor];
    }
}

export class CallsForFundsTypeStringMap {
    private static stringMap = {
        PROPORTIONAL: 'Déblocage des fonds proportionnellement au montant de chaque prêt',
        INCREASING_RATE: 'Déblocage des fonds sur les prêts les moins chers en priorité',
    };
    static toString(type: 'PROPORTIONAL' | 'INCREASING_RATE') {
        return CallsForFundsTypeStringMap.stringMap[type];
    }
}

export class ProjectStringMap {
    private static stringMap = {
        BUDGET: 'Estimation de budget',
        HOUSE_CONSTRUCTION: 'Construction de maison individuelle',
        OLD_PROPERTY: 'Acquisition d\'un logement ancien',
        LAND: 'Achat de terrain seul',
        NEW_PROPERTY: 'Projet d\'acquisition d\'un logement neuf',
        WORKS: 'Projet de travaux seul',
        PINEL: 'Investissement Pinel',
        DEBT_CONSOLIDATION: 'Rachat de crédit',
        BALANCING_ADJUSTMENT: 'Rachat de soulte',
        LMNP: 'LMNP',
    };
    static toString(type: any) {
        return ProjectStringMap.stringMap[type];
    }
}

export class ConstructionNormStringMap {
    private static stringMap = {
        RT_2020: 'RT 2020',
        HPE_2012: 'HPE 2012',
        RT_2012: 'RT 2012',
        BBC_RENOV_2009: 'BBC RENOV 2009',
        HPE_RENOV_2009: 'HPE RENOV 2009',
        RT_2005: 'RT 2005',
        RT_ANTERIEUR: 'RT antérieur',
    };
    static toString(type: any) {
        return ConstructionNormStringMap.stringMap[type];
    }
}

export class PartnerTypeMap {
    private static stringMap = {
        NOTARY: 'Notaire',
        ESTATE_AGENT: 'Agent immobilier',
        BANK: 'Banque',
        BROKER: 'Courtier',
        COLLECTOR_ONE_PERCENT_EMPLOYER: 'Collecteur 1% patronal',
        HOUSE_BUILDER: 'Constructeur de maisons individuelles',
        DPE_CHECKER: 'Diagnostiqueur DPE',
        LAND_SURVEYOR: 'Géomètre',
        BUSINESS_PROVIDER: 'Apporteur d\'affaire',
        ARCHITECT: 'Architecte',
        LAWYER: 'Avocat',
        OTHER: 'Autre type de partenaire'
    };
    static toString(type: PartnerType) {
        return PartnerTypeMap.stringMap[type];
    }
}

export class WorkerStatus {
    private static stringMap = {
        EMPLOYEE: 'Employé(e)',
        SELFEMPLOYED: 'Indépendant(e)',
        STUDENT: 'Employé(e)',
        RETIRED: 'Employé(e)',
        UNEMPLOYED: 'Employé(e)',
        ANNUITANT: 'Employé(e)',
    };
    static toString(type: ProfessionStatus) {
        return WorkerStatus.stringMap[type];
    }
}

export class MatrimonialRegime {
    private static stringMap = {
        NOT_APPLICABLE: 'Sans',
        COMMUNAUTE_UNIVERSELLE: 'Communauté universelle',
        COMMUNAUTE_REDUITE_AUX_ACQUETS: 'Communauté réduite aux acquets',
        COMMUNAUTE_DE_MEUBLES_ET_ACQUETS: 'Communauté de meubles et acquets',
        PARTICIPATION_AUX_ACQUETS: 'Participation aux acquets',
        SEPARATION_DE_BIEN: 'Séparation de biens'
    };
    static toString(type: FamilySituation.MatrimonyRegimeEnum) {
        return MatrimonialRegime.stringMap[type];
    }
}

export class PatrimonyType {
    private static stringMap = {
        LIVRET_A: 'Livret A',
        LDDS: 'LDDS',
        LEP: 'LEP',
        LIVRET_JEUNE: 'Livret jeune',
        LIFE_INSURANCE: 'Assurance vie',
        PEL: 'PEL',
        CEL: 'CEL',
        PEE: 'PEE',
        PEA: 'PEA',
        PER: 'PER',
        CURRENT_ACCOUNT: 'Compte courant',
        FAMILY_DONATION: 'Donation familiale',
        SHARES: 'Actions',
        SCI_SHARES: 'Parts de SCI',
        SOCIAL_SHARES: 'Parts sociales',
        JEWELRY: 'Bijoux',
        ART_WORK: 'Œuvre d\'art',
        COLLECTION: 'Collection',
        REAL_ESTATE_MAIN_PROPERTY: 'Résidence principale',
        REAL_ESTATE_SECONDARY_PROPERTY: 'Résidence secondaire',
        REAL_ESTATE_RENTING_PROPERTY: 'Bien immobilier locatif',
        LAND: 'Terrain',
        PARKING: 'Parking',
        COMMERCIAL_PREMISES: 'Local commercial',
        BUILDING: 'Immeuble',
        PROFESSIONAL_REAL_ESTATE: 'Immobilier professionnel',
        CAPITAL_GOODS: 'Matériel professionnel',
        PLEINE_PROPRIETE: 'Pleine propriété',
        NUE_PROPRIETE: 'Nue propriété',
        USUFRUIT: 'Usufruit'
    };
    static toString(type: string) {
        return PatrimonyType.stringMap[type];
    }
}


export class HousingStatus {
    private static stringMap = {
        HOMEOWNER: 'Propriétaire (sans crédit)',
        TENANT: 'Locataire',
        FREE_OF_CHARGE_TENANT: 'Logé à titre gratuit',
        HOMEOWNER_IN_PROGRESS: 'Proriétaire (avec crédit)',
        OTHER: 'Autre',
    };
    static toString(type: 'HOMEOWNER' | 'TENANT' | 'FREE_OF_CHARGE_TENANT' | 'HOMEOWNER_IN_PROGRESS' | 'OTHER') {
        return HousingStatus.stringMap[type];
    }
}


export class IncomeType {
    private static stringMap = {
        SALARY: 'Salaire',
        DIVIDENDS: 'Dividendes',
        BONUS: 'Primes',
        FRENCH_PARTICIPATION: 'Participation',
        PROFESSIONAL_PROFITS_BIC_BNC_BA: 'Bénéfices professionels (BIC, BNC, BA)',
        RENTAL_INCOMES: 'Revenus locatifs',
        MAINTENANCE: 'Pension alimentaire',
        FAMILY_ALLOWANCE: 'Allocations familiales',
        OTHER_ALLOWANCES_LIKE_AEH_AAH_AEEH: 'Autres allocations (AAH, AEEH, ...)',
        APL_AL: 'Aide au logement (APL, AL)',
        SOCIAL: 'Revenus sociaux',
        RETIREMENT_PENSION: 'Pension de retraite',
        TURNOVER_NM1: 'Chiffre d\'affaire N -1',
        TURNOVER_NM2: 'Chiffre d\'affaire N -2',
        TURNOVER_NM3: 'Chiffre d\'affaire N -3',
        PROFITS_NM1: 'Bénéfices N -1',
        PROFITS_NM2: 'Bénéfices N -2',
        PROFITS_NM3: 'Bénéfices N -3',
        OTHER: 'Autre revenus'
    };

    static toString(type: 'SALARY' | 'DIVIDENDS' | 'BONUS' | 'FRENCH_PARTICIPATION'
                        | 'PROFESSIONAL_PROFITS_BIC_BNC_BA' | 'RENTAL_INCOMES' | 'MAINTENANCE'
                        | 'FAMILY_ALLOWANCE' | 'OTHER_ALLOWANCES_LIKE_AEH_AAH_AEEH' | 'APL_AL' | 'SOCIAL'
                        | 'RETIREMENT_PENSION' | 'TURNOVER_NM1' | 'TURNOVER_NM2' | 'TURNOVER_NM3' | 'PROFITS_NM1'
                        | 'PROFITS_NM2' | 'PROFITS_NM3' | 'OTHER') {
        return IncomeType.stringMap[type];
    }
}

export class BurdensType {
    private static stringMap = {
        RENT: 'Loyer',
        MAINTENANCE: 'Pension alimentaire',
        CONDOMINIUM_FEES: 'Charges de copropriété',
        SCHEDULED_SAVING: 'Epargne programmée',
        LOA: 'Leasing avec Option d\'Achat',
        TAX: 'Taxes',
        OTHER: 'Autre'
    };
    static toString(type: 'RENT' | 'MAINTENANCE' | 'CONDOMINIUM_FEES' | 'SCHEDULED_SAVING' | 'LOA' | 'OTHER') {
        return BurdensType.stringMap[type];
    }
}

export class LoansType {
    private static stringMap = {
        MORTGAGE: 'Crédit immobilier',
        PERSONAL_LOAN: 'Crédit personnel',
        SPECIFIC_LOAN: 'Crédit affecté',
        REVOLVING_LOAN: 'Crédit renouvelable',
        OTHER: 'Autre'
    };
    static toString(type: CurrentLoan.TypeEnum) {
        return LoansType.stringMap[type];
    }
}

export const loansTypeShortList = ['CREDIT IMMO', 'CREDIT PERSO', 'CREDIT AFFECTE', 'CREDIT RENOUV', 'AUTRE CREDIT'];

export class LoansTypeShort {
    private static stringMap = {
        MORTGAGE: loansTypeShortList[0],
        PERSONAL_LOAN: loansTypeShortList[1],
        SPECIFIC_LOAN: loansTypeShortList[2],
        REVOLVING_LOAN: loansTypeShortList[3],
        OTHER: loansTypeShortList[4]
    };
    static toString(type: CurrentLoan.TypeEnum) {
        return LoansTypeShort.stringMap[type];
    }
}

export class LoanFutureType {
    private static stringMap = {
        REIMBURSED_BEFORE_PROJECT: 'Soldé avant le projet',
        CONTINUE_AFTER_PROJECT: 'Continue après le projet',
        REIMBURSED_DURING_PROJECT: 'Soldé par le projet',
        CONSOLIDATED_DURING_PROJECT: 'Racheté par le projet'
    };
    static toString(type: CurrentLoan.FutureEnum) {
        return LoanFutureType.stringMap[type];
    }
}

// export class AcquisitionNature {
//     private static stringMap = {
//         FLAT: 'Appartement',
//         HOUSE: 'Maison',
//         LAND: 'Terrain',
//         LAND_AND_CONSTRUCTION: 'Terrain et construction',
//         PARKING: 'Parking',
//         COMMERCIAL_PREMISES: 'Local commercial'
//     };
//     static toString(type: 'FLAT' | 'HOUSE' | 'LAND' | 'LAND_AND_CONSTRUCTION' | 'PARKING' | 'COMMERCIAL_PREMISES') {
//         return AcquisitionNature.stringMap[type];
//     }
// }

export class GroupeSocioProfessionnal {
    private static stringMap = {
        AGRICULTEURS_EXPLOITANTS: 'Agriculteurs exploitants',
        ARTISANS_COMMERCANTS_CHEFS_DENTREPRISE: 'Artisants, commerçants, chefs d\'entreprise',
        CADRES_PROFESSIONS_INTELLECTUELLES_SUPERIEURES: 'Cadres, professions intellectuelles supérieures',
        PROFESSIONS_INTERMEDIAIRES: 'Professions intermédiaires',
        EMPLOYES: 'Employés',
        OUVRIERS: 'Ouvriers',
        RETRAITES: 'Retraités',
        AUTRES_PERSONNES_SANS_ACTIVITE_PROFESSIONNELLE: 'Sans activité profesionnelle'
    };
    static toString(type: 'AGRICULTEURS_EXPLOITANTS' | 'ARTISANS_COMMERCANTS_CHEFS_DENTREPRISE' | 'CADRES_PROFESSIONS_INTELLECTUELLES_SUPERIEURES' | 'PROFESSIONS_INTERMEDIAIRES' | 'EMPLOYES' | 'OUVRIERS' | 'RETRAITES' | 'AUTRES_PERSONNES_SANS_ACTIVITE_PROFESSIONNELLE') {
        return GroupeSocioProfessionnal.stringMap[type];
    }
}

export class CategorySocioProfessionnal {
    private static stringMap = {
        AGRICULTEURS_PETITE_EXPLOITATION: 'Agriculteurs petite exploitation',
        AGRICULTEURS_MOYENNE_EXPLOITATION: 'Agriculteurs moyenne exploitation',
        AGRICULTEURS_GRANDE_EXPLOITATION: 'Agriculteurs grande exploitation',
        ARTISANS: 'Artisans',
        COMMERCANTS_ET_ASSIMILES: 'Commerçants et assimilés',
        CHEFS_ENTREPRISE_10_SALARIES_OU_PLUS: 'Chef d\'entreprise de 10 salariés ou plus',
        PROFESSIONS_LIBERALES: 'Professions libérales',
        CADRES_FONCTION_PUBLIQUE: 'Cadres de la fonction publique',
        PROFESSEURS_PROFESSIONS_SCIENTIFIQUES: 'Professeurs, professions scientifiques',
        PROFESSIONS_INFORMATION_ARTS_SPECTACLES: 'Professions de l\'information, des arts et des spectacles',
        CADRES_ADMINISTRATIFS_COMMERCIAUX_ENTREPRISE: 'Cadres administratifs et commerciaux d\'entreprises',
        INGENIEURS_CADRES_TECHNIQUES_ENTREPRISE: 'Ingénieurs et cadres techniques d\'entreprises',
        PROFESSEURS_DES_ECOLES_INSTITUTEUR_ET_ASSIMILE: 'Professeurs des écoles, instituteurs et professions assimilées',
        PROFESSIONS_INTERMEDIAIRES_DE_LA_SANTE_ET_DU_TRAVAIL_SOCIAL: 'Professions intermédiaires de la santé et du travail social',
        CLERGE_RELIGIEUX: 'Clergé, religieux',
        PROFESSIONS_INTERMEDIAIRES_ADMINISTRATIVES_DE_LA_FONCTION_PUBLIQUE: 'Professions intermédiaires administratives de la fonction publique',
        PROFESSIONS_INTERMEDIAIRES_ADMINISTRATIVES_COMMERCIALES_ENTREPRISES: 'Professions intermédiaires administratives et commerciales des entreprises',
        TECHNICIENS: 'Techniciens',
        CONTREMAITRES_AGENTS_DE_MAITRISE: 'Contremaîtres, agents de maîtrise',
        EMPLOYES_CIVIL_AGENTS_DE_SERVICE_FONCTION_PUBLIQUE: 'Employés civils et agents de service de la fonction publique',
        POLICIERS_MILITAIRES: 'Policiers, militaires et agents de surveillance',
        EMPLOYES_ADMINISTRATIFS_ENTREPRISE: 'Employés administratifs d\'entreprise',
        EMPLOYES_DE_COMMERCE: 'Employés de commerce',
        PERSONNELS_DES_SERVICES_DIRECTS_AUX_PARTICULIERS: 'Personnels des services directs aux particuliers',
        OUVRIERS_QUALIFIES_DE_TYPE_INDUSTRIEL: 'Ouvriers qualifiés de type industriel',
        OUVRIERS_QUALIFIES_DE_TYPE_ARTISANAL: 'Ouvriers qualifiés de type artisanal',
        CHAUFFEURS: 'Chauffeurs',
        OUVRIERS_QUALIFIERS_MANUTENTION_MAGASINAGE_TRANSPORT: 'Ouvriers qualifiés de la manutention, du magasinage et du transport',
        OUVRIERS_NON_QUALIFIES_DE_TYPE_INDUSTRIEL: 'Ouvriers non qualifiés de type industriel',
        OUVRIERS_NON_QUALIFIES_DE_TYPE_ARTISANAL: 'Ouvriers non qualifiés de type artisanal',
        OUVRIERS_AGRICOLES: 'Ouvriers agricoles et assimilés',
        ANCIENS_AGRICULTEURS_EXPLOITANTS: 'Anciens agriculteurs exploitants',
        ANCIENS_ARTISANS_COMMERCANTS_CHEFS_DENTREPRISE: 'Anciens artisans, commerçants et chefs d\'entreprise',
        ANCIENS_CADRES: 'Anciens cadres',
        ANCIENNES_PROFESSIONS_INTERMEDIAIRES: 'Anciennes professions intermédiaires',
        ANCIENS_EMPLOYES: 'Anciens employés',
        ANCIENS_OUVRIERS: 'Anciens ouvriers',
        CHOMEURS_AYANT_JAMAIS_TRAVAILLE: 'Chômeurs n\'ayant jamais travaillé',
        MILITAIRES_DU_CONTINGENT: 'Militaires du contingent',
        ELEVES_ETUDIANTS: 'Élèves, étudiants',
        SANS_ACTIVITE_MOINS_60: 'Sans activité professionnelle de moins de 60 ans',
        SANS_ACTIVITE_PLUS_60: 'Sans activité professionnelle de plus de 60 ans'
    };
    static toString(type: 'AGRICULTEURS_PETITE_EXPLOITATION' | 'AGRICULTEURS_MOYENNE_EXPLOITATION' | 'AGRICULTEURS_GRANDE_EXPLOITATION' | 'ARTISANS' | 'COMMERCANTS_ET_ASSIMILES' | 'CHEFS_ENTREPRISE_10_SALARIES_OU_PLUS' | 'PROFESSIONS_LIBERALES' | 'CADRES_FONCTION_PUBLIQUE' | 'PROFESSEURS_PROFESSIONS_SCIENTIFIQUES' | 'PROFESSIONS_INFORMATION_ARTS_SPECTACLES' | 'CADRES_ADMINISTRATIFS_COMMERCIAUX_ENTREPRISE' | 'INGENIEURS_CADRES_TECHNIQUES_ENTREPRISE' | 'PROFESSEURS_DES_ECOLES_INSTITUTEUR_ET_ASSIMILE' | 'PROFESSIONS_INTERMEDIAIRES_DE_LA_SANTE_ET_DU_TRAVAIL_SOCIAL' | 'CLERGE_RELIGIEUX' | 'PROFESSIONS_INTERMEDIAIRES_ADMINISTRATIVES_DE_LA_FONCTION_PUBLIQUE' | 'PROFESSIONS_INTERMEDIAIRES_ADMINISTRATIVES_COMMERCIALES_ENTREPRISES' | 'TECHNICIENS' | 'CONTREMAITRES_AGENTS_DE_MAITRISE' | 'EMPLOYES_CIVIL_AGENTS_DE_SERVICE_FONCTION_PUBLIQUE' | 'POLICIERS_MILITAIRES' | 'EMPLOYES_ADMINISTRATIFS_ENTREPRISE' | 'EMPLOYES_DE_COMMERCE' | 'PERSONNELS_DES_SERVICES_DIRECTS_AUX_PARTICULIERS' | 'OUVRIERS_QUALIFIES_DE_TYPE_INDUSTRIEL' | 'OUVRIERS_QUALIFIES_DE_TYPE_ARTISANAL' | 'CHAUFFEURS' | 'OUVRIERS_QUALIFIERS_MANUTENTION_MAGASINAGE_TRANSPORT' | 'OUVRIERS_NON_QUALIFIES_DE_TYPE_INDUSTRIEL' | 'OUVRIERS_NON_QUALIFIES_DE_TYPE_ARTISANAL' | 'OUVRIERS_AGRICOLES' | 'ANCIENS_AGRICULTEURS_EXPLOITANTS' | 'ANCIENS_ARTISANS_COMMERCANTS_CHEFS_DENTREPRISE' | 'ANCIENS_CADRES' | 'ANCIENNES_PROFESSIONS_INTERMEDIAIRES' | 'ANCIENS_EMPLOYES' | 'ANCIENS_OUVRIERS' | 'CHOMEURS_AYANT_JAMAIS_TRAVAILLE' | 'MILITAIRES_DU_CONTINGENT' | 'ELEVES_ETUDIANTS' | 'SANS_ACTIVITE_MOINS_60' | 'SANS_ACTIVITE_PLUS_60') {
        return CategorySocioProfessionnal.stringMap[type];
    }
}

export class LegalPersonTypeMap {
    private static stringMap = {
        SCI: 'SCI',
        COMPANY: 'Entreprise',
        ASSOCIATION: 'Association',
        POLITICAL_PARTY: 'Parti politique',
        LOCAL_AUTHORITIES: 'Collectivité territoriale',
    };
    static toString(type: StructureType) {
        return LegalPersonTypeMap.stringMap[type];
    }
}

export class CourtesyTypeMap {
    private static stringMap = {
        MRS: 'Mme.',
        MR: 'M.',
    };
    static toString(type: Courtesy) {
        return CourtesyTypeMap.stringMap[type];
    }
}

export class DependentPersonTypeMap {
    private static stringMap = {
        MOTHER: 'Mère',
        FATHER: 'Père',
        OTHER: 'Non ascendant'
    };
    static toString(type: DependentPerson.TypeEnum) {
        return DependentPersonTypeMap.stringMap[type];
    }
}


export class RevenueTypeMap {
    private static stringMap = {
        SALARY: 'Salaire',
        DIVIDENDS: 'Dividendes',
        BONUS: 'Prime ou bonus',
        FRENCH_PARTICIPATION: 'Participation',
        PROFESSIONAL_PROFITS_BIC_BNC_BA: 'Bénéfice professionnels (BIC, BNC, BA)',
        RENTAL_INCOMES: 'Revenus locatifs',
        MAINTENANCE: 'Pension alimentaire',
        FAMILY_ALLOWANCE: 'Allocations familliales',
        OTHER_ALLOWANCES_LIKE_AEH_AAH_AEEH: 'Autres allocation (AEH, AEEH...)',
        APL_AL: 'APL, AL',
        SOCIAL: 'Autres revenus sociaux',
        RETIREMENT_PENSION: 'Pension de retraite',
        ANNUITY: 'Rente',
        OTHER: 'Autres revenus',
    };
    static toString(type: RevenueItem.TypeEnum) {
        return RevenueTypeMap.stringMap[type];
    }
}

export class ChargeTypeMap {
    private static stringMap = {
        RENT: 'Loyer',
        MAINTENANCE: 'Pension alimentaire',
        CONDOMINIUM_FEES: 'Charges de copropriété',
        SCHEDULED_SAVING: 'Épargne programmée',
        LOA: 'Location avec option d\'achat',
        TAX: 'Impôts ou taxes',
        OTHER: 'Autres charges financières',
    };
    static toString(type: ChargeItem.TypeEnum) {
        return ChargeTypeMap.stringMap[type];
    }
}

export const chargesTypeShortList = ['LOYER', 'PENSION', 'COPRO', 'EPARGNE', 'LOA', 'IMPOTS', 'AUTRE'];

export class ChargeTypeMapShort {
    private static stringMap = {
        RENT: chargesTypeShortList[0],
        MAINTENANCE: chargesTypeShortList[1],
        CONDOMINIUM_FEES: chargesTypeShortList[2],
        SCHEDULED_SAVING: chargesTypeShortList[3],
        LOA: chargesTypeShortList[4],
        TAX: chargesTypeShortList[5],
        OTHER: chargesTypeShortList[6],
    };
    static toString(type: ChargeItem.TypeEnum) {
        return ChargeTypeMapShort.stringMap[type];
    }
}


export class BreakupTypeMap {
    private static stringMap = {
        PLEINE_PROPRIETE: 'Pleine propriété',
        NUE_PROPRIETE: 'Nue propriété',
        USUFRUIT: 'Usufruit',
    };
    static toString(type: Breakup.TypeEnum) {
        return BreakupTypeMap.stringMap[type];
    }
}


export class RoleTypeMap {
    private static stringMap = {
        BUYER_SIDE: 'Acheteur',
        SELLER_SIDE: 'Vendeur',
        LEADER: 'Commun',
    };
    static toString(type: ActivePartner.RoleEnum) {
        return RoleTypeMap.stringMap[type];
    }
}


export class DivorceProcedureTypeMap {
    private static stringMap = {
        MUTUAL_CONSENT: 'Consentement mutuel',
        JUDICIAL_MUTUAL_CONSENT: 'Voie judiciaire',
    };
    static toString(type: FamilySituation.DivorceProcedureEnum) {
        return DivorceProcedureTypeMap.stringMap[type];
    }
}


export class HousingStatusTypeMap {
    private static stringMap = {
        HOMEOWNER: 'Consentement mutuel',
        TENANT: 'Locataire',
        FREE_OF_CHARGE_TENANT: 'Occupant à titre gratuit',
        STAFF_HOUSING: 'Logement de fonction',
        OTHER: 'Autre',
    };
    static toString(type: Housing.HousingStatusEnum) {
        return HousingStatusTypeMap.stringMap[type];
    }
}


export class ContractTypeTypeMap {
    private static stringMap = {
        CDD: 'CDD',
        CDI: 'CDI',
        CIVIL_SERVANT: 'Fonctionnaire',
        OTHER: 'Autre',
    };
    static toString(type: Employee.ContractTypeEnum) {
        return ContractTypeTypeMap.stringMap[type];
    }
}


export class SubContractTypeTypeMap {
    private static stringMap = {
        TRIAL_PERIOD: 'Période d\'essai',
        TITULAR_CIVIL_SERVANT: 'Fonctionnaire titulaire',
        CONTRACTUAL_CIVIL_SERVANT: 'Fonctionnaire contractuel',
        VACATAIRE_CIVIL_SERVANT: 'Fonctionnaire vacataire',
        INTERIM: 'Intérimaire',
        INTERN: 'Stagiaire',
    };
    static toString(type: Employee.SubContractTypeEnum) {
        return SubContractTypeTypeMap.stringMap[type];
    }
}