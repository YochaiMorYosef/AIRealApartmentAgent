function buildConversation(messages) {
  return messages.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: msg.text
      }
    ]
  }));
}

module.exports = buildConversation;