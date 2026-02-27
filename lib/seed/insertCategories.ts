import { prisma } from "@/lib/utils/prisma";

// Création des catégories
async function insertCategories() {


  // 1. Nettoyer les catégories existantes (optionnel mais recommandé pour éviter les doublons/conflits)
  // Attention : cela peut échouer s'il y a des produits liés. Idéalement, on le fait sur une base vide ou après clean-content.
  console.log("Suppression des anciennes catégories...");
  try {
    await prisma.categorie.deleteMany();
  } catch (error) {
    console.warn("Impossible de supprimer toutes les catégories (peut-être liées à des produits).", error);
  }

  console.log("Insertion des nouvelles catégories...");

  // 2. Créer les Catégories Mères (et récupérer les IDs pour les sous-catégories)
  const vetements = await prisma.categorie.create({
    data: { nom: "Vêtements & Accessoires", description: "Mode, prêt-à-porter" },
  });

  const chaussures = await prisma.categorie.create({
    data: { nom: "Chaussures & accessoires", description: "Chaussures et accessoires" },
  });

  // 3. Créer les Sous-catégories pour Vêtements
  await prisma.categorie.createMany({
    data: [
      { nom: "Hauts", description: "T-shirts, chemises, pulls...", parentId: vetements.id },
      { nom: "Bas", description: "Pantalons, jeans, shorts...", parentId: vetements.id },
      { nom: "Robes & Ensembles", description: "Robes et ensembles assortis", parentId: vetements.id },
      { nom: "Vestes & Manteaux", description: "Vestes, blousons, manteaux", parentId: vetements.id },
    ],
  });

  // 4. Créer les Sous-catégories pour Chaussures & Accessoires
  await prisma.categorie.createMany({
    data: [
      { nom: "Chaussures", description: "Baskets, bottes, sandales...", parentId: chaussures.id },
      { nom: "Accessoires", description: "Sacs, ceintures, chapeaux, bijoux...", parentId: chaussures.id },
    ],
  });

  // 5. Créer toutes les autres catégories racines
  await prisma.categorie.createMany({
    data: [
      { nom: "Livres & Média", description: "Littérature, éducation, musique et contenus multimédias" },
      { nom: "Produits digitaux", description: "Logiciels, abonnements, e-books et biens virtuels" },
      { nom: "Électronique grand public", description: "Téléphones, gadgets, accessoires tech" },
      { nom: "Sports & Loisirs", description: "Équipement sportif, accessoires" },
      { nom: "Produits de beauté et soins personnels", description: null },
      { nom: "Bagages, sacs, étuis", description: null },
      { nom: "Maison & Jardin", description: "Décoration, mobilier, jardinage" },
      { nom: "Bijoux, lunettes & montres", description: null },
      { nom: "Emballage & impression", description: "Fournitures d’emballage" },
      { nom: "Parents, enfants & jouets", description: null },
      { nom: "Hygiène personnelle & ménage", description: "Produits d’entretien" },
      { nom: "Médical & Santé", description: "Équipements de soins, dispositifs" },
      { nom: "Cadeaux & artisanat", description: null },
      { nom: "Animalerie", description: "Produits pour animaux" },
      { nom: "Fournitures de bureau", description: null },
      { nom: "Machines industrielles", description: "Équipements lourds" },
      { nom: "Équipements commerciaux & machines", description: null },
      { nom: "Machines pour le bâtiment & la construction", description: null },
      { nom: "Construction & immobilier", description: null },
      { nom: "Meubles", description: null },
      { nom: "Lumière & éclairage", description: null },
      { nom: "Électroménager", description: null },
      { nom: "Fournitures & outils auto", description: null },
      { nom: "Pièces & accessoires pour véhicules", description: null },
      { nom: "Bricolage & quincaillerie", description: null },
      { nom: "Énergies renouvelables", description: null },
      { nom: "Équipements & fournitures électriques", description: null },
      { nom: "Sécurité & sûreté", description: "Systèmes de surveillance, alarmes" },
      { nom: "Manutention", description: "Équipements de levage, stockage" },
      { nom: "Instruments & équipements de test", description: "Mesure, calibration" },
      { nom: "Transmission d’énergie et composants électroniques", description: null },
      { nom: "Véhicules & transport", description: null },
      { nom: "Agriculture, aliments & boissons", description: "Produits alimentaires, matières agricoles" },
      { nom: "Matières premières", description: "Produits bruts pour fabrication" },
    ],
  });

  console.log("Catégories hiérarchiques ajoutées !");
}

export default insertCategories;
