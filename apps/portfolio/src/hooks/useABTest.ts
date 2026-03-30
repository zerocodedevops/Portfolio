import { useState, useEffect } from 'react';

export function useABTest(testName: string) {
  // Por defecto cargamos la A para evitar parpadeos
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    // Miramos si el usuario ya visitó la web y tiene asignada una versión
    const stored = localStorage.getItem(`ab_test_${testName}`);
    if (stored === 'A' || stored === 'B') {
      setVariant(stored);
    } else {
      // Si es nuevo, sorteamos al 50% y lo guardamos
      const newVariant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem(`ab_test_${testName}`, newVariant);
      setVariant(newVariant);
      
      // Console.log para pre-visualizar el tracking (puedes reemplazarlo por Google Analytics, PostHog, etc.)
      console.log(`[AB Test] Nueva asignación generada: Test "${testName}" -> Variante "${newVariant}"`);
    }
  }, [testName]);

  return variant;
}
