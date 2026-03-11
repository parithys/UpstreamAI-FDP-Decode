import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 
  | 'Reservoir Engineer'
  | 'Geoscientist' 
  | 'Production Engineer'
  | 'Facilities Engineer'
  | 'Drilling Engineer'
  | 'Geomechanics Engineer'
  | 'Petrophysicist'
  | 'Asset Manager'
  | 'Executive'
  | 'Administrator';

export type DisciplineAccess = 
  | 'geology'
  | 'geophysics'
  | 'petrophysics'
  | 'reservoir'
  | 'production'
  | 'facilities'
  | 'drilling'
  | 'geomechanics'
  | 'economics'
  | 'operations';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  disciplineAccess: DisciplineAccess[];
  allAccess: boolean; // For executives and admins
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  hasAccessToDiscipline: (discipline: DisciplineAccess) => boolean;
  canViewAllDisciplines: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default user with full access for demo
const defaultUser: User = {
  id: 'usr-001',
  name: 'Demo User',
  email: 'demouser@upstreamai.ae',
  role: 'Administrator',
  disciplineAccess: [
    'geology',
    'geophysics',
    'petrophysics',
    'reservoir',
    'production',
    'facilities',
    'drilling',
    'geomechanics',
    'economics',
    'operations'
  ],
  allAccess: true
};

// Role-based access matrix
const roleAccessMatrix: Record<UserRole, DisciplineAccess[]> = {
  'Reservoir Engineer': ['reservoir', 'production', 'facilities', 'geology', 'petrophysics'],
  'Geoscientist': ['geology', 'geophysics', 'petrophysics', 'reservoir'],
  'Production Engineer': ['production', 'reservoir', 'operations'],
  'Facilities Engineer': ['facilities', 'production', 'operations'],
  'Drilling Engineer': ['drilling', 'reservoir', 'geomechanics'],
  'Geomechanics Engineer': ['geomechanics', 'geology', 'drilling'],
  'Petrophysicist': ['petrophysics', 'geology', 'reservoir'],
  'Asset Manager': ['reservoir', 'production', 'facilities', 'economics', 'operations'],
  'Executive': ['geology', 'geophysics', 'petrophysics', 'reservoir', 'production', 'facilities', 'drilling', 'geomechanics', 'economics', 'operations'],
  'Administrator': ['geology', 'geophysics', 'petrophysics', 'reservoir', 'production', 'facilities', 'drilling', 'geomechanics', 'economics', 'operations']
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser);

  const hasAccessToDiscipline = (discipline: DisciplineAccess): boolean => {
    if (user.allAccess) return true;
    return user.disciplineAccess.includes(discipline);
  };

  const canViewAllDisciplines = (): boolean => {
    return user.allAccess || user.role === 'Executive' || user.role === 'Administrator';
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      hasAccessToDiscipline, 
      canViewAllDisciplines 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Helper function to get user with specific role
export function getUserByRole(role: UserRole): User {
  return {
    id: `usr-${role.toLowerCase().replace(/\s+/g, '-')}`,
    name: role,
    email: `${role.toLowerCase().replace(/\s+/g, '.')}@upstreamai.ae`,
    role: role,
    disciplineAccess: roleAccessMatrix[role],
    allAccess: role === 'Executive' || role === 'Administrator'
  };
}