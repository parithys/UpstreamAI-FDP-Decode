/**
 * UpstreamAI FDP — Core Engineering & Financial Calculation Library
 *
 * All formulas documented with industry-standard references.
 * Units are explicit in every function signature.
 */

// ─────────────────────────────────────────────────────────────
// FORMATTING UTILITIES
// ─────────────────────────────────────────────────────────────

/** Format NPV in $B or $M depending on magnitude */
export function formatNPV(npvBillions: number): string {
  if (Math.abs(npvBillions) >= 1) return `$${npvBillions.toFixed(1)}B`;
  return `$${(npvBillions * 1000).toFixed(0)}M`;
}

/** Format production rate in kbpd or bpd */
export function formatProductionRate(bpd: number): string {
  if (bpd >= 1000) return `${(bpd / 1000).toFixed(1)} kbpd`;
  return `${bpd.toLocaleString()} bpd`;
}

/** Format reserves in Bbbl or MMbbl */
export function formatReserves(mmbbl: number): string {
  if (mmbbl >= 1000) return `${(mmbbl / 1000).toFixed(1)} Bbbl`;
  return `${Math.round(mmbbl).toLocaleString()} MMbbl`;
}

// ─────────────────────────────────────────────────────────────
// FINANCIAL CALCULATIONS
// ─────────────────────────────────────────────────────────────

export interface ProductionPeriod {
  year: number;
  oil: number;   // bbl/day
  gas: number;   // MMscf/day
}

export interface CapexItem {
  year: number;
  amount: number; // $MM
}

/**
 * Net Present Value — Discounted Cash Flow Analysis
 *
 * Formula: NPV = Σ [ (Revenue_t - OPEX_t - CapEx_t) × (1 - royalty) × (1 - tax) ] / (1 + r)^t
 *
 * @param forecast       Annual oil+gas production profile
 * @param oilPrice       $/bbl (Brent crude)
 * @param gasPrice       $/MMBtu
 * @param opexPerBbl     $/bbl lifted (all-in operating cost)
 * @param capexSchedule  Annual capital expenditure ($MM)
 * @param discountRate   Annual WACC / hurdle rate (fraction, e.g. 0.10)
 * @param royaltyRate    Royalty fraction (e.g. 0.05 = 5%)
 * @param taxRate        Corporate tax rate (e.g. 0.55 for UAE upstream)
 * @param baseYear       t=0 year for discounting
 * @returns NPV in $B
 */
export function calculateNPV(
  forecast: ProductionPeriod[],
  oilPrice: number,
  gasPrice: number,
  opexPerBbl: number,
  capexSchedule: CapexItem[],
  discountRate: number,
  royaltyRate: number = 0.05,
  taxRate: number = 0.55,
  baseYear: number = new Date().getFullYear()
): number {
  let npv = 0;
  const capexMap = new Map(capexSchedule.map(c => [c.year, c.amount * 1e6]));

  for (const period of forecast) {
    const t = period.year - baseYear;
    const discountFactor = Math.pow(1 + discountRate, t);

    // Annual volumes
    const annualOilBbl = period.oil * 365;
    const annualGasMMBtu = period.gas * 365 * 1000; // MMscf → MMBtu (1 MMscf ≈ 1000 MMBtu)

    // Revenue
    const oilRevenue = annualOilBbl * oilPrice;
    const gasRevenue = annualGasMMBtu * gasPrice;
    const totalRevenue = oilRevenue + gasRevenue;

    // Costs
    const opex = annualOilBbl * opexPerBbl;
    const royalty = totalRevenue * royaltyRate;
    const capexThisYear = capexMap.get(period.year) ?? 0;

    // After-tax cash flow
    const grossCF = totalRevenue - opex - royalty - capexThisYear;
    const tax = Math.max(0, grossCF * taxRate);
    const netCF = grossCF - tax;

    npv += netCF / discountFactor;
  }

  return npv / 1e9; // → $B
}

/**
 * Simplified NPV using annuity approximation (fast, for KPI display)
 *
 * Formula: NPV = (annualRevenue - annualOpex) × (1 - royalty) × (1 - tax) × PVF - PV(CapEx)
 * PVF = [1 - (1+r)^-T] / r
 *
 * @param currentOilBpd   Current field production (bbl/day)
 * @param oilPrice        $/bbl
 * @param opexPerBbl      $/bbl
 * @param capexTotalMM    Total remaining CapEx ($MM)
 * @param discountRate    Annual rate (fraction)
 * @param fieldLifeYears  Remaining production years
 * @param royaltyRate     Fraction
 * @param taxRate         Fraction
 * @param gasRevenuePct   Gas as % of oil revenue (default 8%)
 * @returns NPV in $B
 */
export function calculateNPVSimplified(
  currentOilBpd: number,
  oilPrice: number,
  opexPerBbl: number,
  capexTotalMM: number,
  discountRate: number,
  fieldLifeYears: number,
  royaltyRate: number = 0.05,
  taxRate: number = 0.55,
  gasRevenuePct: number = 0.08
): number {
  const annualOilBbl = currentOilBpd * 365;
  const annualRevenue = annualOilBbl * oilPrice * (1 + gasRevenuePct);
  const annualOpex = annualOilBbl * opexPerBbl;
  const grossMargin = (annualRevenue - annualOpex) * (1 - royaltyRate);
  const netCF = grossMargin * (1 - taxRate);

  // Present value factor (annuity)
  const pvFactor =
    discountRate > 0
      ? (1 - Math.pow(1 + discountRate, -fieldLifeYears)) / discountRate
      : fieldLifeYears;

  const npv = netCF * pvFactor - capexTotalMM * 1e6;
  return npv / 1e9; // $B
}

/**
 * Internal Rate of Return (Newton–Raphson solver)
 *
 * IRR is the discount rate r* such that NPV(r*) = 0
 *
 * @param cashFlows  Array indexed by year (t=0 is upfront CapEx, negative)
 * @param guess      Initial guess (default 10%)
 * @returns IRR as a percentage (e.g. 22.4)
 */
export function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
  const MAX_ITER = 1000;
  const TOL = 1e-7;
  let r = guess;

  for (let i = 0; i < MAX_ITER; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + r, t);
      dnpv -= (t * cashFlows[t]) / Math.pow(1 + r, t + 1);
    }
    if (Math.abs(dnpv) < 1e-12) break;
    const newR = r - npv / dnpv;
    if (Math.abs(newR - r) < TOL) return newR * 100;
    r = newR;
  }
  return r * 100;
}

/**
 * Capital Efficiency — Value Investment Ratio (VIR)
 *
 * Formula: VIR = NPV ($B) / PV(CapEx) ($B)
 * VIR > 1 means the project creates more value than it costs.
 */
export function calculateCapitalEfficiency(npvB: number, pvCapexB: number): number {
  if (pvCapexB === 0) return 0;
  return npvB / pvCapexB;
}

/**
 * Risk-Adjusted Return
 *
 * Formula: RAR (%) = P50_NPV / Total_CapEx × 100
 * Accounts for the probability-weighted value vs committed capital.
 */
export function calculateRiskAdjustedReturn(
  p50NpvMM: number,
  totalCapexMM: number
): number {
  if (totalCapexMM === 0) return 0;
  return (p50NpvMM / totalCapexMM) * 100;
}

// ─────────────────────────────────────────────────────────────
// PRODUCTION ENGINEERING — DECLINE CURVE ANALYSIS
// ─────────────────────────────────────────────────────────────

/**
 * Arps Hyperbolic Decline (industry standard — SPE 945)
 *
 * q(t) = q_i / (1 + b × D_i × t)^(1/b)
 *
 * Special cases:
 *   b = 0  → Exponential:  q(t) = q_i × exp(-D_i × t)
 *   b = 1  → Harmonic:     q(t) = q_i / (1 + D_i × t)
 *
 * @param qi   Initial production rate (bbl/day)
 * @param Di   Initial nominal decline rate (fraction/year)
 * @param b    Decline exponent (0 ≤ b ≤ 1)
 * @param t    Time from start (years)
 * @returns    Production rate at time t (bbl/day)
 */
export function hyperbolicDecline(qi: number, Di: number, b: number, t: number): number {
  if (t < 0) return qi;
  if (b === 0) return qi * Math.exp(-Di * t);
  return qi / Math.pow(1 + b * Di * t, 1 / b);
}

/**
 * Cumulative production from hyperbolic decline
 *
 * Np(t) = [q_i^b / (D_i × (1-b))] × [q_i^(1-b) - q(t)^(1-b)]
 */
export function hyperbolicCumulative(qi: number, Di: number, b: number, t: number): number {
  if (t <= 0) return 0;
  if (b === 0) return (qi / Di) * (1 - Math.exp(-Di * t));
  if (b === 1) return (qi / Di) * Math.log(1 + Di * t);
  const qt = hyperbolicDecline(qi, Di, b, t);
  return (Math.pow(qi, b) / (Di * (1 - b))) * (Math.pow(qi, 1 - b) - Math.pow(qt, 1 - b));
}

export interface ForecastPoint {
  year: number;
  oil: number;   // bbl/day
  gas: number;   // MMscf/day
}

/**
 * Generate annual production forecast using Arps decline
 *
 * @param currentRate  Current oil production (bbl/day)
 * @param Di           Annual decline rate (fraction, e.g. 0.03 = 3%/yr)
 * @param b            Decline exponent (0.3–0.6 typical for oil)
 * @param startYear    First forecast year
 * @param years        Number of years to forecast
 * @param gor          Gas-Oil Ratio (MMscf/Mbbl)
 * @param economicLimit  Minimum economic rate (bbl/day)
 * @returns Array of annual production values
 */
export function generateAnnualForecast(
  currentRate: number,
  Di: number,
  b: number,
  startYear: number,
  years: number,
  gor: number = 0.5,
  economicLimit: number = 500
): ForecastPoint[] {
  const forecast: ForecastPoint[] = [];
  for (let i = 0; i < years; i++) {
    const oilRate = Math.max(economicLimit, hyperbolicDecline(currentRate, Di, b, i));
    forecast.push({
      year: startYear + i,
      oil: Math.round(oilRate),
      gas: parseFloat((oilRate * gor / 1000).toFixed(2)),
    });
  }
  return forecast;
}

// ─────────────────────────────────────────────────────────────
// RESERVOIR ENGINEERING
// ─────────────────────────────────────────────────────────────

/**
 * Recovery Factor
 *
 * RF (%) = Cumulative Oil Produced (MMbbl) / OOIP (MMbbl) × 100
 */
export function calculateRecoveryFactor(cumulativeOilMMbbl: number, ooipMMbbl: number): number {
  if (ooipMMbbl === 0) return 0;
  return (cumulativeOilMMbbl / ooipMMbbl) * 100;
}

/**
 * Water Cut
 *
 * WC (%) = Q_water / (Q_oil + Q_water) × 100
 */
export function calculateWaterCut(waterBpd: number, oilBpd: number): number {
  const total = oilBpd + waterBpd;
  if (total === 0) return 0;
  return (waterBpd / total) * 100;
}

/**
 * Reservoir Pressure Decline (simplified material balance)
 *
 * Based on liquid expansion drive:
 * ΔP = Np × Bo / (N × Bo_i × c_t)
 *
 * @param initialPressure  Original reservoir pressure (psi)
 * @param ooipMMbbl        OOIP (MMbbl)
 * @param cumulativeMMbbl  Cumulative oil produced (MMbbl)
 * @param oilFVF           Oil formation volume factor (rb/stb, typically 1.2–1.5)
 * @param totalCompressibility  1/psi (typically 10e-6 to 20e-6)
 * @returns Estimated current reservoir pressure (psi)
 */
export function estimateReservoirPressure(
  initialPressure: number,
  ooipMMbbl: number,
  cumulativeMMbbl: number,
  oilFVF: number = 1.35,
  totalCompressibility: number = 15e-6
): number {
  if (ooipMMbbl === 0) return initialPressure;
  const poreVolumeBbl = ooipMMbbl * 1e6 * oilFVF;
  const deltaP = (cumulativeMMbbl * 1e6 * oilFVF) / (poreVolumeBbl * totalCompressibility);
  return Math.max(500, initialPressure - deltaP);
}

/**
 * Sweep Efficiency Estimate
 *
 * E_sweep = E_areal × E_vertical
 *
 * E_areal: Craig's correlation for 5-spot pattern:
 *   E_areal ≈ 0.967 - 0.125 × ln(M)   for M ≥ 1
 *   where M = mobility ratio = (kr_w/μ_w) / (kr_o/μ_o)
 *
 * E_vertical: Dykstra-Parsons correlation:
 *   E_vertical ≈ 1 - 0.6 × V_DP
 *   where V_DP = Dykstra-Parsons coefficient (0 = homogeneous, 1 = very heterogeneous)
 *
 * @param mobilityRatio   Typically 1–5 for water/oil systems
 * @param dykstraParsonV  Permeability variation coefficient (0–1), default 0.4
 * @returns Sweep efficiency (%)
 */
export function calculateSweepEfficiency(
  mobilityRatio: number,
  dykstraParsonV: number = 0.4
): number {
  const eAreal = mobilityRatio <= 1 ? 0.95 : Math.max(0.45, 0.967 - 0.125 * Math.log(mobilityRatio));
  const eVertical = Math.max(0.3, 1 - 0.6 * dykstraParsonV);
  return eAreal * eVertical * 100;
}

// ─────────────────────────────────────────────────────────────
// HISTORY MATCHING QUALITY METRICS
// ─────────────────────────────────────────────────────────────

/**
 * Coefficient of Determination (R²)
 *
 * R² = 1 - SS_res / SS_tot
 *   SS_res = Σ(obs_i − sim_i)²
 *   SS_tot = Σ(obs_i − mean_obs)²
 *
 * R² = 1.0 → perfect match; < 0 → worse than mean predictor
 */
export function calculateR2(observed: number[], simulated: number[]): number {
  if (observed.length === 0) return 0;
  const mean = observed.reduce((a, b) => a + b, 0) / observed.length;
  const ssTot = observed.reduce((s, o) => s + Math.pow(o - mean, 2), 0);
  const ssRes = observed.reduce((s, o, i) => s + Math.pow(o - simulated[i], 2), 0);
  if (ssTot === 0) return 1;
  return Math.max(0, 1 - ssRes / ssTot);
}

/**
 * Root Mean Square Error
 *
 * RMSE = sqrt( Σ(obs_i − sim_i)² / n )
 */
export function calculateRMSE(observed: number[], simulated: number[]): number {
  if (observed.length === 0) return 0;
  const mse = observed.reduce((s, o, i) => s + Math.pow(o - simulated[i], 2), 0) / observed.length;
  return Math.sqrt(mse);
}

/**
 * Mean Absolute Percentage Error
 *
 * MAPE (%) = (1/n) × Σ |obs_i − sim_i| / obs_i × 100
 */
export function calculateMAPE(observed: number[], simulated: number[]): number {
  if (observed.length === 0) return 0;
  const sum = observed.reduce((s, o, i) => {
    if (o === 0) return s;
    return s + Math.abs((o - simulated[i]) / o);
  }, 0);
  return (sum / observed.length) * 100;
}

/**
 * Composite History Match Quality Score (0–100 %)
 *
 * Weights: R² (60%) + MAPE-based (40%)
 * If pressure match data provided: production (70%) + pressure (30%)
 */
export function calculateHistoryMatchQuality(
  observedProd: number[],
  simulatedProd: number[],
  observedPressure?: number[],
  simulatedPressure?: number[]
): number {
  const r2 = calculateR2(observedProd, simulatedProd);
  const mape = calculateMAPE(observedProd, simulatedProd);
  const mapeScore = Math.max(0, 1 - mape / 10); // 10% MAPE → score 0
  const productionScore = r2 * 0.6 + mapeScore * 0.4;

  if (
    observedPressure &&
    simulatedPressure &&
    observedPressure.length > 0
  ) {
    const pressureR2 = calculateR2(observedPressure, simulatedPressure);
    return (productionScore * 0.7 + pressureR2 * 0.3) * 100;
  }
  return productionScore * 100;
}

/**
 * Generate history-match chart data from asset parameters (deterministic)
 *
 * Uses hyperbolic decline + small sinusoidal seasonal perturbation for observed data.
 * No random numbers — same asset always produces the same chart.
 */
export interface MatchDataPoint {
  month: string;
  observed: number | null;
  simulated: number;
  confidenceLow: number;
  confidenceHigh: number;
}

export function generateMatchChartData(
  currentRateBpd: number,
  Di: number,          // annual decline rate
  b: number,           // decline exponent
  firstOilYear: number,
  chartStartYear: number,
  chartStartMonth: number, // 0–11
  forecastEndYear: number,
  stepMonths: number = 3,
  historyMatchR2: number = 0.95
): MatchDataPoint[] {
  const now = new Date();
  const points: MatchDataPoint[] = [];

  // Back-calculate qi from current rate
  const ageYears = now.getFullYear() - firstOilYear + now.getMonth() / 12;
  const qi = hyperbolicDecline(currentRateBpd, -Di, b, -ageYears); // inverse
  // Simpler: use currentRate as reference and compute relative changes
  // Reference: at chartStart we compute the rate from decline
  const chartStartAge = chartStartYear + chartStartMonth / 12 - firstOilYear;

  let year = chartStartYear;
  let month = chartStartMonth;

  const kbpd = (bpd: number) => Math.round(bpd); // keep in bpd for chart

  while (year < forecastEndYear || (year === forecastEndYear && month === 0)) {
    const t = year + month / 12 - firstOilYear;
    const baseRate = hyperbolicDecline(currentRateBpd, Di, b, t - ageYears);

    // Deterministic seasonal perturbation (amplitude 2% of rate)
    const seasonal = 1 + 0.02 * Math.sin((2 * Math.PI * month) / 12);
    // Deterministic well-maintenance dip (every ~6 months, small)
    const maint = 1 - 0.005 * Math.abs(Math.sin((2 * Math.PI * (month + year)) / 6));

    const observed_raw = baseRate * seasonal * maint;

    // Simulation has small systematic error that decreases with better match quality
    const simError = (1 - historyMatchR2) * 0.05 * Math.sin(t * 0.7 + 1.5);
    const simulated = kbpd(baseRate * (1 + simError));

    const ci = 1 - historyMatchR2 * 0.9; // CI width: 10% if perfect match
    const confidenceLow = Math.round(simulated * (1 - ci * 0.5));
    const confidenceHigh = Math.round(simulated * (1 + ci * 0.5));

    const isHistory = year < now.getFullYear() || (year === now.getFullYear() && month <= now.getMonth());
    const observed = isHistory ? kbpd(observed_raw) : null;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    points.push({
      month: `${monthNames[month]} ${String(year).slice(2)}`,
      observed,
      simulated,
      confidenceLow,
      confidenceHigh,
    });

    month += stepMonths;
    if (month >= 12) {
      month -= 12;
      year += 1;
    }
  }

  return points;
}

// ─────────────────────────────────────────────────────────────
// UNCERTAINTY & MONTE CARLO SIMULATION
// ─────────────────────────────────────────────────────────────

/**
 * Triangular distribution sampler
 *
 * Used for OOIP, recovery factor, and other bounded uncertain parameters.
 */
export function sampleTriangular(min: number, mode: number, max: number): number {
  const u = Math.random();
  const fc = (mode - min) / (max - min);
  if (u < fc) return min + Math.sqrt(u * (max - min) * (mode - min));
  return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

/**
 * Normal distribution sampler (Box–Muller transform)
 */
export function sampleNormal(mean: number, stdDev: number): number {
  const u1 = Math.max(1e-10, Math.random());
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

/**
 * Log-normal distribution sampler
 *
 * Used for oil price — prices cannot go negative and are right-skewed.
 */
export function sampleLogNormal(mean: number, cv: number): number {
  // cv = coefficient of variation = stdDev/mean
  const stdDev = mean * cv;
  const sigma2 = Math.log(1 + (stdDev / mean) ** 2);
  const mu = Math.log(mean) - sigma2 / 2;
  return Math.exp(sampleNormal(mu, Math.sqrt(sigma2)));
}

export interface MonteCarloInputs {
  ooip:            { min: number; mode: number; max: number };     // MMbbl
  recoveryFactor:  { min: number; mode: number; max: number };     // fraction
  oilPrice:        { mean: number; cv: number };                   // $/bbl, CV fraction
  opexPerBbl:      { mean: number; cv: number };                   // $/bbl
  capexMM:         { mean: number; cv: number };                   // $MM
  discountRate:    number;                                         // fraction
  fieldLifeYears:  number;
  royaltyRate:     number;                                         // fraction
  taxRate:         number;                                         // fraction
}

/**
 * Monte Carlo NPV Simulation
 *
 * Samples OOIP and RF from triangular distributions (bounded subsurface uncertainty),
 * oil price from log-normal (market volatility), OPEX and CapEx from normal.
 *
 * NPV approximated using annuity formula for each realization:
 *   NPV_i = (Rev_i - Opex_i) × (1 - royalty) × (1 - tax) × PVF - CapEx_i
 *
 * @returns Sorted array of NPV values ($MM) — use getPercentile() for P10/P50/P90
 */
export function runMonteCarloNPV(inputs: MonteCarloInputs, n: number = 10000): number[] {
  const results: number[] = [];

  const pvFactor =
    inputs.discountRate > 0
      ? (1 - Math.pow(1 + inputs.discountRate, -inputs.fieldLifeYears)) / inputs.discountRate
      : inputs.fieldLifeYears;

  for (let i = 0; i < n; i++) {
    const ooip = sampleTriangular(inputs.ooip.min, inputs.ooip.mode, inputs.ooip.max);
    const rf   = sampleTriangular(inputs.recoveryFactor.min, inputs.recoveryFactor.mode, inputs.recoveryFactor.max);
    const price  = Math.max(20, sampleLogNormal(inputs.oilPrice.mean, inputs.oilPrice.cv));
    const opex   = Math.max(2, sampleNormal(inputs.opexPerBbl.mean, inputs.opexPerBbl.mean * inputs.opexPerBbl.cv));
    const capex  = Math.max(0, sampleNormal(inputs.capexMM.mean, inputs.capexMM.mean * inputs.capexMM.cv));

    const reserves = ooip * rf;                                     // MMbbl
    const annualProd = (reserves / inputs.fieldLifeYears) * 1e6;    // bbl/year

    const annualRevenue  = annualProd * price;
    const annualOpexCost = annualProd * opex;
    const grossMargin    = (annualRevenue - annualOpexCost) * (1 - inputs.royaltyRate);
    const netCF          = grossMargin * (1 - inputs.taxRate);

    const npvMM = (netCF * pvFactor - capex * 1e6) / 1e6; // $MM
    results.push(npvMM);
  }

  return results.sort((a, b) => a - b);
}

/**
 * Extract percentile from a sorted array
 *
 * P10 in oil industry convention = 90th percentile of cumulative distribution
 * (optimistic case — only 10% of outcomes are better)
 *
 * @param sorted  Sorted array (ascending)
 * @param p       Percentile (0–100)
 */
export function getPercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.floor((p / 100) * sorted.length);
  return sorted[Math.min(idx, sorted.length - 1)];
}

/**
 * Generate Monte Carlo distribution bins for histogram display
 *
 * @param sortedValues  Output of runMonteCarloNPV()
 * @param bins          Number of histogram buckets (default 60)
 * @returns Array of {value, frequency} for Recharts BarChart
 */
export function buildHistogramBins(
  sortedValues: number[],
  bins: number = 60
): { value: number; frequency: number }[] {
  if (sortedValues.length === 0) return [];
  const min = sortedValues[0];
  const max = sortedValues[sortedValues.length - 1];
  const step = (max - min) / bins;
  const counts = new Array(bins).fill(0);

  for (const v of sortedValues) {
    const bin = Math.min(bins - 1, Math.floor((v - min) / step));
    counts[bin]++;
  }

  return counts.map((c, i) => ({
    value: Math.round(min + i * step),
    frequency: (c / sortedValues.length) * 100,
  }));
}

// ─────────────────────────────────────────────────────────────
// SENSITIVITY ANALYSIS — TORNADO CHART
// ─────────────────────────────────────────────────────────────

export interface SensitivityResult {
  parameter: string;
  negative: number;   // % NPV change at low-end value
  positive: number;   // % NPV change at high-end value
  impact: number;     // total swing = |positive - negative|
  direction: 'positive' | 'negative' | 'neutral';
}

/**
 * One-At-a-Time (OAT) Sensitivity Analysis
 *
 * For each parameter:
 *   1. Fix all others at base case
 *   2. Vary parameter from P10 to P90 (or min to max)
 *   3. Compute ΔNPV / NPV_base × 100
 *
 * @param baseNPV_MM   NPV at base case ($MM)
 * @param parameters   Record of parameter name → {low, high, lowNPV, highNPV}
 * @returns Sorted descending by total impact (for tornado chart)
 */
export function calculateOATSensitivity(
  baseNPV_MM: number,
  parameters: Record<string, { lowNPV: number; highNPV: number }>
): SensitivityResult[] {
  if (baseNPV_MM === 0) return [];

  const results = Object.entries(parameters).map(([param, vals]) => {
    const negPct = ((vals.lowNPV - baseNPV_MM) / Math.abs(baseNPV_MM)) * 100;
    const posPct = ((vals.highNPV - baseNPV_MM) / Math.abs(baseNPV_MM)) * 100;
    const impact = Math.abs(vals.highNPV - vals.lowNPV) / Math.abs(baseNPV_MM) * 100;
    return {
      parameter: param,
      negative: Math.min(negPct, posPct),
      positive: Math.max(negPct, posPct),
      impact,
      direction: (posPct > 0 ? 'positive' : posPct < 0 ? 'negative' : 'neutral') as
        'positive' | 'negative' | 'neutral',
    };
  });

  // Sort by total impact (largest bar first in tornado chart)
  return results.sort((a, b) => b.impact - a.impact);
}

// ─────────────────────────────────────────────────────────────
// DATA COMPLETENESS
// ─────────────────────────────────────────────────────────────

export interface DataCategoryStatus {
  name: string;
  totalItems: number;
  validatedItems: number;
  criticalMissing: number;
  weight: number; // relative importance (e.g., 0.2 = 20% of total score)
}

/**
 * Weighted Overall Data Completeness
 *
 * Formula: Σ(completeness_i × weight_i) / Σ(weight_i) × 100
 *
 * Weights represent how critical each category is for reservoir simulation:
 *   Static model (structure+porosity+perm) → highest weight
 *   Well data (trajectories+completions) → high
 *   Petrophysical logs → high
 *   Production history → high
 *   Geological interpretations → medium
 *   Geophysical → medium
 */
export function calculateWeightedCompleteness(categories: DataCategoryStatus[]): number {
  const totalWeight = categories.reduce((s, c) => s + c.weight, 0);
  if (totalWeight === 0) return 0;
  const weightedScore = categories.reduce((s, c) => {
    const pct = c.totalItems > 0 ? c.validatedItems / c.totalItems : 0;
    return s + pct * c.weight;
  }, 0);
  return (weightedScore / totalWeight) * 100;
}

/**
 * Total critical data gaps (items that block simulation if missing)
 */
export function countCriticalGaps(categories: DataCategoryStatus[]): number {
  return categories.reduce((s, c) => s + c.criticalMissing, 0);
}

/**
 * Count validated items and total across all categories
 */
export function aggregateValidation(categories: DataCategoryStatus[]): {
  validated: number;
  total: number;
} {
  return {
    validated: categories.reduce((s, c) => s + c.validatedItems, 0),
    total: categories.reduce((s, c) => s + c.totalItems, 0),
  };
}

// ─────────────────────────────────────────────────────────────
// FDP WORKFLOW PROGRESS
// ─────────────────────────────────────────────────────────────

export interface FDPMilestone {
  id: string;
  name: string;
  weight: number;      // fraction of total (sum = 1)
  completionPct: number; // 0–100
}

/**
 * Overall FDP Completion Score
 *
 * Formula: Σ(milestone_completion_i × weight_i) × 100
 */
export function calculateFDPCompletion(milestones: FDPMilestone[]): number {
  return milestones.reduce((s, m) => s + (m.completionPct / 100) * m.weight, 0) * 100;
}

// ─────────────────────────────────────────────────────────────
// MARKET VOLATILITY — PRICE FORECAST
// ─────────────────────────────────────────────────────────────

export interface PriceScenarioPoint {
  year: number;
  optimistic: number;
  base: number;
  pessimistic: number;
}

/**
 * Generate Brent crude price forecast scenarios
 *
 * Methodology:
 *   - Base case: EIA/IEA consensus long-term price + mean-reversion from current spot
 *   - Optimistic (P10): base × (1 + supplyRisk factor + demandUpside)
 *   - Pessimistic (P90): base × (1 - energyTransitionDiscount - demandShock)
 *   - Mean-reversion: prices gradually converge to long-run equilibrium
 *
 * @param currentPrice  Current Brent spot ($/bbl)
 * @param longRunEquil  Long-run equilibrium price ($/bbl, e.g. $70)
 * @param reversionRate Annual mean-reversion speed (fraction, e.g. 0.2)
 * @param startYear     First year of forecast
 * @param years         Number of years
 * @param upliftPct     Optimistic uplift above base (%)
 * @param haircut Pct   Pessimistic haircut below base (%)
 */
export function generatePriceScenarios(
  currentPrice: number,
  longRunEquil: number,
  reversionRate: number,
  startYear: number,
  years: number,
  upliftPct: number = 25,
  haircutPct: number = 30
): PriceScenarioPoint[] {
  const scenarios: PriceScenarioPoint[] = [];
  let base = currentPrice;

  for (let i = 0; i < years; i++) {
    const year = startYear + i;
    // Ornstein-Uhlenbeck mean-reversion (no stochastic term — deterministic scenario)
    base = base + reversionRate * (longRunEquil - base);

    // Optimistic: supply cuts, strong demand
    const optimistic = Math.round(base * (1 + upliftPct / 100));
    // Pessimistic: energy transition, demand shock
    const pessimistic = Math.round(base * (1 - haircutPct / 100));

    scenarios.push({ year, base: Math.round(base), optimistic, pessimistic });
  }
  return scenarios;
}

// ─────────────────────────────────────────────────────────────
// AI CONFIDENCE SCORING
// ─────────────────────────────────────────────────────────────

/**
 * AI / Model Confidence Score
 *
 * Composite score combining:
 *   1. Data quality (weighted completeness)
 *   2. History match quality (R²)
 *   3. Uncertainty coverage (fraction of categories configured)
 *
 * Formula: confidence = w1×dataQuality + w2×hmQuality + w3×uncertaintyCoverage
 */
export function calculateAIConfidence(
  dataCompleteness: number,   // 0–100 %
  historyMatchR2: number,     // 0–1
  uncertaintyCoverage: number // 0–1 fraction of uncertainty categories configured
): {
  overall: number;
  dataQuality: number;
  modelConfidence: number;
  insightReliability: number;
} {
  const dataQuality  = Math.min(100, dataCompleteness);
  const modelConf    = Math.min(100, historyMatchR2 * 100);
  const insightRel   = Math.min(100, (dataQuality * 0.4 + modelConf * 0.4 + uncertaintyCoverage * 100 * 0.2));
  const overall      = (dataQuality * 0.3 + modelConf * 0.4 + insightRel * 0.3);
  return {
    overall: parseFloat(overall.toFixed(1)),
    dataQuality: parseFloat(dataQuality.toFixed(1)),
    modelConfidence: parseFloat(modelConf.toFixed(1)),
    insightReliability: parseFloat(insightRel.toFixed(1)),
  };
}

// ─────────────────────────────────────────────────────────────
// PORTFOLIO AGGREGATION
// ─────────────────────────────────────────────────────────────

/**
 * Aggregate portfolio NPV across multiple fields
 */
export function aggregatePortfolioNPV(fieldNPVs: number[]): number {
  return fieldNPVs.reduce((a, b) => a + b, 0);
}

/**
 * Weighted average capital efficiency across portfolio
 *
 * Weighted by each field's CapEx share (larger CapEx = more weight)
 */
export function portfolioCapitalEfficiency(
  fields: { npvB: number; capexB: number }[]
): number {
  const totalCapex = fields.reduce((s, f) => s + f.capexB, 0);
  if (totalCapex === 0) return 0;
  const weightedVIR = fields.reduce((s, f) => s + (f.npvB / Math.max(0.001, f.capexB)) * f.capexB, 0);
  return weightedVIR / totalCapex;
}
