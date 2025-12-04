import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Mood = "calm" | "focus" | "motivation" | "neutral";

type EmotionContextValue = {
  mood: Mood;
  setMood: (m: Mood) => void;
};

const EmotionContext = createContext<EmotionContextValue | undefined>(undefined);

export function EmotionProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<Mood>("neutral");

  return (
    <EmotionContext.Provider value={{ mood, setMood }}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotion() {
  const ctx = useContext(EmotionContext);
  if (!ctx) {
    throw new Error("useEmotion must be used inside EmotionProvider");
  }
  return ctx;
}
