import React from "react";
import { EmotionProvider, useEmotion } from "./context/EmotionContext";
import Avatar from "./components/Avatar";
import ChatBox from "./components/ChatBox";
import "./App.css";
import { MainLayout } from "./layout/MainLayout";

function Controls() {
  const { setMood } = useEmotion();

  return (
    <div className="controls">
      <button onClick={() => setMood("calm")}>Calm</button>
      <button onClick={() => setMood("focus")}>Focus</button>
      <button onClick={() => setMood("motivation")}>Motivation</button>
      <button onClick={() => setMood("neutral")}>Neutral</button>
    </div>
  );
}

function AppInner() {
  const { mood } = useEmotion();

  const bgClass =
    mood === "calm"
      ? "bg-calm"
      : mood === "focus"
      ? "bg-focus"
      : mood === "motivation"
      ? "bg-motivation"
      : "bg-neutral";

  return (
    <div className={`root-bg ${bgClass}`}>
      <div className="app">
        <h1>Emotion Tutor</h1>

        <div className="hero-row">
          <Avatar />
          <div className="hero-right">
            <Controls />
          </div>
        </div>

        <ChatBox />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <EmotionProvider>
      <MainLayout>
        <AppInner />
      </MainLayout>
    </EmotionProvider>
  );
}

