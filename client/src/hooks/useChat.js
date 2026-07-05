import { useState } from "react";
import { normalizeApartment } from "../utils/normalizeApartment";

export function useChat({ onApartmentsUpdate } = {}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "שלום 👋\nאיזו דירה אתה מחפש?"
    }
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input
    };

    // יוצרים את כל השיחה המעודכנת
    const conversation = [
      ...messages,
      userMessage
    ];

    // מציגים את ההודעה של המשתמש מיד
    setMessages(conversation);
    setSending(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: conversation
      })
    });

    const data = await response.json();

    if (data.apartments) {
      onApartmentsUpdate?.(
        data.apartments.map(normalizeApartment)
      );
    }

    // מוסיפים את תשובת הסוכן
    setMessages([
      ...conversation,
      {
        role: "assistant",
        text: data.reply
      }
    ]);

    setInput("");
    setSending(false);
  }

  return { messages, input, setInput, sending, sendMessage };
}
