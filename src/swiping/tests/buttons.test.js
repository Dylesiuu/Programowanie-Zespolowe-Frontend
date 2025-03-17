import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Buttons from '../components/buttons'; 

describe('Buttons Component', () => {
  const mockOnLike = jest.fn();
  const mockOnDislike = jest.fn();

  test('renders Buttons component with like and dislike buttons', () => {
    render(<Buttons onLike={mockOnLike} onDislike={mockOnDislike} />);

    //Like and dislike buttons are rendered
    expect(screen.getByTestId('like-button')).toBeInTheDocument();
    expect(screen.getByTestId('dislike-button')).toBeInTheDocument();
  });

  test('calls onDislike handler when the dislike button is clicked', () => {
    render(<Buttons onLike={mockOnLike} onDislike={mockOnDislike} />);

    const dislikeButton = screen.getByTestId('dislike-button');

    //onDislike handler was called
    fireEvent.click(dislikeButton);
    expect(mockOnDislike).toHaveBeenCalledTimes(1);
  });

  test('calls onLike handler when the like button is clicked', () => {
    render(<Buttons onLike={mockOnLike} onDislike={mockOnDislike} />);

    const likeButton = screen.getByTestId('like-button');

    //onLike handler was called
    fireEvent.click(likeButton);
    expect(mockOnLike).toHaveBeenCalledTimes(1);
  });
});