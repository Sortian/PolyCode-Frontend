const publicUrl = process.env.PUBLIC_URL || "";

export const ASSISTANT_CONFIG = {
  name: "PolyMentor",
  shortName: "PM",
  tagline: "Your AI programming mentor",
  welcomeMessage:
    "Welcome to **PolyMentor**. I can explain PolyCode, guide your learning path, and help you understand PolyGuard security — ask me anything.",
  storageKey: "polycode_assistant_session",
  avatarSrc: `${publicUrl}/images/assistant.png`,
  inputPlaceholder: "Type your question here…",
  poweredByLabel: "PolyCode Ecosystem · AI Assistant",
  quickPrompts: [
    "What is PolyCode?",
    "How does PolyMentor work?",
    "Tell me about PolyGuard",
    "How do I get started?",
  ],
};
