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
    oil: number; // bbl/day
    gas: number; // MMscf/day
    water: number; // bbl/day
  };
  waterCut: number; // percentage
  recovery: number; // percentage
  pressure: number; // psi
  temperature: number; // °F
  depth: number; // ft
  activeWells: number;
  injectionWells: number;
  platformCount?: number; // for offshore
  facilities: number;
}

export const availableAssets: Asset[] = [
  {
    id: 'upper-zakum',
    name: 'Upper Zakum',
    code: 'UZ-001',
    type: 'offshore',
    status: 'active',
    location: 'UpstreamAI Offshore',
    wells: 0,
    reserves: '0 MMbbl',
    production: {
      oil: 0,
      gas: 0,
      water: 0
    },
    waterCut: 0,
    recovery: 0,
    pressure: 0,
    temperature: 0,
    depth: 0,
    activeWells: 0,
    injectionWells: 0,
    platformCount: 0,
    facilities: 0
  },
  {
    id: 'lower-zakum',
    name: 'Lower Zakum',
    code: 'LZ-002',
    type: 'offshore',
    status: 'active',
    location: 'UpstreamAI Offshore',
    wells: 0,
    reserves: '0 MMbbl',
    production: {
      oil: 0,
      gas: 0,
      water: 0
    },
    waterCut: 0,
    recovery: 0,
    pressure: 0,
    temperature: 0,
    depth: 0,
    activeWells: 0,
    injectionWells: 0,
    platformCount: 0,
    facilities: 0
  },
  {
    id: 'umm-shaif',
    name: 'Umm Shaif',
    code: 'US-003',
    type: 'offshore',
    status: 'active',
    location: 'UpstreamAI Offshore',
    wells: 0,
    reserves: '0 MMbbl',
    production: {
      oil: 0,
      gas: 0,
      water: 0
    },
    waterCut: 0,
    recovery: 0,
    pressure: 0,
    temperature: 0,
    depth: 0,
    activeWells: 0,
    injectionWells: 0,
    platformCount: 0,
    facilities: 0
  },
  {
    id: 'satah',
    name: 'Satah',
    code: 'ST-004',
    type: 'offshore',
    status: 'active',
    location: 'UpstreamAI Offshore',
    wells: 0,
    reserves: '0 MMbbl',
    production: {
      oil: 0,
      gas: 0,
      water: 0
    },
    waterCut: 0,
    recovery: 0,
    pressure: 0,
    temperature: 0,
    depth: 0,
    activeWells: 0,
    injectionWells: 0,
    platformCount: 0,
    facilities: 0
  },
  {
    id: 'nasr',
    name: 'Nasr',
    code: 'NS-005',
    type: 'offshore',
    status: 'active',
    location: 'UpstreamAI Offshore',
    wells: 0,
    reserves: '0 MMbbl',
    production: {
      oil: 0,
      gas: 0,
      water: 0
    },
    waterCut: 0,
    recovery: 0,
    pressure: 0,
    temperature: 0,
    depth: 0,
    activeWells: 0,
    injectionWells: 0,
    platformCount: 0,
    facilities: 0
  },
  {
    id: 'umm-al-dalkh',
    name: 'Umm Al Dalkh',
    code: 'UD-006',
    type: 'offshore',
    status: 'active',
    location: 'UpstreamAI Offshore',
    wells: 0,
    reserves: '0 MMbbl',
    production: {
      oil: 0,
      gas: 0,
      water: 0
    },
    waterCut: 0,
    recovery: 0,
    pressure: 0,
    temperature: 0,
    depth: 0,
    activeWells: 0,
    injectionWells: 0,
    platformCount: 0,
    facilities: 0
  },
  {
    id: 'sarb',
    name: 'Sarb',
    code: 'SB-007',
    type: 'offshore',
    status: 'active',
    location: 'UpstreamAI Offshore',
    wells: 0,
    reserves: '0 MMbbl',
    production: {
      oil: 0,
      gas: 0,
      water: 0
    },
    waterCut: 0,
    recovery: 0,
    pressure: 0,
    temperature: 0,
    depth: 0,
    activeWells: 0,
    injectionWells: 0,
    platformCount: 0,
    facilities: 0
  },
  {
    id: 'umm-lulu',
    name: 'Umm Lulu',
    code: 'UL-008',
    type: 'offshore',
    status: 'active',
    location: 'UpstreamAI Offshore',
    wells: 0,
    reserves: '0 MMbbl',
    production: {
      oil: 0,
      gas: 0,
      water: 0
    },
    waterCut: 0,
    recovery: 0,
    pressure: 0,
    temperature: 0,
    depth: 0,
    activeWells: 0,
    injectionWells: 0,
    platformCount: 0,
    facilities: 0
  },
  {
    id: 'abk',
    name: 'Abu Al Bukhoosh (ABK)',
    code: 'AB-009',
    type: 'offshore',
    status: 'active',
    location: 'UpstreamAI Offshore',
    wells: 0,
    reserves: '0 MMbbl',
    production: {
      oil: 0,
      gas: 0,
      water: 0
    },
    waterCut: 0,
    recovery: 0,
    pressure: 0,
    temperature: 0,
    depth: 0,
    activeWells: 0,
    injectionWells: 0,
    platformCount: 0,
    facilities: 0
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