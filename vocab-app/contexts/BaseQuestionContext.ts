import { createContext, useContext, useState, ReactNode } from "react";

interface BaseQuestionContextType {
  answer: string;
  setAnswer: (answer: string) => void;
  handleSubmit: () => void;
}

export const BaseQuestionContext = createContext<BaseQuestionContextType | undefined>(undefined);

// Custom hook để sử dụng context
export function useBaseQuestion() {
  const context = useContext(BaseQuestionContext);
  if (!context) {
    throw new Error("useBaseQuestion must be used within a BaseQuestionProvider");
  }
  return context;
}
