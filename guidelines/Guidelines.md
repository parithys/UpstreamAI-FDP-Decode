# UpstreamAI FDP - UI System Guidelines

**Version:** 1.0  
**Last Updated:** March 10, 2026  
**Application:** UpstreamAI FDP (Field Development Plan) Platform  
**Tech Stack:** React 18.3.1, Vite 6.3.5, Tailwind CSS v4.0, React Router 7.13.1

---

## 1. Purpose

This document is the **authoritative governance guide** for building and maintaining the UpstreamAI FDP application and all future applications based on this design system. It defines all design foundations, component patterns, layout architectures, interaction behaviors, accessibility rules, and AI generation standards.

**This document is:**

- The single source of truth for UI implementation
- Required reading for all developers and AI assistants
- The validation standard for all code reviews
- The foundation for automated UI generation

---

## 2. Design System Source of Truth

### 2.1 Core Design System

**Primary Design System:** Custom UpstreamAI Design System  
**Location:** `/src/styles/theme.css`  
**Package:** `@parithys/upstreamai-design-system` (referenced)

### 2.2 Design Token Authority

**ALL design decisions MUST use CSS variables from `/src/styles/theme.css`**

**NEVER:**

- ❌ Use hardcoded colors (e.g., `#372358`, `rgba(55, 35, 88, 1.00)`)
- ❌ Use hardcoded spacing values (e.g., `16px`, `24px`)
- ❌ Use hardcoded border radius (e.g., `8px`, `12px`)
- ❌ Use Tailwind arbitrary values for design tokens (e.g., `text-[14px]`, `bg-[#372358]`)

**ALWAYS:**

- ✅ Use semantic CSS variables (e.g., `var(--primary)`, `var(--text-base)`)
- ✅ Use Tailwind utility classes that map to design tokens (e.g., `text-primary`, `bg-card`)
- ✅ Use semantic typography classes (e.g., `.text-h1`, `.text-body`, `.text-label`)

---

## 3. Design Foundations

### 3.1 Color System

#### 3.1.1 Semantic Color Tokens

**Background & Surface Colors:**

```css
--background: rgba(248, 247, 252, 1) /* Main app background */
  --foreground: rgba(35, 25, 55, 1) /* Main text color */
  --card: rgba(255, 255, 255, 1) /* Card/container background */
  --card-foreground: rgba(25, 25, 38, 1) /* Card text */;
```

**Brand Colors:**

```css
--primary: rgba(55, 35, 88, 1) /* Primary purple */
  --primary-foreground: rgba(255, 255, 255, 1)
  --secondary: rgba(242, 237, 252, 1) /* Light purple */
  --secondary-foreground: rgba(55, 35, 88, 1)
  --accent: rgba(123, 94, 167, 1) /* Accent purple */
  --accent-foreground: rgba(255, 255, 255, 1);
```

**UI State Colors:**

```css
--muted: rgba(242, 242, 245, 1) /* Disabled/subtle */
  --muted-foreground: rgba(153, 153, 165, 1)
  --destructive: rgba(212, 32, 32, 1) /* Danger red */
  --destructive-foreground: rgba(255, 255, 255, 1);
```

**Semantic Status Colors (mapped to chart colors):**

```css
--success: var(--chart-3) /* Green - rgba(34, 197, 94, 1.00) */
  --danger: var(--destructive)
  /* Red - rgba(212, 32, 32, 1.00) */ --warning: var(--chart-4)
  /* Amber - rgba(245, 158, 11, 1.00) */ --info: var(--chart-2)
  /* Blue - rgba(59, 130, 246, 1.00) */;
```

**Chart Colors:**

```css
--chart-1: rgba(93, 75, 122, 1) /* Purple */
  --chart-2: rgba(59, 130, 246, 1) /* Blue */
  --chart-3: rgba(34, 197, 94, 1) /* Green */
  --chart-4: rgba(245, 158, 11, 1) /* Amber */
  --chart-5: rgba(212, 32, 32, 1) /* Red */;
```

**Sidebar Colors:**

```css
--sidebar: rgba(30, 19, 52, 1) /* Dark purple background */
  --sidebar-foreground: rgba(192, 192, 204, 1)
  --sidebar-primary: rgba(55, 35, 88, 1)
  --sidebar-accent: rgba(123, 94, 167, 1)
  --sidebar-border: rgba(224, 224, 231, 1);
```

**Border & Input Colors:**

```css
--border: rgba(224, 224, 231, 1) --input: rgba(250, 250, 252, 1)
  /* Filled input background */
  --input-background: rgba(255, 255, 255, 1)
  /* Input background */ --ring: rgba(55, 35, 88, 1)
  /* Focus ring color */;
```

**Elevation:**

```css
--elevation-sm: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
```

#### 3.1.2 Color Usage Rules

**Rule 1: Semantic Color Mapping**

- Use `success` for positive states, completion, health indicators
- Use `danger` for errors, critical issues, destructive actions
- Use `warning` for cautions, pending states, attention needed
- Use `info` for informational messages, links, highlights
- Use `primary` for brand identity, CTAs, active states
- Use `accent` for secondary highlights, hover states

**Rule 2: Text Colors**

- Primary text: `text-foreground` or `text-text-primary`
- Secondary text: `text-text-secondary`
- Tertiary/subtle text: `text-text-tertiary`
- On colored backgrounds: Use corresponding `-foreground` token

**Rule 3: Dark Mode**
All colors have dark mode variants defined in `.dark` class. The system automatically applies them via the ThemeContext.

### 3.2 Typography System

#### 3.2.1 Font Family

**Primary Font:** `'Tenorite', sans-serif`

```css
--font-family-primary: "Tenorite", sans-serif;
```

**RULE:** All text MUST use Tenorite font family (applied globally to `body` and `html`).

#### 3.2.2 Type Scale

```css
--text-h1: 36px /* Large headings */ --text-h2: 28px
  /* Section headings */ --text-h3: 22px
  /* Subsection headings */ --text-h4: 18px /* Card titles */
  --text-base: 14px /* Body text, buttons, inputs */
  --text-label: 12px /* Labels, badges */ --text-caption: 12px
  /* Small text, captions */ --text-body-small: 13px
  /* Small body text */;
```

#### 3.2.3 Font Weights

```css
--font-weight-bold: 700 --font-weight-regular: 400;
```

#### 3.2.4 Line Height

**Standard:** `1.5` for all typography (body, headings, labels, buttons, inputs)

#### 3.2.5 Typography Utility Classes

**Semantic Typography Classes (PREFERRED):**

```css
.text-h1      /* H1 heading: 36px, bold, 1.5 line-height */
.text-h2      /* H2 heading: 28px, bold, 1.5 line-height */
.text-h3      /* H3 heading: 22px, bold, 1.5 line-height */
.text-h4      /* H4 heading: 18px, bold, 1.5 line-height */
.text-body    /* Body text: 14px, regular, 1.5 line-height */
.text-body-small /* Small body: 13px, regular, 1.5 line-height */
.text-label   /* Labels: 12px, bold, 1.5 line-height */
.text-caption /* Captions: 12px, regular, 1.5 line-height */
```

**Font Utilities:**

```css
.font-primary        /* Apply Tenorite font */
.font-bold-weight    /* 700 weight */
.font-regular-weight /* 400 weight */
```

#### 3.2.6 Typography Rules

**RULE 1: Use Semantic Classes**

- ✅ Use `.text-h1`, `.text-h2`, `.text-body`, `.text-label`
- ❌ NEVER use Tailwind font-size classes (`text-2xl`, `text-sm`, `text-base`)
- ❌ NEVER use Tailwind font-weight classes (`font-bold`, `font-semibold`)
- ❌ NEVER use Tailwind line-height classes (`leading-none`, `leading-tight`)

**RULE 2: Default Typography**

- HTML elements (`h1`, `h2`, `h3`, `h4`, `p`, `label`, `button`, `input`) have base typography automatically applied
- Override only when necessary using semantic classes

**RULE 3: Component Typography**

- Buttons: Use `text-base` with `font-weight-bold` (applied automatically)
- Inputs: Use `text-base` with `font-weight-regular` (applied automatically)
- Labels: Use `text-label` with `font-weight-bold` (applied automatically)
- Badges: Use `text-label` or smaller

### 3.3 Spacing System

**Based on Tailwind's default 4px spacing scale:**

```
0.5 → 2px
1   → 4px
1.5 → 6px
2   → 8px
2.5 → 10px
3   → 12px
4   → 16px
5   → 20px
6   → 24px
8   → 32px
10  → 40px
12  → 48px
16  → 64px
```

#### 3.3.1 Spacing Usage Patterns

**Container Padding:**

- Page container: `p-8` (32px)
- Card padding: `px-6 py-4` or `p-6` (24px)
- Section padding: `px-6 py-3` (24px horizontal, 12px vertical)

**Gaps & Spacing:**

- Component gaps: `gap-2` (8px), `gap-3` (12px), `gap-4` (16px)
- Section gaps: `gap-6` (24px), `gap-8` (32px)
- Form element gaps: `gap-1.5` (6px), `gap-2` (8px)

**Margins:**

- Bottom spacing: `mb-2` (8px), `mb-3` (12px), `mb-4` (16px), `mb-6` (24px)
- Top spacing: `mt-2`, `mt-3`, `mt-4`, `mt-6`

### 3.4 Border Radius System

```css
--radius: 8px /* Base radius */ --radius-button: 8px
  /* Button radius */ --radius-card: 12px /* Card radius */
  --radius-sm: 4px
  /* Small radius (calc(var(--radius) - 4px)) */
  --radius-md: 6px
  /* Medium radius (calc(var(--radius) - 2px)) */
  --radius-lg: 8px /* Large radius (var(--radius)) */
  --radius-xl: 12px
  /* Extra large radius (calc(var(--radius) + 4px)) */;
```

**Tailwind Classes:**

- `rounded-lg` → 8px (buttons, inputs, standard components)
- `rounded-xl` → 12px (cards, modals, containers)
- `rounded-md` → 6px (badges, small elements)
- `rounded-full` → Full circle (pills, avatars, icon buttons)

**Usage Rules:**

- Buttons: `rounded-lg` (8px)
- Cards: `rounded-xl` (12px)
- Inputs: `rounded-lg` (8px)
- Badges: `rounded-full` (pill shape)
- Modals: `rounded-lg` (8px)
- Tooltips: `rounded-lg` (8px)

### 3.5 Shadow System

**Elevation Shadow:**

```css
--elevation-sm: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
```

**Custom Shadows:**

```
shadow-glow       /* Subtle glow for cards */
shadow-glow-hover /* Enhanced glow on hover */
shadow-lg         /* Large shadow for elevated elements */
```

**Usage:**

- Cards: `shadow-glow` (default), `shadow-glow-hover` (on hover)
- Buttons: `shadow-lg` with color opacity (e.g., `shadow-primary/20`)
- Modals: `shadow-lg`
- Floating elements: `shadow-lg`

### 3.6 Breakpoints

**Tailwind Default Breakpoints:**

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

**Usage Patterns:**

- Mobile-first approach
- Sidebar collapses at small screens
- Grid layouts: 1 column (mobile) → 2 columns (md) → 3-4 columns (lg)
- Top bar adjusts spacing and hides elements on mobile

---

## 4. Layout Architecture

### 4.1 App Layout Structure

```
App
├── BrowserRouter
│   ├── ScrollToTop
│   ├── ErrorBoundary
│   ├── ThemeProvider
│   │   ├── ConfirmationProvider
│   │   │   ├── NotificationsProvider
│   │   │   │   ├── SearchProvider
│   │   │   │   │   ├── SidebarProvider
│   │   │   │   │   │   ├── ChatProvider
│   │   │   │   │   │   │   ├── Toaster
│   │   │   │   │   │   │   ├── AssetProvider
│   │   │   │   │   │   │   │   ├── UserProvider
│   │   │   │   │   │   │   │   │   ├── WorkflowProvider
│   │   │   │   │   │   │   │   │   │   ├── LayerProvider
│   │   │   │   │   │   │   │   │   │   │   ├── CollaborationProvider
│   │   │   │   │   │   │   │   │   │   │   │   ├── GlobalSearch
│   │   │   │   │   │   │   │   │   │   │   │   ├── Routes
│   │   │   │   │   │   │   │   │   │   │   │   │   ├── Login (/)
│   │   │   │   │   │   │   │   │   │   │   │   │   ├── AppLayout
│   │   │   │   │   │   │   │   │   │   │   │   │   │   ├── Sidebar
│   │   │   │   │   │   │   │   │   │   │   │   │   │   ├── TopBar
│   │   │   │   │   │   │   │   │   │   │   │   │   │   ├── Breadcrumbs
│   │   │   │   │   │   │   │   │   │   │   │   │   │   ├── Main Content
│   │   │   │   │   │   │   │   │   │   │   │   │   │   ├── DataAnnotationToolbar (conditional)
│   │   │   │   │   │   │   │   │   │   │   │   │   │   ├── AIOracle (conditional)
```

### 4.2 AppLayout Component

**Location:** `/src/app/App.tsx` (AppLayout function)

**Structure:**

```jsx
<div className="min-h-screen">
  <Sidebar />
  <TopBar />
  <main className={isCollapsed ? "pl-16 pt-16" : "pl-60 pt-16"}>
    <Breadcrumbs /> {/* Sticky at top-16 */}
    {children}      {/* Page content */}
    <DataAnnotationToolbar /> {/* Conditional */}
  </main>
  <AIOracle />      {/* Modal overlay */}
</div>
```

**Layout Rules:**

1. **Sidebar:**
   - Fixed left: `fixed left-0 top-0 h-screen`
   - Width: `w-60` (expanded), `w-16` (collapsed)
   - Transition: `transition-all duration-200 ease-in-out`
   - Z-index: Below TopBar

2. **TopBar:**
   - Fixed top: `fixed top-0 h-16`
   - Left offset: `left-60` (sidebar expanded), `left-16` (collapsed)
   - Right: `right-0`
   - Transition: `transition-all duration-200 ease-in-out`
   - Z-index: `z-30`

3. **Main Content:**
   - Padding left: `pl-60` (sidebar expanded), `pl-16` (collapsed)
   - Padding top: `pt-16` (TopBar height)
   - Transition: `padding-left 200ms ease-in-out`

4. **Breadcrumbs:**
   - Sticky positioning: `sticky top-16 z-20`
   - Background: `bg-background/50 backdrop-blur-sm`
   - Border: `border-b border-card-border`
   - Padding: `px-6 py-3`

### 4.3 Sidebar Structure

**Width:**

- Expanded: `w-60` (240px)
- Collapsed: `w-16` (64px)

**Sections:**

1. **Header (Logo + Title):** `h-16` with logo and platform name
2. **Navigation:** Scrollable module links with icons
3. **Footer (Actions):** Settings, theme toggle, notifications, chat

**Navigation Item States:**

- Active: `bg-primary/10 text-primary border-l-4 border-primary`
- Hover: `hover:bg-white/5 hover:text-text-primary`
- Default: `text-text-secondary`

**Tooltip Pattern:**
When collapsed, show tooltip on hover for each nav item using NavTooltip component.

### 4.4 TopBar Structure

**Sections:**

1. **Left:** AssetSelector component
2. **Right:** RealTimeSyncIndicator, GlobalSearch button, user menu

**Height:** `h-16` (64px)

**Search Bar:**

- Width: `w-[320px]`
- Style: `bg-background-secondary/50 border border-card-border rounded-full`
- Keyboard shortcut: Ctrl+K / Cmd+K

### 4.5 Page Container Pattern

**Standard page wrapper:**

```jsx
<div className="min-h-screen bg-background-primary">
  <div className="p-8">
    {/* Page Header */}
    <div className="mb-6">
      <h1 className="text-h1 text-text-primary">Page Title</h1>
      <p className="text-body text-text-secondary mt-2">Description</p>
    </div>

    {/* Page Content */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Content sections */}
    </div>
  </div>
</div>
```

**Page Padding:** `p-8` (32px all sides)

### 4.6 Breadcrumb System

**Pattern:**

```
Home > Section > Subsection > Current Page
```

**Mapping:** Defined in `BREADCRUMB_MAP` in App.tsx

**Implementation:**

- Uses Radix UI Breadcrumb components
- React Router Link components for navigation
- Last item is non-clickable (BreadcrumbPage)

---

## 5. Page Templates

### 5.1 Dashboard Layout

**Pattern:** Grid of metric cards + module cards + widgets

```jsx
<div className="min-h-screen bg-background-primary">
  <div className="p-8">
    {/* Layer Navigation */}
    <LayerNavigation />

    {/* KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard /> {/* Repeat */}
    </div>

    {/* Module Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ModuleCard /> {/* Repeat */}
    </div>
  </div>
</div>
```

### 5.2 Data Table Layout

**Pattern:** Filters + table + pagination

```jsx
<div className="min-h-screen bg-background-primary">
  <div className="p-8">
    {/* Header */}
    <div className="mb-6">
      <h1 className="text-h1">Data View</h1>
    </div>

    {/* Filters */}
    <Card className="mb-6">
      <div className="p-6 flex gap-4">
        <Input placeholder="Search..." />
        <Select>...</Select>
        <Button>Filter</Button>
      </div>
    </Card>

    {/* Table */}
    <Card>
      <Table>...</Table>
    </Card>
  </div>
</div>
```

### 5.3 Analytics Layout

**Pattern:** Charts + filters + insights

```jsx
<div className="min-h-screen bg-background-primary">
  <div className="p-8">
    {/* Header with Actions */}
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-h1">Analytics</h1>
      <div className="flex gap-2">
        <Button variant="outline">Export</Button>
        <Button>Configure</Button>
      </div>
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Chart Title</CardTitle></CardHeader>
        <CardContent>
          <ChartContainer>...</ChartContainer>
        </CardContent>
      </Card>
    </div>
  </div>
</div>
```

### 5.4 Form Entry Layout

**Pattern:** Form sections with validation

```jsx
<div className="min-h-screen bg-background-primary">
  <div className="p-8 max-w-4xl mx-auto">
    {/* Form Header */}
    <div className="mb-6">
      <h1 className="text-h1">Form Title</h1>
      <p className="text-body text-text-secondary mt-2">Description</p>
    </div>

    {/* Form Content */}
    <Card>
      <CardContent className="p-6">
        <form className="space-y-6">
          {/* Form fields */}
          <div>
            <Input label="Field Label" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button variant="outline">Cancel</Button>
            <Button>Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</div>
```

### 5.5 Detail Page Layout

**Pattern:** Header + tabs + content sections

```jsx
<div className="min-h-screen bg-background-primary">
  <div className="p-8">
    {/* Header with Metadata */}
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Item Name</CardTitle>
        <CardDescription>Metadata</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <StatCard /> {/* Key metrics */}
        </div>
      </CardContent>
    </Card>

    {/* Tabs */}
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        {/* Tab content */}
      </TabsContent>
    </Tabs>
  </div>
</div>
```

---

## 6. Component System

### 6.1 Button Component

**Location:** `/src/app/components/ui/button.tsx`

**Variants:**

```typescript
variant: "default" |
  "primary" |
  "secondary" |
  "ghost" |
  "pill" |
  "destructive" |
  "danger" |
  "warning" |
  "outline" |
  "link";
```

**Sizes:**

```typescript
size: "default" | "sm" | "md" | "lg" | "icon";
```

**Variant Specifications:**

1. **default / primary:**
   - Background: `bg-primary`
   - Text: `text-white`
   - Hover: `hover:bg-primary-hover`
   - Shadow: `shadow-lg shadow-primary/20`
   - Border radius: `rounded-lg`

2. **secondary:**
   - Background: `bg-background-secondary`
   - Border: `border border-card-border`
   - Text: `text-text-primary`
   - Hover: `hover:border-accent hover:text-accent`

3. **ghost:**
   - Background: `bg-transparent`
   - Text: `text-text-secondary`
   - Hover: `hover:text-text-primary hover:bg-white/5`

4. **destructive / danger:**
   - Background: `bg-danger`
   - Text: `text-white`
   - Hover: `hover:bg-danger/90`
   - Shadow: `shadow-lg shadow-danger/20`

5. **outline:**
   - Background: `bg-transparent`
   - Border: `border border-card-border`
   - Text: `text-text-primary`
   - Hover: `hover:bg-white/5 hover:border-accent`

**Size Specifications:**

- `sm`: `h-8 px-3`
- `default` / `md`: `h-10 px-4`
- `lg`: `h-12 px-6`
- `icon`: `size-9 rounded-md` (square icon button)

**Props:**

- `isLoading`: Shows loading spinner
- `leftIcon`: Icon before text
- `rightIcon`: Icon after text
- `disabled`: Disables interaction

**Accessibility:**

- Focus ring: `focus:ring-2 focus:ring-primary focus:ring-offset-2`
- Disabled state: `disabled:opacity-50 disabled:cursor-not-allowed`

### 6.2 Card Component

**Location:** `/src/app/components/ui/card.tsx`

**Variants:**

```typescript
variant: "default" | "flat" | "elevated" | "glass";
```

**Variant Specifications:**

1. **default:**
   - Background: `bg-card`
   - Border: `border border-card-border`
   - Shadow: `shadow-glow`
   - Hover: `hover:border-card-hover hover:shadow-glow-hover`

2. **flat:**
   - Background: `bg-card/50`
   - Border: `border-transparent`

3. **elevated:**
   - Background: `bg-card`
   - Border: `border border-accent/30`
   - Shadow: `shadow-glow-hover`

4. **glass:**
   - Background: `bg-card backdrop-blur-xl`
   - Border: `border border-card-border`
   - Shadow: `shadow-glow`

**Border Radius:** `rounded-xl` (12px)

**Card Composition:**

```jsx
<Card variant="default">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>Action Button</CardAction>
  </CardHeader>
  <CardContent>
    Main content
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

**Clickable Cards:**

- Add `onClick` prop to make card clickable
- Automatically adds: `cursor-pointer active:scale-[0.99]`
- Keyboard accessible: `tabIndex={0}`, Enter/Space key support

**Disabled State:**

- `disabled` prop: `opacity-60 cursor-not-allowed`

### 6.3 StatCard Component

**Location:** `/src/app/components/ui/stat-card.tsx`

**Props:**

```typescript
interface StatCardProps {
  label: string;
  value: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  description?: string;
  className?: string;
}
```

**Trend Direction Colors:**

- `up`: `text-success` with TrendingUp icon
- `down`: `text-danger` with TrendingDown icon
- `neutral`: `text-text-secondary` with Minus icon

**Layout:**

- Label: `text-sm font-medium text-text-secondary`
- Value: `text-3xl font-bold text-text-primary`
- Trend: `text-2xl font-bold` with direction color
- Description: `text-sm text-text-secondary mt-auto`

### 6.4 Input Component

**Location:** `/src/app/components/ui/input.tsx`

**Variants:**

```typescript
variant: "default" | "chat";
```

**Variant Specifications:**

1. **default:**
   - Height: `h-10`
   - Padding: `px-3`
   - Border radius: `rounded-lg`

2. **chat:**
   - Height: `h-12`
   - Padding: `pl-4 pr-12`
   - Border radius: `rounded-xl`
   - Shadow: `shadow-lg`
   - Send button: Positioned absolute right

**Base Styles:**

- Background: `bg-input-bg`
- Border: `border border-input-border`
- Text: `text-text-primary`
- Placeholder: `placeholder-text-tertiary`
- Focus: `focus:ring-1 focus:ring-primary focus:border-primary`

**Props:**

- `label`: Display label above input
- `error`: Error message (changes border to danger)
- `icon`: Icon on left side (default variant only)
- `onSend`: Send callback (chat variant only)

**Error State:**

- Border: `border-danger`
- Focus ring: `focus:ring-danger focus:border-danger`
- Error message: `text-caption text-danger`

### 6.5 Select Component

**Location:** `/src/app/components/ui/select.tsx`

**Based on Radix UI Select**

**Sizes:**

- `default`: `h-9`
- `sm`: `h-8`

**Base Styles:**

- Background: `bg-input-background`
- Border: `border border-input-border`
- Border radius: `rounded-md`
- Focus: `focus-visible:ring-[3px] focus-visible:ring-ring/50`

**Composition:**

```jsx
<Select>
  <SelectTrigger size="default">
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Group Label</SelectLabel>
      <SelectItem value="1">Item 1</SelectItem>
      <SelectItem value="2">Item 2</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### 6.6 Table Component

**Location:** `/src/app/components/ui/table.tsx`

**Composition:**

```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data 1</TableCell>
      <TableCell>Data 2</TableCell>
    </TableRow>
  </TableBody>
  <TableFooter>
    {/* Optional footer */}
  </TableFooter>
</Table>
```

**TableRow Props:**

- `disabled`: Gray out and disable interaction
- `onClick`: Make row clickable

**Clickable Row Behavior:**

- Cursor: `cursor-pointer`
- Hover: `hover:bg-muted/50`
- Disabled: `opacity-50 cursor-not-allowed` (no hover)

**Styling:**

- Border: `border-b` on rows
- Text size: `text-sm`
- Head: `text-foreground font-medium`
- Cell padding: `p-2`
- Alignment: `text-left align-middle`

### 6.7 Badge Component

**Location:** `/src/app/components/ui/badge.tsx`

**Variants:**

```typescript
variant: "default" |
  "success" |
  "danger" |
  "warning" |
  "info" |
  "neutral" |
  "secondary" |
  "destructive" |
  "outline";
```

**Variant Specifications:**

1. **default:**
   - Background: `bg-primary/10`
   - Text: `text-primary`
   - Border: `border-primary/20`

2. **success:**
   - Background: `bg-success/10`
   - Text: `text-success`
   - Border: `border-success/20`

3. **danger / destructive:**
   - Background: `bg-danger/10`
   - Text: `text-danger`
   - Border: `border-danger/20`

4. **warning:**
   - Background: `bg-warning/10`
   - Text: `text-warning`
   - Border: `border-warning/20`

5. **info:**
   - Background: `bg-accent/10`
   - Text: `text-accent`
   - Border: `border-accent/20`

**Sizes:**

- `sm`: `px-2 py-0.5`
- `md`: `px-2.5 py-1`
- `lg`: `px-3 py-1.5`

**Shape:** `rounded-full` (pill shape)

**Clickable:** If `onClick` provided, adds `cursor-pointer hover:opacity-80`

### 6.8 Dialog/Modal Component

**Location:** `/src/app/components/ui/dialog.tsx`

**Based on Radix UI Dialog**

**Composition:**

```jsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Styling:**

- Overlay: `bg-black/50` with fade animation
- Content: `bg-background rounded-lg border p-6 shadow-lg`
- Max width: `sm:max-w-lg`
- Position: Centered (`top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]`)
- Close button: Top-right corner with X icon
- Z-index: `z-50`

**Animations:**

- Fade in/out
- Zoom in/out (95% to 100%)

### 6.9 Tabs Component

**Location:** `/src/app/components/ui/tabs.tsx`

**Based on Radix UI Tabs**

**Composition:**

```jsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Content 1
  </TabsContent>
  <TabsContent value="tab2">
    Content 2
  </TabsContent>
</Tabs>
```

**Styling:**

- List: `bg-muted rounded-xl p-[3px]` (pill container)
- Trigger: `rounded-xl px-2 py-1 text-sm`
- Active trigger: `bg-card` with border
- Focus ring: `focus-visible:ring-[3px]`

### 6.10 Loading State Component

**Location:** `/src/app/components/ui/loading-state.tsx`

**Sizes:**

- `sm`: `w-4 h-4`
- `md`: `w-8 h-8`
- `lg`: `w-12 h-12`
- `xl`: `w-16 h-16`

**Variants:**

```jsx
<LoadingState size="md" message="Loading..." />
<PageLoadingState message="Loading page..." />
<InlineLoadingState message="Processing..." />
<CardLoadingState message="Loading data..." />
```

**Spinner:**

- Icon: `Loader2` from lucide-react
- Color: `text-primary`
- Animation: `animate-spin`

**Fullscreen:**

- `fullscreen` prop: Fixed overlay with backdrop blur
- Z-index: `z-50`

### 6.11 Error State Component

**Location:** `/src/app/components/ui/error-state.tsx`

**Variants:**

```typescript
variant: "error" | "warning" | "network" | "notFound";
```

**Variant Icons:**

- `error`: XCircle (red)
- `warning`: AlertTriangle (amber)
- `network`: WifiOff (red)
- `notFound`: AlertCircle (secondary)

**Components:**

```jsx
<ErrorState
  variant="error"
  title="Custom Title"
  message="Error message"
  onRetry={handleRetry}
  isRetrying={isRetrying}
/>

<PageErrorState {...props} />
<CardErrorState {...props} />
<InlineErrorState message="Error" variant="error" />
```

**Retry Button:**

- Variant: `outline`
- Icon: `RefreshCw` (spins when `isRetrying`)

### 6.12 Chart Component

**Location:** `/src/app/components/ui/chart.tsx`

**Based on Recharts**

**Usage:**

```jsx
<ChartContainer config={chartConfig}>
  <LineChart data={data}>
    <Line dataKey="value" stroke="var(--color-chart-1)" />
  </LineChart>
</ChartContainer>
```

**Chart Config:**

```typescript
const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
};
```

**Colors:**
Use `--chart-1` through `--chart-5` for data series

**Min Height:** `min-h-[200px]`

**Aspect Ratio:** `aspect-video` (default)

---

## 7. UX Pattern Library

### 7.1 Layer Navigation Pattern

**Purpose:** Allow users to navigate between different levels of detail (L1: Overview, L2: Detailed, L3: Deep-Dive)

**Component:** `LayerNavigation`

**Location:** `/src/app/components/layers/LayerNavigation.tsx`

**Context:** `LayerContext` (`/src/app/context/LayerContext.tsx`)

**Layer Levels:**

```typescript
type LayerLevel = 1 | 2 | 3;
```

- Layer 1: Executive/Strategic view (KPIs, high-level metrics)
- Layer 2: Detailed/Analytical view (charts, tables, detailed data)
- Layer 3: Deep-Dive/Technical view (granular data, advanced analytics)

**Variants:**

- `buttons`: Full button navigation
- `toggle`: Quick toggle buttons (collapse/expand)
- `minimal`: Compact chevron navigation

**Global Layer Preference:**

- Stored in LayerContext: `globalLayerPreference`
- Affects all dashboard KPIs and widgets

**Usage:**

```jsx
const { currentLayer, setLayer } = useLayer();

<LayerNavigation
  currentLayer={currentLayer}
  availableLayers={[1, 2, 3]}
  onLayerChange={setLayer}
  variant="buttons"
/>
```

### 7.2 Asset Selector Pattern

**Purpose:** Switch between different assets/fields

**Component:** `AssetSelector`

**Location:** `/src/app/components/AssetSelector.tsx`

**Context:** `AssetContext` (`/src/app/context/AssetContext.tsx`)

**Asset Interface:**

```typescript
interface Asset {
  id: string;
  name: string;
  code: string;
  type: "onshore" | "offshore";
  status: "active" | "planning" | "development";
  wells: number;
  reserves: string;
  production: { oil: number; gas: number; water: number };
  // ... more properties
}
```

**Selection Updates:**

- Global asset state via AssetContext
- All screens reflect selected asset
- Persisted in localStorage

### 7.3 AI Oracle Chat Pattern

**Purpose:** Contextual AI assistant accessible from anywhere

**Component:** `AIOracle`

**Location:** `/src/app/components/AIOracle.tsx`

**Context:** `ChatContext` (`/src/app/context/ChatContext.tsx`)

**Trigger:**

- Sidebar chat icon button
- Floating action button (some screens)

**Behavior:**

- Modal overlay (right side or full screen on mobile)
- Chat interface with message history
- Context-aware suggestions
- Close with X button or ESC key

### 7.4 Global Search Pattern

**Purpose:** Search across all data, screens, and resources

**Component:** `GlobalSearch`

**Location:** `/src/app/components/GlobalSearch.tsx`

**Context:** `SearchContext` (`/src/app/context/SearchContext.tsx`)

**Triggers:**

- TopBar search button
- Keyboard shortcut: Ctrl+K / Cmd+K

**Behavior:**

- Command palette style modal
- Instant search results
- Keyboard navigation
- Recent searches

### 7.5 Real-Time Sync Indicator Pattern

**Purpose:** Show data synchronization status

**Component:** `RealTimeSyncIndicator`

**Location:** `/src/app/components/RealTimeSyncIndicator.tsx`

**Variants:**

- `compact`: Icon + status dot
- `full`: Icon + text + timestamp

**States:**

- Syncing: Animated spinner
- Synced: Green check icon
- Error: Red warning icon

**Placement:** TopBar (right section)

### 7.6 Data Annotation Pattern

**Purpose:** Collaborative annotation and markup on data visualizations

**Component:** `DataAnnotationToolbar`

**Location:** `/src/app/components/collaboration/DataAnnotationToolbar.tsx`

**Context:** `CollaborationContext` (`/src/app/context/CollaborationContext.tsx`)

**Tools:**

- Pointer (select)
- Pen (draw)
- Highlighter
- Comment
- Eraser
- Camera (snapshot)

**Behavior:**

- Floating toolbar at bottom center
- Pill-shaped with tool buttons
- Active tool highlighted
- Close button

**Activation:**

- Via collaboration menu/button
- Context-specific screens

### 7.7 Workflow Orchestration Pattern

**Purpose:** Visualize and manage multidisciplinary workflows

**Component:** `WorkflowOrchestration`

**Location:** `/src/app/components/workflow/WorkflowOrchestration.tsx`

**Context:** `WorkflowContext` (`/src/app/context/WorkflowContext.tsx`)

**Features:**

- Stage progression visualization
- Gate criteria tracking
- Bottleneck detection
- Discipline connections
- Real-time status updates

**Workflow Stages:**

```typescript
type WorkflowStageStatus =
  | "not-started"
  | "ready"
  | "in-progress"
  | "blocked"
  | "completed"
  | "failed";
```

### 7.8 Confirmation Dialog Pattern

**Purpose:** Confirm destructive or important actions

**Component:** `ConfirmationDialog`

**Location:** `/src/app/components/ui/confirmation-dialog.tsx` and `ConfirmationContext`

**Context:** `ConfirmationContext` (`/src/app/context/ConfirmationContext.tsx`)

**Usage:**

```jsx
const { confirmDanger, confirmWarning } = useConfirmation();

const handleDelete = async () => {
  const confirmed = await confirmDanger({
    title: 'Delete Item',
    message: 'Are you sure? This cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel'
  });

  if (confirmed) {
    // Proceed with deletion
  }
};
```

**Types:**

- `confirmDanger`: Red destructive action
- `confirmWarning`: Amber warning action
- `confirmInfo`: Blue informational confirmation

### 7.9 Notification Pattern

**Purpose:** Display toast notifications for user feedback

**Component:** `Toaster` (from sonner)

**Location:** `/src/app/components/ui/toaster.tsx`

**Usage:**

```jsx
import { toast } from 'sonner';

toast.success('Operation successful');
toast.error('An error occurred');
toast.info('Information message');
toast.warning('Warning message');
toast.loading('Processing...');
```

**Placement:** Top-right corner (by default)

**Behavior:**

- Auto-dismiss after 5 seconds (configurable)
- Dismissible with X button
- Stacks multiple notifications

### 7.10 Screen Wrapper Pattern

**Purpose:** Standardize loading/error/content states for screens

**Component:** `ScreenWrapper`

**Location:** `/src/app/components/ui/screen-wrapper.tsx`

**Usage:**

```jsx
export function MyScreen() {
  const { data, isLoading, error, refetch } = useAsyncData();

  return (
    <ScreenWrapper
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      loadingMessage="Loading screen data..."
    >
      <div>{/* Render content when data is ready */}</div>
    </ScreenWrapper>
  );
}
```

**Behavior:**

- Shows `PageLoadingState` when `isLoading`
- Shows `PageErrorState` when `error`
- Renders `children` when ready

---

## 8. Interaction & Behavior Rules

### 8.1 Hover States

**Interactive Elements:**

- Buttons: Opacity change or background color shift
- Cards (clickable): `hover:border-card-hover hover:shadow-glow-hover`
- Links: `hover:underline` or color change
- Icon buttons: `hover:bg-white/5`
- Navigation items: `hover:bg-white/5 hover:text-text-primary`

**Transition:**

- All hover states: `transition-all duration-200` or `transition-colors`

### 8.2 Focus States

**Focus Ring:**

- Color: `ring-primary` or `ring-ring`
- Width: `ring-2` (buttons), `ring-1` (inputs), `ring-[3px]` (form elements)
- Offset: `ring-offset-2` (buttons)
- Opacity: `ring-ring/50` (form elements)

**Focus Classes:**

```
focus:outline-none
focus:ring-2
focus:ring-primary
focus:ring-offset-2
```

**Keyboard Navigation:**

- All interactive elements MUST be keyboard accessible
- Tab order MUST follow visual order
- Enter/Space key MUST activate buttons and links

### 8.3 Active States

**Buttons:**

- Scale down slightly: `active:scale-[0.99]` (for clickable cards)
- No active state for most buttons (rely on click feedback)

**Navigation:**

- Active route: `bg-primary/10 text-primary border-l-4 border-primary`

### 8.4 Loading States

**Button Loading:**

- Show `Loader2` icon with `animate-spin`
- Disable button: `disabled={isLoading}`
- Text: "Loading..." or keep original text

**Page Loading:**

- Use `PageLoadingState` component
- Center spinner with message

**Inline Loading:**

- Use `InlineLoadingState` for small sections
- Spinner + optional message

**Skeleton Loading:**

- Use `Skeleton` component for content placeholders
- Match layout of actual content

### 8.5 Disabled States

**All Interactive Elements:**

- Opacity: `disabled:opacity-50`
- Cursor: `disabled:cursor-not-allowed`
- Pointer events: Automatically disabled by `disabled` attribute

**Visual Indicators:**

- Gray out content
- Remove hover effects
- Show tooltip explaining why disabled (optional)

### 8.6 Error States

**Form Inputs:**

- Border: `border-danger`
- Focus ring: `focus:ring-danger focus:border-danger`
- Error message: Below input, `text-caption text-danger`

**Page Errors:**

- Use `ErrorState` or `PageErrorState` component
- Provide retry button when applicable
- Clear error message

**Toast Notifications:**

- Use `toast.error()` for non-critical errors
- Use modal dialogs for critical errors

### 8.7 Success States

**Feedback:**

- Toast notification: `toast.success()`
- Success badge/icon (green checkmark)
- Color: `text-success` or `bg-success/10`

**Form Submission:**

- Show success message
- Clear form or redirect
- Disable submit button during processing

### 8.8 Modal/Dialog Behavior

**Opening:**

- Fade in overlay
- Zoom in content (95% to 100%)
- Trap focus inside modal
- Disable scrolling on body

**Closing:**

- ESC key
- Click outside overlay (configurable)
- X button (top-right)
- Cancel button

**Animations:**

- Duration: 200ms
- Easing: ease-in-out

### 8.9 Dropdown/Popover Behavior

**Opening:**

- Click trigger
- Focus trigger + Enter/Space
- Auto-position to avoid viewport edges

**Closing:**

- Click outside
- ESC key
- Select item (if applicable)

**Navigation:**

- Arrow keys to navigate items
- Enter to select
- Type to filter/search (if applicable)

### 8.10 Sidebar Behavior

**Toggle:**

- Click collapse button
- Keyboard: Focus button + Enter/Space
- Smooth transition (200ms)

**Collapsed State:**

- Show icons only
- Tooltip on hover for each item
- Expand on hover (optional)

**Navigation:**

- Highlight active route
- Scroll to active item on load
- Keyboard navigation (Tab, Arrow keys)

---

## 9. Navigation System

### 9.1 Routing Architecture

**Router:** React Router v7 (Data mode pattern)

**Entry Point:** `/src/app/App.tsx`

**Router Setup:**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
    {/* More routes */}
  </Routes>
</BrowserRouter>
```

### 9.2 Route Structure

**Root Routes:**

- `/` - Login (entry point, no AppLayout)
- `/dashboard` - Main dashboard (with AppLayout)

**Module Routes:**

- `/data-health` - Data Health module
  - `/data-health/static-model`
  - `/data-health/well-data`
  - `/data-health/petrophysical-logs`
  - `/data-health/geological-interpretations`
  - `/data-health/geophysical-data`
  - `/data-health/production-history`

- `/history-matching` - History Matching module
  - `/history-matching/ai-led`
  - `/history-matching/comparison`

- `/uncertainty` - Uncertainty Analysis module
  - `/uncertainty/subsurface`
  - `/uncertainty/operational`
  - `/uncertainty/cross-domain`
  - `/uncertainty/market-volatility`
  - `/uncertainty/simulation-comparison`

- `/insights` - Insights & Decisions module
  - `/insights/deep-dive`
  - `/insights/deep-dive-analytics`
  - `/insights/multidisciplinary-workflow`
  - `/insights/governance-audit`
  - `/insights/decision-approval`
  - `/insights/ai-led-integration`

- `/fdp-summary` - FDP Summary module
- `/ai-agents-management` - AI Agents Management
- `/cross-discipline-visibility` - Cross-Discipline Visibility
- `/forum` - Discussion Forum (Collaboration)

**Fallback:**

- `*` - Redirect to `/dashboard`

### 9.3 Sidebar Navigation Hierarchy

**Main Modules:**

```typescript
const modules = [
  {
    id: "dashboard",
    label: "FDP Nerve Center",
    icon: LayoutGrid,
    path: "/dashboard",
  },
  {
    id: "data-health",
    label: "Data Health",
    icon: Database,
    path: "/data-health",
  },
  {
    id: "history-matching",
    label: "History Matching",
    icon: ClockArrowDown,
    path: "/history-matching",
  },
  {
    id: "uncertainty",
    label: "Uncertainty Analysis",
    icon: ScatterChart,
    path: "/uncertainty",
  },
  {
    id: "insights",
    label: "Insights & Decisions",
    icon: Lightbulb,
    path: "/insights",
  },
  {
    id: "fdp-summary",
    label: "FDP Summary",
    icon: FileText,
    path: "/fdp-summary",
  },
  {
    id: "ai-agents",
    label: "AI Agents",
    icon: Bot,
    path: "/ai-agents-management",
    badge: "12",
  },
];
```

**Active State Logic:**

```typescript
const isActive =
  location.pathname === module.path ||
  location.pathname.startsWith(module.path + "/");
```

### 9.4 Breadcrumb Rules

**Format:** `Home > Section > Subsection > Current Page`

**Mapping:** Centralized in `BREADCRUMB_MAP` in App.tsx

**Example:**

```
Home > Data Health > Well Data
Home > Uncertainty & Sensitivity > Subsurface Uncertainty
```

**Implementation:**

- Uses React Router `Link` for navigation
- Last item is non-clickable (current page)
- Separator: `/` icon

### 9.5 Deep Linking

**All routes MUST be bookmarkable and shareable**

**State Management:**

- Use URL parameters for view state (filters, tabs, selected items)
- Example: `/data-health/well-data?filter=active&sort=name`

**Scroll Restoration:**

- Automatically handled by `ScrollToTop` component
- Scrolls to top on route change

---

## 10. Data Visualization Standards

### 10.1 Chart Library

**Primary:** Recharts (v2.15.2)

**Wrapper:** `ChartContainer` component (`/src/app/components/ui/chart.tsx`)

### 10.2 Chart Types

**Supported:**

- Line Chart (trends, time series)
- Bar Chart (comparisons, categories)
- Area Chart (cumulative trends)
- Pie Chart / Donut Chart (proportions)
- Scatter Chart (correlations, uncertainty)
- Radar Chart (multi-dimensional comparisons)
- Tornado Chart (sensitivity analysis)
- Pareto Chart (optimization frontiers)

### 10.3 Chart Colors

**MUST use design system chart colors:**

```css
--chart-1: rgba(93, 75, 122, 1)
  /* Purple - Primary data series */
  --chart-2: rgba(59, 130, 246, 1) /* Blue - Secondary series */
  --chart-3: rgba(34, 197, 94, 1) /* Green - Positive/success */
  --chart-4: rgba(245, 158, 11, 1) /* Amber - Warning/caution */
  --chart-5: rgba(212, 32, 32, 1) /* Red - Negative/danger */;
```

**Usage:**

```jsx
<Line dataKey="value" stroke="var(--color-chart-1)" />
<Bar dataKey="amount" fill="var(--color-chart-2)" />
```

### 10.4 Chart Configuration

**Chart Config Pattern:**

```typescript
const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)"
  },
  target: {
    label: "Target",
    color: "var(--chart-2)"
  }
};

<ChartContainer config={chartConfig}>
  <LineChart data={data}>...</LineChart>
</ChartContainer>
```

### 10.5 Chart Styling

**Container:**

- Min height: `min-h-[200px]`
- Aspect ratio: `aspect-video` (default) or custom
- Background: Transparent or `bg-card`

**Grid Lines:**

- Stroke: `stroke-border/50`

**Axis:**

- Text: `text-muted-foreground`
- Font size: `text-xs`

**Tooltips:**

- Background: `bg-popover`
- Border: `border border-card-border`
- Shadow: `shadow-md`

**Legend:**

- Position: Bottom or right
- Alignment: Center
- Font size: `text-xs`

### 10.6 Interactive Behavior

**Hover:**

- Show tooltip with data values
- Highlight data point/bar

**Click (optional):**

- Drill-down to detail view
- Filter/select data

**Zoom/Pan (for large datasets):**

- Enable when data points > 50
- Reset button

### 10.7 Responsive Charts

**Breakpoints:**

- Mobile: Single column, reduced height
- Tablet: 2 columns
- Desktop: 2-3 columns, full height

**Text:**

- Hide axis labels on small screens if needed
- Shorten labels (abbreviations)

### 10.8 KPI Card Rules

**Component:** `StatCard`

**Layout:**

- Label (top)
- Value (large, bold)
- Trend indicator (optional, with icon and direction)
- Description (bottom, optional)

**Colors:**

- Use semantic colors for trends (success/danger)
- Neutral for metrics without trend

**Icon Usage:**

- TrendingUp (green) for positive trends
- TrendingDown (red) for negative trends
- Minus (gray) for neutral/no change

---

## 11. Accessibility Rules

### 11.1 WCAG 2.1 AA Compliance

**This application MUST meet WCAG 2.1 AA standards**

**Key Requirements:**

- Color contrast ratio ≥ 4.5:1 for normal text
- Color contrast ratio ≥ 3:1 for large text (18pt+)
- All functionality keyboard accessible
- Focus indicators visible and clear
- ARIA labels for all interactive elements
- Semantic HTML structure

### 11.2 Color Contrast

**Design System Compliance:**
All color tokens in `/src/styles/theme.css` are designed to meet WCAG AA standards.

**Verification:**

- Text on `--background`: Use `--foreground` or `--text-primary`
- Text on `--card`: Use `--card-foreground` or `--text-primary`
- Text on `--primary`: Use `--primary-foreground` (white)
- Text on colored backgrounds: Use corresponding `-foreground` token

**Never:**

- ❌ Low contrast combinations (e.g., light gray on white)
- ❌ Color as the only indicator (always include text/icon)

### 11.3 Keyboard Navigation

**Tab Order:**

- MUST follow visual/logical order
- No keyboard traps
- Skip to main content link (optional)

**Interactive Elements:**

- All buttons, links, inputs: `tabindex="0"` (default) or focusable
- Disabled elements: `tabindex="-1"` or `disabled` attribute
- Modals: Trap focus inside, return focus on close

**Keyboard Shortcuts:**

- ESC: Close modals/dialogs
- Enter: Activate buttons/links
- Space: Activate buttons (not links)
- Arrow keys: Navigate lists/menus/tabs
- Ctrl+K / Cmd+K: Open global search

### 11.4 Focus Indicators

**All focusable elements MUST have visible focus indicators**

**Standard Focus Ring:**

```css
focus:outline-none
focus:ring-2
focus:ring-primary
focus:ring-offset-2
```

**Form Elements:**

```css
focus:ring-1
focus:ring-primary
focus:border-primary
```

**Never:**

- ❌ `outline: none` without custom focus indicator
- ❌ Invisible or very subtle focus states

### 11.5 ARIA Labels

**Interactive Elements:**

```jsx
<button aria-label="Close dialog">
  <X className="w-4 h-4" />
</button>

<Link to="/dashboard" aria-label="Go to dashboard">
  <img src={logo} alt="UpstreamAI Logo" />
</Link>
```

**Form Inputs:**

```jsx
<Input
  id="email"
  label="Email Address"
  aria-describedby="email-error"
  aria-invalid={!!error}
/>
{error && <p id="email-error" className="text-danger">{error}</p>}
```

**Dynamic Content:**

```jsx
<div aria-live="polite" aria-atomic="true">
  {notification}
</div>
```

**Loading States:**

```jsx
<div role="status" aria-live="polite">
  <Loader2 className="animate-spin" />
  <span className="sr-only">Loading...</span>
</div>
```

### 11.6 Semantic HTML

**Use semantic elements:**

- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- `<button>` for clickable actions (not `<div>`)
- `<a>` for navigation (not `<button>`)
- `<h1>` - `<h6>` for headings hierarchy
- `<ul>`, `<ol>`, `<li>` for lists
- `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` for tabular data

**Never:**

- ❌ `<div onClick>` (use `<button>`)
- ❌ `<span onClick>` (use `<button>` or `<a>`)
- ❌ Skip heading levels (h1 → h3)

### 11.7 Screen Reader Support

**Visually Hidden Content:**

```jsx
<span className="sr-only">Close</span>
```

**Image Alt Text:**

```jsx
<img src={logo} alt="UpstreamAI Logo" />
<img src={chart} alt="Production trend chart showing 15% increase" />
```

**Icon-Only Buttons:**

```jsx
<button aria-label="Settings">
  <Settings className="w-4 h-4" />
  <span className="sr-only">Settings</span>
</button>
```

### 11.8 Form Accessibility

**Labels:**

- MUST be associated with inputs (`htmlFor` / `id`)
- Visible labels preferred (not placeholder-only)

**Error Messages:**

- Associated with inputs (`aria-describedby`)
- Clear, actionable messages
- Announced to screen readers

**Required Fields:**

```jsx
<Input
  label="Email"
  required
  aria-required="true"
/>
```

**Form Validation:**

- Real-time or on blur (not just on submit)
- Clear error indicators (color + icon + text)
- Focus first error on submit

### 11.9 Modal/Dialog Accessibility

**Focus Management:**

- Trap focus inside modal when open
- Return focus to trigger when closed
- Set initial focus to first interactive element

**ARIA Attributes:**

```jsx
<Dialog
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
  aria-modal="true"
>
  <h2 id="dialog-title">Dialog Title</h2>
  <p id="dialog-description">Description</p>
</Dialog>
```

**Close Behavior:**

- ESC key closes modal
- Click outside closes (optional, must be announced)
- Close button with visible label

### 11.10 Table Accessibility

**Semantic Structure:**

```jsx
<table>
  <thead>
    <tr>
      <th scope="col">Column 1</th>
      <th scope="col">Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

**Sortable Columns:**

```jsx
<th scope="col" aria-sort="ascending">
  <button onClick={handleSort}>Name</button>
</th>
```

**Responsive Tables:**

- Horizontal scroll container
- Sticky headers (optional)
- Mobile: Consider card view for complex tables

---

## 12. Responsive Design Rules

### 12.1 Breakpoint Strategy

**Mobile-First Approach:**

- Design for mobile first
- Enhance for larger screens

**Breakpoints:**

```
sm:  640px  (Small tablets, large phones)
md:  768px  (Tablets)
lg:  1024px (Small laptops, large tablets)
xl:  1280px (Desktops)
2xl: 1536px (Large desktops)
```

### 12.2 Layout Patterns

**Grid Layouts:**

```jsx
{/* 1 column on mobile, 2 on tablet, 3 on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>

{/* 1 column on mobile, 4 on desktop */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  {kpis.map(kpi => <StatCard key={kpi.id} {...kpi} />)}
</div>
```

**Flex Layouts:**

```jsx
{/* Stack on mobile, row on desktop */}
<div className="flex flex-col lg:flex-row gap-4">
  <div className="flex-1">Content</div>
  <div className="lg:w-80">Sidebar</div>
</div>
```

### 12.3 Sidebar Responsive Behavior

**Breakpoints:**

- `< md` (< 768px): Auto-collapse sidebar to icon-only mode
- `≥ md`: User-controlled collapse state

**Mobile:**

- Consider drawer/sheet overlay instead of fixed sidebar
- Or always collapsed with hamburger menu

### 12.4 TopBar Responsive Behavior

**Mobile:**

- Hide search bar text, show icon button only
- Move user menu to dropdown
- Stack elements vertically if needed

**Tablet/Desktop:**

- Full search bar visible
- Horizontal layout

### 12.5 Typography Responsive

**DO NOT scale typography automatically**

**Exception:** Very large headings may scale down on mobile if needed:

```jsx
<h1 className="text-h1 lg:text-[48px]">Title</h1>
```

**Preferred:** Use consistent typography sizes, adjust layout instead

### 12.6 Spacing Responsive

**Reduce padding on mobile:**

```jsx
<div className="p-4 lg:p-8">Content</div>
<div className="px-4 lg:px-6 py-3">Section</div>
```

**Reduce gaps on mobile:**

```jsx
<div className="grid gap-4 lg:gap-6">...</div>
```

### 12.7 Table Responsive

**Small Screens:**

- Horizontal scroll container

```jsx
<div className="overflow-x-auto">
  <Table>...</Table>
</div>
```

**Alternative:** Card view on mobile

```jsx
<div className="hidden lg:block">
  <Table>...</Table>
</div>
<div className="lg:hidden space-y-4">
  {data.map(item => <Card key={item.id}>{/* Card layout */}</Card>)}
</div>
```

### 12.8 Chart Responsive

**Height Adjustments:**

```jsx
<ChartContainer className="h-[300px] lg:h-[400px]">
  <LineChart>...</LineChart>
</ChartContainer>
```

**Hide Labels:**

- Consider hiding axis labels on very small screens
- Or use abbreviations

**Single Column:**

```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card>
    <ChartContainer>...</ChartContainer>
  </Card>
</div>
```

### 12.9 Modal/Dialog Responsive

**Mobile:**

- Full screen or near-full screen
- Bottom sheet for small modals

**Desktop:**

- Centered, max-width limited
- Breathing room around modal

```jsx
<DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
  ...
</DialogContent>
```

### 12.10 Touch Target Sizes

**Minimum Touch Target:** 44x44 px (WCAG 2.1)

**Buttons:**

- Default height: `h-10` (40px) - increase to `h-12` on mobile if needed
- Icon buttons: `size-9` (36px) - increase to `size-12` on mobile

**Clickable Areas:**

- Add padding around small elements
- Increase tap area for icons

---

## 13. Context System

### 13.1 Context Providers

**Hierarchical Order (from outer to inner):**

1. **ThemeProvider** - Dark/light mode
2. **ConfirmationProvider** - Confirmation dialogs
3. **NotificationsProvider** - Toast notifications
4. **SearchProvider** - Global search state
5. **SidebarProvider** - Sidebar collapse state
6. **ChatProvider** - AI Oracle chat state
7. **AssetProvider** - Selected asset state
8. **UserProvider** - Current user and permissions
9. **WorkflowProvider** - Workflow orchestration state
10. **LayerProvider** - Layer navigation state
11. **CollaborationProvider** - Annotation/collaboration state

**Location:** `/src/app/context/`

### 13.2 Theme Context

**Location:** `/src/app/context/ThemeContext.tsx`

**Usage:**

```jsx
const { theme, toggleTheme } = useTheme();

// theme: 'light' | 'dark'
// toggleTheme: () => void
```

**Implementation:**

- Persists to localStorage
- Applies `.dark` class to `<html>` element
- CSS variables automatically update

### 13.3 Asset Context

**Location:** `/src/app/context/AssetContext.tsx`

**Usage:**

```jsx
const { selectedAsset, setSelectedAsset, availableAssets } = useAsset();

// selectedAsset: Asset
// setSelectedAsset: (asset: Asset) => void
// availableAssets: Asset[]
```

**Asset Interface:**

```typescript
interface Asset {
  id: string;
  name: string;
  code: string;
  type: "onshore" | "offshore";
  status: "active" | "planning" | "development";
  // ... production, wells, reserves, etc.
}
```

### 13.4 User Context

**Location:** `/src/app/context/UserContext.tsx`

**Usage:**

```jsx
const {
  user,
  setUser,
  hasAccessToDiscipline,
  canViewAllDisciplines
} = useUser();

// Check access
if (hasAccessToDiscipline('reservoir')) {
  // Show reservoir data
}
```

**User Roles:**

```typescript
type UserRole =
  | "Reservoir Engineer"
  | "Geoscientist"
  | "Production Engineer"
  | "Facilities Engineer"
  | "Drilling Engineer"
  | "Geomechanics Engineer"
  | "Petrophysicist"
  | "Asset Manager"
  | "Executive"
  | "Administrator";
```

### 13.5 Layer Context

**Location:** `/src/app/context/LayerContext.tsx`

**Usage:**

```jsx
const {
  globalLayerPreference,
  setGlobalLayerPreference,
  currentLayers,
  setLayer,
  getLayer,
  registerItem
} = useLayer();

// Set global layer preference
setGlobalLayerPreference(2); // Switch to Layer 2

// Register item with available layers
registerItem({
  itemId: 'well-data-chart',
  availableLayers: [1, 2, 3],
  defaultLayer: 1
});

// Set layer for specific item
setLayer('well-data-chart', 2);
```

**Layer Levels:**

- `1`: Executive/Overview (high-level KPIs)
- `2`: Detailed/Analytical (detailed charts, tables)
- `3`: Deep-Dive/Technical (granular data, advanced analytics)

### 13.6 Workflow Context

**Location:** `/src/app/context/WorkflowContext.tsx`

**Usage:**

```jsx
const {
  stages,
  disciplines,
  metrics,
  updateStageStatus,
  checkGateCriteria,
  resolveBottleneck
} = useWorkflow();
```

**Workflow Stages:**

```typescript
type WorkflowStageStatus =
  | "not-started"
  | "ready"
  | "in-progress"
  | "blocked"
  | "completed"
  | "failed";
```

### 13.7 Collaboration Context

**Location:** `/src/app/context/CollaborationContext.tsx`

**Usage:**

```jsx
const {
  isAnnotationToolbarVisible,
  setAnnotationToolbarVisible,
  isCommentsPanelOpen,
  setCommentsPanelOpen
} = useCollaboration();

// Show annotation toolbar
setAnnotationToolbarVisible(true);
```

### 13.8 Chat Context

**Location:** `/src/app/context/ChatContext.tsx`

**Usage:**

```jsx
const { isChatOpen, openChat, closeChat } = useChat();

// Open AI Oracle
openChat();
```

### 13.9 Search Context

**Location:** `/src/app/context/SearchContext.tsx`

**Usage:**

```jsx
const { isSearchOpen, openSearch, closeSearch } = useSearch();

// Open global search
openSearch();
```

### 13.10 Sidebar Context

**Location:** `/src/app/context/SidebarContext.tsx`

**Usage:**

```jsx
const { isCollapsed, toggleSidebar, setCollapsed } = useSidebar();

// Toggle sidebar
toggleSidebar();

// Set specific state
setCollapsed(true);
```

---

## 14. Naming Conventions

### 14.1 Component Naming

**PascalCase for all components:**

```
Button.tsx
Card.tsx
StatCard.tsx
LoadingState.tsx
ErrorState.tsx
```

**Compound Components:**

```
Card.tsx → Card, CardHeader, CardContent, CardFooter
Table.tsx → Table, TableHeader, TableBody, TableRow, TableCell
```

### 14.2 File Naming

**Components:** PascalCase with `.tsx` extension

```
/components/Button.tsx
/components/ui/card.tsx
/screens/Dashboard.tsx
```

**Contexts:** PascalCase with `Context` suffix

```
/context/ThemeContext.tsx
/context/AssetContext.tsx
```

**Utilities:** camelCase with `.ts` extension

```
/utils/cn.ts
/utils/formatDate.ts
```

**Styles:** kebab-case with `.css` extension

```
/styles/theme.css
/styles/fonts.css
```

### 14.3 CSS Variable Naming

**Design Tokens:** kebab-case with `--` prefix

```css
--background
--foreground
--primary
--card-border
--text-h1
--font-family-primary
```

**Semantic Tokens:** Descriptive names

```css
--success
--danger
--warning
--info
```

### 14.4 Tailwind Class Naming

**NEVER create custom Tailwind classes in JS files**

**Use semantic utility classes from theme.css:**

```
.text-h1
.text-body
.text-label
.font-primary
```

### 14.5 Context Hook Naming

**Pattern:** `use` + `ContextName` (without "Context")

```typescript
useTheme(); // ThemeContext
useAsset(); // AssetContext
useUser(); // UserContext
useLayer(); // LayerContext
```

### 14.6 Route Path Naming

**kebab-case:**

```
/dashboard
/data-health
/history-matching
/ai-agents-management
/cross-discipline-visibility
```

**Nested routes:**

```
/data-health/well-data
/uncertainty/subsurface
/insights/deep-dive-analytics
```

### 14.7 Asset/Data Naming

**Branding:**

- Platform: "UpstreamAI FDP"
- Company: "UpstreamAI"
- Email domain: `@upstreamai.ae`

**File exports:**

- Prefix with `UpstreamAI_`
- Example: `UpstreamAI_FDP_Report_2026.pdf`

**Storage keys:**

- Prefix with `upstreamAI_`
- Example: `upstreamAI_selectedAsset`, `upstreamAI_theme`

---

## 15. AI Generation Rules

### 15.1 Design System Enforcement

**RULE 1: Token-Only Design**

ALL design decisions MUST use CSS variables from `/src/styles/theme.css`.

**NEVER generate code with:**

- ❌ Hardcoded colors (hex, rgb, rgba)
- ❌ Hardcoded spacing (px, rem)
- ❌ Hardcoded border radius
- ❌ Hardcoded font sizes
- ❌ Tailwind arbitrary values for design tokens

**ALWAYS generate code with:**

- ✅ CSS variables: `var(--primary)`, `var(--text-h1)`
- ✅ Tailwind semantic classes: `bg-primary`, `text-text-primary`
- ✅ Semantic typography classes: `.text-h1`, `.text-body`

**RULE 2: Typography Enforcement**

- ✅ Use `.text-h1`, `.text-h2`, `.text-body`, `.text-label`
- ❌ NEVER use `text-2xl`, `text-sm`, `font-bold`, `leading-tight`

**RULE 3: Component Reuse**

ALWAYS use existing components from `/src/app/components/ui/`:

- Button, Card, Input, Select, Table, Badge, Dialog, Tabs, etc.

NEVER create duplicate components.

### 15.2 Code Structure Rules

**RULE 1: Import Order**

```typescript
// 1. React and core libraries
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

// 2. UI components
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
} from "../components/ui/card";

// 3. Custom components
import { CustomWidget } from "../components/CustomWidget";

// 4. Contexts
import { useAsset } from "../context/AssetContext";

// 5. Utilities (from lib or ui/utils depending on location)
import { cn } from "../lib/utils"; // From screens or top-level components
// OR
import { cn } from "./utils"; // From within ui components

// 6. Icons
import { Save, Download } from "lucide-react";

// 7. Assets
import logo from "figma:asset/...";
```

**RULE 2: Component Structure**

```typescript
export function ComponentName() {
  // 1. Contexts
  const { value } = useContext();

  // 2. State
  const [state, setState] = useState();

  // 3. Refs
  const ref = useRef();

  // 4. Effects
  useEffect(() => {
    // ...
  }, []);

  // 5. Handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render helpers
  const renderItem = (item) => {
    // ...
  };

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

**RULE 3: TypeScript Types**

ALWAYS define interfaces for props:

```typescript
interface ComponentProps {
  title: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function Component({
  title,
  onClick,
  children,
}: ComponentProps) {
  // ...
}
```

### 15.3 Accessibility Enforcement

**RULE 1: Semantic HTML**

- ✅ Use `<button>` for actions
- ✅ Use `<a>` for navigation
- ❌ NEVER use `<div onClick>`

**RULE 2: ARIA Labels**

- All icon-only buttons MUST have `aria-label`
- Form inputs MUST have associated labels
- Dynamic content MUST have `aria-live`

**RULE 3: Keyboard Navigation**

- All interactive elements MUST be keyboard accessible
- Modals MUST trap focus
- Tab order MUST follow visual order

**RULE 4: Focus Indicators**

- ALL focusable elements MUST have visible focus ring
- Use standard focus ring classes

### 15.4 Responsive Design Enforcement

**RULE 1: Mobile-First**

- Start with mobile layout
- Enhance for larger screens using `md:`, `lg:`, `xl:`

**RULE 2: Grid Layouts**

```jsx
{/* Standard pattern: 1 col mobile, 2 tablet, 3 desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**RULE 3: Spacing**

```jsx
{/* Reduce padding on mobile */}
<div className="p-4 lg:p-8">
```

### 15.5 Error Handling Enforcement

**RULE 1: Use ErrorBoundary**

- Wrap all routes with ErrorBoundary
- Provide fallback UI

**RULE 2: Use ScreenWrapper**

```jsx
<ScreenWrapper
  isLoading={isLoading}
  error={error}
  onRetry={refetch}
>
  {/* Content */}
</ScreenWrapper>
```

**RULE 3: User Feedback**

- Show loading states during async operations
- Show error messages with retry option
- Show success feedback after actions

### 15.6 Performance Rules

**RULE 1: Lazy Loading**

- Use React.lazy() for large components
- Code-split routes

**RULE 2: Memoization**

- Use useMemo for expensive computations
- Use useCallback for event handlers passed to children
- Use React.memo for pure components

**RULE 3: Image Optimization**

- Use appropriate image formats
- Lazy load images below the fold

### 15.7 State Management Rules

**RULE 1: Context for Global State**

- Use contexts for truly global state (theme, user, asset)
- Don't overuse contexts for local state

**RULE 2: Local State**

- Use useState for component-local state
- Don't lift state unnecessarily

**RULE 3: Form State**

- Use react-hook-form for complex forms
- Local state for simple forms

### 15.8 Router Rules

**RULE 1: Use React Router Correctly**

- Import from `'react-router'` (NOT `'react-router-dom'`)
- Use `<Link>` for navigation (not `<a>` with `onClick`)
- Use `useNavigate` for programmatic navigation

**RULE 2: Route Wrapping**

```jsx
<Route
  path="/screen"
  element={
    <AppLayout>
      <ErrorBoundary>
        <ScreenComponent />
      </ErrorBoundary>
    </AppLayout>
  }
/>
```

---

## 16. Prohibited Actions

### 16.1 Design System Violations

**PROHIBITED:**

1. ❌ **Hardcoded Colors**

   ```jsx
   // WRONG
   <div style={{ color: '#372358' }}>
   <div className="text-[#372358]">
   <div className="bg-[rgba(55,35,88,1)]">
   ```

   ```jsx
   // CORRECT
   <div className="text-primary">
   <div className="bg-primary">
   ```

2. ❌ **Hardcoded Typography**

   ```jsx
   // WRONG
   <h1 className="text-4xl font-bold">
   <p className="text-sm leading-tight">
   ```

   ```jsx
   // CORRECT
   <h1 className="text-h1">
   <p className="text-body">
   ```

3. ❌ **Hardcoded Spacing**

   ```jsx
   // WRONG
   <div style={{ padding: '32px' }}>
   <div className="p-[32px]">
   ```

   ```jsx
   // CORRECT
   <div className="p-8">
   ```

4. ❌ **Non-Semantic Class Names**

   ```jsx
   // WRONG
   <div className="purple-card">
   <div className="big-text">
   ```

   ```jsx
   // CORRECT
   <Card variant="elevated">
   <h1 className="text-h1">
   ```

### 16.2 Component Violations

**PROHIBITED:**

1. ❌ **Duplicate Components**
   - NEVER create new button/card/input components
   - ALWAYS use components from `/src/app/components/ui/`

2. ❌ **Non-Semantic HTML**

   ```jsx
   // WRONG
   <div onClick={handleClick}>Click me</div>
   <span onClick={handleNav}>Go to page</span>
   ```

   ```jsx
   // CORRECT
   <button onClick={handleClick}>Click me</button>
   <Link to="/page">Go to page</Link>
   ```

3. ❌ **Missing Component Props**

   ```jsx
   // WRONG - Icon button without aria-label
   <button><Settings /></button>
   ```

   ```jsx
   // CORRECT
   <button aria-label="Settings">
     <Settings />
   </button>
   ```

### 16.3 Accessibility Violations

**PROHIBITED:**

1. ❌ **Missing Alt Text**

   ```jsx
   // WRONG
   <img src={logo} />
   ```

   ```jsx
   // CORRECT
   <img src={logo} alt="UpstreamAI Logo" />
   ```

2. ❌ **Inaccessible Forms**

   ```jsx
   // WRONG
   <input placeholder="Email" />
   ```

   ```jsx
   // CORRECT
   <Input id="email" label="Email Address" />
   ```

3. ❌ **Removed Focus Indicators**

   ```jsx
   // WRONG
   <button className="focus:outline-none">
   ```

   ```jsx
   // CORRECT
   <button className="focus:outline-none focus:ring-2 focus:ring-primary">
   ```

4. ❌ **Color-Only Indicators**

   ```jsx
   // WRONG - Color alone indicates status
   <div className="text-success">Active</div>
   ```

   ```jsx
   // CORRECT - Color + icon
   <div className="flex items-center gap-2 text-success">
     <CheckCircle className="w-4 h-4" />
     Active
   </div>
   ```

### 16.4 Routing Violations

**PROHIBITED:**

1. ❌ **Importing from react-router-dom**

   ```jsx
   // WRONG
   import { Link } from 'react-router-dom';
   ```

   ```jsx
   // CORRECT
   import { Link } from 'react-router';
   ```

2. ❌ **Manual Navigation**

   ```jsx
   // WRONG
   <a href="/dashboard">Dashboard</a>
   <button onClick={() => window.location.href = '/dashboard'}>
   ```

   ```jsx
   // CORRECT
   <Link to="/dashboard">Dashboard</Link>
   <button onClick={() => navigate('/dashboard')}>
   ```

### 16.5 State Management Violations

**PROHIBITED:**

1. ❌ **Prop Drilling**
   - NEVER pass props through 3+ levels
   - Use context for deeply nested shared state

2. ❌ **Incorrect Context Usage**

   ```jsx
   // WRONG - Using context before provider
   const value = useContext(SomeContext);
   ```

   ```jsx
   // CORRECT - Wrapped in provider
   <SomeProvider>
     <ComponentThatUsesContext />
   </SomeProvider>
   ```

### 16.6 Code Style Violations

**PROHIBITED:**

1. ❌ **Console Logs in Production**

   ```jsx
   // WRONG
   console.log('Debug info');
   ```

   ```jsx
   // CORRECT
   if (process.env.NODE_ENV === 'development') {
     console.log('Debug info');
   }
   ```

2. ❌ **Inline Styles for Design Tokens**

   ```jsx
   // WRONG
   <div style={{ color: 'purple' }}>
   ```

   ```jsx
   // CORRECT
   <div className="text-primary">
   ```

3. ❌ **Unused Imports**
   - ALWAYS remove unused imports

4. ❌ **Magic Numbers**

   ```jsx
   // WRONG
   const timeout = 3000;
   ```

   ```jsx
   // CORRECT
   const NOTIFICATION_TIMEOUT = 3000;
   ```

---

## 17. Validation Checklist

### 17.1 Design System Validation

**Before Committing Code, Verify:**

- [ ] No hardcoded colors (hex, rgb, rgba)
- [ ] All colors use CSS variables or Tailwind semantic classes
- [ ] No hardcoded font sizes (px, rem, or Tailwind size classes)
- [ ] All typography uses semantic classes (`.text-h1`, `.text-body`, etc.)
- [ ] No hardcoded spacing (px, rem)
- [ ] All spacing uses Tailwind scale (`p-8`, `gap-6`, etc.)
- [ ] All border radius uses design system tokens
- [ ] All shadows use design system tokens

### 17.2 Component Validation

**Before Committing Code, Verify:**

- [ ] Using existing components from `/src/app/components/ui/`
- [ ] Not creating duplicate buttons, cards, inputs, etc.
- [ ] All custom components have TypeScript interfaces
- [ ] All components use semantic HTML
- [ ] All icon-only elements have `aria-label`
- [ ] All interactive elements are keyboard accessible

### 17.3 Accessibility Validation

**Before Committing Code, Verify:**

- [ ] All images have `alt` text
- [ ] All form inputs have associated labels
- [ ] All interactive elements are semantic (`<button>`, `<a>`)
- [ ] All focusable elements have visible focus indicators
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text)
- [ ] No color-only indicators (always include icon/text)
- [ ] Keyboard navigation works for all interactions
- [ ] Modals trap focus and restore on close
- [ ] Screen reader support verified (aria-labels, aria-live, etc.)

### 17.4 Responsive Validation

**Before Committing Code, Verify:**

- [ ] Mobile-first approach used
- [ ] Layout tested at all breakpoints (320px, 768px, 1024px, 1280px)
- [ ] Touch targets ≥ 44x44px on mobile
- [ ] No horizontal scroll on any screen size
- [ ] Typography readable on all screen sizes
- [ ] Charts/tables responsive or scrollable

### 17.5 Performance Validation

**Before Committing Code, Verify:**

- [ ] No unnecessary re-renders (use React DevTools Profiler)
- [ ] Large components lazy loaded
- [ ] Images optimized and lazy loaded
- [ ] No blocking operations in render
- [ ] Expensive computations memoized

### 17.6 Router Validation

**Before Committing Code, Verify:**

- [ ] All imports from `'react-router'` (not `'react-router-dom'`)
- [ ] All routes wrapped in AppLayout (except Login)
- [ ] All routes wrapped in ErrorBoundary
- [ ] Breadcrumbs update correctly
- [ ] Browser back button works correctly
- [ ] Deep links work (direct URL access)

### 17.7 State Management Validation

**Before Committing Code, Verify:**

- [ ] Using correct context for global state
- [ ] Not overusing contexts for local state
- [ ] State updates don't cause unnecessary re-renders
- [ ] Forms use react-hook-form or local state appropriately

### 17.8 Error Handling Validation

**Before Committing Code, Verify:**

- [ ] All async operations have error handling
- [ ] Loading states shown during async operations
- [ ] Error states shown with retry option
- [ ] Success feedback provided after actions
- [ ] ErrorBoundary catches render errors

### 17.9 Code Quality Validation

**Before Committing Code, Verify:**

- [ ] No unused imports
- [ ] No console.logs (or wrapped in dev check)
- [ ] No magic numbers (use constants)
- [ ] TypeScript types defined for all props
- [ ] No TypeScript `any` types (unless absolutely necessary)
- [ ] Code formatted consistently
- [ ] Comments for complex logic

### 17.10 Branding Validation

**Before Committing Code, Verify:**

- [ ] Platform name: "UpstreamAI FDP"
- [ ] Company name: "UpstreamAI"
- [ ] Email domain: `@upstreamai.ae`
- [ ] File exports prefixed: `UpstreamAI_`
- [ ] Storage keys prefixed: `upstreamAI_`
- [ ] No references to old branding

---

## 18. Implementation Examples

### 18.1 Correct Dashboard Page

```tsx
import React from "react";
import { Link } from "react-router";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { StatCard } from "../components/ui/stat-card";
import { LayerNavigation } from "../components/layers/LayerNavigation";
import { useAsset } from "../context/AssetContext";
import { useLayer } from "../context/LayerContext";
import { Database, TrendingUp } from "lucide-react";

export function Dashboard() {
  const { selectedAsset } = useAsset();
  const { globalLayerPreference, setGlobalLayerPreference } =
    useLayer();

  const kpis = [
    {
      label: "Est. Ultimate Recovery",
      value: `${selectedAsset.recovery}%`,
      trend: { value: "+2.3%", direction: "up" as const },
    },
    {
      label: "Net Present Value",
      value: "$3.1B",
      trend: { value: "+8.2%", direction: "up" as const },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-h1 text-foreground">
            FDP Nerve Center
          </h1>
          <p className="text-body text-text-secondary mt-2">
            {selectedAsset.name} - Real-time dashboard
          </p>
        </div>

        {/* Layer Navigation */}
        <div className="mb-6">
          <LayerNavigation
            currentLayer={globalLayerPreference}
            availableLayers={[1, 2, 3]}
            onLayerChange={setGlobalLayerPreference}
            variant="buttons"
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpis.map((kpi, index) => (
            <StatCard key={index} {...kpi} />
          ))}
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Data Health</CardTitle>
                  <Badge
                    variant="warning"
                    size="sm"
                    className="mt-1"
                  >
                    78% Complete
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-body-small text-text-secondary mb-4">
                Monitor data quality and completeness across all
                disciplines
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/data-health">View Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### 18.2 Correct Form Component

```tsx
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  role: string;
}

export function UserForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Partial<FormData> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.role) newErrors.role = "Role is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("User created successfully");
      setFormData({ name: "", email: "", role: "" });
    } catch (error) {
      toast.error("Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-h1 text-foreground">
            Create User
          </h1>
          <p className="text-body text-text-secondary mt-2">
            Add a new user to the platform
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <Input
                id="name"
                label="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                error={errors.name}
                placeholder="Enter full name"
              />

              <Input
                id="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                error={errors.email}
                placeholder="user@upstreamai.ae"
              />

              <div>
                <label
                  htmlFor="role"
                  className="text-label text-text-secondary mb-1.5 block"
                >
                  Role
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineer">
                      Reservoir Engineer
                    </SelectItem>
                    <SelectItem value="geoscientist">
                      Geoscientist
                    </SelectItem>
                    <SelectItem value="executive">
                      Executive
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-caption text-danger mt-1.5">
                    {errors.role}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex gap-3 justify-end pt-6 border-t border-border">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Create User
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
```

### 18.3 Correct Data Table

```tsx
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, Download } from "lucide-react";

interface Well {
  id: string;
  name: string;
  status: "active" | "inactive" | "planned";
  production: number;
  pressure: number;
}

const wells: Well[] = [
  {
    id: "1",
    name: "Well-001",
    status: "active",
    production: 1250,
    pressure: 3200,
  },
  {
    id: "2",
    name: "Well-002",
    status: "active",
    production: 980,
    pressure: 3100,
  },
  {
    id: "3",
    name: "Well-003",
    status: "inactive",
    production: 0,
    pressure: 2800,
  },
];

export function WellDataTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWells = wells.filter((well) =>
    well.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusBadge = (status: Well["status"]) => {
    const variants = {
      active: "success",
      inactive: "danger",
      planned: "warning",
    } as const;

    return (
      <Badge variant={variants[status]} size="sm">
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-h1 text-foreground">Well Data</h1>
          <p className="text-body text-text-secondary mt-2">
            View and manage well production data
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search wells..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button
              variant="outline"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export
            </Button>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Well List ({filteredWells.length} wells)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Well Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Production (bbl/day)</TableHead>
                  <TableHead>Pressure (psi)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWells.map((well) => (
                  <TableRow key={well.id}>
                    <TableCell>
                      <span className="text-body font-medium text-foreground">
                        {well.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(well.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-body text-foreground">
                        {well.production.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-body text-foreground">
                        {well.pressure.toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 19. Conclusion

This document defines the complete UI governance system for UpstreamAI FDP. All code generation, modifications, and new features MUST adhere to these guidelines.

**Key Principles:**

1. **Design System First:** Always use CSS variables and semantic classes
2. **Component Reuse:** Use existing components, never duplicate
3. **Accessibility Always:** WCAG 2.1 AA compliance is mandatory
4. **Responsive by Default:** Mobile-first, responsive at all breakpoints
5. **User Feedback:** Clear loading, error, and success states
6. **Code Quality:** TypeScript, semantic HTML, proper structure
7. **Branding Consistency:** UpstreamAI across all touchpoints

**Enforcement:**

- Code reviews MUST use Section 17 (Validation Checklist)
- AI code generation MUST follow Section 15 (AI Generation Rules)
- No exceptions to Section 16 (Prohibited Actions)

**Updates:**

This document is a living guide. As the design system evolves, this document MUST be updated to reflect changes.

**Questions or Clarifications:**

When in doubt, refer to existing implementations in `/src/app/screens/` and `/src/app/components/`.

---

**END OF GUIDELINES**