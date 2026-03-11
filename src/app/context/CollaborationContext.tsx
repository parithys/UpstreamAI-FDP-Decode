import React, { createContext, useContext, useState } from 'react';

interface CollaborationContextType {
  isAnnotationToolbarVisible: boolean;
  setAnnotationToolbarVisible: (visible: boolean) => void;
  isCommentsPanelOpen: boolean;
  setCommentsPanelOpen: (open: boolean) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const [isAnnotationToolbarVisible, setAnnotationToolbarVisible] = useState(false);
  const [isCommentsPanelOpen, setCommentsPanelOpen] = useState(false);

  return (
    <CollaborationContext.Provider value={{ 
      isAnnotationToolbarVisible, 
      setAnnotationToolbarVisible,
      isCommentsPanelOpen,
      setCommentsPanelOpen
    }}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (context === undefined) {
    throw new Error('useCollaboration must be used within a CollaborationProvider');
  }
  return context;
}
