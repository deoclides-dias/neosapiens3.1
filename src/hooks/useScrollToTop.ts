// ============================================================================
// HOOK UNIVERSAL: useScrollToTop
// ============================================================================
// Arquivo: src/hooks/useScrollToTop.ts
// ============================================================================

import { useEffect, useState } from 'react';

interface UseScrollToTopOptions {
  behavior?: 'smooth' | 'auto';
  delay?: number;
  offset?: number;
  enabled?: boolean;
}

/**
 * Hook universal para scroll automático para o topo
 * @param trigger - Qualquer valor que quando mudar, ativa o scroll
 * @param options - Opções de configuração do scroll
 */
export const useScrollToTop = (
  trigger: any, 
  options: UseScrollToTopOptions = {}
) => {
  const { 
    behavior = 'smooth', 
    delay = 100, 
    offset = 0,
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled) return;

    const scrollToTop = () => {
      window.scrollTo({ 
        top: offset, 
        behavior,
        left: 0
      });
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToTop, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToTop();
    }
  }, [trigger, behavior, delay, offset, enabled]);
};

// ============================================================================
// HOOK AVANÇADO: useScrollToElement
// ============================================================================

interface UseScrollToElementOptions extends UseScrollToTopOptions {
  elementId?: string;
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
}

/**
 * Hook para scroll para um elemento específico
 * @param trigger - Valor que quando mudar, ativa o scroll
 * @param options - Opções incluindo ID do elemento
 */
export const useScrollToElement = (
  trigger: any,
  options: UseScrollToElementOptions = {}
) => {
  const {
    elementId,
    block = 'start',
    inline = 'nearest',
    behavior = 'smooth',
    delay = 100,
    enabled = true
  } = options;

  useEffect(() => {
    if (!enabled || !elementId) return;

    const scrollToElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior,
          block,
          inline
        });
      }
    };

    if (delay > 0) {
      const timeoutId = setTimeout(scrollToElement, delay);
      return () => clearTimeout(timeoutId);
    } else {
      scrollToElement();
    }
  }, [trigger, elementId, block, inline, behavior, delay, enabled]);
};

// ============================================================================
// HOOK: useScrollPosition
// ============================================================================

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Hook para monitorar posição do scroll
 */
export const useScrollPosition = (): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0
  });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.pageXOffset,
        y: window.pageYOffset
      });
    };

    window.addEventListener('scroll', updatePosition);
    updatePosition(); // Initial position

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

// ============================================================================
// HOOK: useScrollDirection
// ============================================================================

type ScrollDirection = 'up' | 'down' | null;

/**
 * Hook para detectar direção do scroll
 */
export const useScrollDirection = (): ScrollDirection => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDirection(direction);
      }
      
      setLastScrollY(scrollY > 0 ? scrollY : 0);
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
};

// ============================================================================
// HOOK: useScrollToTopOnMount
// ============================================================================

/**
 * Hook simples para scroll automático ao montar componente
 */
export const useScrollToTopOnMount = (enabled: boolean = true) => {
  useScrollToTop(true, { enabled });
};

// ============================================================================
// INSTRUÇÕES DE USO
// ============================================================================

/*
EXEMPLOS DE USO:

1. SCROLL BÁSICO AO CARREGAR:
   useScrollToTop(true);

2. SCROLL QUANDO STEP MUDA:
   const [currentStep, setCurrentStep] = useState(1);
   useScrollToTop(currentStep);

3. SCROLL COM OPÇÕES CUSTOMIZADAS:
   useScrollToTop(trigger, {
     behavior: 'smooth',
     delay: 200,
     offset: 100
   });

4. SCROLL PARA ELEMENTO ESPECÍFICO:
   useScrollToElement(trigger, {
     elementId: 'form-header',
     block: 'center'
   });

5. MONITORAR SCROLL:
   const { y } = useScrollPosition();
   const direction = useScrollDirection();

IMPLEMENTAÇÃO NO PROJETO:

1. Salve este arquivo em: src/hooks/useScrollToTop.ts

2. Nos componentes Step, importe:
   import { useScrollToTop } from '@/hooks/useScrollToTop';

3. Use no início do componente:
   useScrollToTop(true); // Scroll ao carregar
   useScrollToTop(currentStep); // Scroll quando step muda

4. Para o PsychologicalForm principal:
   import { useScrollToTop } from '@/hooks/useScrollToTop';
   
   const PsychologicalForm = () => {
     const { formState } = usePsychologicalForm();
     
     // Scroll quando step muda
     useScrollToTop(formState.currentStep);
     
     // resto do código...
   };

BENEFÍCIOS:
✅ Experiência mais fluida
✅ Usuário sempre vê o início do formulário
✅ Navegação intuitiva entre steps
✅ Reutilizável em qualquer componente
✅ Configurável e flexível
✅ Performance otimizada

NOTA: Para componentes visuais como SmoothTransition,
crie arquivos .tsx separados para evitar conflitos JSX.
*/