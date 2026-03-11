// scripts/generate-formula-doc.js
// Run: node scripts/generate-formula-doc.js
// Output: UpstreamAI_FDP_Formula_Reference.docx

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  convertInchesToTwip, PageOrientation, Footer, PageNumber, NumberFormat,
  UnderlineType, VerticalAlign,
} = require('docx');
const fs = require('fs');
const path = require('path');

// ─── Colours ────────────────────────────────────────────────────────────────
const BRAND_BLUE     = '1E3A5F';
const ACCENT_TEAL    = '0D9488';
const LIGHT_GREY     = 'F3F4F6';
const MID_GREY       = 'D1D5DB';
const DARK_GREY      = '374151';
const WHITE          = 'FFFFFF';
const FORMULA_BG     = 'EFF6FF';

// ─── Helpers ────────────────────────────────────────────────────────────────
const bold   = (text, size = 20, colour = DARK_GREY) =>
  new TextRun({ text, bold: true, size, color: colour });

const normal = (text, size = 20, colour = DARK_GREY) =>
  new TextRun({ text, size, color: colour });

const code   = (text) =>
  new TextRun({ text, font: 'Courier New', size: 18, color: '1E40AF' });

const heading1 = (text) =>
  new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    run: { bold: true, size: 36, color: WHITE },
    shading: { type: ShadingType.SOLID, color: BRAND_BLUE, fill: BRAND_BLUE },
    indent: { left: convertInchesToTwip(0.2), right: convertInchesToTwip(0.2) },
  });

const heading2 = (text) =>
  new Paragraph({
    children: [bold(text, 28, WHITE)],
    spacing: { before: 300, after: 120 },
    shading: { type: ShadingType.SOLID, color: ACCENT_TEAL, fill: ACCENT_TEAL },
    indent: { left: convertInchesToTwip(0.15) },
  });

const heading3 = (text) =>
  new Paragraph({
    children: [bold(text, 22, BRAND_BLUE)],
    spacing: { before: 240, after: 80 },
    border: {
      bottom: { color: ACCENT_TEAL, space: 4, value: BorderStyle.SINGLE, size: 4 },
    },
  });

const para = (text, spacing = 160) =>
  new Paragraph({ children: [normal(text)], spacing: { before: spacing, after: 80 } });

const formula = (text) =>
  new Paragraph({
    children: [code(text)],
    spacing: { before: 100, after: 100 },
    indent: { left: convertInchesToTwip(0.4) },
    shading: { type: ShadingType.SOLID, color: FORMULA_BG, fill: FORMULA_BG },
    border: {
      left: { color: ACCENT_TEAL, space: 6, value: BorderStyle.THICK, size: 8 },
    },
  });

const bullet = (text) =>
  new Paragraph({
    children: [normal(`• ${text}`)],
    indent: { left: convertInchesToTwip(0.4) },
    spacing: { before: 60, after: 60 },
  });

const spacer = () =>
  new Paragraph({ text: '', spacing: { before: 80, after: 80 } });

const labelValue = (label, value) =>
  new Paragraph({
    children: [bold(`${label}: `, 20, DARK_GREY), normal(value)],
    spacing: { before: 80, after: 60 },
  });

function twoColTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(([left, right]) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [bold(left, 18)] })],
            width: { size: 30, type: WidthType.PERCENTAGE },
            shading: { type: ShadingType.SOLID, color: LIGHT_GREY, fill: LIGHT_GREY },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            verticalAlign: VerticalAlign.CENTER,
          }),
          new TableCell({
            children: [new Paragraph({ children: [code(right)] })],
            width: { size: 70, type: WidthType.PERCENTAGE },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            shading: { type: ShadingType.SOLID, color: FORMULA_BG, fill: FORMULA_BG },
          }),
        ],
      })
    ),
    borders: {
      top:            { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
      bottom:         { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
      left:           { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
      right:          { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
      insideVertical:   { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
    },
  });
}

// ─── Document assembly ───────────────────────────────────────────────────────
const doc = new Document({
  creator: 'UpstreamAI FDP Engine',
  title: 'UpstreamAI FDP – Engineering & Financial Formula Reference',
  description: 'Comprehensive documentation of all calculation logic used in the UpstreamAI Field Development Plan application.',
  numbering: {
    config: [{ reference: 'num1', levels: [{ level: 0, format: NumberFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT }] }],
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: convertInchesToTwip(1), bottom: convertInchesToTwip(1), left: convertInchesToTwip(1.2), right: convertInchesToTwip(1.2) },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                normal('UpstreamAI FDP Formula Reference  |  Confidential  |  Page ', 16, '9CA3AF'),
                new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '9CA3AF' }),
                normal(' of ', 16, '9CA3AF'),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '9CA3AF' }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
      children: [

        // ══════════════════════════════════════════════════════════════════════
        //  COVER
        // ══════════════════════════════════════════════════════════════════════
        new Paragraph({
          children: [bold('UpstreamAI', 80, BRAND_BLUE)],
          alignment: AlignmentType.CENTER,
          spacing: { before: convertInchesToTwip(1.5), after: 0 },
        }),
        new Paragraph({
          children: [bold('Field Development Plan', 52, ACCENT_TEAL)],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 0 },
        }),
        new Paragraph({
          children: [bold('Engineering & Financial Formula Reference', 36, DARK_GREY)],
          alignment: AlignmentType.CENTER,
          spacing: { before: 160, after: 480 },
        }),
        new Paragraph({
          children: [normal('Version 1.0  •  March 2026', 22, '6B7280')],
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: convertInchesToTwip(2) },
        }),

        // ══════════════════════════════════════════════════════════════════════
        //  1. OVERVIEW
        // ══════════════════════════════════════════════════════════════════════
        heading1('1. Overview'),
        para(
          'This document describes every calculation, formula, and algorithm embedded in the ' +
          'UpstreamAI FDP Decode application. The application covers nine ADNOC offshore fields ' +
          'and provides reservoir engineering, financial analysis, uncertainty quantification, ' +
          'and AI-confidence metrics across eleven interactive screens.',
          120
        ),
        spacer(),
        heading3('Architecture Overview'),
        bullet('Layer 1 – Executive Dashboard: portfolio-level NPV, capital efficiency, risk metrics'),
        bullet('Layer 2 – Asset Manager Dashboard: field-level KPIs, FDP Nerve Center'),
        bullet('Layer 3 – Reservoir Engineer Tools: decline curves, history matching, Monte Carlo'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  2. DATA MODEL
        // ══════════════════════════════════════════════════════════════════════
        heading1('2. Asset Data Model'),
        para('Each field in the AssetContext carries the following parameters that feed all formulas:'),
        spacer(),
        twoColTable([
          ['ooip',             'MMbbl – Original Oil In Place'],
          ['cumulativeOil',    'MMbbl – Cumulative oil produced to date'],
          ['initialPressure',  'psi – Original reservoir pressure'],
          ['pressure',         'psi – Current reservoir pressure'],
          ['firstOilYear',     'Calendar year of first production'],
          ['declineRate (Di)', 'Annual nominal decline rate (fraction/yr)'],
          ['declineExponent (b)', 'Arps b-exponent (0 = exponential, 1 = harmonic)'],
          ['gor',              'scf/bbl – Gas-Oil Ratio'],
          ['opexPerBbl',       '$/bbl – All-in operating cost'],
          ['remainingCapexMM', '$MM – Remaining capital expenditure'],
          ['fieldLifeYears',   'Remaining production life (years)'],
          ['mobilityRatio',    'Water/oil mobility ratio (dimensionless)'],
          ['dataCompleteness', 'Weighted data completeness score (0–100%)'],
          ['historyMatchR2',   'History match coefficient of determination R² (0–1)'],
        ]),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  3. RESERVOIR ENGINEERING
        // ══════════════════════════════════════════════════════════════════════
        heading1('3. Reservoir Engineering Calculations'),

        // 3.1 Recovery Factor
        heading2('3.1  Recovery Factor (RF)'),
        para('Measures what fraction of the Original Oil In Place has been recovered to date.'),
        spacer(),
        labelValue('Formula', ''),
        formula('RF (%) = (Np / N) × 100'),
        spacer(),
        twoColTable([
          ['RF',  'Recovery Factor (%)'],
          ['Np',  'Cumulative oil produced to date (MMbbl)'],
          ['N',   'Original Oil In Place – OOIP (MMbbl)'],
        ]),
        spacer(),
        labelValue('Application', 'Displayed on Dashboard, FDP Summary, and DeepDive Analytics screens'),
        labelValue('Implementation', 'calculateRecoveryFactor(cumulativeOil, ooip) in calculations.ts'),
        spacer(),

        // 3.2 Water Cut
        heading2('3.2  Water Cut'),
        para('Fraction of produced liquid that is water, expressed as a percentage.'),
        spacer(),
        formula('WC (%) = Qw / (Qo + Qw) × 100'),
        spacer(),
        twoColTable([
          ['WC', 'Water Cut (%)'],
          ['Qo', 'Oil production rate (bbl/day)'],
          ['Qw', 'Water production rate (bbl/day)'],
        ]),
        spacer(),
        labelValue('Application', 'Dashboard KPI card and trend charts'),
        labelValue('Implementation', 'calculateWaterCut(waterBpd, oilBpd)'),
        spacer(),

        // 3.3 Arps Hyperbolic Decline
        heading2('3.3  Arps Hyperbolic Decline Curve  (SPE-945)'),
        para(
          'Used to forecast future production rates. The hyperbolic form covers exponential ' +
          '(b = 0) through harmonic (b = 1) decline behaviour.'
        ),
        spacer(),
        formula('q(t) = qi / (1 + b × Di × t)^(1/b)'),
        spacer(),
        twoColTable([
          ['q(t)', 'Production rate at time t (bbl/day)'],
          ['qi',   'Initial production rate (bbl/day)'],
          ['Di',   'Nominal annual decline rate (fraction/yr)'],
          ['b',    'Arps exponent (0 ≤ b ≤ 1)'],
          ['t',    'Time elapsed since start of decline (years)'],
        ]),
        spacer(),
        labelValue('Special case  b = 0', 'q(t) = qi × exp(−Di × t)   [exponential decline]'),
        spacer(),
        para(
          'Cumulative production under hyperbolic decline (b ≠ 0) for an annual forecast step ' +
          'is integrated analytically:'
        ),
        formula('Np(t1→t2) = [qi^b / (Di × (1−b))] × [q(t1)^(1−b) − q(t2)^(1−b)]'),
        spacer(),
        labelValue('Application', 'HistoryMatching chart, DeepDive P10/P50/P90 forecast, FDP production profile'),
        labelValue('Implementation', 'hyperbolicDecline(qi, Di, b, t) · generateAnnualForecast(...)'),
        spacer(),

        // 3.4 Reservoir Pressure
        heading2('3.4  Reservoir Pressure – Material Balance Approximation'),
        para(
          'Simplified liquid-expansion material balance to estimate current average reservoir ' +
          'pressure from cumulative production.'
        ),
        spacer(),
        formula('P_current ≈ P_initial × (1 − Np / (N × ct × P_initial))'),
        para('Or equivalently using a linear pressure depletion approximation:'),
        formula('P_current = P_initial × (1 − Np / N × depletion_factor)'),
        spacer(),
        twoColTable([
          ['P_current',        'Estimated current reservoir pressure (psi)'],
          ['P_initial',        'Original reservoir pressure (psi)'],
          ['Np',               'Cumulative oil produced (MMbbl)'],
          ['N',                'OOIP (MMbbl)'],
          ['ct',               'Total compressibility (~1.5 × 10⁻⁵ psi⁻¹ default)'],
          ['depletion_factor', 'Calibration scalar (default 0.5)'],
        ]),
        spacer(),
        labelValue('Application', 'Dashboard current pressure KPI'),
        labelValue('Implementation', 'estimateReservoirPressure(initialPressure, ooip, cumulativeOil, oilFVF?, ct?)'),
        spacer(),

        // 3.5 Sweep Efficiency
        heading2('3.5  Sweep Efficiency'),
        para(
          "Combines Craig's areal sweep efficiency with Dykstra-Parsons vertical heterogeneity " +
          'to estimate displacement efficiency.'
        ),
        spacer(),
        heading3('Areal Sweep (Craig correlation)'),
        formula('Ea = 0.54602789 + 0.03170817/M − 0.00509693×M + 0.11289012×ln(M)'),
        spacer(),
        twoColTable([
          ['Ea', 'Areal sweep efficiency (fraction)'],
          ['M',  'Mobility ratio = (krw/μw) / (kro/μo)'],
        ]),
        spacer(),
        heading3('Vertical Sweep (Dykstra-Parsons)'),
        formula('Ev = 1 − V_DP'),
        spacer(),
        twoColTable([
          ['Ev',  'Vertical sweep efficiency (fraction)'],
          ['V_DP','Dykstra-Parsons coefficient of variation (0–1, default 0.72)'],
        ]),
        spacer(),
        heading3('Overall Displacement Efficiency'),
        formula('E_total (%) = Ea × Ev × 100'),
        spacer(),
        labelValue('Application', 'Dashboard Sweep Efficiency KPI'),
        labelValue('Implementation', 'calculateSweepEfficiency(mobilityRatio, dykstraParsonV?)'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  4. FINANCIAL ANALYSIS
        // ══════════════════════════════════════════════════════════════════════
        heading1('4. Financial Analysis Calculations'),

        // 4.1 NPV
        heading2('4.1  Net Present Value (NPV)'),
        para(
          'Full discounted cash flow using an annuity approximation when a detailed year-by-year ' +
          'forecast is not computed. Incorporates royalty, income tax, and remaining CAPEX.'
        ),
        spacer(),
        heading3('Revenue and Cost Stream'),
        formula('Revenue/yr   = q × OilPrice × 365'),
        formula('Royalty/yr   = Revenue × royaltyRate         (default 5%)'),
        formula('OPEX/yr      = q × opexPerBbl × 365'),
        formula('EBITDA/yr    = Revenue − Royalty − OPEX'),
        formula('Tax/yr       = EBITDA × taxRate              (default 55%)'),
        formula('NetCF/yr     = EBITDA − Tax'),
        spacer(),
        heading3('Present Value Annuity (mid-year convention)'),
        formula('PV(annuity) = NetCF × [1 − (1+r)^(−n)] / r × (1+r)^0.5'),
        spacer(),
        heading3('Final NPV'),
        formula('NPV = PV(annuity) − CapEx_total'),
        spacer(),
        twoColTable([
          ['q',             'Current oil production rate (bbl/day)'],
          ['OilPrice',      'Flat oil price assumption ($/bbl, default $80)'],
          ['royaltyRate',   'Government royalty fraction (default 0.05)'],
          ['opexPerBbl',    'All-in operating cost ($/bbl)'],
          ['taxRate',       'Effective income tax rate (default 0.55 for PSC)'],
          ['r',             'Discount rate (default 10%)'],
          ['n',             'Field life remaining (years)'],
          ['CapEx_total',   'Remaining capital expenditure ($B)'],
        ]),
        spacer(),
        labelValue('Output units', 'Billions USD ($B) for display; $MM internally'),
        labelValue('Application', 'Dashboard, FDP Summary, ExecutiveDashboard'),
        labelValue('Implementation', 'calculateNPVSimplified(...)  ·  calculateNPV(forecast, ...)'),
        spacer(),

        // 4.2 IRR
        heading2('4.2  Internal Rate of Return (IRR)'),
        para(
          'Newton-Raphson root-finding on the NPV=0 equation. Cash-flow array starts with ' +
          '−CapEx in Year 0 followed by annual net cash flows.'
        ),
        spacer(),
        formula('NPV(r) = Σ [CF_t / (1+r)^t] = 0   →   solve for r'),
        spacer(),
        heading3('Newton-Raphson iteration'),
        formula('r_{n+1} = r_n − NPV(r_n) / NPV\'(r_n)'),
        formula('NPV\'(r) = −Σ [t × CF_t / (1+r)^(t+1)]'),
        spacer(),
        twoColTable([
          ['CF_0',   '−CapEx (initial investment, negative)'],
          ['CF_t',   'Net cash flow in year t (positive)'],
          ['r_0',    'Initial guess (default 10%)'],
          ['tol',    'Convergence tolerance (10⁻⁶)'],
          ['maxIter','Maximum iterations (1000)'],
        ]),
        spacer(),
        labelValue('Application', 'FDP Summary screen IRR metric'),
        labelValue('Implementation', 'calculateIRR(cashFlows, guess?)'),
        spacer(),

        // 4.3 Capital Efficiency
        heading2('4.3  Value Investment Ratio (VIR) / Capital Efficiency'),
        para('Measures NPV generated per dollar of capital invested.'),
        spacer(),
        formula('VIR = NPV / PV(CapEx)'),
        spacer(),
        para('PV(CapEx) discounts the remaining capex to present value:'),
        formula('PV(CapEx) = CapEx_MM / (1 + r)^(n/2)'),
        spacer(),
        twoColTable([
          ['NPV',       'Net Present Value ($B)'],
          ['PV(CapEx)', 'Present value of remaining capital expenditure ($B)'],
          ['r',         'Discount rate (10%)'],
          ['n',         'Field life remaining (years); n/2 uses midpoint approximation'],
        ]),
        spacer(),
        labelValue('Interpretation', '> 1.0x means investment creates more than $1 of NPV per $1 invested'),
        labelValue('Application', 'Dashboard KPI, ExecutiveDashboard portfolio view'),
        labelValue('Implementation', 'calculateCapitalEfficiency(npvB, pvCapexB)'),
        spacer(),

        // 4.4 Risk-Adjusted Return
        heading2('4.4  Risk-Adjusted Return (RAR)'),
        para('Portfolio-level ratio of P50 NPV to total capital deployed.'),
        spacer(),
        formula('RAR = P50_NPV_MM / TotalCapEx_MM'),
        spacer(),
        labelValue('Application', 'Executive Dashboard portfolio risk metrics'),
        labelValue('Implementation', 'calculateRiskAdjustedReturn(p50NpvMM, totalCapexMM)'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  5. UNCERTAINTY & MONTE CARLO
        // ══════════════════════════════════════════════════════════════════════
        heading1('5. Uncertainty Quantification'),

        // 5.1 Monte Carlo
        heading2('5.1  Monte Carlo NPV Simulation'),
        para(
          'A stochastic NPV model sampling key reservoir and economic uncertainties. ' +
          'Runs n = 5,000 iterations per analysis.'
        ),
        spacer(),
        heading3('Sampling Distributions'),
        twoColTable([
          ['OOIP',            'Triangular(low, mode, high)  — reflects structural uncertainty'],
          ['Recovery Factor', 'Triangular(low, mode, high)  — EOR upside / base / downside'],
          ['Oil Price',       'Log-normal(μ, σ)  where σ = mean × CV (CV default 20%)'],
          ['OPEX',            'Normal(mean, std) clamped at 0  — cost uncertainty'],
          ['CapEx',           'Normal(mean, std) clamped at 0  — development cost overrun'],
        ]),
        spacer(),
        heading3('Triangular Distribution Inverse CDF'),
        formula('u < Fc: x = low + √( u × (high−low) × (mode−low) )'),
        formula('u ≥ Fc: x = high − √( (1−u) × (high−low) × (high−mode) )'),
        formula('Fc = (mode − low) / (high − low)'),
        spacer(),
        heading3('Log-Normal Sampling (Box-Muller)'),
        formula('z = √(−2 ln U1) × cos(2π U2)    [standard normal]'),
        formula('σ_ln = √( ln(1 + CV²) )'),
        formula('μ_ln = ln(mean) − σ_ln²/2'),
        formula('x = exp(μ_ln + σ_ln × z)'),
        spacer(),
        heading3('Per-Iteration NPV'),
        formula('Np_iter = OOIP_iter × RF_iter     [MMbbl ultimate recovery]'),
        formula('Revenue  = Np_iter × 1e6 × Price_iter / fieldLife'),
        formula('NetCF    = (Revenue − OPEX_iter × Np_iter/fieldLife × 1e6) × (1−tax) − CapEx_iter'),
        formula('NPV_iter = NetCF × annuity_factor(r, fieldLife)'),
        spacer(),
        heading3('Output Statistics'),
        twoColTable([
          ['P90 (optimistic)', '10th percentile of sorted NPV distribution'],
          ['P50 (base case)',  '50th percentile of sorted NPV distribution'],
          ['P10 (pessimistic)','90th percentile of sorted NPV distribution'],
        ]),
        spacer(),
        labelValue('Application', 'DeepDive Analytics – Monte Carlo histogram and P10/P50/P90 cards'),
        labelValue('Implementation', 'runMonteCarloNPV(inputs, n)  ·  getPercentile(sorted, p)  ·  buildHistogramBins(values, bins)'),
        spacer(),

        // 5.2 OAT Sensitivity
        heading2('5.2  One-At-a-Time (OAT) Sensitivity – Tornado Chart'),
        para(
          'Perturbs each input parameter ±20% (holding all others fixed) and measures the ' +
          'resulting NPV swing. Sorted by absolute impact for tornado chart display.'
        ),
        spacer(),
        formula('Swing_i = NPV(+20%_i) − NPV(−20%_i)'),
        formula('Sensitivity_i = Swing_i / BaseNPV × 100  [%]'),
        spacer(),
        twoColTable([
          ['Oil Price',           '±20% of base price ($80/bbl)'],
          ['Permeability',        '±15% proxy affecting production rate'],
          ['OOIP',                '±15% structural uncertainty'],
          ['Recovery Factor',     '±15% EOR efficiency uncertainty'],
          ['OPEX',                '±20% cost uncertainty'],
          ['Discount Rate',       '±20% of base 10%'],
          ['Gas Revenue',         '±20% of gas contribution'],
          ['Decline Rate (Di)',   '±20% of field Di'],
        ]),
        spacer(),
        labelValue('Application', 'Uncertainty screen – Tornado Chart'),
        labelValue('Implementation', 'calculateOATSensitivity(baseNPV_MM, parameters)'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  6. HISTORY MATCHING
        // ══════════════════════════════════════════════════════════════════════
        heading1('6. History Matching Quality Metrics'),

        heading2('6.1  Coefficient of Determination (R²)'),
        formula('R² = 1 − SS_res / SS_tot'),
        formula('SS_res = Σ (y_obs_i − y_sim_i)²'),
        formula('SS_tot = Σ (y_obs_i − ȳ_obs)²'),
        spacer(),
        twoColTable([
          ['R²',      'Goodness of fit (1.0 = perfect match)'],
          ['y_obs_i', 'Observed production/pressure value at step i'],
          ['y_sim_i', 'Simulated model value at step i'],
          ['ȳ_obs',   'Mean of observed values'],
        ]),
        spacer(),

        heading2('6.2  Root Mean Square Error (RMSE)'),
        formula('RMSE = √( Σ (y_obs_i − y_sim_i)² / n )'),
        spacer(),
        labelValue('Normalisation', 'Sometimes expressed as a fraction of the mean observed value'),
        spacer(),

        heading2('6.3  Mean Absolute Percentage Error (MAPE)'),
        formula('MAPE (%) = (100/n) × Σ |y_obs_i − y_sim_i| / |y_obs_i|'),
        spacer(),

        heading2('6.4  Composite History Match Quality Score'),
        para(
          'Combines production match and pressure match quality into a single 0–100% score.'
        ),
        formula('HMQ = 0.6 × R²_prod × 100  +  0.4 × R²_press × 100   (if pressure data available)'),
        formula('HMQ = R²_prod × 100                                    (production only)'),
        spacer(),
        labelValue('Application', 'History Matching screen – Quality Score card'),
        labelValue('Implementation', 'calculateHistoryMatchQuality(observedProd, simulatedProd, observedPressure?, simulatedPressure?)'),
        spacer(),

        heading2('6.5  Historical Chart Data Generation'),
        para(
          'Synthetic historical data is generated using Arps decline with seasonal perturbations ' +
          '(sinusoidal, no random noise) so the chart remains deterministic and reproducible ' +
          'across re-renders.'
        ),
        formula('q_seasonal(t) = q_decline(t) × (1 + 0.04 × sin(2π × month/12))'),
        formula('q_simulated(t) = q_decline(t)   [clean model curve]'),
        spacer(),
        labelValue('Application', 'History Matching screen – production match chart'),
        labelValue('Implementation', 'generateMatchChartData(currentRate, Di, b, firstOilYear, ...)'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  7. MARKET VOLATILITY
        // ══════════════════════════════════════════════════════════════════════
        heading1('7. Oil Price Scenario Modelling'),

        heading2('7.1  Ornstein-Uhlenbeck Mean-Reversion'),
        para(
          'Deterministic price path (no random term) using mean-reversion dynamics. Models the ' +
          'tendency of oil prices to revert toward a long-run equilibrium.'
        ),
        spacer(),
        formula('P(t) = P_eq + (P_0 − P_eq) × exp(−κ × t)'),
        spacer(),
        twoColTable([
          ['P(t)',  'Price at year t ($/bbl)'],
          ['P_0',  'Current oil price ($/bbl, default $78)'],
          ['P_eq', 'Long-run equilibrium price ($/bbl, default $72)'],
          ['κ',    'Mean-reversion speed (yr⁻¹, default 0.20)'],
          ['t',    'Years from today'],
        ]),
        spacer(),
        heading3('Scenario Bands'),
        formula('P_bull(t)  = P(t) × (1 + uplift)   [upside scenario, default +25%]'),
        formula('P_base(t)  = P(t)                   [base / central scenario]'),
        formula('P_bear(t)  = P(t) × (1 − haircut)  [downside scenario, default −30%]'),
        spacer(),
        labelValue('Application', 'Market Volatility screen – price scenario fan chart'),
        labelValue('Implementation', 'generatePriceScenarios(current, equilibrium, κ, startYear, years, uplift, haircut)'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  8. DATA HEALTH
        // ══════════════════════════════════════════════════════════════════════
        heading1('8. Data Health & Completeness'),

        heading2('8.1  Weighted Data Completeness'),
        para(
          'Each data category is assessed for the number of validated items versus total ' +
          'required items. Category scores are averaged weighted by importance.'
        ),
        spacer(),
        formula('Completeness_i (%) = validatedItems_i / totalItems_i × 100'),
        formula('OverallCompleteness = Σ (Completeness_i × weight_i) / Σ weight_i'),
        spacer(),
        twoColTable([
          ['Static Model',              'weight = 0.25  (structural framework – highest criticality)'],
          ['Well Data',                 'weight = 0.20'],
          ['Petrophysical Logs',        'weight = 0.20'],
          ['Geological Interpretations','weight = 0.15'],
          ['Geophysical Data',          'weight = 0.10'],
          ['Production History',        'weight = 0.10'],
        ]),
        spacer(),
        labelValue('Application', 'Data Health screen – Overall Completeness gauge'),
        labelValue('Implementation', 'calculateWeightedCompleteness(categories)'),
        spacer(),

        heading2('8.2  Critical Gaps Count'),
        formula('CriticalGaps = Σ criticalMissing_i  (across all categories)'),
        spacer(),

        heading2('8.3  Validation Aggregation'),
        formula('TotalValidated = Σ validatedItems_i'),
        formula('TotalRequired  = Σ totalItems_i'),
        spacer(),
        labelValue('Application', 'Data Health screen – validated/total counter'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  9. FDP COMPLETION
        // ══════════════════════════════════════════════════════════════════════
        heading1('9. FDP Completion Score'),
        para(
          'The overall FDP completion percentage is calculated as a weighted average of key ' +
          'development milestones, where each milestone is assigned a relative importance weight.'
        ),
        spacer(),
        formula('FDPCompletion (%) = Σ (progress_i × weight_i) / Σ weight_i'),
        spacer(),
        twoColTable([
          ['Milestone',                    'Weight'],
          ['Data Acquisition & QC',        '0.15'],
          ['Static Model Build',           '0.20'],
          ['Dynamic Simulation',           '0.25'],
          ['Uncertainty Quantification',   '0.15'],
          ['Development Concept Selection','0.10'],
          ['Economics & Approvals',        '0.15'],
        ]),
        spacer(),
        para(
          'Each milestone progress value (0–100%) is tracked against its status: ' +
          'Not Started = 0%, In Progress = 0–99%, Completed = 100%.'
        ),
        spacer(),
        labelValue('Application', 'Executive Dashboard – FDP Completion KPI'),
        labelValue('Implementation', 'calculateFDPCompletion(milestones)'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  10. AI CONFIDENCE
        // ══════════════════════════════════════════════════════════════════════
        heading1('10. AI Confidence Score'),
        para(
          'A composite metric measuring the reliability of AI-generated insights based on ' +
          'three orthogonal quality dimensions.'
        ),
        spacer(),
        formula('DataQuality     = dataCompleteness (%)'),
        formula('ModelConfidence = historyMatchR2 × 100'),
        formula('UncertCoverage  = uncertaintyCoverage × 100     (default 75%)'),
        spacer(),
        formula('AIConfidence_overall = 0.40 × DataQuality + 0.35 × ModelConfidence + 0.25 × UncertCoverage'),
        spacer(),
        twoColTable([
          ['DataQuality',      'Weighted data completeness score (0–100%)'],
          ['ModelConfidence',  'History match R² scaled to percentage'],
          ['UncertCoverage',   'Fraction of uncertainty parameter space modelled (0–1)'],
        ]),
        spacer(),
        heading3('Sub-scores (displayed on Insights screen)'),
        formula('InsightReliability = 0.5 × ModelConfidence + 0.3 × UncertCoverage + 0.2 × DataQuality'),
        spacer(),
        labelValue('Application', 'Insights screen – AI confidence gauge; FDP Summary – model confidence'),
        labelValue('Implementation', 'calculateAIConfidence(dataCompleteness, historyMatchR2, uncertaintyCoverage)'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  11. PORTFOLIO ANALYTICS
        // ══════════════════════════════════════════════════════════════════════
        heading1('11. Portfolio Analytics'),

        heading2('11.1  Portfolio NPV Aggregation'),
        formula('NPV_portfolio = Σ NPV_field_i     [sum across all active fields]'),
        spacer(),
        labelValue('Application', 'Executive Dashboard – Total Portfolio Value'),
        labelValue('Implementation', 'aggregatePortfolioNPV(fieldNPVs)'),
        spacer(),

        heading2('11.2  Portfolio Capital Efficiency'),
        formula('VIR_portfolio = NPV_portfolio / Σ PV(CapEx_field_i)'),
        spacer(),
        labelValue('Application', 'Executive Dashboard – Portfolio VIR'),
        labelValue('Implementation', 'portfolioCapitalEfficiency(fields)'),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  12. FIELD ASSET REFERENCE
        // ══════════════════════════════════════════════════════════════════════
        heading1('12. ADNOC Field Reference Data'),
        para(
          'The following table summarises the key engineering parameters for each of the nine ' +
          'ADNOC offshore fields modelled in the application.'
        ),
        spacer(),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            // Header
            new TableRow({
              tableHeader: true,
              children: ['Field', 'OOIP (MMbbl)', 'RF%', 'Di (/yr)', 'b', 'GOR (scf/bbl)', 'OPEX ($/bbl)', 'Field Life (yr)', 'HM R²'].map(h =>
                new TableCell({
                  children: [new Paragraph({ children: [bold(h, 16, WHITE)], alignment: AlignmentType.CENTER })],
                  shading: { type: ShadingType.SOLID, color: BRAND_BLUE, fill: BRAND_BLUE },
                  margins: { top: 80, bottom: 80, left: 80, right: 80 },
                })
              ),
            }),
            // Data rows
            ...([
              ['Upper Zakum',       '21,000', '47%', '0.035', '0.45', '380', '$4.20', '25', '0.94'],
              ['Lower Zakum',       '8,500',  '38%', '0.040', '0.40', '350', '$4.80', '22', '0.92'],
              ['Umm Shaif',         '6,200',  '44%', '0.038', '0.42', '420', '$5.10', '18', '0.95'],
              ['Satah',             '2,800',  '38%', '0.045', '0.38', '300', '$6.20', '15', '0.91'],
              ['Nasr',              '1,900',  '28%', '0.052', '0.35', '260', '$7.50', '20', '0.88'],
              ['Umm Al Dalkh',      '1,600',  '26%', '0.055', '0.32', '240', '$8.20', '14', '0.87'],
              ['Sarb',              '1,200',  '26%', '0.058', '0.30', '275', '$8.80', '12', '0.86'],
              ['Umm Lulu',          '1,500',  '18%', '0.030', '0.48', '310', '$6.80', '28', '0.96'],
              ['Abu Al Bukhoosh',   '900',    '39%', '0.065', '0.25', '220', '$9.50', '10', '0.83'],
            ]).map((row, idx) =>
              new TableRow({
                children: row.map((cell, colIdx) =>
                  new TableCell({
                    children: [new Paragraph({ children: [normal(cell, 16)], alignment: colIdx === 0 ? AlignmentType.LEFT : AlignmentType.CENTER })],
                    shading: { type: ShadingType.SOLID, color: idx % 2 === 0 ? WHITE : LIGHT_GREY, fill: idx % 2 === 0 ? WHITE : LIGHT_GREY },
                    margins: { top: 60, bottom: 60, left: 80, right: 80 },
                  })
                ),
              })
            ),
          ],
          borders: {
            top:              { style: BorderStyle.SINGLE, size: 2, color: BRAND_BLUE },
            bottom:           { style: BorderStyle.SINGLE, size: 2, color: BRAND_BLUE },
            left:             { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
            right:            { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
            insideVertical:   { style: BorderStyle.SINGLE, size: 1, color: MID_GREY },
          },
        }),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  13. FORMAT HELPERS
        // ══════════════════════════════════════════════════════════════════════
        heading1('13. Display Formatting'),
        spacer(),
        twoColTable([
          ['formatNPV(npvB)',              '"$X.XX B"  or  "$XXX M"  — auto-scales billions/millions'],
          ['formatProductionRate(bpd)',    '"XXX,XXX bbl/day"  with locale comma formatting'],
          ['formatReserves(mmbbl)',        '"X,XXX MMbbl"  with comma formatting'],
        ]),
        spacer(),

        // ══════════════════════════════════════════════════════════════════════
        //  14. REFERENCES
        // ══════════════════════════════════════════════════════════════════════
        heading1('14. References'),
        bullet('Arps, J.J. (1945). Analysis of Decline Curves. SPE-945-PA, Trans. AIME 160, 228–247.'),
        bullet('Craig, F.F. (1971). The Reservoir Engineering Aspects of Waterflooding. SPE Monograph Vol. 3.'),
        bullet('Dykstra, H. & Parsons, R.L. (1950). The Prediction of Oil Recovery by Water Flood. Secondary Recovery of Oil in the United States, API.'),
        bullet('Ahmed, T. (2010). Reservoir Engineering Handbook, 4th Ed. Gulf Professional Publishing.'),
        bullet('Ornstein, L.S. & Uhlenbeck, G.E. (1930). On the Theory of the Brownian Motion. Physical Review 36, 823.'),
        bullet('Trigeorgis, L. (1996). Real Options: Managerial Flexibility and Strategy in Resource Allocation. MIT Press.'),
        spacer(),

        // Footer note
        new Paragraph({
          children: [normal('Generated by UpstreamAI FDP Decode  •  All formulas implemented in src/app/utils/calculations.ts', 16, '9CA3AF')],
          alignment: AlignmentType.CENTER,
          spacing: { before: 480 },
        }),
      ],
    },
  ],
});

// ─── Write to disk ─────────────────────────────────────────────────────────
const outPath = path.join(__dirname, '..', 'UpstreamAI_FDP_Formula_Reference.docx');
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log(`✅  Document written to: ${outPath}`);
  console.log(`    Size: ${(buffer.length / 1024).toFixed(1)} KB`);
}).catch(err => {
  console.error('❌  Error generating document:', err);
  process.exit(1);
});
