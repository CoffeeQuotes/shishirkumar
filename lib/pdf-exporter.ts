// lib/pdf-export.ts

import { jsPDF, TextOptionsLight } from "jspdf";

// --- Main Export Function ---
/**
 * Exports cheatsheet data to a PDF document using jsPDF directly.
 * @param {Array<any>} cheatsheetData - The cheatsheet data array.
 * @returns {Promise<void>} - Resolves when PDF is saved, rejects on error.
 */
export const exportCheatsheetToPdf = async (cheatsheetData: Array<any>): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Use setTimeout to yield to main thread
      setTimeout(() => {
        try {
            const doc = createPdfDocument();
            const dimensions = getPdfDimensions(doc);
            const fonts = configureFonts();
            const colors = configurePdfColors(); // Define colors once

            // Call the main rendering function
            renderPdfContent(doc, cheatsheetData, { ...dimensions, fonts, colors });

            // **** FIX: Pass 'colors' to addPageNumbers ****
            addPageNumbers(doc, dimensions.pageHeight, dimensions.pageWidth, dimensions.margin, colors);

            // Save the document
            const date = new Date().toISOString().split('T')[0];
            doc.save(`tech-cheatsheet-data-${date}.pdf`);

            resolve(); // Resolve the promise successfully

        } catch (renderError) {
             console.error("Error during PDF rendering or saving:", renderError);
             reject(renderError);
        }
      }, 0);
    } catch (setupError) {
      console.error("Error during PDF generation setup:", setupError);
      reject(setupError);
    }
  });
};


// === Helper Functions ===

// --- Document & Dimension Setup ---

function createPdfDocument(): jsPDF {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
  });
}

function getPdfDimensions(doc: jsPDF) {
  return {
    pageHeight: doc.internal.pageSize.getHeight(),
    pageWidth: doc.internal.pageSize.getWidth(),
    margin: 15,
  };
}

// --- Configuration ---

function configureFonts() {
  // same as before
  return {
    FONT_NORMAL: 'helvetica',
    FONT_BOLD: 'helvetica',
    FONT_ITALIC: 'helvetica',
    FONT_CODE: 'courier',
    SIZE_H1: 16,
    SIZE_H2: 14,
    SIZE_H3: 12,
    SIZE_NORMAL: 10.5,
    SIZE_CODE: 9.5,
    SIZE_NOTE: 10,
    LINE_HEIGHT_FACTOR: 1.15,
    PT_TO_MM: 0.352778,
  };
}

function configurePdfColors() {
  // same as before
  return {
    TEXT_PRIMARY: '#111827',
    TEXT_SECONDARY: '#4b5563',
    TEXT_NOTE: '#6b7280',
    TEXT_CODE: '#1f2937',
    BG_CODE: '#f8f8f8',
    BORDER_CODE: '#e5e7eb',
    BLACK: '#000000',
    GREY_SEPARATOR: '#cccccc',
    GREY_PAGE_NUMBER: '#999999', // Color for page numbers
  };
}

// --- Content Rendering Engine ---

function renderPdfContent(
  doc: jsPDF,
  cheatsheetData: Array<any>,
  config: {
    pageHeight: number;
    pageWidth: number;
    margin: number;
    fonts: ReturnType<typeof configureFonts>;
    colors: ReturnType<typeof configurePdfColors>;
  }
) {
  // Destructure config
  const { pageHeight, pageWidth, margin, fonts, colors } = config;
  let currentY = margin;
  const maxLineWidth = pageWidth - margin * 2;
  const defaultLineSpacing = 2.5;

  // --- Nested Helper: Calculate text height ---
  const calculateTextHeight = (lines: string[], size: number): number => {
    if (!lines || lines.length === 0) return 0;
    return lines.length * size * fonts.LINE_HEIGHT_FACTOR * fonts.PT_TO_MM;
  };

  // --- Nested Helper: Ensure vertical space and handle page breaks ---
  const ensureSpace = (requiredHeight: number): boolean => {
    if (currentY + requiredHeight > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // --- Nested Helper: Add text block ---
  const addText = (
    text: string | string[],
    x: number,
    size: number,
    font = fonts.FONT_NORMAL,
    style: 'normal' | 'bold' | 'italic' = 'normal',
    options: TextOptionsLight = {},
    color = colors.TEXT_PRIMARY
  ) => {
    const textStr = Array.isArray(text) ? text.join('\n') : text;
    if (!textStr || textStr.trim() === '') return;

    doc.setFont(font, style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(textStr, maxLineWidth);
    const textHeight = calculateTextHeight(lines, size);
    const spaceNeeded = textHeight + (defaultLineSpacing * 0.2);

    ensureSpace(spaceNeeded);

    // Reset font/color AFTER ensureSpace
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(color);
    doc.text(lines, x, currentY, options);
    currentY += textHeight;
  };

  // --- Nested Helper: Add code block with background ---
  const addCodeBlock = (code: string) => {
     if (!code || code.trim() === '') return;
     const PADDING_V = 2;
     const PADDING_H = 3;
     doc.setFont(fonts.FONT_CODE, 'normal');
     doc.setFontSize(fonts.SIZE_CODE);
     const codeMaxWidth = maxLineWidth - (PADDING_H * 2);
     const lines = doc.splitTextToSize(code, codeMaxWidth);
     const textHeight = calculateTextHeight(lines, fonts.SIZE_CODE);
     const blockHeight = textHeight + (PADDING_V * 2);
     const spaceNeeded = blockHeight + (defaultLineSpacing * 0.5);

     ensureSpace(spaceNeeded);

     // Reset styles AFTER ensureSpace
     doc.setFillColor(colors.BG_CODE);
     doc.setDrawColor(colors.BORDER_CODE);
     doc.setFont(fonts.FONT_CODE, 'normal');
     doc.setFontSize(fonts.SIZE_CODE);
     doc.setTextColor(colors.TEXT_CODE);

     doc.rect(margin, currentY, maxLineWidth, blockHeight, 'FD');
     doc.text(lines, margin + PADDING_H, currentY + PADDING_V + (fonts.SIZE_CODE * fonts.PT_TO_MM * 0.1));
     currentY += blockHeight;
  };

  // --- Iterate through data and render ---
  cheatsheetData.forEach((tab, tabIndex) => {
    if (tabIndex > 0) {
      ensureSpace(fonts.SIZE_H1 * 2);
      currentY += defaultLineSpacing * 3;
      doc.setDrawColor(colors.GREY_SEPARATOR);
      doc.setLineWidth(0.2);
      doc.line(margin, currentY - defaultLineSpacing * 1.5, pageWidth - margin, currentY - defaultLineSpacing * 1.5);
      doc.setLineWidth(0.2);
    }
    addText(tab.title, margin, fonts.SIZE_H1, fonts.FONT_BOLD, 'bold', {}, colors.BLACK);
    currentY += defaultLineSpacing * 0.8;
    addText(tab.intro, margin, fonts.SIZE_NORMAL, fonts.FONT_ITALIC, 'italic', {}, colors.TEXT_SECONDARY);
    currentY += defaultLineSpacing * 1.5;

    tab.sections.forEach((section) => {
      ensureSpace(fonts.SIZE_H2 + defaultLineSpacing);
      currentY += defaultLineSpacing * 1.2;
      addText(section.title, margin, fonts.SIZE_H2, fonts.FONT_BOLD, 'bold', {}, colors.TEXT_PRIMARY);
      currentY += defaultLineSpacing * 0.6;

      section.items.forEach((item) => {
        ensureSpace(fonts.SIZE_H3 + defaultLineSpacing * 0.5);
        currentY += defaultLineSpacing * 0.8;
        addText(item.concept, margin, fonts.SIZE_H3, fonts.FONT_BOLD, 'bold', {}, colors.TEXT_CODE);
        currentY += defaultLineSpacing * 0.3;
        addText(item.description, margin, fonts.SIZE_NORMAL, fonts.FONT_NORMAL, 'normal', {}, colors.TEXT_PRIMARY);
        currentY += defaultLineSpacing * 0.3;
        if (item.note) {
          addText(item.note, margin, fonts.SIZE_NOTE, fonts.FONT_ITALIC, 'italic', {}, colors.TEXT_NOTE);
          currentY += defaultLineSpacing * 0.3;
        }
        addCodeBlock(item.code);
        currentY += defaultLineSpacing * 1.2;
      });
       currentY += defaultLineSpacing * 0.5;
    });
     currentY += defaultLineSpacing;
  });
} // End of renderPdfContent


// --- Add Page Numbers ---
// **** FIX: Add 'colors' parameter ****
function addPageNumbers(
    doc: jsPDF,
    pageHeight: number,
    pageWidth: number,
    margin: number,
    colors: ReturnType<typeof configurePdfColors> // <-- Added parameter
) {
  const totalPages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i); // Activate page i
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    // **** FIX: Access color via the passed 'colors' object ****
    doc.setTextColor(colors.GREY_PAGE_NUMBER);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - (margin / 2) + 3,
      { align: 'center' }
    );
  }
}