import { prisma } from "@/lib/utils/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

// Helper function to generate random dates in the past
function getPastDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date;
}

// Création des utilisateurs
async function insertUsers() {
  const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD!, 10);

  // Création du client 0
  try {
    await prisma.user.create({
      data: {
        nom: "Adjovi",
        prenom: "Koffi",
        email: "client@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000001",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Boulevard de la Marina",
            ville: "Cotonou",
            quartier: "Ganhi",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client@email.com existe déjà.");
  }

  // Création d'un client 1
  try {
    await prisma.user.create({
      data: {
        nom: "Houssou",
        prenom: "Aminou",
        email: "client1@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000002",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Rue du Commerce",
            ville: "Cotonou",
            quartier: "Akpakpa",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client1@email.com existe déjà.");
  }

  // Création du client 2
  try {
    await prisma.user.create({
      data: {
        nom: "Dossou",
        prenom: "Marie",
        email: "client2@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000003",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Avenue Jean-Paul II",
            ville: "Cotonou",
            quartier: "Cadjèhoun",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client2@email.com existe déjà.");
  }

  // Création d'un client 3
  try {
    await prisma.user.create({
      data: {
        nom: "Ahounou",
        prenom: "Codjo",
        email: "client3@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000004",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Rue des Cocotiers",
            ville: "Cotonou",
            quartier: "Fidjrossè",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client3@email.com existe déjà.");
  }

  // Création d'un client 4
  try {
    await prisma.user.create({
      data: {
        nom: "Agbossou",
        prenom: "Victoire",
        email: "client4@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000005",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Boulevard Saint-Michel",
            ville: "Cotonou",
            quartier: "Haie Vive",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client4@email.com existe déjà.");
  }

  // Création d'un client 5
  try {
    await prisma.user.create({
      data: {
        nom: "Gbaguidi",
        prenom: "Pascal",
        email: "client5@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000006",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Rue du Palais",
            ville: "Porto-Novo",
            quartier: "Ouando",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client5@email.com existe déjà.");
  }

  // Création d'un client 6
  try {
    await prisma.user.create({
      data: {
        nom: "Sodji",
        prenom: "Gérard",
        email: "client6@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000007",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Avenue de la Liberté",
            ville: "Parakou",
            quartier: "Banikanni",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client6@email.com existe déjà.");
  }

  // Création d'un client 7
  try {
    await prisma.user.create({
      data: {
        nom: "Tohoungba",
        prenom: "Félicienne",
        email: "client7@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000008",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Rue du Marché",
            ville: "Abomey-Calavi",
            quartier: "Godomey",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client7@email.com existe déjà.");
  }

  // Création d'un client 8
  try {
    await prisma.user.create({
      data: {
        nom: "Azonhoumon",
        prenom: "Léonce",
        email: "client8@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000009",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Rue des Martyrs",
            ville: "Bohicon",
            quartier: "Bohicon Centre",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client8@email.com existe déjà.");
  }

  // Création d'un client 9
  try {
    await prisma.user.create({
      data: {
        nom: "Gbenou",
        prenom: "Aristide",
        email: "client9@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000010",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Avenue de l'Indépendance",
            ville: "Natitingou",
            quartier: "Natitingou Centre",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client9@email.com existe déjà.");
  }

  // Création d'un client 10
  try {
    await prisma.user.create({
      data: {
        nom: "Hounsokou",
        prenom: "Fabrice",
        email: "client10@email.com",
        password: hashedPassword,
        role: UserRole.CLIENT,
        emailVerifie: true,
        tel: "+22997000011",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Boulevard de la République",
            ville: "Cotonou",
            quartier: "Zongo",
            codePostal: "00229",
          },
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur client10@email.com existe déjà.");
  }

  // Création d'un vendeur
  try {
    await prisma.user.create({
      data: {
        nom: "Agbodjan",
        prenom: "Sylvain",
        email: "vendeur@email.com",
        password: hashedPassword,
        role: UserRole.VENDEUR,
        emailVerifie: true,
        tel: "+22997100001",
        imagePublicId: "clothes_mqs4nn",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Rue du Marché Dantokpa",
            ville: "Cotonou",
            quartier: "Dantokpa",
            codePostal: "00229",
          },
        },
        client: {
          create: {
            vendeur: {
              create: {
                nomBoutique: "Mode Luxe Cotonou",
                nomBanque: "BOA Bénin",
                rib: "000999554283123",
                description: `
## Mode Luxe Cotonou

**Mode Luxe Cotonou** propose une collection exclusive de vêtements et accessoires haut de gamme.

- Offre des *vêtements élégants* pour hommes, femmes et enfants
- Utilise des *matériaux de qualité supérieure* pour un confort optimal
- Designs modernes et intemporels, parfaits pour toutes les occasions
- Basée à Cotonou, avec une passion pour la mode africaine et internationale

> Découvrez des pièces uniques qui allient style et sophistication pour sublimer votre garde-robe.

**Contact** : Visitez notre boutique à Cotonou ou contactez-nous au +22997100001 pour plus d'informations.
              `,
              },
            },
          },
        },
      },
    });
  } catch {
    console.warn("Utilisateur vendeur@email.com existe déjà.");
  }

  // Création d'un vendeur 1
  try {
    await prisma.user.create({
      data: {
        nom: "Kpossou",
        prenom: "Théophile",
        email: "vendeur1@email.com",
        password: hashedPassword,
        role: UserRole.VENDEUR,
        emailVerifie: true,
        tel: "+22997100002",
        imagePublicId: "clothes_mqs4nn",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Avenue Steinmetz",
            ville: "Cotonou",
            quartier: "Ganhi",
            codePostal: "00229",
          },
        },
        client: {
          create: {
            vendeur: {
              create: {
                nomBoutique: "Marque VIP Porto-Novo",
                nomBanque: "Ecobank Bénin",
                rib: "000999554283124",
                description: `
## Marque VIP Porto-Novo

**Marque VIP Porto-Novo** propose une collection exclusive de vêtements et accessoires haut de gamme.

- Offre des *vêtements élégants* pour hommes, femmes et enfants
- Utilise des *matériaux de qualité supérieure* pour un confort optimal
- Designs modernes et intemporels, parfaits pour toutes les occasions
- Basée à Porto-Novo, avec une passion pour la mode africaine et internationale

> Découvrez des pièces uniques qui allient style et sophistication pour sublimer votre garde-robe.

**Contact** : Visitez notre boutique à Porto-Novo ou contactez-nous au +22997100002 pour plus d'informations.
              `,
              },
            },
          },
        },
      },
    });
  } catch {
    console.warn("Utilisateur vendeur1@email.com existe déjà.");
  }

  // Création d'un vendeur 2
  try {
    await prisma.user.create({
      data: {
        nom: "Dossou-Yovo",
        prenom: "Marcel",
        email: "vendeur2@email.com",
        password: hashedPassword,
        role: UserRole.VENDEUR,
        emailVerifie: true,
        tel: "+22997100003",
        imagePublicId: "clothes_mqs4nn",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Boulevard de France",
            ville: "Cotonou",
            quartier: "Cocotiers",
            codePostal: "00229",
          },
        },
        client: {
          create: {
            vendeur: {
              create: {
                nomBoutique: "Votre boutique en ligne",
                nomBanque: "UBA Bénin",
                rib: "000999554283125",
                description: `
## Votre boutique en ligne

**Votre boutique en ligne** propose une collection exclusive de vêtements et accessoires haut de gamme.

- Offre des *vêtements élégants* pour hommes, femmes et enfants
- Utilise des *matériaux de qualité supérieure* pour un confort optimal
- Designs modernes et intemporels, parfaits pour toutes les occasions
- Basée à Cotonou, avec une passion pour la mode africaine et internationale

> Découvrez des pièces uniques qui allient style et sophistication pour sublimer votre garde-robe.

**Contact** : Contactez-nous au +22997100003 pour plus d'informations.
              `,
              },
            },
          },
        },
      },
    });
  } catch {
    console.warn("Utilisateur vendeur2@email.com existe déjà.");
  }

  // Création d'un admin
  try {
    await prisma.user.create({
      data: {
        nom: "Sossou",
        prenom: "Emmanuel",
        email: "admin@email.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
        emailVerifie: true,
        tel: "+22997200001",
        dateCreation: getPastDate(Math.floor(Math.random() * 30)),
        adresse: {
          create: {
            rue: "Boulevard de la Marina",
            ville: "Cotonou",
            quartier: "Cadjèhoun",
            codePostal: "00229",
          },
        },
        admin: {
          create: {},
        },
        client: {
          create: {},
        },
      },
    });
  } catch {
    console.warn("Utilisateur admin@email.com existe déjà.");
  }

  console.log("prisma/seed.ts : Utilisateurs insérées avec succès (ou déjà présents) !");
}

export default insertUsers;
