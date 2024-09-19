import { expect } from 'chai';
import { buildPrompt } from '../src/utils/prompt-builder.js';

describe('Prompt Builder', () => {
  it('should create a prompt with system message, chat history, and user input', () => {
    const userInput = 'How do I size a drainage pipe?';
    const chatHistory = [
      { role: 'user', content: 'What is HVAC?' },
      { role: 'assistant', content: 'HVAC stands for Heating, Ventilation, and Air Conditioning.' }
    ];

    const prompt = buildPrompt(userInput, chatHistory);

    expect(prompt).to.have.lengthOf(4);
    expect(prompt[0].role).to.equal('system');
    expect(prompt[1].role).to.equal('user');
    expect(prompt[1].content).to.equal('What is HVAC?');
    expect(prompt[2].role).to.equal('assistant');
    expect(prompt[3].role).to.equal('user');
    expect(prompt[3].content).to.equal('How do I size a drainage pipe?');
  });
});
