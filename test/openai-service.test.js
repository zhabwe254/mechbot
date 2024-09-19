import { expect } from 'chai';
import sinon from 'sinon';
import { getChatbotResponse } from '../src/services/openai-service.js';
import openai from '../src/config/openai.js';

describe('OpenAI Service', () => {
  let createChatCompletionStub;

  beforeEach(() => {
    createChatCompletionStub = sinon.stub(openai, 'createChatCompletion');
  });

  afterEach(() => {
    createChatCompletionStub.restore();
  });

  it('should return a response from OpenAI', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: 'This is a mock response from the OpenAI API.',
            },
          },
        ],
      },
    };

    createChatCompletionStub.resolves(mockResponse);

    const userInput = 'How do I size a drainage pipe?';
    const chatHistory = [];

    const response = await getChatbotResponse(userInput, chatHistory);

    expect(response).to.equal('This is a mock response from the OpenAI API.');
    expect(createChatCompletionStub.calledOnce).to.be.true;

    const callArgs = createChatCompletionStub.getCall(0).args[0];
    expect(callArgs.model).to.equal('gpt-3.5-turbo');
    expect(callArgs.messages).to.have.lengthOf(2); // System prompt + user input
    expect(callArgs.messages[1].content).to.equal(userInput);
  });

  it('should include chat history in the API call', async () => {
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content: 'Mock response with chat history.',
            },
          },
        ],
      },
    };

    createChatCompletionStub.resolves(mockResponse);

    const userInput = 'What about HVAC?';
    const chatHistory = [
      { role: 'user', content: 'How do I size a drainage pipe?' },
      { role: 'assistant', content: 'To size a drainage pipe, you need to consider...' },
    ];

    await getChatbotResponse(userInput, chatHistory);

    const callArgs = createChatCompletionStub.getCall(0).args[0];
    expect(callArgs.messages).to.have.lengthOf(4); // System prompt + chat history + user input
    expect(callArgs.messages[1].content).to.equal('How do I size a drainage pipe?');
    expect(callArgs.messages[2].content).to.include('To size a drainage pipe');
    expect(callArgs.messages[3].content).to.equal('What about HVAC?');
  });

  it('should throw an error when the API call fails', async () => {
    const errorMessage = 'API request failed';
    createChatCompletionStub.rejects(new Error(errorMessage));

    const userInput = 'How do I size a drainage pipe?';
    const chatHistory = [];

    try {
      await getChatbotResponse(userInput, chatHistory);
      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect(error.message).to.equal(errorMessage);
    }

    expect(createChatCompletionStub.calledOnce).to.be.true;
  });
});
