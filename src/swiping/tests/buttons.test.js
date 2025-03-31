import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Buttons from '../components/buttons'; 

describe('Buttons Component', () => {
  const mockOnLike = jest.fn();
  const mockOnDislike = jest.fn();

  test('renders Buttons component with like and dislike buttons', () => {
    render(<Buttons onLike={mockOnLike} onDislike={mockOnDislike} />);

    expect(screen.getByTestId('like-button')).toBeInTheDocument();
    expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
  });

  test('calls onDislike handler when the dislike button is clicked', async () => {
    render(<Buttons onLike={mockOnLike} onDislike={mockOnDislike} />);
    
    const dislikeButton = screen.getByTestId('dislike-button');

    await userEvent.click(dislikeButton);
    expect(mockOnDislike).toHaveBeenCalledTimes(1);
  });

  test('calls onLike handler when the like button is clicked', async () => {
    render(<Buttons onLike={mockOnLike} onDislike={mockOnDislike} />);
    
    const likeButton = screen.getByTestId('like-button');

    await userEvent.click(likeButton);
    expect(mockOnLike).toHaveBeenCalledTimes(1);
  });
});