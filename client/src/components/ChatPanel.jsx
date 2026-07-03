import { useEffect, useRef } from "react";

function TypingIndicator() {
  return (
    <div className="chat-bubble assistant typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

function ChatMessage({ message }) {
  const isAssistant = message.role === "assistant";
  return (
    <div className={`chat-row ${isAssistant ? "assistant" : "user"}`}>
      {isAssistant && <div className="chat-avatar">🤖</div>}
      <div className={`chat-bubble ${isAssistant ? "assistant" : "user"}`}>
        {message.text}
      </div>
    </div>
  );
}

function ChatPanel({ messages, input, sending, onInputChange, onSend }) {
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !sending) onSend();
    }
  }

  return (
    <aside className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-avatar">🤖</div>
        <div>
          <h2>סוכן דירות AI</h2>
          <span className="chat-subtitle">כאן כדי לעזור לך למצוא דירה</span>
        </div>
      </div>

      <div className="messages">
        {messages.map((m, i) => (
          <ChatMessage key={i} message={m} />
        ))}
        {sending && (
          <div className="chat-row assistant">
            <div className="chat-avatar">🤖</div>
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="כתוב הודעה..."
          rows={1}
          onKeyDown={handleKeyDown}
        />
        <button
          className="send-button"
          onClick={onSend}
          disabled={sending || !input.trim()}
          aria-label="שלח"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M4 12l16-8-6 8 6 8-16-8z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}

export default ChatPanel;
