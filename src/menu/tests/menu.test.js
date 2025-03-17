import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Menu from '../components/menu';
import Link from 'next/link'; 

//Menu component isnt done yet so this test will be updated later

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>; // Mock Link as a simple anchor tag
  };
});

describe('Menu Component', () => {
  test('renders the menu on smaller screens', () => {
    global.innerWidth = 500; 
    global.dispatchEvent(new Event('resize')); // Trigger resize event

    render(<Menu />);

    //Menu button is rendered on smaller screens
    expect(screen.getByRole('button', { name: '☰' })).toBeInTheDocument();

    //Navigation links are not visible by default on smaller screens
    const menuContainer = screen.getByRole('navigation').parentElement;
    expect(menuContainer).not.toHaveClass('open'); 

    //Click the menu button to open the menu
    fireEvent.click(screen.getByRole('button', { name: '☰' }));
    expect(menuContainer).toHaveClass('open');

    // Click the menu button again to close the menu
    fireEvent.click(screen.getByRole('button', { name: '☰' }));
    expect(menuContainer).not.toHaveClass('open');
  });

  test('renders the menu on larger screens', () => {
    global.innerWidth = 1200; 
    global.dispatchEvent(new Event('resize')); 

    render(<Menu />);

    //Menu button is not rendered on larger screens
    expect(screen.queryByRole('button', { name: '☰' })).not.toBeInTheDocument();

    //Navigation links are visible by default on larger screens
    const menuContainer = screen.getByRole('navigation').parentElement;
    expect(menuContainer).toHaveClass('open');
  });

  test('navigation links have the correct href attributes', () => {
    render(<Menu />);

    //Check href attributes of the links
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/homePage');
    expect(screen.getByRole('link', { name: /swipe/i })).toHaveAttribute('href', '/swipePage');
  });
});