"use client";
import { createContext, useContext, useState } from "react";

type HabitTrackerContextType = {
  selectedArea: string | null;
  setSelectedArea: (value: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  selectedHabit: string | null;
  setSelectedHabit: (value: string | null) => void;
};

export const HabitTrackerContext = createContext<HabitTrackerContextType>({
  selectedArea: null,
  setSelectedArea: () => {},
  selectedCategory: null,
  setSelectedCategory: () => {},
  selectedHabit: null,
  setSelectedHabit: () => {},
});

export const HabitProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  return (
    <HabitTrackerContext.Provider
      value={{
        selectedArea,
        setSelectedArea,
        selectedCategory,
        setSelectedCategory,
        selectedHabit,
        setSelectedHabit,
      }}
    >
      {children}
    </HabitTrackerContext.Provider>
  );
};

export const useHabit = () => {
  const context = useContext(HabitTrackerContext);
  if (!context) {
    throw new Error(
      "useHabitTracker has to be used within <HabitTrackerContext.Provider>"
    );
  }
  return context;
};
