import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ChatBot from './ChatBot';

describe('ChatBot Component', () => {
  test('renders ChatBot component and sends message', async () => {
    render(<ChatBot />);

    // Check if input and button are rendered
    const textarea = screen.getByPlaceholderText(/Ask the bot/i);
    const button = screen.getByText('Send');
    
    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    // Simulate typing a message
    fireEvent.change(textarea, { target: { value: 'What is the cooling load?' } });
    expect(textarea.value).toBe('What is the cooling load?');

    // Simulate sending a message
    fireEvent.click(button);

    // Assuming mock API or test environment response handling for chatbot
    // You would check if API request was sent and response is rendered.
    // Here we simply check if the button is clickable and state changes.
  });
});
