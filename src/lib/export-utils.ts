/**
 * Export utilities for PDF and Excel generation
 * Used across laporan, jamaah list, kloter, and other data views.
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// ─────────────────────────────── PDF ───────────────────────────────

interface PdfExportOptions {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  orientation?: 'portrait' | 'landscape';
  footerText?: string;
}

export function exportToPdf(options: PdfExportOptions): void {
  const {
    title,
    subtitle,
    headers,
    rows,
    filename,
    orientation = 'landscape',
    footerText,
  } = options;

  const doc = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  // Header bar
  doc.setFillColor(10, 62, 47); // #0A3E2F
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 22, 'F');

  // Title
  doc.setTextColor(212, 175, 55); // #D4AF37
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 10);

  // Subtitle
  if (subtitle) {
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(subtitle, 14, 17);
  }

  // Timestamp
  const now = new Date();
  const timestamp = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jayapura',
  }) + ' WIT';
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text(`Dicetak: ${timestamp}`, doc.internal.pageSize.getWidth() - 14, 10, { align: 'right' });

  // Table
  autoTable(doc, {
    startY: 28,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [10, 62, 47],
      textColor: [212, 175, 55],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 30, 30],
      cellPadding: 2.5,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.25,
    },
    margin: { left: 10, right: 10 },
    didDrawPage: (data: any) => {
      // Footer on every page
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(
        footerText || 'SIAP HAJI PAPUA — Sistem Informasi Administrasi & Pelayanan Haji Provinsi Papua',
        14,
        pageHeight - 8,
      );
      doc.text(
        `Halaman ${data.pageNumber}`,
        doc.internal.pageSize.getWidth() - 14,
        pageHeight - 8,
        { align: 'right' },
      );
    },
  });

  doc.save(`${filename}.pdf`);
}

// ─────────────────────────────── EXCEL ───────────────────────────────

interface ExcelExportOptions {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  sheetName?: string;
}

export function exportToExcel(options: ExcelExportOptions): void {
  const { title, headers, rows, filename, sheetName = 'Data' } = options;

  // Build the data with a title row
  const wsData = [
    [title],
    [`Diekspor: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jayapura' })} WIT`],
    [], // blank row
    headers,
    ...rows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Column widths based on max content length
  const colWidths = headers.map((h, i) => {
    const maxContentLen = Math.max(
      h.length,
      ...rows.map((r) => String(r[i] ?? '').length),
    );
    return { wch: Math.min(Math.max(maxContentLen + 2, 10), 50) };
  });
  ws['!cols'] = colWidths;

  // Merge title row across all columns
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

// ─────────────────────────────── PRINT ───────────────────────────────

export function printPage(): void {
  window.print();
}
