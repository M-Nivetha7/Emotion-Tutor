import React, { useState } from "react";
import type { FormEvent } from "react";
import { useEmotion } from "../context/EmotionContext";

type ChatMessage = {
  from: "user" | "bot";
  text: string;
};

type SentimentResult = {
  label?: string; // "POSITIVE" | "NEGATIVE" | "NEUTRAL" | etc.
  score?: number;
};

// ---------- text helpers (typo tolerant) ----------
function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fuzzyIncludes(text: string, word: string) {
  const tokens = text.split(" ");
  return tokens.some((t) => {
    if (Math.abs(t.length - word.length) > 2) return false;
    let mismatches = 0;
    const minLen = Math.min(t.length, word.length);
    for (let i = 0; i < minLen; i++) {
      if (t[i] !== word[i]) mismatches++;
      if (mismatches > 2) return false;
    }
    return true;
  });
}

// ---------- rule-based reply (uses mood + text) ----------
function reply(text: string, currentMood: string): string {
  const clean = normalize(text);

  const has = (...words: string[]) => words.some((w) => fuzzyIncludes(clean, w));

  const isQuestion = clean.endsWith("?");
  const talksAboutFeeling =
    clean.startsWith("i feel ") ||
    clean.startsWith("i am ") ||
    clean.startsWith("im ");

  // very heavy phrases only
  const isVeryNegative = has("suicidal", "kill", "ending");

  // detect negative / positive by tokens
  const wordHas = (...words: string[]) =>
    words.some((w) => fuzzyIncludes(clean, w));

  const isNegative = wordHas(
    "sad",
    "down",
    "tired",
    "stressed",
    "anxious",
    "anxiety",
    "overwhelmed",
    "lonely",
    "angry",
    "upset",
    "bad"
  );

  const isPositive = wordHas(
    "happy",
    "good",
    "great",
    "excited",
    "proud",
    "grateful",
    "thankful",
    "relieved"
  );

  // special case: very short greetings
  if (clean === "hi" || clean === "hello" || clean === "hey") {
    return "Hey there. Tell me a bit about how you’re feeling right now.";
  }

  if (isVeryNegative) {
    return (
      "That sounds really heavy. You deserve support from a real person—" +
      "if you can, consider talking to someone you trust or a professional right now."
    );
  }

  if (currentMood === "calm") {
    if (isPositive && !isNegative) {
      return "Beautiful. When things feel this calm, it can help to note what’s working so you can return to it later. What helped today?";
    }
    if (isNegative) {
      return "Even in a calm mood, tough thoughts can show up. Want to describe what’s sitting in the back of your mind?";
    }
    return "Let’s stay with this calm moment for a second. What’s one small thing around you that feels comforting right now?";
  }

  if (currentMood === "focus") {
    if (has("study", "exam", "project", "deadline", "work")) {
      return "You sound locked in on your work. Try breaking it into one tiny next step—what’s the next 10‑minute task you can do?";
    }
    if (isNegative) {
      return "Focus under stress is hard. What’s the main distraction or worry that’s pulling you away right now?";
    }
    return "Nice, you’re in focus mode. Tell me what you’re working on, like you’re explaining it to a friend.";
  }

  if (currentMood === "motivation") {
    if (has("goal", "goals", "plan", "dream", "idea")) {
      return "Love that energy. Let’s make it concrete—what’s one tiny step you can take toward that goal today?";
    }
    if (isNegative) {
      return "Motivation can wobble and that’s normal. What’s making it harder to act, even though you want to?";
    }
    return "Motivated is a great place to start. Name one thing you’ll do in the next 30 minutes, and I’ll treat it as your mini‑mission.";
  }

  if (talksAboutFeeling) {
    return "Thanks for putting words to how you feel. What do you think is the biggest thing influencing that feeling right now?";
  }

  if (isPositive && !isNegative) {
    return "That genuinely sounds like a bright spot. What made it feel so good for you?";
  }

  if (isNegative) {
    return "That sounds tough. If you’d like, describe what happened in a bit more detail—I’ll stay with you through it.";
  }

  if (isQuestion) {
    return "Good question. Before answering, tell me what you’re hoping will change for you if you figure this out.";
  }

  return "I’m here and listening. Tell me the story behind what you just wrote—what happened first, and what happened after?";
}

// ---------- ML API helper (Flask backend) ----------
async function analyzeSentiment(text: string): Promise<SentimentResult | null> {
  try {
    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("API error");
    return await res.json(); // { label, score }
  } catch (err) {
    console.error("analyzeSentiment error", err);
    return null;
  }
}

// currently we ignore the ML label for behavior; kept for future use
function replyWithModel(
  text: string,
  currentMood: string,
  _sentiment: SentimentResult | null
): string {
  return reply(text, currentMood);
}

// ---------- component ----------
export default function ChatBox() {
  const { mood } = useEmotion();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Hi, I’m your Emotion Tutor. How are you feeling right now?",
    },
  ]);
  const [input, setInput] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const sentiment = await analyzeSentiment(text); // not used yet, but ready
    const botText = replyWithModel(text, mood, sentiment);

    const botMsg: ChatMessage = { from: "bot", text: botText };
    setMessages((prev) => [...prev, botMsg]);
  }

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`chat-row ${m.from === "user" ? "user" : "bot"}`}
          >
            <div className="bubble">{m.text}</div>
          </div>
        ))}
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type how you feel..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
