import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Question from '../components/Question';

describe('Question', () => {
  const mockQuestion = {
    text: 'Wybierz odpowiedzi, które najlepiej opisują Twoje miejsce zamieszkania.',
    options: [
      { text: 'Dom', tags: [1] },
      { text: 'Mieszkanie wielopokojowe', tags: [2] },
      { text: 'Mieszkanie jednopokojowe', tags: [3] },
    ],
  };

  it('renders question text and options', async () => {
    render(
      <Question
        question={mockQuestion}
        selectedTags={[]}
        onOptionClick={() => {}}
      />
    );

    expect(await screen.findByText(mockQuestion.text)).toBeInTheDocument();

    for (const option of mockQuestion.options) {
      expect(await screen.findByText(option.text)).toBeInTheDocument();
    }
  });

  it('calls onOptionClick with correct tags when an option is clicked', async () => {
    const mockOnOptionClick = jest.fn();
    render(
      <Question
        question={mockQuestion}
        selectedTags={[]}
        onOptionClick={mockOnOptionClick}
      />
    );

    const option = await screen.findByText('Dom');
    await userEvent.click(option);

    expect(mockOnOptionClick).toHaveBeenCalledWith([1]);
  });

  it('sets aria-pressed correctly for selected options', async () => {
    render(
      <Question
        question={mockQuestion}
        selectedTags={[{ _id: 1, text: 'Dom' }]}
        onOptionClick={() => {}}
      />
    );

    const selectedOption = await screen.findByText('Dom');
    const unselectedOption = await screen.findByText(
      'Mieszkanie wielopokojowe'
    );
    const unselectedOption2 = await screen.findByText(
      'Mieszkanie jednopokojowe'
    );

    expect(selectedOption).toHaveAttribute('aria-pressed', 'true');
    expect(unselectedOption).toHaveAttribute('aria-pressed', 'false');
    expect(unselectedOption2).toHaveAttribute('aria-pressed', 'false');
  });
});
