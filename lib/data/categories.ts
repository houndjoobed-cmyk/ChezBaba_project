import { CategoryFromAPI } from "@/lib/types/category.types";

const categories: CategoryFromAPI[] = [
  {
    id: "1",
    nom: "Vêtements & Accessoires",
    description: "Trouvez les dernières tendances en mode et prêt-à-porter.",
  },
  {
    id: "2",
    nom: "Chaussures & accessoires",
    description: "Baskets, bottes, sandales et accessoires assortis.",
  },
  {
    id: "3",
    nom: "Livres & Média",
    description: "Littérature, éducation, musique et contenus multimédias.",
  },
  {
    id: "4",
    nom: "Produits digitaux",
    description: "Logiciels, abonnements, e-books et biens virtuels.",
  },
  {
    id: "5",
    nom: "Électronique grand public",
    description: "Téléphones, ordinateurs, gadgets et accessoires tech.",
  },
  {
    id: "6",
    nom: "Maison & Jardin",
    description: "Décoration, mobilier, jardinage et ameublement.",
  },
  {
    id: "7",
    nom: "Autres",
    description: "Découvrez toutes nos autres catégories disponibles.",
  },
];

export default categories;
