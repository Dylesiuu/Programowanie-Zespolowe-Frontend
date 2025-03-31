import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Menu from '../components/menu';
import Link from 'next/link'; 

//Menu component isnt done yet so this test will be updated later

jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>; // Mock Link as a simple anchor tag
  };
});

describe('Menu Component', () => {
  test('renders the menu on smaller screens', async () => {
    global.innerWidth = 500; 
    global.dispatchEvent(new Event('resize')); 

    render(<Menu />);

    expect(screen.getByRole('button', { name: '☰' })).toBeInTheDocument();

    const menuContainer = screen.getByRole('navigation').parentElement;
    expect(menuContainer).not.toHaveClass('open'); 

    userEvent.click(screen.getByRole('button', { name: '☰' }));

    await waitFor(() => {
      expect(menuContainer).toHaveClass('open');
    });

    userEvent.click(screen.getByRole('button', { name: '☰' }));

    await waitFor(() => {
      expect(menuContainer).not.toHaveClass('open');
    });
  });

  test('renders the menu on larger screens', () => {
    global.innerWidth = 1200; 
    global.dispatchEvent(new Event('resize')); 

    render(<Menu />);

    expect(screen.queryByRole('button', { name: '☰' })).not.toBeInTheDocument();

    const menuContainer = screen.getByRole('navigation').parentElement;
    expect(menuContainer).toBeVisible();
  });

  test('navigation links have the correct href attributes', () => {
    render(<Menu />);

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/homePage');
    expect(screen.getByRole('link', { name: /swipe/i })).toHaveAttribute('href', '/swipePage');
  });
});