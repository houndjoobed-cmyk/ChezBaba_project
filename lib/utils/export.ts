import * as XLSX from "xlsx";
import { toast } from "sonner";

/**
 * Exporte un tableau d'objets (JSON) vers un fichier Excel (.xlsx) et gère le téléchargement depuis le navigateur.
 * Cette méthode est plus robuste que XLSX.writeFile() dans certains environnements Next.js/Browser.
 * 
 * @param data Tableau d'objets représentant les lignes (ex: [{ "ID": 1, "Nom": "Test" }])
 * @param sheetName Nom de la feuille dans le classeur (ex: "Commandes")
 * @param fileName Nom du fichier téléchargé sans extension (ex: "MesCommandes")
 * @param columnWidths (Optionnel) Tableau des largeurs de colonnes (ex: [10, 20, 30])
 */
export function exportToExcel(
  data: Record<string, unknown>[],
  sheetName: string,
  fileName: string,
  columnWidths?: number[]
) {
  try {
    if (!data || data.length === 0) {
      toast.error("Aucune donnée à exporter.");
      return;
    }

    // 1. Créer la feuille à partir des données JSON
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Appliquer un style sur l'en-tête (Optionnel, SheetJS version gratuite ignore souvent les styles avancés)
    const headerStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: "D3D3D3" } },
      alignment: { horizontal: "center" },
    };

    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:G1");
    // Décorer les en-têtes
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = headerStyle;
    }

    // Largeur des colonnes
    if (columnWidths && columnWidths.length > 0) {
      worksheet["!cols"] = columnWidths.map((w) => ({ wch: w }));
    }

    // 3. Créer le livre (workbook) et y attacher la feuille
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 4. Utiliser write() pour buffer au lieu de writeFile() pour éviter les fichiers vides dans le navigateur
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array", // array buffer
    });

    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    
    // 5. Créer un Blob et un lien de téléchargement natif
    const dataBlob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    const downloadUrl = window.URL.createObjectURL(dataBlob);
    
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${fileName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // Nettoyage de l'URL pour la mémoire
    window.URL.revokeObjectURL(downloadUrl);

    toast.success("Exportation réussie !");
  } catch (error) {
    console.error("Erreur lors de l'exportation Excel:", error);
    toast.error("Une erreur est survenue lors de l'exportation Excel.");
  }
}
