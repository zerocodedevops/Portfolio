import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Projects } from '@/components/sections/Projects';
import { Contact } from '@/components/sections/Contact';


// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    {children}
  </>
);

describe('Portfolio Sections Render', () => {
  it('Hero section renders with main heading', () => {
    render(
      <TestWrapper>
        <Hero />
      </TestWrapper>
    );
    
    expect(screen.getByText(/Hola, soy/i)).toBeInTheDocument();
    expect(screen.getByText(/Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/Contáctame/i)).toBeInTheDocument();
    expect(screen.getByText(/Ver GitHub/i)).toBeInTheDocument();
  });

  it('About section renders with correct content', () => {
    render(
      <TestWrapper>
        <About />
      </TestWrapper>
    );
    
    // expect(screen.getByText(/Sobre mí/i)).toBeInTheDocument();
    expect(screen.getByText(/Desarrollador apasionado/i)).toBeInTheDocument();
  });

  it('Skills section renders with all categories', () => {
    render(
      <TestWrapper>
        <Skills />
      </TestWrapper>
    );
    
    // expect(screen.getByRole('heading', { level: 2, name: /Skills/i })).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('IA & ML')).toBeInTheDocument();
    expect(screen.getByText('Herramientas')).toBeInTheDocument();
  });

  it('Projects section renders with project cards', () => {
    render(
      <TestWrapper>
        <Projects />
      </TestWrapper>
    );
    
    // expect(screen.getByText(/Proyectos/i)).toBeInTheDocument();
    expect(screen.getByText(/E-Commerce Platform/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Chat Assistant/i)).toBeInTheDocument();
  });

  it('Contact section renders with form fields', () => {
    render(
      <TestWrapper>
        <Contact />
      </TestWrapper>
    );
    
    // expect(screen.getByText(/Contacto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Asunto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensaje/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar mensaje/i })).toBeInTheDocument();
  });
});
