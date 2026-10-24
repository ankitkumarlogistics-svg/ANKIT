import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export interface ExportPdfOptions {
  elementId: string;
  filename: string;
}

export const downloadElementAsPdf = async ({
  elementId,
  filename,
}: ExportPdfOptions): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Ensure fonts are ready
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  try {
    // Render using html-to-image with skipFonts: true to prevent SecurityError on cross-origin Google Fonts stylesheets
    const dataUrl = await htmlToImage.toPng(element, {
      quality: 0.98,
      pixelRatio: 2.2,
      backgroundColor: '#ffffff',
      skipFonts: true, // Prevents reading sheet.cssRules on cross-origin fonts
      cacheBust: true,
    });

    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, 297));

    // If content spans past 1 page
    if (pdfHeight > 297) {
      let remainingHeight = pdfHeight - 297;
      let position = -297;
      while (remainingHeight > 0) {
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
        position -= 297;
        remainingHeight -= 297;
      }
    }

    const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanFilename);
  } catch (err) {
    console.error('Direct PDF rendering error, falling back to print dialog:', err);
    // If any canvas conversion fails, trigger native vector print which never fails
    window.print();
  }
};

export const printElement = (): void => {
  window.print();
};
