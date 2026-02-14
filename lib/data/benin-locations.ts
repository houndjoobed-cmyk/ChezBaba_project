// Données géographiques du Bénin

// Les 12 départements du Bénin
export const departements = [
    "Alibori",
    "Atacora",
    "Atlantique",
    "Borgou",
    "Collines",
    "Couffo",
    "Donga",
    "Littoral",
    "Mono",
    "Ouémé",
    "Plateau",
    "Zou",
];

// Villes principales du Bénin par département
export const villesBenin: Record<string, string[]> = {
    Alibori: ["Kandi", "Malanville", "Banikoara", "Karimama", "Gogounou", "Ségbana"],
    Atacora: ["Natitingou", "Tanguiéta", "Boukoumbé", "Cobly", "Kérou", "Kouandé", "Matéri", "Péhunco", "Toukountouna"],
    Atlantique: ["Abomey-Calavi", "Allada", "Kpomassè", "Ouidah", "Sô-Ava", "Toffo", "Tori-Bossito", "Zè"],
    Borgou: ["Parakou", "N'Dali", "Nikki", "Kalalé", "Pèrèrè", "Sinendé", "Tchaourou", "Bembèrèkè"],
    Collines: ["Dassa-Zoumè", "Savalou", "Glazoué", "Ouèssè", "Bantè", "Savè"],
    Couffo: ["Aplahoué", "Djakotomey", "Dogbo", "Klouékanmè", "Lalo", "Toviklin"],
    Donga: ["Djougou", "Bassila", "Copargo", "Ouaké"],
    Littoral: ["Cotonou"],
    Mono: ["Lokossa", "Athiémé", "Bopa", "Comè", "Grand-Popo", "Houéyogbé"],
    Ouémé: ["Porto-Novo", "Adjarra", "Akpro-Missérété", "Avrankou", "Bonou", "Dangbo", "Sèmè-Kpodji", "Aguégués"],
    Plateau: ["Pobè", "Adja-Ouèrè", "Ifangni", "Kétou", "Sakété"],
    Zou: ["Abomey", "Bohicon", "Agbangnizoun", "Covè", "Djidja", "Ouinhi", "Zagnanado", "Za-Kpota", "Zogbodomey"],
};

// Quartiers par ville principale
export const quartiersBenin: Record<string, string[]> = {
    // Cotonou - Littoral
    Cotonou: [
        "Akpakpa",
        "Fidjrossè",
        "Cadjèhoun",
        "Ganhi",
        "Zongo",
        "Sainte-Rita",
        "Agla",
        "Kouhounou",
        "Vedoko",
        "Gbegamey",
        "Xwlacodji",
        "Jericho",
        "Haie Vive",
        "Cocotiers",
        "Patte d'Oie",
        "Missèbo",
        "Dantokpa",
        "Vossa",
        "Mènontin",
        "Cotonou Centre",
    ],
    // Porto-Novo - Ouémé
    "Porto-Novo": [
        "Ouando",
        "Djassin",
        "Ahouanlèko",
        "Tokplegbé",
        "Houinmè",
        "Djègan-Daho",
        "Attakè",
        "Ouenlinda",
        "Lokpodji",
        "Gbèkon",
    ],
    // Parakou - Borgou
    Parakou: [
        "Banikanni",
        "Titirou",
        "Zongo",
        "Tourou",
        "Kpébié",
        "Madina",
        "Ganon",
        "Thian",
        "Albarika",
        "Guéma",
    ],
    // Abomey-Calavi - Atlantique
    "Abomey-Calavi": [
        "Godomey",
        "Akassato",
        "Hêvié",
        "Togba",
        "Ouèdo",
        "Zinvié",
        "Glo-Djigbé",
        "Kpanroun",
    ],
    // Djougou - Donga
    Djougou: [
        "Djougou Centre",
        "Baréi",
        "Kolokondé",
        "Pélébina",
        "Partago",
        "Sérou",
    ],
    // Bohicon - Zou
    Bohicon: [
        "Bohicon Centre",
        "Lissèzoun",
        "Saclo",
        "Gnidjazoun",
        "Passagon",
        "Sodohomè",
    ],
    // Ouidah - Atlantique
    Ouidah: [
        "Ouidah Centre",
        "Djègbadji",
        "Pahou",
        "Savi",
        "Avlékété",
        "Gakpé",
    ],
    // Natitingou - Atacora
    Natitingou: [
        "Natitingou Centre",
        "Kotopounga",
        "Kouaba",
        "Perma",
        "Tchoumi-Tchoumi",
    ],
    // Lokossa - Mono
    Lokossa: [
        "Lokossa Centre",
        "Houin",
        "Koudo",
        "Ouèdèmè-Adja",
        "Agamè",
    ],
    // Kandi - Alibori
    Kandi: [
        "Kandi Centre",
        "Angaradébou",
        "Bensekou",
        "Donwari",
        "Sam",
        "Sonsoro",
    ],
};

// Liste plate de tous les quartiers pour l'autocomplétion
export const tousLesQuartiers: string[] = Object.values(quartiersBenin).flat();

// Liste plate de toutes les villes pour l'autocomplétion
export const toutesLesVilles: string[] = Object.values(villesBenin).flat();

// Fonction pour obtenir les quartiers d'une ville
export function getQuartiersParVille(ville: string): string[] {
    return quartiersBenin[ville] || [];
}

// Fonction pour obtenir les villes d'un département
export function getVillesParDepartement(departement: string): string[] {
    return villesBenin[departement] || [];
}

const locationsData = {
    departements,
    villesBenin,
    quartiersBenin,
    tousLesQuartiers,
    toutesLesVilles,
    getQuartiersParVille,
    getVillesParDepartement,
};

export default locationsData;
