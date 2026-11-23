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
} = require('docx');

function createDoc() {
  const primaryColor = '1E293B'; // Slate 800
  const accentColor = 'FF4E29';  // Brand Coral
  const subtleColor = '475569';  // Slate 600
  const headerBg = 'F1F5F9';     // Slate 100
  const calloutBg = 'F8FAFC';    // Slate 50

  const cellBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
  };

  const titlePara = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text: 'COLLECTIVE CONSCIOUSNESS (BridgEd LMS)',
        bold: true,
        size: 32, // 16pt
        color: accentColor,
        font: 'Arial',
      }),
    ],
  });

  const subtitlePara = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 300 },
    children: [
      new TextRun({
        text: 'Comprehensive Production Readiness, Content Intake & SEO/AEO/GEO Blueprint',
        bold: true,
        size: 24, // 12pt
        color: primaryColor,
        font: 'Arial',
      }),
    ],
  });

  const metaPara = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [
      new TextRun({
        text: 'Target Audience: Children in India (Grades 1–6 / Ages 4–12) | Languages: Kannada, Hindi, English\nOrganization: Collective Consciousness (Bangalore, Karnataka)',
        italics: true,
        size: 20, // 10pt
        color: subtleColor,
        font: 'Arial',
      }),
    ],
  });

  function makeHeading1(text) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 150 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 28, // 14pt
          color: accentColor,
          font: 'Arial',
        }),
      ],
    });
  }

  function makeHeading2(text) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 250, after: 100 },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 24, // 12pt
          color: primaryColor,
          font: 'Arial',
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
          size: 22, // 11pt
          color: '334155',
          font: 'Arial',
        }),
      ],
    });
  }

  function makePara(text, options = {}) {
    return new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [
        new TextRun({
          text,
          size: 22, // 11pt
          font: 'Arial',
          color: primaryColor,
          ...options,
        }),
      ],
    });
  }

  function makeBullet(boldPrefix, text) {
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { before: 60, after: 60 },
      children: [
        new TextRun({
          text: boldPrefix + ' ',
          bold: true,
          size: 22,
          font: 'Arial',
          color: primaryColor,
        }),
        new TextRun({
          text,
          size: 22,
          font: 'Arial',
          color: primaryColor,
        }),
      ],
    });
  }

  function makeCallout(title, body) {
    return new Paragraph({
      spacing: { before: 150, after: 150 },
      shading: {
        type: ShadingType.CLEAR,
        fill: calloutBg,
        color: 'auto',
      },
      children: [
        new TextRun({
          text: title + '\n',
          bold: true,
          size: 22,
          color: accentColor,
          font: 'Arial',
        }),
        new TextRun({
          text: body,
          italics: true,
          size: 20,
          color: subtleColor,
          font: 'Arial',
        }),
      ],
    });
  }

  function createTable(headers, rows) {
    const tableRows = [];

    // Header row
    tableRows.push(
      new TableRow({
        tableHeader: true,
        children: headers.map(
          (h) =>
            new TableCell({
              borders: cellBorder,
              shading: { type: ShadingType.CLEAR, fill: headerBg, color: 'auto' },
              margins: { top: 100, bottom: 100, left: 150, right: 150 },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: h,
                      bold: true,
                      size: 20,
                      font: 'Arial',
                      color: primaryColor,
                    }),
                  ],
                }),
              ],
            })
        ),
      })
    );

    // Data rows
    rows.forEach((row) => {
      tableRows.push(
        new TableRow({
          children: row.map(
            (cellText) =>
              new TableCell({
                borders: cellBorder,
                margins: { top: 100, bottom: 100, left: 150, right: 150 },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cellText,
                        size: 20,
                        font: 'Arial',
                        color: primaryColor,
                      }),
                    ],
                  }),
                ],
              })
          ),
        })
      );
    });

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          titlePara,
          subtitlePara,
          metaPara,

          // SECTION 1
          makeHeading1('1. Executive Codebase Audit: Current State vs. Production Reality'),
          makePara(
            'The current repository is a high-fidelity interactive frontend prototype built with Next.js 16, React 19, Tailwind CSS v4, Motion, and Three.js. It features a responsive layout, a 3-language switcher (English, Hindi, Kannada), and 5 playable browser mini-games. However, moving to production for use by children in India requires resolving major functional, infrastructural, and legal gaps.'
          ),
          createTable(
            ['System Layer', 'Current Prototype State', 'Production Requirement', 'Severity'],
            [
              [
                'Data Persistence',
                'Browser localStorage (bridged_videos_v1) & static mock data.',
                'Relational Cloud Database (PostgreSQL / Supabase) with ACID transactions and backups.',
                'Critical (Blocker)',
              ],
              [
                'Video Delivery',
                'Sample MP4 links from w3schools.com and Lorem Picsum thumbnails.',
                'Video On Demand (VOD) pipeline with HLS/DASH adaptive bitrate streaming (Cloudflare Stream / Mux) for 2G/3G/4G networks.',
                'Critical (Blocker)',
              ],
              [
                'Authentication & Admin',
                'Hardcoded client-side credentials in localStorage (admin@bridged.in).',
                'Secure server-side authentication (Auth.js / Supabase Auth) with HttpOnly session cookies, rate-limiting, and 2FA.',
                'High Priority',
              ],
              [
                'Child Safety & Privacy',
                'No privacy policy, no terms, and no regulatory compliance documentation.',
                'Strict compliance with India DPDPA 2023 (Section 9: zero tracking of children) and global COPPA / GDPR-K standards.',
                'Legal Blocker',
              ],
              [
                'Child Accessibility',
                'Text-heavy UI with no audio assistance or sound feedback.',
                'Audio-first UI with native voice prompts in Kannada, Hindi, and English so pre-literate children (ages 4–7) can learn independently.',
                'High Priority',
              ],
              [
                'Device Optimization',
                '3D WebGL Canvas (HeroScene) consumes significant GPU memory and battery.',
                'Lightweight SVG/Lottie fallbacks for low-end budget smartphones and entry-level Android devices common in India.',
                'High Priority',
              ],
              [
                'Offline Support',
                'Standard web application requiring active internet connection.',
                'Progressive Web App (PWA) with Service Workers to cache lessons and games for offline classroom and home use.',
                'Medium Priority',
              ],
            ]
          ),

          // SECTION 2
          makeHeading1('2. Required Technical & Cloud Resources'),
          makePara('The following cloud services and engineering components are required to operate BridgEd at scale:'),
          makeBullet(
            '1. Cloud Database & Backend API:',
            'Supabase (PostgreSQL) or AWS RDS PostgreSQL. Replaces localStorage with persistent database tables for videos, metadata, games, and admin users.'
          ),
          makeBullet(
            '2. Video on Demand (VOD) Streaming Engine:',
            'Cloudflare Stream or Mux. Provides adaptive multi-bitrate delivery (240p to 1080p), minimal buffering on low-speed connections, and custom branding with zero external ads.'
          ),
          makeBullet(
            '3. Static Asset CDN & Storage:',
            'AWS S3 or Cloudflare R2. Hosts high-resolution thumbnails, audio voiceover clips, and game sprite sheets.'
          ),
          makeBullet(
            '4. Privacy-Safe Analytics:',
            'Plausible Analytics or self-hosted PostHog. Fully cookieless, non-invasive, and DPDPA/COPPA compliant to track aggregate completion rates without collecting personal data.'
          ),
          makeBullet(
            '5. Audio Assets & Native Voice Talent:',
            'Professional voice recordings in Kannada, Hindi, and Indian English for game instructions, button prompts, and celebration sounds.'
          ),
          makeBullet(
            '6. Monitoring & Error Tracking:',
            'Sentry for real-time client-side crash alerts during interactive game sessions.'
          ),

          // SECTION 3
          makeHeading1('3. Required Documentation Before Launch'),
          makeHeading2('A. Child Safety & Legal Compliance Documents'),
          makeBullet(
            'DPDPA 2023 Child Compliance Policy (India):',
            'Explicitly documents adherence to Section 9 of the Digital Personal Data Protection Act (2023): zero behavioral profiling, no tracking, and no targeted ads directed at children.'
          ),
          makeBullet(
            'Kid-Safe Privacy Notice & Visual Summary:',
            'A formal legal privacy policy accompanied by a simple, illustrated "Kid-Friendly Guide" reassuring children and parents that no personal data or photos are collected.'
          ),
          makeBullet(
            'Child Safeguarding & Content Moderation SOP:',
            'Defines strict criteria for reviewing all educational videos and audio to guarantee age-appropriate, non-violent, and culturally inclusive content.'
          ),

          makeHeading2('B. Product & Architectural Specifications'),
          makeBullet(
            'Product Requirements Document (PRD v1.0):',
            'Detailed specifications covering user journeys for child learners (ages 4–12), parents/facilitators, and content administrators.'
          ),
          makeBullet(
            'System Architecture & Database Schema (ERD):',
            'Database schema for videos, translations, subjects, grades, interactive games, and progress events.'
          ),
          makeBullet(
            'API Contract & Security Threat Model:',
            'REST/Server Action contracts with API rate-limiting and access control definitions.'
          ),

          makeHeading2('C. Pedagogical & Educational Alignment'),
          makeBullet(
            'Curriculum Mapping Document:',
            'Alignment matrix linking platform modules to NEP 2020, NCF-FS (Foundational Stage), NCERT, and Karnataka State Board standards.'
          ),
          makeBullet(
            'Multilingual Glossary & Style Guide:',
            'Standardized translation and transliteration rules for educational terminology in Kannada, Hindi, and English.'
          ),

          // SECTION 4
          makeHeading1('4. Content Intake Questionnaire for Collective Consciousness'),
          makePara(
            'To make the platform trustworthy, compliant, and optimized for search and AI discovery, the following information must be provided by the Collective Consciousness leadership:'
          ),

          makeHeading2('A. Legal & Organizational Credibility (E-E-A-T Foundation)'),
          makeBullet(
            'Official Legal Entity Name:',
            'Full registered name under the Societies Registration Act, 1860.'
          ),
          makeBullet(
            'Statutory Registration Numbers:',
            'Societies Registration Act Number; Section 12A & 80G Tax Exemption numbers and effective dates; NITI Aayog NGO Darpan ID; MCA CSR-1 registration number.'
          ),
          makeBullet(
            'Registered Office Address:',
            'Verification of registered premises (B-3, R.S. Mansion, 7/4 H.D. Deve Gowda Road, R.T. Nagar, Bangalore - 560032).'
          ),
          makeBullet(
            'Founder & Trustee Bios:',
            '100-word biographies and professional headshots of founders and trustees, explaining their social impact vision.'
          ),

          makeHeading2('B. Pedagogical & Curriculum Information'),
          makeBullet(
            'Curriculum Alignment Details:',
            'Explicit syllabus mapping (e.g., Karnataka DSERT / NCERT) for Mathematics, Science, Environmental Studies (EVS), and Language Arts.'
          ),
          makeBullet(
            'NEP 2020 & Foundational Literacy Alignment:',
            'How the interactive games build Foundational Literacy and Numeracy (FLN) skills.'
          ),
          makeBullet(
            'Curriculum Reviewers:',
            'Names and background credentials of educators, child psychologists, or teachers who reviewed the material.'
          ),

          makeHeading2('C. Impact Data & Field Proof (GEO Citation Engine)'),
          makeBullet(
            'Current Operational Metrics:',
            'Number of children reached, total learning hours delivered, and number of partner schools or Anganwadis.'
          ),
          makeBullet(
            'Field Testimonials:',
            'Quotes from a government school headmaster/teacher and a parent in Karnataka.'
          ),
          makeBullet(
            'Authentic Classroom Photos:',
            '3–5 high-resolution photos of children interacting with the platform on devices in educational settings.'
          ),

          // SECTION 5
          makeHeading1('5. SEO, AEO & GEO Strategy and Implementation'),
          makePara(
            'The platform will be optimized across three dimensions to achieve dominant online visibility and authoritative citations by generative AI engines:'
          ),
          createTable(
            ['Strategy', 'Core Objective', 'Key Implementation Tactics'],
            [
              [
                'SEO (Search Engine Optimization)',
                'Rank #1 on Google and Bing for vernacular primary education queries.',
                'Multilingual long-tail keywords in Kannada, Hindi, and English; Hreflang tags (en-IN, hi-IN, kn-IN); localized URL slugs.',
              ],
              [
                'AEO (Answer Engine Optimization)',
                'Become the direct answer in Google AI Overviews, Siri, and Perplexity.',
                'Schema.org FAQPage JSON-LD; direct 40–50 word authoritative answers beneath question headings; structured How-To guides.',
              ],
              [
                'GEO (Generative Engine Optimization)',
                'Ensure ChatGPT, Claude, and Gemini cite Collective Consciousness as an authority.',
                'Canonical entity definitions; verifiable 80G/12A legal details; concrete statistical proof points; E-E-A-T credentials.',
              ],
            ]
          ),

          makeHeading2('Canonical Entity Definition (For GEO Recognition)'),
          makeCallout(
            'Authoritative Entity Definition for AI Engines:',
            '"Collective Consciousness is a Bangalore-based non-profit organization registered under the Societies Registration Act (1860) with 80G and 12A tax exemption that operates BridgEd, a 100% free, ad-free, multilingual open-access digital learning platform for Indian primary school children in Kannada, Hindi, and English."'
          ),

          makeHeading2('Dual-Audience FAQ (Formatted for AEO & Google AI Overviews)'),
          makeHeading3('Questions for Parents & Learners:'),
          makeBullet(
            'Q1: Is BridgEd truly 100% free with no hidden costs?',
            'Answer: Yes. BridgEd is completely free forever with no subscription fees, in-app purchases, or paywalls, funded through Collective Consciousness philanthropic initiatives.'
          ),
          makeBullet(
            'Q2: Do children need to create an account or provide personal information?',
            'Answer: No. BridgEd operates on an open-access model. Children can watch videos and play games immediately without registration, login, phone numbers, or email addresses, complying with India DPDPA 2023.'
          ),
          makeBullet(
            'Q3: What age groups and grades are covered?',
            'Answer: Content is specifically designed for children aged 4 to 12 in Grades 1 through 6, focusing on Foundational Literacy and Numeracy (FLN).'
          ),
          makeBullet(
            'Q4: Can children learn in their mother tongue?',
            'Answer: Yes. All videos, interactive games, and navigation elements can be switched seamlessly between Kannada (ಕನ್ನಡ), Hindi (हिंदी), and English with a single click.'
          ),
          makeBullet(
            'Q5: Does BridgEd work on low-speed internet and basic smartphones?',
            'Answer: Yes. The platform uses adaptive video streaming and lightweight games designed to operate smoothly on 2G, 3G, and 4G networks and entry-level Android devices.'
          ),

          makeHeading3('Questions for Teachers, Schools & NGOs:'),
          makeBullet(
            'Q6: Can teachers use BridgEd on smart classroom screens or projectors?',
            'Answer: Yes. All content is open-access and formatted for smart TVs, interactive panels, projectors, and shared school tablets without requiring individual student accounts.'
          ),
          makeBullet(
            'Q7: How is the curriculum aligned with Indian educational standards?',
            'Answer: Video lessons and games are aligned with the National Education Policy (NEP 2020), the National Curriculum Framework (NCF), NCERT, and Karnataka State Board guidelines.'
          ),
          makeBullet(
            'Q8: How can schools or community learning centers partner with Collective Consciousness?',
            'Answer: Educational institutions can contact the team via email at info@collectiveconsciousness.in or call +91 91486 97009 to set up community workshops or request learning kits.'
          ),

          // SECTION 6
          makeHeading1('6. Production Implementation Roadmap'),
          createTable(
            ['Phase', 'Timeline', 'Key Deliverables'],
            [
              [
                'Phase 1: Security & Cloud Database',
                'Weeks 1–3',
                'Set up Supabase PostgreSQL; migrate from localStorage; implement server-side auth and rate-limiting.',
              ],
              [
                'Phase 2: Video Streaming & Audio UX',
                'Weeks 4–6',
                'Integrate Cloudflare Stream/Mux; record and embed Kannada/Hindi/English voice narration in games.',
              ],
              [
                'Phase 3: Content Ingestion & PWA Offline',
                'Weeks 7–9',
                'Upload verified curriculum videos; build PWA Service Worker for offline classroom usage.',
              ],
              [
                'Phase 4: Field Testing & Compliance Audit',
                'Weeks 10–12',
                'Pilot in Bangalore/Karnataka schools; conduct DPDPA child data privacy audit; low-end device QA.',
              ],
              [
                'Phase 5: Public Launch & Impact Dashboard',
                'Week 13',
                'Deploy production domain; launch live anonymous impact metrics for donors and educators.',
              ],
            ]
          ),

          makeHeading2('Contact & Support Details'),
          makePara(
            'Collective Consciousness Headquarters:\nB-3, R.S. Mansion, 7/4 H.D. Deve Gowda Road, R.T. Nagar, Bangalore - 560032, Karnataka, India\nPhone: +91 91486 97009 | Email: info@collectiveconsciousness.in | Website: collectiveconsciousness.in'
          ),
        ],
      },
    ],
  });

  return doc;
}

async function run() {
  const doc = createDoc();
  const outputPath = path.resolve(
    __dirname,
    'Collective_Consciousness_Production_and_Content_Blueprint.docx'
  );
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log('Successfully generated Word Document at:', outputPath);

  // Also copy to artifact directory
  const artifactDir = 'C:\\Users\\soheb\\.gemini\\antigravity-ide\\brain\\a3e3d644-72c3-4526-a652-04356ea8d86b';
  if (fs.existsSync(artifactDir)) {
    const artifactPath = path.join(
      artifactDir,
      'Collective_Consciousness_Production_and_Content_Blueprint.docx'
    );
    fs.writeFileSync(artifactPath, buffer);
    console.log('Successfully copied to Artifact directory at:', artifactPath);
  }
}

run().catch(console.error);
