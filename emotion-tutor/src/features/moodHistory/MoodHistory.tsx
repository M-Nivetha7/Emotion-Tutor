import React from "react";
import { useEmotion } from "../../context/EmotionContext";

type MoodCounts = {
  calm: number;
  focus: number;
  motivation: number;
  neutral: number;
};

// Simple in‑memory history; can later move to localStorage
const counts: MoodCounts = { calm: 0, focus: 0, motivation: 0, neutral: 0 };

export function MoodHistory() {
  const { mood } = useEmotion();
  counts[mood as keyof MoodCounts]++;

  return (
    <div className="mood-history">
      <h2>Mood streak</h2>
      <p>Calm: {counts.calm}</p>
      <p>Focus: {counts.focus}</p>
      <p>Motivation: {counts.motivation}</p>
      <p>Neutral: {counts.neutral}</p>
    </div>
  );
}
