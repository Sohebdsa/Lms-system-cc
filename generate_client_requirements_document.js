cls
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

// --- Color Palette: Deep Navy, Teal, Coral, Gold, Slate, Light Gray ---
const C_NAVY = '0F2038';       // Primary deep navy
const C_TEAL = '0D9488';       // Vibrant education teal
const C_CORAL = 'FF4E29';      // LMS brand warm coral
const C_GOLD = 'D97706';       // Accent gold / amber
const C_TEXT_DARK = '1E293B';  // Body text dark charcoal
const C_TEXT_MUTED = '64748B'; // Muted slate text
const C_BG_LIGHT = 'F8FAFC';   // Table alternate row / subtle light
const C_BG_CALLOUT = 'F0FDFA'; // Teal-tinted callout background
const C_BG_WARN = 'FFFBEB';    // Amber-tinted warning background
const C_BORDER = 'CBD5E1';     // Table border slate
const C_WHITE = 'FFFFFF';

// --- Border Styles ---
const borderNone = { style: BorderStyle.NONE, size: 0, color: 'auto' };
const borderSubtle = { style: BorderStyle.SINGLE, size: 4, color: C_BORDER };
const borderTealThick = { style: BorderStyle.SINGLE, size: 24, color: C_TEAL };
const borderCoralThick = { style: BorderStyle.SINGLE, size: 24, color: C_CORAL };

const tableBorders = {
  top: borderSubtle,
  bottom: borderSubtle,
  left: borderSubtle,
  right: borderSubtle,
  insideHorizontal: borderSubtle,
  insideVertical: borderSubtle,
};

const cellMargins = { top: 120, bottom: 120, left: 150, right: 150 };

// --- Reusable Document Element Helpers ---

function makeHeading1(text, pageBreakBefore = false) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore,
    spacing: { before: pageBreakBefore ? 0 : 360, after: 120 },
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
    spacing: { before: 240, after: 90 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 23, // 11.5pt
        color: C_TEAL,
        font: 'Calibri',
      }),
    ],
  });
}

function makeHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 70 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 20, // 10pt
        color: C_NAVY,
        font: 'Calibri',
      }),
    ],
  });
}

function makeParagraph(text, options = {}) {
  const { bold = false, italics = false, color = C_TEXT_DARK, size = 21, spacingAfter = 110 } = options;
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

function makeBullet(boldPrefix, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 70, line: 260 },
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
    spacing: { after: 50, line: 240 },
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

function makeCallout(title, body, isWarn = false) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: borderNone,
      bottom: borderNone,
      left: isWarn ? borderCoralThick : borderTealThick,
      right: borderNone,
      insideHorizontal: borderNone,
      insideVertical: borderNone,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            shading: { fill: isWarn ? C_BG_WARN : C_BG_CALLOUT, type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 180, right: 160 },
            children: [
              new Paragraph({
                spacing: { after: 50 },
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 21,
                    color: isWarn ? C_CORAL : C_TEAL,
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

function makeClientResponseBox(promptText, lines = 3) {
  const contentParagraphs = [
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `[ CLIENT DECISION / RESPONSE: ${promptText} ]`,
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
        spacing: { after: 70 },
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
            shading: { fill: 'FFFDF9', type: ShadingType.CLEAR },
            margins: { top: 110, bottom: 110, left: 160, right: 160 },
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
      ...(cell.widthPct ? { width: { size: `${cell.widthPct}%`, type: WidthType.PERCENTAGE } } : {}),
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
      ...(cell.widthPct ? { width: { size: `${cell.widthPct}%`, type: WidthType.PERCENTAGE } } : {}),
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

function makeCheckboxItem(text, isChecked = false) {
  return new Paragraph({
    spacing: { after: 60, line: 240 },
    children: [
      new TextRun({
        text: isChecked ? ' [X] ' : ' [   ] ',
        bold: true,
        color: isChecked ? C_TEAL : C_NAVY,
        size: 20,
        font: 'Consolas',
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

// --- Assemble Document Sections ---
const children = [];

// ==========================================
// COVER PAGE
// ==========================================
children.push(
  new Paragraph({
    spacing: { before: 800, after: 140 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'COLLECTIVE CONSCIOUSNESS',
        bold: true,
        size: 36, // 18pt
        color: C_CORAL,
        font: 'Calibri',
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 80 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'LEARNING MANAGEMENT SYSTEM (LMS)',
        bold: true,
        size: 32, // 16pt
        color: C_NAVY,
        font: 'Calibri',
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 320 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'MVP to Production — Client Content & Requirements Request',
        bold: true,
        size: 26, // 13pt
        color: C_TEAL,
        font: 'Calibri',
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 600 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'A structured technical and pedagogical requirements brief to transition the BridgEd LMS prototype into an enterprise-grade, child-safe, production-ready educational platform.',
        italics: true,
        size: 21,
        color: C_TEXT_MUTED,
        font: 'Calibri',
      }),
    ],
  }),

  // Metadata Table on Cover Page
  new Table({
    width: { size: 90, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    alignment: AlignmentType.CENTER,
    rows: [
      makeTableHeader([
        { text: 'Project Parameter', widthPct: 35 },
        { text: 'Specification / Status', widthPct: 65 },
      ]),
      makeTableRow([
        { text: 'Prepared For', widthPct: 35, bold: true },
        { text: 'Collective Consciousness Leadership Team & Educational Trustees', widthPct: 65 },
      ], false),
      makeTableRow([
        { text: 'Prepared Date', widthPct: 35, bold: true },
        { text: 'September 2026', widthPct: 65 },
      ], true),
      makeTableRow([
        { text: 'Current System State', widthPct: 35, bold: true },
        { text: 'High-Fidelity MVP Prototype (Next.js 16, React 19, Multilingual Shell, 5 Games)', widthPct: 65 },
      ], false),
      makeTableRow([
        { text: 'Objective of this Document', widthPct: 35, bold: true },
        { text: 'Formal collection of authentic curriculum data, video assets, quizzes, child safety approvals, and operational decisions', widthPct: 65 },
      ], true),
      makeTableRow([
        { text: 'Target Learners', widthPct: 35, bold: true },
        { text: 'Primary School Children in India (Grades 1–6 / Ages 4–12)', widthPct: 65 },
      ], false),
      makeTableRow([
        { text: 'Focus Languages', widthPct: 35, bold: true },
        { text: 'Kannada (ಕನ್ನಡ), Hindi (हिंदी), English', widthPct: 65 },
      ], true),
      makeTableRow([
        { text: 'Target Deployment', widthPct: 35, bold: true },
        { text: 'Bangalore & Karnataka Schools / Anganwadis / BridgEd Community Centers', widthPct: 65 },
      ], false),
    ],
  }),

  new Paragraph({
    spacing: { before: 600, after: 0 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: 'Confidential · Prepared exclusively for Collective Consciousness (collectiveconsciousness.in)',
        italics: true,
        size: 18,
        color: C_TEXT_MUTED,
        font: 'Calibri',
      }),
    ],
  })
);

// ==========================================
// SECTION 1: INTRODUCTION & PURPOSE
// ==========================================
children.push(
  makeHeading1('Section 1 — Introduction & Purpose', true),
  makeParagraph(
    'Collective Consciousness is an established Indian non-profit organisation registered under the Societies Registration Act (1860) with 80G and 12A tax exemptions, head-quartered in Bangalore, Karnataka. While the organisation already maintains its primary public website at https://collectiveconsciousness.in/, this project focuses strictly and specifically on the creation, refinement, and production rollout of its dedicated Learning Management System (LMS).'
  ),
  makeParagraph(
    'A high-fidelity Minimum Viable Product (MVP) of the LMS platform has already been designed and built in the project workspace. This MVP proves the platform\'s visual appeal, multilingual interface (Kannada, Hindi, and English), interactive browser gaming capabilities, and administrative control structure.'
  ),
  makeParagraph(
    'However, transitioning this MVP from a prototype into an enterprise-grade, child-safe, and truly impactful production learning platform requires moving beyond placeholder mock data and temporary browser storage. We must now integrate verified educational curriculum, authentic video lessons, validated formative assessments, and legally compliant child safety workflows.'
  ),
  makeCallout(
    'Core Objective of this Requirements Document',
    'This document is designed for the Collective Consciousness leadership and curriculum team to define and deliver the essential educational content, curriculum mappings, business rules, administrative workflows, and regulatory approvals needed to finalize the production LMS without making engineering assumptions.'
  ),
  makeHeading2('Key Questions Answered by this Document'),
  makeBullet('Curriculum & Pedagogy', 'What exact subjects, grades, chapters, and lessons will be published at launch?'),
  makeBullet('Digital Media Assets', 'Where will authentic high-definition video lessons, worksheets, audio voiceovers, and question banks be sourced?'),
  makeBullet('Student Workflow', 'Should students learn via an open-access model (no registration) or through personalized student/school accounts?'),
  makeBullet('Child Safety & Compliance', 'How will the platform satisfy India\'s Digital Personal Data Protection Act (DPDPA 2023) and parental consent mandates?'),
  makeBullet('Technical Infrastructure', 'What cloud hosting, video on demand (VOD) streaming engine, and database architecture should be provisioned?')
);

// ==========================================
// SECTION 2: CURRENT LMS MVP UNDERSTANDING (CODEBASE AUDIT)
// ==========================================
children.push(
  makeHeading1('Section 2 — Current LMS MVP Understanding (Codebase Audit)', true),
  makeParagraph(
    'To guarantee that this document reflects the true engineering baseline rather than hypothetical assumptions, a rigorous, line-by-line inspection of the existing workspace repository was conducted. The table below presents the exact architectural findings, current functional state, and the necessary client decisions required.'
  ),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'Area / Subsystem', widthPct: 18 },
        { text: 'Current MVP Codebase Functionality', widthPct: 32 },
        { text: 'Technical Implementation Reality', widthPct: 22 },
        { text: 'Status in Repository', widthPct: 13 },
        { text: 'Client Decision / Content Required', widthPct: 15 },
      ]),
      makeTableRow([
        { text: 'Frontend Tech & UI Architecture', bold: true },
        { text: 'Next.js 16.3.4 (App Router), React 19, Tailwind CSS v4, Motion, Phosphor Icons, Three.js 3D Earth scene.' },
        { text: 'Modern responsive client shell; high performance on desktop; WebGL hero canvas.' },
        { text: 'Implemented', bold: true, color: '15803D' },
        { text: 'Confirm target student devices (low-end Android mobile vs classroom smart TV).' },
      ], false),
      makeTableRow([
        { text: 'Backend & Data Persistence', bold: true },
        { text: 'No backend API routes (src/app/api is empty); no database (PostgreSQL, Supabase, Prisma) installed.' },
        { text: 'All data stored in browser localStorage ("bridged_videos_v1") or static JS arrays.' },
        { text: 'Critical Blocker (Technical)', bold: true, color: 'DC2626' },
        { text: 'Approve cloud database provisioning (Supabase / AWS RDS PostgreSQL).' },
      ], true),
      makeTableRow([
        { text: 'Admin Authentication', bold: true },
        { text: 'Admin login page (/admin/login) accepts hardcoded credentials (admin@bridged.in / bridged2026).' },
        { text: 'Writes mock token to localStorage; no server session, HttpOnly cookie, or bcrypt hashing.' },
        { text: 'Placeholder / Insecure', bold: true, color: 'D97706' },
        { text: 'Provide official admin email addresses and specify multi-admin access needs.' },
      ], false),
      makeTableRow([
        { text: 'Student Authentication & Accounts', bold: true },
        { text: 'No student login, sign-up, profile screen, or student role exists in the codebase.' },
        { text: 'Platform currently operates as an open-access public catalog with zero login.' },
        { text: 'Not Found in Codebase', bold: true, color: '64748B' },
        { text: 'Decide: Maintain 100% open access vs Student/Classroom accounts for tracking.' },
      ], true),
      makeTableRow([
        { text: 'Student Dashboard', bold: true },
        { text: 'No student dashboard exists; learners browse flat lists at /videos and /games.' },
        { text: 'No "Continue Watching", "My Enrolled Courses", or progress bookmarks.' },
        { text: 'Not Found in Codebase', bold: true, color: '64748B' },
        { text: 'Confirm whether a personalized student dashboard is required for launch.' },
      ], false),
      makeTableRow([
        { text: 'Course & Curriculum Hierarchy', bold: true },
        { text: 'No Course or Lesson model exists. Videos and Games exist only as flat standalone entities.' },
        { text: 'Metadata has basic Grade (1–6) and Subject tags, but no multi-lesson syllabus structure.' },
        { text: 'Partially Implemented', bold: true, color: 'D97706' },
        { text: 'Provide structured course syllabus (Subjects -> Chapters -> Sequential Lessons).' },
      ], true),
      makeTableRow([
        { text: 'Educational Video Player', bold: true },
        { text: 'Custom React HTML5 video player (/videos/[id]) with play/pause, seek bar, fullscreen.' },
        { text: '12 mock videos pointing to sample MP4 on w3schools.com and Lorem Picsum thumbnails.' },
        { text: 'Partially Implemented', bold: true, color: 'D97706' },
        { text: 'Provide authentic video files and approve cloud video streaming service (Cloudflare Stream/Mux).' },
      ], false),
      makeTableRow([
        { text: 'Interactive Learning Games', bold: true },
        { text: '5 playable browser games: Picture Puzzle, Word Matching, Fruit Counter, Color Sort, Letter Scramble.' },
        { text: 'Built with React state & Framer Motion; features multilingual pairs (EN/HI/KN).' },
        { text: 'Implemented (Demo)', bold: true, color: '15803D' },
        { text: 'Review games for grade alignment; provide additional words/concepts to populate.' },
      ], true),
      makeTableRow([
        { text: 'Quizzes & Formal Assessments', bold: true },
        { text: 'No quiz or assessment engine exists. Only game completion screens calculate score.' },
        { text: 'No MCQ questions, scoring engine, attempt limits, or answer keys.' },
        { text: 'Not Found in Codebase', bold: true, color: '64748B' },
        { text: 'Provide question banks, passing marks, and confirm if quizzes are required in v1.' },
      ], false),
      makeTableRow([
        { text: 'Student Progress Tracking', bold: true },
        { text: 'No student progress or score persistence exists. Video completion only sets local state.' },
        { text: 'Scores and watched seconds disappear when browser tab is closed.' },
        { text: 'Not Found in Codebase', bold: true, color: '64748B' },
        { text: 'Confirm tracking requirements (aggregate anonymous vs individual student records).' },
      ], true),
      makeTableRow([
        { text: 'Certificates & Badges', bold: true },
        { text: 'No certificate generation, PDF download, or credential verification in codebase.' },
        { text: 'Games display a celebratory Trophy banner upon completion.' },
        { text: 'Not Found in Codebase', bold: true, color: '64748B' },
        { text: 'Decide if digital completion certificates are required for students or teachers.' },
      ], false),
      makeTableRow([
        { text: 'Admin Console & CRUD', bold: true },
        { text: 'Admin portal has 3 screens: Platform Overview, Video Management, and Analytics.' },
        { text: 'Add/Edit/Delete videos modifies browser localStorage; accepts text URLs only.' },
        { text: 'Partially Implemented', bold: true, color: 'D97706' },
        { text: 'Define admin user roles and workflow for managing courses and publishing.' },
      ], true),
      makeTableRow([
        { text: 'Analytics & Reporting', bold: true },
        { text: 'Displays total views, game plays, watch time, and language breakdown; exports CSV.' },
        { text: 'All analytics metrics are static hardcoded numbers in src/lib/data.ts.' },
        { text: 'Placeholder / Mock', bold: true, color: 'D97706' },
        { text: 'Specify operational KPI reports needed for donors, trustees, and partner schools.' },
      ], false),
      makeTableRow([
        { text: 'Multilingual Support', bold: true },
        { text: 'LanguageContext supports Kannada (ಕನ್ನಡ), Hindi (हिंदी), English switcher in header.' },
        { text: 'UI strings and video titles have 3-language translations stored in memory.' },
        { text: 'Implemented', bold: true, color: '15803D' },
        { text: 'Approve official educational terminology and translation glossaries.' },
      ], true),
      makeTableRow([
        { text: 'Study Materials & PDFs', bold: true },
        { text: 'No PDF viewer, downloadable worksheets, or document storage in codebase.' },
        { text: 'Current platform supports only video playback and interactive HTML games.' },
        { text: 'Not Found in Codebase', bold: true, color: '64748B' },
        { text: 'Confirm if printable worksheets or student guides should accompany lessons.' },
      ], false),
      makeTableRow([
        { text: 'Teacher / Facilitator Role', bold: true },
        { text: 'No teacher role, classroom dashboard, or cohort assignment exists.' },
        { text: 'The codebase only distinguishes between general public visitors and Admin.' },
        { text: 'Not Found in Codebase', bold: true, color: '64748B' },
        { text: 'Clarify whether classroom teachers or Anganwadi workers need special tools.' },
      ], true),
      makeTableRow([
        { text: 'Child Safety & Data Privacy', bold: true },
        { text: 'No privacy policy, terms, parental consent form, or DPDPA 2023 compliance docs.' },
        { text: 'Zero tracking currently occurs because no student data is collected or stored.' },
        { text: 'Requires Legal Review', bold: true, color: 'DC2626' },
        { text: 'Approve Child Safeguarding Policy, Kid-Safe Privacy Notice, and DPDPA consent.' },
      ], false),
    ],
  })
);

// ==========================================
// SECTION 3: LMS VISION & LEARNING OBJECTIVES
// ==========================================
children.push(
  makeHeading1('Section 3 — LMS Vision & Learning Objectives', true),
  makeParagraph(
    'To ensure the platform architecture aligns with Collective Consciousness\'s strategic mission, please provide the institutional vision, target beneficiary profiles, and measurable success criteria for the LMS.'
  ),
  makeHeading2('3.1 Platform Identity & Core Mission'),
  makeClientResponseBox('Official LMS Platform Name (e.g., BridgEd LMS, Collective Consciousness Digital Academy, or other)', 2),
  new Paragraph({ spacing: { after: 100 } }),
  makeClientResponseBox('Core Problem Solved (e.g., post-pandemic learning loss, lack of quality Kannada digital resources, foundational numeracy)', 3),
  new Paragraph({ spacing: { after: 100 } }),
  makeClientResponseBox('Initiative Scope: Is this LMS dedicated exclusively to the "BridgEd" program, or will it serve other CC initiatives (e.g., teacher upskilling, community health, vocational)?', 2),

  makeHeading2('3.2 Target Learners & Demographics'),
  makeParagraph('Please specify the exact age cohorts, school grades, and geographic priorities:'),
  makeCheckboxItem('Early Childhood / Foundational Stage (Ages 4–6 / Anganwadi, LKG, UKG)'),
  makeCheckboxItem('Lower Primary (Ages 6–8 / Grades 1 & 2 — Focus on FLN: Foundational Literacy & Numeracy)'),
  makeCheckboxItem('Middle Primary (Ages 8–10 / Grades 3 to 5)'),
  makeCheckboxItem('Upper Primary / Middle School (Ages 11–14 / Grades 6 to 8)'),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Target Geographic Regions (e.g., Bangalore urban slums, specific rural Karnataka districts, pan-India expansion)', 2),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Primary Learning Delivery Context (e.g., individual children on parents\' mobile phones at home, teacher-projected smart classrooms in government schools, community learning pods)', 3),

  makeHeading2('3.3 Measurable Impact Goals'),
  makeClientResponseBox('Short-Term Goals (First 3–6 Months Post-Launch: Target active learners, target completed hours, partner schools enrolled)', 2),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Long-Term Vision (1–3 Years: Scaling plans, curriculum breadth, institutional partnerships)', 2)
);

// ==========================================
// SECTION 4: COURSES & CURRICULUM
// ==========================================
children.push(
  makeHeading1('Section 4 — Courses & Curriculum', true),
  makeParagraph(
    'In the current MVP prototype, educational content exists as standalone, unorganized video links and games. For production, the platform must be organized into a structured curriculum with defined courses, subjects, chapters, and sequential lessons.'
  ),
  makeHeading2('4.1 Curriculum Framework Alignment'),
  makeParagraph('Please confirm which educational guidelines and state curriculum frameworks the LMS must adhere to:'),
  makeCheckboxItem('National Education Policy (NEP 2020) — Foundational & Preparatory Stages'),
  makeCheckboxItem('National Curriculum Framework for Foundational Stage (NCF-FS)'),
  makeCheckboxItem('NIPUN Bharat Mission (National Initiative for Proficiency in Reading with Understanding and Numeracy)'),
  makeCheckboxItem('Karnataka State Board (DSERT Karnataka State Curriculum)'),
  makeCheckboxItem('NCERT Standard Curriculum Guidelines'),
  makeCheckboxItem('Other State / Alternative Frameworks (specify below)'),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Details on official curriculum mapping, textbook chapter alignment, or state syllabus references', 3),

  makeHeading2('4.2 Curriculum Hierarchy & Completion Criteria'),
  makeBullet('Recommended Hierarchy', 'Subject -> Grade / Level -> Module or Chapter -> Individual Lessons (Video + Worksheet + Quiz).'),
  makeBullet('Lesson Sequencing', 'Should lessons be unlocked strictly sequentially (must complete Lesson 1 to access Lesson 2) or open for self-paced exploration?'),
  makeBullet('Course Completion Rules', 'What triggers course completion? (e.g., 80% video watch time + passing score on chapter quiz).'),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Client Confirmation of Course Structure & Lesson Progression Logic', 2),

  makeHeading2('4.3 Initial Launch Courses (Intake Template)'),
  makeParagraph('Please outline the initial 3 to 5 courses planned for the production launch in the template below:'),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'Course Title', widthPct: 20 },
        { text: 'Subject', widthPct: 15 },
        { text: 'Target Grade / Age', widthPct: 15 },
        { text: 'Language(s)', widthPct: 15 },
        { text: 'Est. Duration', widthPct: 15 },
        { text: 'Learning Objectives & Content Owner', widthPct: 20 },
      ]),
      makeTableRow([
        { text: 'Example: Foundational Numbers & Counting' },
        { text: 'Mathematics' },
        { text: 'Grade 1 (Ages 5–6)' },
        { text: 'Kannada & English' },
        { text: '8 Lessons (~60 mins)' },
        { text: 'Master counting 1–50, number bonds, visual quantity recognition. Owner: CC Math Lead' },
      ], false),
      makeTableRow([
        { text: '[ Course 1 Name ]', bold: true },
        { text: '........................' },
        { text: '........................' },
        { text: '........................' },
        { text: '........................' },
        { text: '...................................................................................' },
      ], true),
      makeTableRow([
        { text: '[ Course 2 Name ]', bold: true },
        { text: '........................' },
        { text: '........................' },
        { text: '........................' },
        { text: '........................' },
        { text: '...................................................................................' },
      ], false),
      makeTableRow([
        { text: '[ Course 3 Name ]', bold: true },
        { text: '........................' },
        { text: '........................' },
        { text: '........................' },
        { text: '........................' },
        { text: '...................................................................................' },
      ], true),
      makeTableRow([
        { text: '[ Course 4 Name ]', bold: true },
        { text: '........................' },
        { text: '........................' },
        { text: '........................' },
        { text: '........................' },
        { text: '...................................................................................' },
      ], false),
    ],
  })
);

// ==========================================
// SECTION 5: LESSON CONTENT REQUIREMENTS
// ==========================================
children.push(
  makeHeading1('Section 5 — Lesson Content Requirements', true),
  makeParagraph(
    'Each published course consists of individual modular lessons. To build and populate these lessons within the production database, specific educational parameters, metadata, and asset references must be provided by the Collective Consciousness content team.'
  ),
  makeHeading2('5.1 Lesson Data Parameters Required'),
  makeBullet('Lesson Title & Description', 'Must be provided in English, Hindi, and Kannada for vernacular parity.'),
  makeBullet('Pedagogical Objective', 'A single concise statement of what the child will understand or be able to do.'),
  makeBullet('Primary Lesson Asset', 'Video file (.mp4), interactive game slug, audio clip, or worksheet PDF.'),
  makeBullet('Duration & Pacing', 'Estimated duration (recommended 4–8 minutes for primary school attention spans).'),
  makeBullet('Formative Assessment', 'At least 2–3 check-for-understanding questions linked to the lesson.'),
  makeBullet('Content Review & Approval', 'Sign-off from designated educator before publication.'),

  makeHeading2('5.2 Modular Lesson Intake Template'),
  makeParagraph('Please use this structured template to document lessons for pilot ingestion:'),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'Course & Chapter', widthPct: 18 },
        { text: 'Lesson Title (EN / KN)', widthPct: 22 },
        { text: 'Type', widthPct: 12 },
        { text: 'Asset File / Link', widthPct: 20 },
        { text: 'Lang', widthPct: 8 },
        { text: 'Dur.', widthPct: 8 },
        { text: 'Reviewer / Status', widthPct: 12 },
      ]),
      makeTableRow([
        { text: 'Math: Numbers / Ch.1' },
        { text: 'L1: Numbers 1 to 10 (ಸಂಖ್ಯೆಗಳು ೧-೧೦)' },
        { text: 'Video' },
        { text: 'drive.google.com/.../math_l1.mp4' },
        { text: 'KN, EN' },
        { text: '6m' },
        { text: 'Approved (Dr. Sharma)' },
      ], false),
      makeTableRow([
        { text: 'Math: Numbers / Ch.1' },
        { text: 'L2: Fruit Counter Practice' },
        { text: 'Game' },
        { text: 'Built-in: fruit-counter' },
        { text: 'All' },
        { text: '5m' },
        { text: 'Approved' },
      ], true),
      makeTableRow([
        { text: '........................' },
        { text: '........................' },
        { text: 'Video / PDF' },
        { text: '........................' },
        { text: '....' },
        { text: '....' },
        { text: 'Pending review' },
      ], false),
      makeTableRow([
        { text: '........................' },
        { text: '........................' },
        { text: 'Video / Game' },
        { text: '........................' },
        { text: '....' },
        { text: '....' },
        { text: 'Pending review' },
      ], true),
      makeTableRow([
        { text: '........................' },
        { text: '........................' },
        { text: 'Worksheet' },
        { text: '........................' },
        { text: '....' },
        { text: '....' },
        { text: 'Pending review' },
      ], false),
    ],
  }),

  makeHeading2('5.3 Content Governance & Maintenance'),
  makeClientResponseBox('Designated Content Creator(s): Who authors or scripts the lesson materials?', 2),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Designated Curriculum Reviewer(s): Who reviews content for pedagogical accuracy and age appropriateness?', 2),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Content Revision Cycle: How often should lessons be audited or updated against revised school textbooks?', 2)
);

// ==========================================
// SECTION 6: EDUCATIONAL CONTENT ASSETS
// ==========================================
children.push(
  makeHeading1('Section 6 — Educational Content Assets', true),
  makeParagraph(
    'A production LMS requires high-quality, standardized media files. Below is the master asset checklist and technical specification guidelines for materials provided by Collective Consciousness.'
  ),
  makeHeading2('6.1 Master Media Asset Checklist'),
  makeCheckboxItem('Full-Length Video Lessons (1080p or 720p, 16:9 aspect ratio, MP4 / H.264 format, clear studio audio)'),
  makeCheckboxItem('Native Language Audio Voiceovers (.mp3 / .wav at 192kbps — Kannada, Hindi, and Indian English)'),
  makeCheckboxItem('Printable Student Worksheets (.pdf — Black-and-white print-optimized A4 format for school printing)'),
  makeCheckboxItem('Question Banks & Answer Keys (Structured Excel / Google Sheet with distractors & explanations)'),
  makeCheckboxItem('Course & Lesson Thumbnails (16:9 ratio, 1280x720px, WebP or PNG format, child-friendly illustrations)'),
  makeCheckboxItem('Subtitles / Closed Captions (.vtt or .srt files in English, Kannada, and Hindi for accessibility)'),
  makeCheckboxItem('Teacher / Facilitator Activity Guides (PDF guides with classroom instructions and learning prompts)'),
  makeCheckboxItem('Digital Certificate Background Template (High-resolution printable vector or PDF format)'),

  makeHeading2('6.2 Asset Technical Standards & File Conventions'),
  makeParagraph('To ensure seamless automated ingestion into cloud storage, please adhere to these standards:'),
  makeBullet('Video Specs', 'Resolution: 1920x1080 (1080p) or 1280x720 (720p). Audio: AAC stereo, 44.1kHz. Frame rate: 24 or 30 fps.'),
  makeBullet('Naming Syntax', '[SUBJECT]_[GRADE]_[CHAPTER]_[LESSON#]_[LANG].[ext] — e.g., MATH_G1_CH01_L01_KN.mp4.'),
  makeBullet('Delivery Channel', 'Organized Google Drive or OneDrive folder shared with the development team with view/download permissions.'),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Shared Cloud Folder Link & Access Details for Asset Transfer (Google Drive / OneDrive)', 2),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Intellectual Property & Copyright Confirmation: Confirm that all provided videos, illustrations, and audio are owned by Collective Consciousness or licensed under open-access Creative Commons', 2)
);

// ==========================================
// SECTION 7: STUDENT USER EXPERIENCE
// ==========================================
children.push(
  makeHeading1('Section 7 — Student User Experience', true),
  makeParagraph(
    'A critical design decision discovered during our codebase audit is the current lack of a student registration or login mechanism. In the MVP prototype, anyone can access any video or game immediately. Moving to production requires deciding whether to keep an anonymous open-access model, introduce student accounts, or adopt a hybrid structure.'
  ),

  makeHeading2('7.1 Strategic Decision: Open Access vs. Registered Accounts'),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'Model', widthPct: 20 },
        { text: 'Key Advantages', widthPct: 35 },
        { text: 'Limitations / Trade-offs', widthPct: 35 },
        { text: 'Recommendation', widthPct: 10 },
      ]),
      makeTableRow([
        { text: 'Option A: 100% Open Access (Current Prototype)' },
        { text: 'Zero barrier to entry; no login friction; 100% compliant with India DPDPA child data laws (zero PII collected); ideal for rural classrooms.' },
        { text: 'Cannot save individual student progress; cannot resume learning across devices; cannot issue personalized certificates.' },
        { text: 'Good for v1 Public Catalog' },
      ], false),
      makeTableRow([
        { text: 'Option B: Mandatory Student Accounts' },
        { text: 'Personalized student dashboard; persistent resume learning; quiz score history; custom certificates; school cohort reports.' },
        { text: 'Requires mobile OTP or parent email; high login drop-off among rural children; strict DPDPA parental consent compliance required.' },
        { text: 'Complex for Children' },
      ], true),
      makeTableRow([
        { text: 'Option C: Hybrid "Smart Access" (Recommended)' },
        { text: 'Public catalog is free and open to browse without login; optional lightweight Student PIN / Class Code enables progress saving and certificates.' },
        { text: 'Requires building two navigation modes; minimal data collected (only nickname + class PIN, no child phone/email).' },
        { text: 'Strongly Recommended' },
      ], false),
    ],
  }),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Client Decision on Account Model (Select Option A, B, or C, and provide operational rationale)', 3),

  makeHeading2('7.2 Student Dashboard & Navigation Features'),
  makeParagraph('If student accounts or persistent session saving is selected, please confirm the desired dashboard elements:'),
  makeCheckboxItem('"Continue Learning" Banner (One-click resume to exact video timestamp or next lesson)'),
  makeCheckboxItem('My Enrolled Courses & Progress Percentage Bars'),
  makeCheckboxItem('Recent Game Achievements & High Scores'),
  makeCheckboxItem('Completed Lessons & Star Rating History'),
  makeCheckboxItem('Earned Certificates & Download Hub'),
  makeCheckboxItem('Language Preference Quick-Toggle (EN / HI / KN)'),

  makeHeading2('7.3 Gamification & Motivation Mechanics'),
  makeClientResponseBox('Gamification Elements: Should the platform feature points, stars, streaks, or audio celebration effects for completing lessons?', 2)
);

// ==========================================
// SECTION 8: ADMIN PANEL REQUIREMENTS
// ==========================================
children.push(
  makeHeading1('Section 8 — Admin Panel Requirements', true),
  makeParagraph(
    'The current MVP admin console (/admin) features three screens: Overview, Video Management, and Analytics. However, all data is stored temporarily in the administrator\'s browser localStorage. For production, the admin panel must connect to a secure cloud database and offer comprehensive management capabilities.'
  ),
  makeHeading2('8.1 Required Administrative Capabilities'),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'Admin Subsystem', widthPct: 22 },
        { text: 'Proposed Production Capability', widthPct: 48 },
        { text: 'Priority for Launch', widthPct: 15 },
        { text: 'Client Confirmation', widthPct: 15 },
      ]),
      makeTableRow([
        { text: 'User & Staff Management' },
        { text: 'Create, edit, and deactivate admin users; assign roles (Super Admin, Content Editor, School Facilitator).' },
        { text: 'Must Have (v1.0)' },
        { text: '[  ] Approved' },
      ], false),
      makeTableRow([
        { text: 'Course & Lesson Builder' },
        { text: 'Create courses, arrange chapters, drag-and-drop lesson reordering, publish/unpublish toggles, multilingual text editor.' },
        { text: 'Must Have (v1.0)' },
        { text: '[  ] Approved' },
      ], true),
      makeTableRow([
        { text: 'Cloud Media Uploader' },
        { text: 'Direct drag-and-drop file upload for MP4 videos, PDF worksheets, and thumbnail images directly to cloud storage (replacing text URL input).' },
        { text: 'Must Have (v1.0)' },
        { text: '[  ] Approved' },
      ], false),
      makeTableRow([
        { text: 'Assessment & Quiz Editor' },
        { text: 'Create quizzes, author MCQ questions, define correct answer keys, set passing marks, attach answer explanations.' },
        { text: 'Should Have (v1.1)' },
        { text: '[  ] Approved' },
      ], true),
      makeTableRow([
        { text: 'School & Partner Cohorts' },
        { text: 'Group students by partner school, community learning center, or Anganwadi; generate aggregate school performance reports.' },
        { text: 'Could Have (v2.0)' },
        { text: '[  ] Approved' },
      ], false),
      makeTableRow([
        { text: 'Live Analytics & Donor Reports' },
        { text: 'Real-time database metrics: unique learners, total hours streamed, language breakdown, drop-off rates, exportable CSV/PDF.' },
        { text: 'Must Have (v1.0)' },
        { text: '[  ] Approved' },
      ], true),
    ],
  }),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Admin Team Personnel: List the names and email addresses of CC team members who will manage the LMS', 2)
);

// ==========================================
// SECTION 9: TEACHER / CONTENT CREATOR REQUIREMENTS
// ==========================================
children.push(
  makeHeading1('Section 9 — Teacher / Content Creator Requirements', true),
  makeParagraph(
    'Our codebase audit revealed that no teacher or content creator role currently exists in the platform. We must determine whether Collective Consciousness requires an educator portal in Phase 1 or if this should be scheduled for a future release.'
  ),
  makeHeading2('9.1 Potential Teacher Workflows'),
  makeParagraph('Please confirm if any of the following educator capabilities are required:'),
  makeCheckboxItem('Classroom Presentation Mode: Dedicated UI for government school teachers to project lessons onto a smart screen or TV without student logins'),
  makeCheckboxItem('Class Cohort Tracking: Teachers viewing aggregate progress and quiz scores for their specific class or school'),
  makeCheckboxItem('Printable Material Hub: Quick bulk-download of worksheets, lesson plans, and offline activities for classroom use'),
  makeCheckboxItem('External Content Creator Uploads: Restricted portal for volunteer educators to submit draft videos for CC review'),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Client Decision: Is a dedicated Teacher / Instructor role required for the initial launch, or should teachers use the public interface?', 3)
);

// ==========================================
// SECTION 10: ASSESSMENT & CERTIFICATION
// ==========================================
children.push(
  makeHeading1('Section 10 — Assessment & Certification', true),
  makeParagraph(
    'Assessments allow educators and donors to evaluate learning efficacy. In the current prototype, only game completion screens exist. Please define the rules for formal assessments and completion certificates.'
  ),
  makeHeading2('10.1 Assessment Rules & Parameters'),
  makeBullet('Quiz Formats', 'Multiple Choice (3 or 4 options), True/False, Match the Words, Image/Picture Identification.'),
  makeBullet('Passing Threshold', 'What is the required passing percentage? (e.g., 60%, 70%, 80%).'),
  makeBullet('Attempt Limits', 'Can children retake quizzes immediately, or should question order be randomized on retakes?'),
  makeBullet('Remedial Feedback', 'Should the platform show the correct answer and a gentle explanation immediately upon a wrong choice?'),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Client Assessment Policy (Passing mark %, number of attempts permitted, question formats preferred)', 3),

  makeHeading2('10.2 Certificate Requirements & Verification'),
  makeParagraph('Please confirm if digital completion certificates are required:'),
  makeCheckboxItem('Certificates required upon completing a full course (100% lessons watched + passing quiz)'),
  makeCheckboxItem('Automated personalized PDF certificate generated with student name, course title, and completion date'),
  makeCheckboxItem('Public verification QR code / URL allowing schools or parents to verify authenticity'),
  makeCheckboxItem('Authorized digital signature of Collective Consciousness Trustee or Academic Director'),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Certificate Authorized Signatory Name & Designation (e.g., Managing Trustee / Education Director)', 2)
);

// ==========================================
// SECTION 11: LANGUAGES & ACCESSIBILITY
// ==========================================
children.push(
  makeHeading1('Section 11 — Languages & Accessibility', true),
  makeParagraph(
    'The prototype includes a functional language switcher for English, Hindi, and Kannada. For production, we must confirm language parity, translation workflows, and low-bandwidth accessibility for rural users.'
  ),
  makeHeading2('11.1 Language Scope at Launch'),
  makeBullet('Confirmed Launch Languages', 'Kannada (ಕನ್ನಡ), Hindi (हिंदी), English.'),
  makeBullet('Future Planned Languages', 'Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी), Urdu (اردو).'),
  makeBullet('Multilingual Parity Policy', 'Will every course have full 3-language video and audio versions, or will specific courses be language-exclusive?'),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Client Confirmation on Launch Languages & Translation Ownership (Who produces Kannada/Hindi translations?)', 3),

  makeHeading2('11.2 Early Childhood & Low-Bandwidth Accessibility'),
  makeParagraph('Primary school learners in rural and semi-urban India face unique digital challenges:'),
  makeCheckboxItem('Audio-First Interface: Voice prompts in Kannada/Hindi for children aged 4–7 who cannot yet read text instructions'),
  makeCheckboxItem('Adaptive Bitrate Video Streaming: Seamless playback on 2G/3G/4G networks with 240p and 360p fallback options'),
  makeCheckboxItem('Low-End Device Compatibility: Smooth performance on entry-level Android smartphones (2GB RAM) without UI lag'),
  makeCheckboxItem('Progressive Web App (PWA) Offline Caching: Allowing lessons to be cached for offline classroom playback'),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Accessibility Priorities: Confirm which accessibility features must be prioritized for launch', 2)
);

// ==========================================
// SECTION 12: CHILD SAFETY, PRIVACY & DATA REQUIREMENTS
// ==========================================
children.push(
  makeHeading1('Section 12 — Child Safety, Privacy & Data Requirements', true),
  makeParagraph(
    'Operating an educational platform serving primary school children in India is subject to strict statutory standards, primarily the Digital Personal Data Protection Act (DPDPA 2023) Section 9. Compliance must be established prior to public launch.'
  ),
  makeHeading2('12.1 India DPDPA 2023 Statutory Requirements'),
  makeBullet('Section 9 Mandate', 'Data fiduciaries processing data of children must obtain verifiable parental consent before collecting personal data.'),
  makeBullet('Prohibited Practices', 'Zero behavioral tracking, zero profiling, zero targeted advertising, and no tracking of children\'s browsing behavior.'),
  makeBullet('Recommended Compliance Architecture', 'Adopt a "Zero-PII" model where child learners never provide phone numbers, real full names, or email addresses. Students use anonymous handles/avatars or classroom group PINs.'),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Client Confirmation: Approve the Zero-PII / Anonymous Child Architecture or specify alternative parental consent flow', 3),

  makeHeading2('12.2 Child Safeguarding & Content Moderation Policy'),
  makeParagraph('Please confirm the adoption of mandatory child safety policies:'),
  makeCheckboxItem('Child Safeguarding SOP: Written protocol guaranteeing that all videos and games are non-violent, culturally inclusive, and free from adult themes'),
  makeCheckboxItem('Kid-Friendly Privacy Notice: A simple, illustrated summary reassuring children and parents that no personal photos or data are tracked'),
  makeCheckboxItem('Grievance Redressal Officer: Designated contact person published on the website for safety or data concerns as required by Indian law'),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Designated Grievance Officer Name, Email, and Phone Number for Statutory Website Publication', 2)
);

// ==========================================
// SECTION 13: NOTIFICATIONS & COMMUNICATION
// ==========================================
children.push(
  makeHeading1('Section 13 — Notifications & Communication', true),
  makeParagraph(
    'In the existing prototype, no automated notification or messaging system exists. Please determine which communication channels are required for learners, parents, or administrators.'
  ),
  makeHeading2('13.1 Communication Channels & Priorities'),
  makeCheckboxItem('WhatsApp Business Notifications (Highest open rate in India; useful for weekly learning reminders or certificates)'),
  makeCheckboxItem('Transactional SMS (Requires TRAI DLT registration in India for sender ID)'),
  makeCheckboxItem('Transactional Email (Automated emails for password resets, admin alerts, or weekly parent progress summaries)'),
  makeCheckboxItem('In-App Notification Center (Gentle on-screen banners announcing new games or courses)'),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Client Decision: Are automated notifications (WhatsApp / SMS / Email) required for v1.0, or should they be deferred to Phase 2?', 3)
);

// ==========================================
// SECTION 14: CONTENT MANAGEMENT & APPROVAL WORKFLOW
// ==========================================
children.push(
  makeHeading1('Section 14 — Content Management & Approval Workflow', true),
  makeParagraph(
    'To guarantee educational excellence and prevent unreviewed materials from reaching children, a standardized 6-stage content lifecycle is proposed.'
  ),
  makeHeading2('14.1 Proposed 6-Stage Content Lifecycle'),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'Stage', widthPct: 15 },
        { text: 'Stage Name', widthPct: 20 },
        { text: 'Activity Description', widthPct: 40 },
        { text: 'Responsible Party', widthPct: 25 },
      ]),
      makeTableRow([
        { text: 'Stage 1' },
        { text: 'Pedagogical Ideation' },
        { text: 'Define curriculum syllabus, lesson objectives, script, and activity plan.' },
        { text: 'Curriculum Specialist / Educator' },
      ], false),
      makeTableRow([
        { text: 'Stage 2' },
        { text: 'Asset Production' },
        { text: 'Record high-definition video, record vernacular voiceover, produce worksheet PDF.' },
        { text: 'Media Production Team' },
      ], true),
      makeTableRow([
        { text: 'Stage 3' },
        { text: 'Academic Review' },
        { text: 'Audit content for factual accuracy, grade appropriateness, and NEP alignment.' },
        { text: 'Pedagogical Reviewer' },
      ], false),
      makeTableRow([
        { text: 'Stage 4' },
        { text: 'Executive Approval' },
        { text: 'Formal sign-off by Collective Consciousness Academic Lead.' },
        { text: 'CC Leadership / Trustee' },
      ], true),
      makeTableRow([
        { text: 'Stage 5' },
        { text: 'Technical Staging & QA' },
        { text: 'Upload to staging server, test video streaming on 4G, verify game interaction.' },
        { text: 'LMS Technical Team' },
      ], false),
      makeTableRow([
        { text: 'Stage 6' },
        { text: 'Live Publication' },
        { text: 'Toggle lesson to Published status in production database.' },
        { text: 'LMS Platform Admin' },
      ], true),
    ],
  }),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Client Feedback on Content Workflow: Approve this 6-stage lifecycle or specify modifications', 2)
);

// ==========================================
// SECTION 15: LMS BRANDING & UI CONTENT
// ==========================================
children.push(
  makeHeading1('Section 15 — LMS Branding & UI Content', true),
  makeParagraph(
    'While the public website represents the non-profit organization as a whole, the LMS interface requires its own focused, child-friendly identity, microcopy, and visual assets.'
  ),
  makeHeading2('15.1 Brand Assets & Microcopy Needed'),
  makeBullet('LMS Official Wordmark & Logo', 'Vector SVG and transparent high-res PNG (e.g., BridgEd logo with Collective Consciousness tagline).'),
  makeBullet('App Icon / Favicon', 'High-contrast 512x512px icon optimized for browser tabs and mobile home-screen bookmarks.'),
  makeBullet('Approved Color Palette', 'Current palette: Deep Navy (#0F2038), Teal (#0D9488), Warm Coral (#FF4E29), Gold (#D97706), Soft White.'),
  makeBullet('Tone of Voice', 'Warm, playful, highly encouraging, culturally resonant with Indian schoolchildren.'),

  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Platform Tagline / Slogan (e.g., "Learn Without Limits", "Free Multilingual Education for Every Child")', 2),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Welcome Prompt for Student Learners (Displayed on the homepage hero banner)', 2)
);

// ==========================================
// SECTION 16: TECHNICAL & PRODUCTION DECISIONS
// ==========================================
children.push(
  makeHeading1('Section 16 — Technical & Production Decisions', true),
  makeParagraph(
    'To transition the codebase from a local prototype to a high-availability cloud deployment, several foundational cloud infrastructure decisions must be confirmed.'
  ),
  makeHeading2('16.1 Infrastructure & Hosting Choices'),
  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'Component', widthPct: 22 },
        { text: 'Recommended Production Solution', widthPct: 43 },
        { text: 'Alternative Option', widthPct: 20 },
        { text: 'Decision Needed', widthPct: 15 },
      ]),
      makeTableRow([
        { text: 'Production Domain' },
        { text: 'learn.collectiveconsciousness.in or bridged.in' },
        { text: 'Subfolder on main site' },
        { text: 'Confirm Domain' },
      ], false),
      makeTableRow([
        { text: 'Cloud Web Hosting' },
        { text: 'Vercel Pro (Serverless edge deployment, auto-scaling, global CDN)' },
        { text: 'AWS ECS / Amplify' },
        { text: 'Approve Vercel' },
      ], true),
      makeTableRow([
        { text: 'Cloud Database' },
        { text: 'Supabase (Managed PostgreSQL, automated backups, row-level security)' },
        { text: 'AWS RDS PostgreSQL' },
        { text: 'Approve Supabase' },
      ], false),
      makeTableRow([
        { text: 'Video Streaming (VOD)' },
        { text: 'Cloudflare Stream or Mux (Adaptive HLS/DASH streaming, ad-free, 240p–1080p)' },
        { text: 'YouTube Unlisted (Free)' },
        { text: 'Select VOD Pipeline' },
      ], true),
      makeTableRow([
        { text: 'Static Asset Storage' },
        { text: 'Cloudflare R2 or AWS S3 (High-res thumbnails, PDF worksheets, audio)' },
        { text: 'Supabase Storage' },
        { text: 'Approve S3 / R2' },
      ], false),
    ],
  }),

  new Paragraph({ spacing: { after: 80 } }),
  makeCallout(
    'Important Video Streaming Trade-Off Note',
    'While YouTube Unlisted embeds are free, they display third-party recommended videos and external links that can distract young children. Professional VOD streaming (Cloudflare Stream / Mux) ensures 100% ad-free, controlled streaming with adaptive bandwidth for rural networks at modest cloud storage cost.'
  ),
  new Paragraph({ spacing: { after: 80 } }),
  makeClientResponseBox('Client Decision on Domain, Hosting, and Video Streaming Pipeline', 3)
);

// ==========================================
// SECTION 17: MVP TO PRODUCTION PRIORITY LIST
// ==========================================
children.push(
  makeHeading1('Section 17 — MVP to Production Priority List', true),
  makeParagraph(
    'To establish a clear engineering roadmap, all discovered and requested features are organized into delivery priority tiers. Please review and approve these release targets.'
  ),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'Feature / Module', widthPct: 22 },
        { text: 'Current MVP Codebase Status', widthPct: 26 },
        { text: 'Proposed Release Priority', widthPct: 20 },
        { text: 'Client Decision Required', widthPct: 32 },
      ]),
      makeTableRow([
        { text: 'Cloud PostgreSQL Database' },
        { text: 'Not implemented (localStorage)' },
        { text: 'Must Have (Launch v1.0)', bold: true, color: 'DC2626' },
        { text: 'Approve Supabase / AWS RDS setup' },
      ], false),
      makeTableRow([
        { text: 'Secure Admin Server Auth' },
        { text: 'Placeholder (client-side mock)' },
        { text: 'Must Have (Launch v1.0)', bold: true, color: 'DC2626' },
        { text: 'Confirm admin users & permissions' },
      ], true),
      makeTableRow([
        { text: 'Course & Lesson Hierarchy' },
        { text: 'Flat standalone items only' },
        { text: 'Must Have (Launch v1.0)', bold: true, color: 'DC2626' },
        { text: 'Provide structured course syllabus' },
      ], false),
      makeTableRow([
        { text: 'Adaptive Video Streaming' },
        { text: 'Sample MP4 on W3Schools' },
        { text: 'Must Have (Launch v1.0)', bold: true, color: 'DC2626' },
        { text: 'Approve Cloudflare Stream / Mux setup' },
      ], true),
      makeTableRow([
        { text: '5 Interactive Games' },
        { text: 'Fully playable in browser' },
        { text: 'Must Have (Launch v1.0)', bold: true, color: '15803D' },
        { text: 'Approve game content & vocabulary' },
      ], false),
      makeTableRow([
        { text: 'Multilingual UI (EN/HI/KN)' },
        { text: 'Implemented in React Context' },
        { text: 'Must Have (Launch v1.0)', bold: true, color: '15803D' },
        { text: 'Audit Kannada & Hindi terminology' },
      ], true),
      makeTableRow([
        { text: 'Child Privacy Compliance' },
        { text: 'No policies or DPDPA docs' },
        { text: 'Must Have (Launch v1.0)', bold: true, color: 'DC2626' },
        { text: 'Approve Kid-Safe Privacy Notice & SOP' },
      ], false),
      makeTableRow([
        { text: 'Downloadable PDF Worksheets' },
        { text: 'Not found in codebase' },
        { text: 'Should Have (v1.1 Update)' },
        { text: 'Provide worksheet PDF files' },
      ], true),
      makeTableRow([
        { text: 'Formative Quiz Engine' },
        { text: 'Not found in codebase' },
        { text: 'Should Have (v1.1 Update)' },
        { text: 'Provide question banks and answer keys' },
      ], false),
      makeTableRow([
        { text: 'Digital Certificates' },
        { text: 'Not found in codebase' },
        { text: 'Should Have (v1.1 Update)' },
        { text: 'Approve certificate layout & signatory' },
      ], true),
      makeTableRow([
        { text: 'Teacher Presentation Mode' },
        { text: 'Not found in codebase' },
        { text: 'Could Have (v2.0)' },
        { text: 'Evaluate classroom smart TV needs' },
      ], false),
      makeTableRow([
        { text: 'PWA Offline Caching' },
        { text: 'Not found in codebase' },
        { text: 'Could Have (v2.0)' },
        { text: 'Assess rural network offline demand' },
      ], true),
    ],
  })
);

// ==========================================
// SECTION 18: CLIENT CONTENT SUBMISSION CHECKLIST
// ==========================================
children.push(
  makeHeading1('Section 18 — Client Content Submission Checklist', true),
  makeParagraph(
    'This master checklist outlines every tangible deliverable required from the Collective Consciousness leadership team to complete the LMS production deployment.'
  ),
  makeHeading2('18.1 Master Submission Checklist'),
  makeParagraph('Category A: Organizational & Programmatic Decisions'),
  makeCheckboxItem('Official LMS platform name and tagline confirmed'),
  makeCheckboxItem('Launch audience, grades (1–6), and geographic priority confirmed'),
  makeCheckboxItem('Account model chosen (100% Open Access vs Smart Hybrid PIN model)'),
  makeCheckboxItem('Target production domain confirmed (e.g., learn.collectiveconsciousness.in)'),

  makeParagraph('Category B: Curriculum & Lesson Data'),
  makeCheckboxItem('Initial launch course list provided (3 to 5 courses minimum)'),
  makeCheckboxItem('Curriculum alignment confirmed (NEP 2020 / NCF-FS / Karnataka State Board)'),
  makeCheckboxItem('Structured lesson breakdown submitted using the Section 5 template'),
  makeCheckboxItem('Designated pedagogical reviewers assigned'),

  makeParagraph('Category C: Media & Digital Assets'),
  makeCheckboxItem('High-definition lesson videos uploaded to shared Drive folder'),
  makeCheckboxItem('Vernacular audio narration clips provided (Kannada / Hindi / English)'),
  makeCheckboxItem('Printable PDF worksheets and activity guides shared'),
  makeCheckboxItem('16:9 course thumbnail illustrations delivered'),

  makeParagraph('Category D: Assessment & Certification Assets'),
  makeCheckboxItem('Question banks with multiple-choice options and answer keys submitted'),
  makeCheckboxItem('Passing score percentage and retake policy defined'),
  makeCheckboxItem('Certificate template approved and authorized signatory assigned'),

  makeParagraph('Category E: Child Safety, Legal & Regulatory Approvals'),
  makeCheckboxItem('India DPDPA 2023 Child Compliance Policy approved'),
  makeCheckboxItem('Kid-Safe Privacy Notice text signed off by legal representative'),
  makeCheckboxItem('Child Safeguarding & Content Moderation SOP approved'),
  makeCheckboxItem('Grievance Redressal Officer appointed and published')
);

// ==========================================
// SECTION 19: OPEN QUESTIONS & CLIENT DECISIONS
// ==========================================
children.push(
  makeHeading1('Section 19 — Open Questions & Client Decisions', true),
  makeParagraph(
    'Below is a consolidated register of the critical open architectural, operational, and educational questions discovered during our codebase review.'
  ),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'No.', widthPct: 8 },
        { text: 'Critical Question / Decision Item', widthPct: 34 },
        { text: 'Client Response / Decision', widthPct: 36 },
        { text: 'Owner / Status', widthPct: 22 },
      ]),
      makeTableRow([
        { text: 'Q1', bold: true },
        { text: 'Should the platform remain 100% open-access (no login) or adopt a hybrid PIN account model for progress tracking?' },
        { text: '...................................................................................' },
        { text: 'CC Leadership / Open' },
      ], false),
      makeTableRow([
        { text: 'Q2', bold: true },
        { text: 'Which curriculum standard (Karnataka DSERT, NEP 2020, or NCERT) is the primary official benchmark for course mapping?' },
        { text: '...................................................................................' },
        { text: 'Curriculum Team / Open' },
      ], true),
      makeTableRow([
        { text: 'Q3', bold: true },
        { text: 'What is the approved budget for ad-free cloud video streaming (Cloudflare Stream / Mux) vs YouTube Unlisted?' },
        { text: '...................................................................................' },
        { text: 'Executive Director / Open' },
      ], false),
      makeTableRow([
        { text: 'Q4', bold: true },
        { text: 'Are completion certificates required for students in the initial launch release or in a subsequent update?' },
        { text: '...................................................................................' },
        { text: 'Academic Lead / Open' },
      ], true),
      makeTableRow([
        { text: 'Q5', bold: true },
        { text: 'Is a dedicated Teacher Portal required for classroom projection, or will teachers navigate the public catalog?' },
        { text: '...................................................................................' },
        { text: 'School Liaison / Open' },
      ], false),
      makeTableRow([
        { text: 'Q6', bold: true },
        { text: 'Who will serve as the statutory Grievance Redressal Officer under India\'s DPDPA 2023 regulations?' },
        { text: '...................................................................................' },
        { text: 'Legal Trustee / Open' },
      ], true),
      makeTableRow([
        { text: 'Q7', bold: true },
        { text: 'What is the targeted official launch date for the production LMS and initial school pilot?' },
        { text: '...................................................................................' },
        { text: 'All Stakeholders / Open' },
      ], false),
    ],
  })
);

// ==========================================
// SECTION 20: CLIENT SIGN-OFF
// ==========================================
children.push(
  makeHeading1('Section 20 — Client Sign-off', true),
  makeParagraph(
    'Please review the contents, requirements, and responsibilities outlined in this document. Sign-off confirms that the provided information accurately reflects the strategic and technical scope for the next phase of LMS development.'
  ),
  makeCallout(
    'Formal Alignment Statement',
    'By approving this document, the client confirms that the provided curriculum specifications, content assets, business logic, and regulatory policies accurately represent the intended LMS scope for the transition from MVP to Production. Any additional features or structural changes requested after sign-off will be scheduled as part of subsequent development phases.'
  ),
  new Paragraph({ spacing: { after: 120 } }),

  new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: tableBorders,
    rows: [
      makeTableHeader([
        { text: 'Sign-off Field', widthPct: 35 },
        { text: 'Authorized Representative Entry', widthPct: 65 },
      ]),
      makeTableRow([
        { text: 'Authorized Representative Name', bold: true },
        { text: '..................................................................................................................' },
      ], false),
      makeTableRow([
        { text: 'Official Designation / Title', bold: true },
        { text: '..................................................................................................................' },
      ], true),
      makeTableRow([
        { text: 'Organization', bold: true },
        { text: 'Collective Consciousness' },
      ], false),
      makeTableRow([
        { text: 'Signature / Approval Confirmation', bold: true },
        { text: '\n\n..................................................................................................................\n' },
      ], true),
      makeTableRow([
        { text: 'Date & Location', bold: true },
        { text: 'Date: .......................................   Location: Bangalore, Karnataka' },
      ], false),
      makeTableRow([
        { text: 'Executive Comments / Approval Notes', bold: true },
        { text: '..................................................................................................................\n..................................................................................................................' },
      ], true),
    ],
  }),

  makeHeading2('Immediate Next Steps Following Sign-off'),
  makeBullet('Step 1 (Week 1)', 'Provision Supabase PostgreSQL cloud database and migrate schema from localStorage.'),
  makeBullet('Step 2 (Weeks 2–3)', 'Integrate Cloudflare Stream/Mux video pipeline and deploy secure server-side admin authentication.'),
  makeBullet('Step 3 (Weeks 4–5)', 'Ingest verified course curriculum, video lessons, and interactive game assets.'),
  makeBullet('Step 4 (Week 6)', 'Conduct staging user acceptance testing (UAT) with partner educators and launch production.')
);

// ==========================================
// APPENDIX: TECHNICAL ARCHITECTURE & MIGRATION BLUEPRINT
// ==========================================
children.push(
  makeHeading1('Appendix — Technical Architecture Audit & Migration Blueprint', true),
  makeParagraph(
    'This technical appendix summarizes the underlying Next.js 16 / React 19 codebase structure and provides the database schema blueprint for the engineering migration from MVP to production.'
  ),
  makeHeading2('A.1 Codebase Structure Summary'),
  makeBullet('Framework', 'Next.js 16.3.4 App Router with React 19.2.8 and TypeScript 5.'),
  makeBullet('Styling System', 'Tailwind CSS v4 with custom CSS variables (--coral-500: #FF4E29, --font-sf-display, --font-sf-text).'),
  makeBullet('3D & Animation', 'Three.js (@react-three/fiber, @react-three/drei) rendering Earth GLB model in HeroScene.tsx; Motion for smooth spring UI animations; Lenis for smooth scrolling.'),
  makeBullet('Component Library', 'Custom Radix-based primitives (Button, Card, Dialog, Dropdown, Tabs, Toast) styled to clean aesthetic standards.'),

  makeHeading2('A.2 Proposed PostgreSQL Database Schema (Relational Migration)'),
  makeParagraph('To replace the temporary browser localStorage ("bridged_videos_v1"), the following database tables will be established:'),
  makeBullet('users', 'id (UUID), email, password_hash, role (super_admin, admin, educator), created_at.'),
  makeBullet('students', 'id (UUID), display_name, avatar_id, class_code, created_at (Zero PII stored).'),
  makeBullet('courses', 'id (UUID), slug, title_en, title_kn, title_hi, description_en, subject, grade, thumbnail_url, is_published.'),
  makeBullet('chapters', 'id (UUID), course_id (FK), title_en, title_kn, title_hi, sequence_order.'),
  makeBullet('lessons', 'id (UUID), chapter_id (FK), title_en, title_kn, type (video, game, pdf), media_url, duration_seconds, sequence_order.'),
  makeBullet('games', 'id (UUID), slug, title, difficulty, age_range, subjects (array), languages (array).'),
  makeBullet('quizzes', 'id (UUID), lesson_id (FK), passing_pct, max_attempts, time_limit_seconds.'),
  makeBullet('questions', 'id (UUID), quiz_id (FK), prompt_en, prompt_kn, prompt_hi, options (JSONB), correct_idx, explanation.'),
  makeBullet('progress', 'id (UUID), student_id (FK), lesson_id (FK), watch_seconds, completed (bool), score, updated_at.'),
  makeBullet('certificates', 'id (UUID), student_id (FK), course_id (FK), verification_code, issued_at, pdf_url.')
);

// --- Build and Export Document ---
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: 'Calibri',
          size: 21,
          color: C_TEXT_DARK,
        },
      },
    },
  },
  sections: [
    {
      properties: {
        titlePage: true,
        page: {
          margin: {
            top: 1440,    // 1 inch
            bottom: 1440, // 1 inch
            left: 1440,   // 1 inch
            right: 1440,  // 1 inch
          },
        },
      },
      headers: {
        first: new Header({ children: [] }),
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              spacing: { after: 120 },
              children: [
                new TextRun({
                  text: 'Collective Consciousness LMS · MVP to Production Requirements Brief',
                  size: 17,
                  color: C_TEXT_MUTED,
                  font: 'Calibri',
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        first: new Footer({ children: [] }),
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 120 },
              children: [
                new TextRun({
                  text: 'Confidential — For Internal Collective Consciousness Use Only',
                  size: 17,
                  color: C_TEXT_MUTED,
                  font: 'Calibri',
                }),
                new TextRun({
                  text: '\t\tPage ',
                  size: 17,
                  color: C_TEXT_MUTED,
                  font: 'Calibri',
                }),
                PageNumber.CURRENT,
                new TextRun({
                  text: ' of ',
                  size: 17,
                  color: C_TEXT_MUTED,
                  font: 'Calibri',
                }),
                PageNumber.TOTAL_PAGES,
              ],
            }),
          ],
        }),
      },
      children,
    },
  ],
});

async function run() {
  const outputPath = path.join(__dirname, 'CC_LMS_Client_Content_Requirements.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Document created successfully at: ${outputPath}`);
  console.log(`File size: ${(buffer.length / 1024).toFixed(1)} KB`);
}

run().catch((err) => {
  console.error('Error generating document:', err);
  process.exit(1);
});
