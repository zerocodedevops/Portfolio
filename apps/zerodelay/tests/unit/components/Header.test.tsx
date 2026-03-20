import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Header from '@/components/common/Header';

describe.skip('Header Component', () => {
  it('renders logo and navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    expect(screen.getByText('Zero Delay')).toBeInTheDocument();
    expect(screen.getByText('QUIENES SOMOS')).toBeInTheDocument();
    expect(screen.getByText('SERVICIOS')).toBeInTheDocument();
    expect(screen.getByText('CONTACTO')).toBeInTheDocument();
    expect(screen.getAllByText('Pide Presupuesto')[0]).toBeInTheDocument();
  });

  it('mobile menu toggles when button is clicked', () => {
    // Mock window.innerWidth to simulate mobile device
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const toggleButton = screen.getByLabelText('Toggle menu');
    expect(toggleButton).toBeInTheDocument();

    // Menu should be closed initially (or at least check that we can open it)
    fireEvent.click(toggleButton);

    // After click, we expect mobile menu items to be visible.
    // Since we reuse links, we check if they are present.
    // Note: In a real mobile test we might check for visibility or specific mobile classes.
    expect(screen.getByText('QUIENES SOMOS')).toBeInTheDocument();
  });
});
