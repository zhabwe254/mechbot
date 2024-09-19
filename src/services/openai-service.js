import openai from '../config/openai.js';
import { buildPrompt } from '../utils/prompt-builder.js';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function makeOpenAIRequest(messages, retryCount = 0) {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    if (error.response && error.response.status === 429 && retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Rate limited. Retrying in ${delay}ms...`);
      await sleep(delay);
      return makeOpenAIRequest(messages, retryCount + 1);
    }
    throw error;
  }
}

export async function getChatbotResponse(userInput, chatHistory) {
  const messages = buildPrompt(userInput, chatHistory);
  
  try {
    return await makeOpenAIRequest(messages);
  } catch (error) {
    console.error('Error calling OpenAI API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw new Error('Failed to get response from OpenAI. Please try again later.');
  }
}
