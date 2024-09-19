const SYSTEM_PROMPT = `You are Mechbot, an AI assistant for mechanical engineers in the construction industry. You specialize in fire protection, drainage, plumbing, pipe sizing, and HVAC. Provide accurate and helpful information on these topics.`;

export function buildPrompt(userInput, chatHistory) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...chatHistory,
    { role: 'user', content: userInput }
  ];
  return messages;
}
