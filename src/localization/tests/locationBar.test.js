import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationBar from '../components/locationBar';

describe('LocationBar Component', () => {
  const mockOnLocationChange = jest.fn();
  const mockOnRangeChange = jest.fn();

  test('renders LocationBar with default location and range', () => {
    render(
        <LocationBar
          defaultLocation="Warsaw"
          onLocationChange={mockOnLocationChange}
          onRangeChange={mockOnRangeChange}
        />
      );
  
      expect(screen.getByDisplayValue('Warsaw')).toBeInTheDocument();
  
      const rangeSelect = screen.getByRole('combobox');
      expect(rangeSelect.value).toBe('30000'); 
  });

  test('shows map when location input is clicked', async () => {
    render(
      <LocationBar
        defaultLocation="Warsaw"
        onLocationChange={mockOnLocationChange}
        onRangeChange={mockOnRangeChange}
      />
    );

    await act(async () => {
        fireEvent.click(screen.getByDisplayValue('Warsaw'));
      });

    expect(screen.getByRole('button', { name: /save location/i })).toBeInTheDocument();
  });

  test('calls onRangeChange when range is changed', () => {
    render(
        <LocationBar
          defaultLocation="Warsaw"
          onLocationChange={mockOnLocationChange}
          onRangeChange={mockOnRangeChange}
        />
      );
  
      const rangeSelect = screen.getByRole('combobox');
      fireEvent.change(rangeSelect, { target: { value: '50000' } });
  
      expect(mockOnRangeChange).toHaveBeenCalledWith('50000');
  });
});