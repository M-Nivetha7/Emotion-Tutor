import React from "react";
import { useEmotion } from "../context/EmotionContext";
import "./Avatar.css";

export default function Avatar() {
  const { mood } = useEmotion();

  const faceClass =
    (mood === "calm"
      ? "face calm"
      : mood === "focus"
      ? "face focus"
      : mood === "motivation"
      ? "face motivation"
      : "face neutral") + " pop";

  const mouth =
    mood === "calm"
      ? "mouth smile"
      : mood === "motivation"
      ? "mouth big-smile"
      : mood === "focus"
      ? "mouth flat"
      : "mouth neutral";

  const brows =
    mood === "focus"
      ? "brows down"
      : mood === "motivation"
      ? "brows up"
      : "brows neutral";

  return (
    <div className={faceClass}>
      <div className="eye left" />
      <div className="eye right" />
      <div className={brows} />
      <div className={mouth} />
    </div>
  );
}
