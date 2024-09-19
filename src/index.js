import readlineSync from 'readline-sync';
import colors from 'colors';
import { getChatbotResponse } from './services/openai-service.js';

async function main() {
  console.log(colors.bold.green('Welcome to Mechbot!'));
  console.log(colors.bold.green('Your AI assistant for mechanical engineering in construction.'));
  console.log(colors.bold.green('You can ask questions about fire protection, drainage, plumbing, pipe sizing, and HVAC.'));

  const chatHistory = [];

  while (true) {
    const userInput = readlineSync.question(colors.yellow('You: '));

    if (userInput.toLowerCase() === 'exit') {
      console.log(colors.green('Mechbot: Thank you for using Mechbot. Goodbye!'));
      break;
    }

    try {
      const response = await getChatbotResponse(userInput, chatHistory);
      console.log(colors.green('Mechbot: ') + response);

      chatHistory.push({ role: 'user', content: userInput });
      chatHistory.push({ role: 'assistant', content: response });
    } catch (error) {
      console.error(colors.red('An error occurred:'), error.message);
      console.log(colors.yellow('Mechbot: I apologize, but I encountered an issue. Please try again or check your internet connection.'));
    }
  }
}

main();
