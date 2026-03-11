Act as a Senior Design Systems Architect, UX Governance Lead, and Frontend Architecture Auditor.

Your task is to reverse-engineer the entire UI system from the current Figma Make application and generate a comprehensive "guidelines.md" document that becomes the authoritative AI governance guide for building and maintaining this application and all future applications based on it.

You must analyze the entire project and extract all design decisions, layout structures, patterns, behaviors, accessibility rules, and architectural standards that are currently implemented.

The output must be a clean, structured, production-grade guidelines.md file.

-------------------------------------

STEP 1 — Ingest the Entire Application

Analyze the full Figma Make project including:

• All pages
• All frames
• All layouts
• All components
• All variants
• All design tokens
• All styles
• All patterns
• All interactions
• All navigation systems
• All charts
• All tables
• All forms
• All modals
• All overlays
• All state variations

Treat the application as the source of truth.

-------------------------------------

STEP 2 — Extract Design Foundations

Identify and extract all design foundations including:

• Color system
• Typography system
• Spacing scale
• Border radius system
• Shadow/elevation system
• Grid system
• Breakpoints
• Token usage patterns

Document:

• Token names
• Token structure
• Token usage rules
• Token hierarchy
• Semantic tokens

-------------------------------------

STEP 3 — Extract App Layout Architecture

Identify the core application layout structure used across pages.

Document:

• App Layout
• Sidebar navigation structure
• Top navigation bar
• Page header structure
• Content container rules
• Section layout rules
• Panel structures
• Footer patterns

Provide a hierarchical layout diagram.

Example:

App Layout
├ Sidebar
├ Top Navigation
├ Page Header
├ Page Content
└ Footer

-------------------------------------

STEP 4 — Extract Page Layout Templates

Identify reusable page templates used in the application.

Examples may include:

• Dashboard layout
• Data table layout
• Analytics layout
• Form entry layout
• Detail page layout
• Wizard / workflow layout
• AI assistant layout
• Configuration page

For each template document:

• layout structure
• component composition
• spacing rules
• interaction behavior

-------------------------------------

STEP 5 — Extract Component System

Analyze the component library used in the application.

Identify:

• Buttons
• Inputs
• Dropdowns
• Tables
• Cards
• Tabs
• Modals
• Tooltips
• Alerts
• Panels
• Navigation components

For each component document:

• component name
• variants
• states
• allowed usage
• spacing rules
• token usage

-------------------------------------

STEP 6 — Extract UX Pattern Library

Identify UX patterns used across the application.

Examples include:

• Dashboard analytics pattern
• Table + filters pattern
• Search + results pattern
• Wizard / stepper pattern
• Modal interaction pattern
• Settings/configuration pattern
• Notification pattern
• Data exploration pattern

Document each pattern including:

• pattern name
• pattern purpose
• layout structure
• interaction behavior
• components used

-------------------------------------

STEP 7 — Extract Interaction & Behavior Rules

Document UI behavior rules including:

• hover states
• focus states
• active states
• loading states
• disabled states
• modal behavior
• dropdown behavior
• navigation transitions
• form validation behavior
• error handling behavior

-------------------------------------

STEP 8 — Extract Navigation System

Document the navigation architecture.

Include:

• sidebar navigation hierarchy
• navigation grouping
• page routing structure
• breadcrumb rules
• deep linking rules

-------------------------------------

STEP 9 — Extract Data Visualization Rules

Identify how charts and analytics components are implemented.

Document:

• chart types
• chart styling
• chart interaction behavior
• chart layout rules
• KPI card rules

-------------------------------------

STEP 10 — Extract Accessibility Standards

Audit accessibility features present in the UI.

Document:

• color contrast standards
• keyboard navigation
• focus indicators
• ARIA labeling patterns
• accessible form patterns

-------------------------------------

STEP 11 — Extract Responsive Layout Rules

Identify responsive design behavior.

Document:

• breakpoints
• grid collapse rules
• mobile layout patterns
• tablet layout patterns

-------------------------------------

STEP 12 — Extract Naming Conventions

Identify naming conventions used across:

• components
• tokens
• patterns
• layouts

Document the naming rules.

-------------------------------------

STEP 13 — Identify Inconsistencies

Audit the system for:

• duplicate styles
• unused tokens
• redundant components
• layout inconsistencies
• pattern duplication

List all issues and propose corrections.

-------------------------------------

STEP 14 — Generate guidelines.md

Using all extracted information, generate a comprehensive "guidelines.md" file.

The document must include the following sections:

1. Purpose
2. Design System Source of Truth
3. Design Foundations
4. Design Tokens
5. Layout Architecture
6. App Layout
7. Page Templates
8. Component System
9. UX Pattern Library
10. Interaction & Behavior Rules
11. Navigation System
12. Data Visualization Standards
13. Accessibility Rules
14. Responsive Design Rules
15. Naming Conventions
16. AI Generation Rules
17. Prohibited Actions
18. Validation Checklist

-------------------------------------

OUTPUT FORMAT

Return the final output as:

• a single structured Markdown document
• with clear section headings
• production-ready for use as guidelines.md

-------------------------------------

IMPORTANT RULES

Do not invent design rules.

Only document rules that exist in the application.

Normalize inconsistent rules when necessary.

Ensure the document can be used as a strict governance document for AI-generated UI.