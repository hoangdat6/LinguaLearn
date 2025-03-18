import { createContext, useContext } from "react";

interface EnterContextType {
  onEnterPress: () => void;
}

export const EnterContext = createContext<EnterContextType | null>(null);

export const useEnterContext = () => {
  const context = useContext(EnterContext);
  if (!context) {
    throw new Error("useEnterContext must be used within an EnterProvider");
  }
  return context;
};
