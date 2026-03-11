import { createContext, useContext, useState, ReactNode } from 'react';

export interface Asset {
  id: string;
  name: string;
  code: string;
  type: 'onshore' | 'offshore';
  status: 'active' | 'planning' | 'development';
  location: string;
  wells: number;
  reserves: string;
  production: {
    oil: number;   // bbl/day
    gas: number;   // MMscf/day
    water: number; // bbl/day
  };
  waterCut: number;   // %
  recovery: number;   // % (computed = cumulativeOil / ooip × 100)
  pressure: number;   // current reservoir pressure, psi
  temperature: number; // °F
  depth: number;       // ft subsea
  activeWells: number;
  injectionWells: number;
  platformCount?: number;
  facilities: number;

  // ── Reservoir engineering parameters ──────────────────────────────
  ooip: number;             // Original Oil In Place (MMbbl)
  cumulativeOil: number;    // Cumulative oil produced to date (MMbbl)
  initialPressure: number;  // Original reservoir pressure (psi)
  firstOilYear: number;     // Calendar year of first production

  // ── Decline curve (Arps) ──────────────────────────────────────────
  declineRate: number;      // Annual nominal decline rate Di (fraction/yr)
  declineExponent: number;  // Arps b exponent (0 = exponential, 1 = harmonic)
  gor: number;              // Gas-Oil Ratio (scf/bbl)

  // ── Financial parameters ──────────────────────────────────────────
  opexPerBbl: number;       // All-in operating cost ($/bbl)
  remainingCapexMM: number; // Remaining capital expenditure ($MM)
  fieldLifeYears: number;   // Remaining production life (years)

  // ── Sweep / displacement efficiency ──────────────────────────────
  mobilityRatio: number;    // Water/oil mobility ratio (dimensionless)

  // ── AI / simulation quality ───────────────────────────────────────
  dataCompleteness: number; // Weighted data completeness 0–100 %
  historyMatchR2: number;   // History match R² (0–1)
}

export const availableAssets: Asset[] = [
  {
    id: 'upper-zakum',
    name: 'Upper Zakum',
    code: 'UZ-001',
    type: 'offshore',
    status: 'active',
    location: 'Abu Dhabi Offshore',
    wells: 486,
    reserves: '11,130 MMbbl',
    production: { oil: 950000, gas: 361, water: 720000 },
    waterCut: 43,
    recovery: 47,
    pressure: 3210,
    temperature: 220,
    depth: 6200,
    activeWells: 312,
    injectionWells: 174,
    platformCount: 12,
    facilities: 18,
    // Reservoir
    ooip: 21000,
    cumulativeOil: 9870,
    initialPressure: 3800,
    firstOilYear: 1967,
    // Decline curve
    declineRate: 0.035,
    declineExponent: 0.45,
    gor: 380,
    // Financial
    opexPerBbl: 4.20,
    remainingCapexMM: 2800,
    fieldLifeYears: 25,
    // Sweep
    mobilityRatio: 2.5,
    // Quality
    dataCompleteness: 85,
    historyMatchR2: 0.94
  },
  {
    id: 'lower-zakum',
    name: 'Lower Zakum',
    code: 'LZ-002',
    type: 'offshore',
    status: 'active',
    location: 'Abu Dhabi Offshore',
    wells: 215,
    reserves: '5,270 MMbbl',
    production: { oil: 340000, gas: 119, water: 210000 },
    waterCut: 38,
    recovery: 38,
    pressure: 3290,
    temperature: 215,
    depth: 5800,
    activeWells: 148,
    injectionWells: 67,
    platformCount: 8,
    facilities: 12,
    ooip: 8500,
    cumulativeOil: 3230,
    initialPressure: 3500,
    firstOilYear: 1973,
    declineRate: 0.040,
    declineExponent: 0.40,
    gor: 350,
    opexPerBbl: 4.80,
    remainingCapexMM: 1200,
    fieldLifeYears: 22,
    mobilityRatio: 2.8,
    dataCompleteness: 82,
    historyMatchR2: 0.92
  },
  {
    id: 'umm-shaif',
    name: 'Umm Shaif',
    code: 'US-003',
    type: 'offshore',
    status: 'active',
    location: 'Abu Dhabi Offshore',
    wells: 178,
    reserves: '3,472 MMbbl',
    production: { oil: 280000, gas: 118, water: 186000 },
    waterCut: 40,
    recovery: 44,
    pressure: 3460,
    temperature: 230,
    depth: 7100,
    activeWells: 124,
    injectionWells: 54,
    platformCount: 6,
    facilities: 10,
    ooip: 6200,
    cumulativeOil: 2728,
    initialPressure: 3650,
    firstOilYear: 1962,
    declineRate: 0.038,
    declineExponent: 0.42,
    gor: 420,
    opexPerBbl: 5.10,
    remainingCapexMM: 980,
    fieldLifeYears: 18,
    mobilityRatio: 2.3,
    dataCompleteness: 88,
    historyMatchR2: 0.95
  },
  {
    id: 'satah',
    name: 'Satah',
    code: 'ST-004',
    type: 'offshore',
    status: 'active',
    location: 'Abu Dhabi Offshore',
    wells: 95,
    reserves: '1,736 MMbbl',
    production: { oil: 120000, gas: 36, water: 64000 },
    waterCut: 35,
    recovery: 38,
    pressure: 2690,
    temperature: 195,
    depth: 4200,
    activeWells: 62,
    injectionWells: 33,
    platformCount: 4,
    facilities: 6,
    ooip: 2800,
    cumulativeOil: 1064,
    initialPressure: 2850,
    firstOilYear: 1975,
    declineRate: 0.045,
    declineExponent: 0.38,
    gor: 300,
    opexPerBbl: 6.20,
    remainingCapexMM: 450,
    fieldLifeYears: 15,
    mobilityRatio: 3.0,
    dataCompleteness: 79,
    historyMatchR2: 0.91
  },
  {
    id: 'nasr',
    name: 'Nasr',
    code: 'NS-005',
    type: 'offshore',
    status: 'active',
    location: 'Abu Dhabi Offshore',
    wells: 72,
    reserves: '1,368 MMbbl',
    production: { oil: 65000, gas: 17, water: 18000 },
    waterCut: 22,
    recovery: 28,
    pressure: 2980,
    temperature: 200,
    depth: 5000,
    activeWells: 48,
    injectionWells: 24,
    platformCount: 3,
    facilities: 5,
    ooip: 1900,
    cumulativeOil: 532,
    initialPressure: 3100,
    firstOilYear: 2014,
    declineRate: 0.052,
    declineExponent: 0.35,
    gor: 260,
    opexPerBbl: 7.50,
    remainingCapexMM: 680,
    fieldLifeYears: 20,
    mobilityRatio: 2.0,
    dataCompleteness: 76,
    historyMatchR2: 0.88
  },
  {
    id: 'umm-al-dalkh',
    name: 'Umm Al Dalkh',
    code: 'UD-006',
    type: 'offshore',
    status: 'active',
    location: 'Abu Dhabi Offshore',
    wells: 58,
    reserves: '1,184 MMbbl',
    production: { oil: 42000, gas: 10, water: 16000 },
    waterCut: 28,
    recovery: 26,
    pressure: 2590,
    temperature: 185,
    depth: 3800,
    activeWells: 38,
    injectionWells: 20,
    platformCount: 2,
    facilities: 4,
    ooip: 1600,
    cumulativeOil: 416,
    initialPressure: 2700,
    firstOilYear: 1983,
    declineRate: 0.055,
    declineExponent: 0.32,
    gor: 240,
    opexPerBbl: 8.20,
    remainingCapexMM: 320,
    fieldLifeYears: 14,
    mobilityRatio: 3.2,
    dataCompleteness: 72,
    historyMatchR2: 0.87
  },
  {
    id: 'sarb',
    name: 'Sarb',
    code: 'SB-007',
    type: 'offshore',
    status: 'active',
    location: 'Abu Dhabi Offshore',
    wells: 48,
    reserves: '888 MMbbl',
    production: { oil: 35000, gas: 10, water: 15000 },
    waterCut: 30,
    recovery: 26,
    pressure: 2730,
    temperature: 190,
    depth: 4100,
    activeWells: 32,
    injectionWells: 16,
    platformCount: 2,
    facilities: 3,
    ooip: 1200,
    cumulativeOil: 312,
    initialPressure: 2900,
    firstOilYear: 1998,
    declineRate: 0.058,
    declineExponent: 0.30,
    gor: 275,
    opexPerBbl: 8.80,
    remainingCapexMM: 280,
    fieldLifeYears: 12,
    mobilityRatio: 3.1,
    dataCompleteness: 74,
    historyMatchR2: 0.86
  },
  {
    id: 'umm-lulu',
    name: 'Umm Lulu',
    code: 'UL-008',
    type: 'offshore',
    status: 'development',
    location: 'Abu Dhabi Offshore',
    wells: 65,
    reserves: '1,230 MMbbl',
    production: { oil: 105000, gas: 33, water: 18000 },
    waterCut: 15,
    recovery: 18,
    pressure: 3720,
    temperature: 210,
    depth: 6500,
    activeWells: 45,
    injectionWells: 20,
    platformCount: 3,
    facilities: 5,
    ooip: 1500,
    cumulativeOil: 270,
    initialPressure: 3800,
    firstOilYear: 2018,
    declineRate: 0.030,
    declineExponent: 0.48,
    gor: 310,
    opexPerBbl: 6.80,
    remainingCapexMM: 1450,
    fieldLifeYears: 28,
    mobilityRatio: 1.8,
    dataCompleteness: 91,
    historyMatchR2: 0.96
  },
  {
    id: 'abk',
    name: 'Abu Al Bukhoosh (ABK)',
    code: 'AB-009',
    type: 'offshore',
    status: 'active',
    location: 'Abu Dhabi Offshore',
    wells: 42,
    reserves: '549 MMbbl',
    production: { oil: 28000, gas: 6, water: 30000 },
    waterCut: 52,
    recovery: 39,
    pressure: 2020,
    temperature: 175,
    depth: 3200,
    activeWells: 28,
    injectionWells: 14,
    platformCount: 2,
    facilities: 3,
    ooip: 900,
    cumulativeOil: 351,
    initialPressure: 2100,
    firstOilYear: 1969,
    declineRate: 0.065,
    declineExponent: 0.25,
    gor: 220,
    opexPerBbl: 9.50,
    remainingCapexMM: 180,
    fieldLifeYears: 10,
    mobilityRatio: 4.0,
    dataCompleteness: 68,
    historyMatchR2: 0.83
  }
];

interface AssetContextType {
  selectedAsset: Asset;
  setSelectedAsset: (asset: Asset) => void;
  availableAssets: Asset[];
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(availableAssets[0]);

  return (
    <AssetContext.Provider value={{ selectedAsset, setSelectedAsset, availableAssets }}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAsset() {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAsset must be used within an AssetProvider');
  }
  return context;
}
