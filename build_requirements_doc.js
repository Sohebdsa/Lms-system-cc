const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
} = require('docx');

// --- Color Palette: Deep Navy, Teal, Slate, Subtle Accents ---
const C_NAVY = '0F2038';       // Primary brand dark navy
const C_TEAL = '0D9488';       // Primary brand teal
const C_CORAL = 'FF4E29';      // Subtle warm coral / accent
const C_GOLD = 'D97706';       // Amber / gold highlight
const C_TEXT_DARK = '1E293B';  // Body text dark slate
const C_TEXT_MUTED = '64748B'; // Muted text slate
const C_BG_LIGHT = 'F8FAFC';   // Table alternate row / box light
const C_BG_CALLOUT = 'F0FDFA'; // Teal-tinted callout background
const C_BORDER = 'CBD5E1';     // Subtle table border
const C_WHITE = 'FFFFFF';

// --- Border Styles ---
const borderNone = { style: BorderStyle.NONE, size: 0, color: 'auto' };
const borderSubtle = { style: BorderStyle.SINGLE, size: 4, color: C_BORDER };
const borderTealThick = { style: BorderStyle.SINGLE, size: 24, color: C_TEAL };

const tableBorders = {
  top: borderSubtle,
  bottom: borderSubtle,
  left: borderSubtle,
  right: borderSubtle,
  insideHorizontal: borderSubtle,
  insideVertical: borderSubtle,
};

const cellMargins = { top: 120, bottom: 120, left: 160, right: 160 };

// --- Helper Functions for Document Elements ---

function makeHeading1(text, pageBreakBefore = false) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore,
    spacing: { before: pageBreakBefore ? 0 : 360, after: 140 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28, // 14pt
        color: C_NAVY,
        font: 'Calibri',
      }),
    ],
  });
}

function makeHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24, // 12pt
        color: C_TEAL,
        font: 'Calibri',
      }),
    ],
  });
}

function makeHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 21, // 10.5pt
        color: C_NAVY,
        font: 'Calibri',
      }),
    ],
  });
}

function makeParagraph(text, options = {}) {
  const { bold = false, italics = false, color = C_TEXT_DARK, size = 21, spacingAfter = 120 } = options;
  return new Paragraph({
    spacing: { after: spacingAfter, line: 276 },
    children: [
      new TextRun({
        text,
        bold,
        italics,
        color,
        size,
        font: 'Calibri',
      }),
    ],
  });
}

function makeLeadParagraph(text) {
  return new Paragraph({
    spacing: { after: 160, line: 288 },
    children: [
      new TextRun({
        text,
        size: 22,
        color: C_TEXT_DARK,
        font: 'Calibri',
      }),
    ],
  });
}

function makeBullet(boldPrefix, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80, line: 260 },
    children: [
      new TextRun({
        text: boldPrefix ? `${boldPrefix}: ` : '',
        bold: true,
        color: C_NAVY,
        size: 20,
        font: 'Calibri',
      }),
      new TextRun({
        text,
        color: C_TEXT_DARK,
        size: 20,
        font: 'Calibri',
      }),
    ],
  });
}

function makeSubBullet(text) {
  return new Paragraph({
    bullet: { level: 1 },
    spacing: { after: 60, line: 240 },
    children: [
      new TextRun({
        text,
        color: C_TEXT_DARK,
        size: 19,
        font: 'Calibri',
      }),
    ],
  });
}

function makeCallout(title, body) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: borderNone,
      bottom: borderNone,
      left: borderTealThick,
      right: borderNone,
      insideHorizontal: borderNone,
      insideVertical: borderNone,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: C_BG_CALLOUT, type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 200, right: 180 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 21,
                    color: C_TEAL,
                    font: 'Calibri',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 0, line: 260 },
                children: [
                  new TextRun({
                    text: body,
                    size: 20,
                    color: C_TEXT_DARK,
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function makeClientResponseBox(promptText, lines = 4) {
  const contentParagraphs = [
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `[ CLIENT RESPONSE REQUIRED: ${promptText} ]`,
          bold: true,
          size: 19,
          color: C_CORAL,
          font: 'Calibri',
        }),
      ],
    }),
  ];

  for (let i = 0; i < lines; i++) {
    contentParagraphs.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: '....................................................................................................................................................................................',
            color: '94A3B8',
            size: 18,
            font: 'Calibri',
          }),
        ],
      })
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: borderSubtle,
      bottom: borderSubtle,
      left: { style: BorderStyle.SINGLE, size: 16, color: C_CORAL },
      right: borderSubtle,
      insideHorizontal: borderNone,
      insideVertical: borderNone,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: 'FFFBF7', type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            children: contentParagraphs,
          }),
        ],
      }),
    ],
  });
}

function makeTableHeader(cells) {
  return new TableRow({
    tableHeader: true,
    cantSplit: true,
    children: cells.map((cell) => new TableCell({
      width: { size: cell.widthPct, type: WidthType.PERCENTAGE },
      shading: { fill: C_NAVY, type: ShadingType.CLEAR },
      margins: cellMargins,
      borders: tableBorders,
      children: [
        new Paragraph({
          alignment: cell.alignment || AlignmentType.LEFT,
          spacing: { after: 0 },
          children: [
            new TextRun({
              text: cell.text,
              bold: true,
              size: 19,
              color: C_WHITE,
              font: 'Calibri',
            }),
          ],
        }),
      ],
    })),
  });
}

function makeTableRow(cells, isAlt = false) {
  return new TableRow({
    cantSplit: true,
    children: cells.map((cell) => new TableCell({
      width: { size: cell.widthPct, type: WidthType.PERCENTAGE },
      shading: { fill: isAlt ? C_BG_LIGHT : C_WHITE, type: ShadingType.CLEAR },
      margins: cellMargins,
      borders: tableBorders,
      children: [
        new Paragraph({
          alignment: cell.alignment || AlignmentType.LEFT,
          spacing: { after: 0, line: 240 },
          children: [
            new TextRun({
              text: cell.text || '',
              bold: cell.bold || false,
              italics: cell.italics || false,
              size: 18,
              color: cell.color || C_TEXT_DARK,
              font: 'Calibri',
            }),
          ],
        }),
      ],
    })),
  });
}

console.log('Building document components...');
