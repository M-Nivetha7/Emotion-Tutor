import React from "react";
import { useEmotion } from "../../../context/EmotionContext";

export function MoodTip() {
  const { mood } = useEmotion();

  const tip =
    mood === "calm"
      ? "Enjoy this calm moment. Try a deep breath in and out."
      : mood === "focus"
      ? "Stay in the zone. Turn off one distraction right now."
      : mood === "motivation"
      ? "Channel your energy. Pick one tiny task and start."
      : "Not sure how you feel? That’s okay—just start typing below.";

  return <p className="mood-tip">{tip}</p>;
}
