// GlobalStateContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for the context
interface GlobalStateContextProps {
  showSearchBar: boolean;
  setShowSearchBar: (value: boolean) => void;
}

// Create the context
const GlobalStateContext = createContext<GlobalStateContextProps | undefined>(undefined);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showSearchBar, setShowSearchBar] = useState(true);

  return (
    <GlobalStateContext.Provider value={{ showSearchBar, setShowSearchBar }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
