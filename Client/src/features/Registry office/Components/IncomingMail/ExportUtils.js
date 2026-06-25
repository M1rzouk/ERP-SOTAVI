import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Export vers PDF
export const exportToPDF = (courriers, title = 'Courrier Entrant') => {
  const doc = new jsPDF('landscape');
  
  // Titre
  doc.setFontSize(18);
  doc.setTextColor(255, 193, 7);
  doc.text(title, 14, 20);
  
  // Date d'export
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
  
  // Préparer les données pour le tableau
  const tableData = courriers.map(c => [
    c.id,
    c.date,
    c.expediteur,
    c.sujet,
    c.assigneA,
    c.statut,
  ]);
  
  // Tableau
  autoTable(doc, {
    startY: 35,
    head: [['N°', 'DATE', 'EXPÉDITEUR', 'SUJET', 'ASSIGNÉ À', 'STATUT']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [255, 193, 7],
      textColor: [26, 26, 26],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [255, 249, 196] },
    margin: { top: 35, left: 14, right: 14 },
  });
  
  doc.save(`courrier_entrant_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export vers Excel
export const exportToExcel = (courriers) => {
  const data = courriers.map(c => ({
    'N°': c.id,
    'DATE': c.date,
    'EXPÉDITEUR': c.expediteur,
    'SUJET': c.sujet,
    'ASSIGNÉ À': c.assigneA,
    'STATUT': c.statut,
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Courrier Entrant');
  XLSX.writeFile(wb, `courrier_entrant_${new Date().toISOString().split('T')[0]}.xlsx`);
};