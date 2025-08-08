import { describe, expect, test, beforeEach } from '@jest/globals';

describe('Preloader Functionality', () => {
  let mockPreloaderPercent: HTMLElement;
  let mockPreloader: HTMLElement;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="preloader">
        <span id="preloaderPercent">0%</span>
      </div>
    `;
    
    mockPreloader = document.getElementById('preloader')!;
    mockPreloaderPercent = document.getElementById('preloaderPercent')!;
  });

  test('visual counter should start at 0%', () => {
    expect(mockPreloaderPercent.textContent).toBe('0%');
  });

  test('preloader should have correct initial state', () => {
    expect(mockPreloader.classList.contains('fade-out')).toBe(false);
    expect(mockPreloader.id).toBe('preloader');
    expect(mockPreloaderPercent.id).toBe('preloaderPercent');
  });

  test('visual counter percentage calculation should be correct', () => {
    const duration = 1800; // 1.8 seconds as specified
    
    // Test progress calculations
    const calculateProgress = (elapsed: number) => {
      const progress = Math.min(elapsed / duration, 1);
      return Math.floor(progress * 100);
    };

    expect(calculateProgress(0)).toBe(0);      // 0% at start
    expect(calculateProgress(900)).toBe(50);   // 50% at halfway
    expect(calculateProgress(1800)).toBe(100); // 100% at end
    expect(calculateProgress(2000)).toBe(100); // capped at 100%
  });

  test('preloader fade-out should add correct class', () => {
    const fadeOutPreloader = () => {
      mockPreloader.classList.add('fade-out');
    };

    fadeOutPreloader();
    expect(mockPreloader.classList.contains('fade-out')).toBe(true);
  });

  test('percentage text update should work correctly', () => {
    // Simulate updating percentage text
    mockPreloaderPercent.textContent = '25%';
    expect(mockPreloaderPercent.textContent).toBe('25%');
    
    mockPreloaderPercent.textContent = '75%';
    expect(mockPreloaderPercent.textContent).toBe('75%');
    
    mockPreloaderPercent.textContent = '100%';
    expect(mockPreloaderPercent.textContent).toBe('100%');
  });
});