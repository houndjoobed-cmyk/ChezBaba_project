import { CategoryFromAPI } from "@/lib/types/category.types";

const categories: CategoryFromAPI[] = [
  {
    id: "8",
    nom: "Mode",
    description: "Vêtements, chaussures et accessoires tendance pour hommes, femmes et enfants.",
    img: "/categoriesImages/ctg-mode.jfif",
    count: 45
  },
  {
    id: "2",
    nom: "Électronique grand public",
    description: "Téléphones, gadgets et accessoires technologiques.",
    img: "/categoriesImages/ctg-electronique.jpeg",
    count: 98
  },
  {
    id: "3",
    nom: "Sports & Loisirs",
    description: "Équipements sportifs et accessoires de loisirs.",
    img: "/categoriesImages/ctg-sports.jpeg",
    count: 76
  },
  {
    id: "4",
    nom: "Produits de beauté & soins",
    description: "Produits cosmétiques et soins personnels.",
    img: "/categoriesImages/ctg-beaute.jpeg",
    count: 64
  },
  {
    id: "32",
    nom: "Véhicules & transport",
    description: "Véhicules et solutions de transport.",
    img: "/categoriesImages/ctg-vehicule.jpeg",
    count: 35
  },
  {
    id: "33",
    nom: "Agriculture, aliments & boissons",
    description: "Produits agricoles et alimentaires.",
    img: "/categoriesImages/ctg-agriculture.jfif",
    count: 50
  },
  {
    id: "6",
    nom: "Maison & Jardin",
    description: "Décoration, mobilier et équipements de jardinage.",
    img: "/categoriesImages/ctg-maisonJardin.jfif",
    count: 88
  },
  {
    id: "7",
    nom: "Chaussures & accessoires",
    description: "Chaussures, baskets, sandales et accessoires.",
    img: "/categoriesImages/ctg-chaussures.jpeg",
    count: 73
  },
  {
    id: "9",
    nom: "Emballage & impression",
    description: "Fournitures d’emballage et impression.",
    img: "/categoriesImages/ctg-emballages.jpeg",
    count: 39
  },
  {
    id: "10",
    nom: "Parents, enfants & jouets",
    description: "Produits pour enfants et jouets.",
    img: "/categoriesImages/ctg-jouets.jpeg",
    count: 67
  },
  {
    id: "11",
    nom: "Hygiène personnelle & ménage",
    description: "Produits d’entretien et hygiène domestique.",
    img: "/categoriesImages/ctg-hygiene.jpeg",
    count: 58
  },
  {
    id: "12",
    nom: "Médical & Santé",
    description: "Équipements médicaux et dispositifs de soins.",
    img: "/categoriesImages/ctg-medical.jpeg",
    count: 41
  },
  {
    id: "13",
    nom: "Cadeaux & artisanat",
    description: "Articles cadeaux et produits artisanaux.",
    img: "/categoriesImages/ctg-cadeaux.jpeg",
    count: 34
  },
  {
    id: "14",
    nom: "Animalerie",
    description: "Produits et accessoires pour animaux.",
    img: "/categoriesImages/ctg-animalerie.jpeg",
    count: 29
  },
  {
    id: "15",
    nom: "Fournitures de bureau",
    description: "Matériel et fournitures pour bureau.",
    img: "/categoriesImages/ctg-bureau.jpeg",
    count: 62
  },
  {
    id: "16",
    nom: "Machines industrielles",
    description: "Équipements industriels lourds.",
    img: "/categoriesImages/ctg-machine.jfif",
    count: 22
  },
  {
    id: "17",
    nom: "Équipements commerciaux & machines",
    description: "Machines et équipements professionnels.",
    img: "/categoriesImages/ctg-outils.jfif",
    count: 27
  },
  // {
  //   id: "18",
  //   nom: "Machines bâtiment & construction",
  //   description: "Machines pour le secteur du bâtiment.",
  //   img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800",
  //   count: 31
  // },
  {
    id: "19",
    nom: "Construction & immobilier",
    description: "Matériaux et services immobiliers.",
    img: "/categoriesImages/ctg-immobilier.jpeg",
    count: 48
  },
  {
    id: "20",
    nom: "Meubles",
    description: "Mobilier intérieur et extérieur.",
    img: "/categoriesImages/ctg-meuble.jfif",
    count: 53
  },
  // {
  //   id: "21",
  //   nom: "Lumière & éclairage",
  //   description: "Lampes et systèmes d’éclairage.",
  //   img: "https://images.unsplash.com/photo-1507477338202-487281e6c27e?auto=format&fit=crop&q=80&w=800",
  //   count: 31
  // },
  {
    id: "5",
    nom: "Bagages, sacs & étuis",
    description: "Valises, sacs et accessoires de transport.",
    img: "/categoriesImages/ctg-bagage.jfif",
    count: 52
  },
  {
    id: "22",
    nom: "Électroménager",
    description: "Appareils électroménagers domestiques.",
    img: "/categoriesImages/ctg-menager.jfif",
    count: 37
  },
  // {
  //   id: "23",
  //   nom: "Fournitures & outils auto",
  //   description: "Outils et équipements automobiles.",
  //   img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
  //   count: 44
  // },
  {
    id: "24",
    nom: "Pièces & accessoires véhicules",
    description: "Pièces détachées et accessoires auto.",
    img: "/categoriesImages/ctg-pieceAuto.jpeg",
    count: 36
  },
  // {
  //   id: "25",
  //   nom: "Bricolage & outils",
  //   description: "Outils et matériel de bricolage.",
  //   img: "https://images.unsplash.com/photo-1581147036324-c1c6c4a2a4b0?auto=format&fit=crop&q=80&w=800",
  //   count: 55
  // },
  // {
  //   id: "26",
  //   nom: "Énergies renouvelables",
  //   description: "Solutions solaires et énergies alternatives.",
  //   img: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&q=80&w=800",
  //   count: 21
  // },
  // {
  //   id: "27",
  //   nom: "Équipements & fournitures électriques",
  //   description: "Matériel et composants électriques.",
  //   img: "https://images.unsplash.com/photo-1581092918367-5f3c0c2c3d3b?auto=format&fit=crop&q=80&w=800",
  //   count: 33
  // },
  // {
  //   id: "28",
  //   nom: "Sécurité & sûreté",
  //   description: "Systèmes de surveillance et alarmes.",
  //   img: "https://images.unsplash.com/photo-1581093588401-22a6a8a2f2b2?auto=format&fit=crop&q=80&w=800",
  //   count: 26
  // },
  {
    id: "29",
    nom: "Produits digitaux",
    description: "Documents PDF, logiciels et ressources numériques téléchargeables.",
    img: "/categoriesImages/ctg-digitaux.jfif",
    count: 18
  },
  {
    id: "30",
    nom: "Instruments & Audio",
    description: "Instruments de musique et accessoires.",
    img: "/categoriesImages/ctg-instrumentsAudio.jfif",
    count: 23
  },
  {
    id: "31",
    nom: "Transmission d’énergie & composants électroniques",
    description: "Composants électroniques et transmission d’énergie.",
    img: "/categoriesImages/ctg-composantElectronique.jpeg",
    count: 40
  },

  // {
  //   id: "34",
  //   nom: "Matières premières",
  //   description: "Produits bruts destinés à la fabrication.",
  //   img: "/categoriesImages/ctg-matierePremiere.jpeg",
  //   count: 19
  // }
];

export default categories;