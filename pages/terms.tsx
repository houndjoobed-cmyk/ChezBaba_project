import React from "react";

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Conditions d&apos;Utilisation</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Acceptation des conditions</h2>
        <p>
          Bienvenue sur ChezBaba ! En utilisant notre plateforme, vous acceptez d&apos;être lié par les présentes conditions générales d&apos;utilisation. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser nos services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Conditions générales</h2>
        <h3 className="text-xl font-medium mb-2">Obligations des utilisateurs</h3>
        <ul className="list-disc pl-6">
          <li>Fournir des informations exactes et à jour lors de l&apos;inscription.</li>
          <li>Respecter les droits de propriété intellectuelle d&apos;autrui.</li>
          <li>Ne pas utiliser la plateforme à des fins illégales ou frauduleuses.</li>
          <li>Maintenir la confidentialité de vos identifiants de connexion.</li>
          <li>Respecter les autres utilisateurs et ne pas harceler ou intimider.</li>
        </ul>

        <h3 className="text-xl font-medium mb-2">Obligations des vendeurs</h3>
        <ul className="list-disc pl-6">
          <li>Décrire avec précision les produits proposés à la vente.</li>
          <li>Respecter les délais de livraison annoncés.</li>
          <li>Fournir des produits conformes à leur description.</li>
          <li>Traiter les réclamations des acheteurs de bonne foi.</li>
          <li>Respecter les lois et réglementations en vigueur.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Activités interdites</h2>
        <p>Les activités suivantes sont strictement interdites sur la plateforme ChezBaba :</p>
        <ul className="list-disc pl-6">
          <li>Vendre des produits illégaux ou contrefaits.</li>
          <li>Publier des informations fausses ou trompeuses.</li>
          <li>Harceler, intimider ou menacer d&apos;autres utilisateurs.</li>
          <li>Utiliser des programmes automatisés pour accéder à la plateforme.</li>
          <li>Contourner les mesures de sécurité de la plateforme.</li>
          <li>Diffuser des virus ou autres programmes malveillants.</li>
          <li>Violer les droits de propriété intellectuelle d&apos;autrui.</li>
          <li>Utiliser la plateforme pour des activités frauduleuses.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Limitation de responsabilité</h2>
        <p>
          ChezBaba n&apos;est pas responsable des litiges entre acheteurs et vendeurs, dans les limites autorisées par la loi. Nous ne garantissons pas l&apos;exactitude des informations fournies par les vendeurs ni la qualité des produits.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Résiliation</h2>
        <p>
          Vous pouvez résilier votre compte à tout moment en nous contactant. ChezBaba peut résilier votre accès à la plateforme immédiatement en cas de violation grave des conditions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Droit applicable et juridiction</h2>
        <p>
          Les présentes conditions sont régies par le droit ivoirien. Tout litige relatif à l&apos;utilisation de la plateforme ChezBaba sera soumis à la compétence exclusive des tribunaux ivoiriens.
        </p>
      </section>
    </div>
  );
};

export default TermsPage;