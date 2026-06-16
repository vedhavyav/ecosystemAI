import { useEffect, RefObject } from 'react';

/**
 * Custom hook to trap focus within a modal element.
 * Restricts the Tab and Shift+Tab keys to only cycle through focusable elements inside the ref container.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const container = ref.current;
    
    // Select all potentially focusable elements
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(',');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelectors);
      const elements = Array.from(focusableElements).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
      
      if (elements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: Move to last element if focused on first
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: Move to first element if focused on last
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Try to auto-focus the first element when activated
    const initialFocusable = container.querySelectorAll<HTMLElement>(focusableSelectors);
    if (initialFocusable.length > 0) {
      initialFocusable[0].focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, isActive]);
}
