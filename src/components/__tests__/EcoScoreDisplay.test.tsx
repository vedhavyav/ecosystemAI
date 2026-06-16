import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EcoScoreDisplay from '../EcoScoreDisplay';

jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    motion: {
      div: ({ children, ...rest }: Record<string, unknown>) => React.createElement('div', rest, children),
      span: ({ children, ...rest }: Record<string, unknown>) => React.createElement('span', rest, children),
      circle: ({ children, ...rest }: Record<string, unknown>) => React.createElement('circle', rest, children),
    },
    useReducedMotion: () => true,
  };
});

const mockResult = {
  ecoScore: 75,
  totalCO2eTons: 10.5,
  level: 'Eco-Warrior',
};

const mockRecommendations = [
  {
    title: 'Switch to LED',
    description: 'Use LED bulbs to save energy.',
    impactScore: 8,
    difficulty: 'Easy' as const,
  },
];

describe('EcoScoreDisplay Component', () => {
  it('renders the eco score and level correctly', () => {
    render(<EcoScoreDisplay result={mockResult} recommendations={mockRecommendations} />);

    expect(screen.getByText('Your Eco Score')).toBeTruthy();
    expect(screen.getByText('75')).toBeTruthy();
    expect(screen.getByText('Eco-Warrior')).toBeTruthy();
    expect(screen.getByText('10.50')).toBeTruthy();
  });

  it('renders timeline when recommendations are provided', () => {
    render(<EcoScoreDisplay result={mockResult} recommendations={mockRecommendations} />);

    expect(screen.getByText('Sustainable Journey')).toBeTruthy();
  });

  it('hides score section when showScore is false', () => {
    render(
      <EcoScoreDisplay
        result={mockResult}
        recommendations={mockRecommendations}
        showScore={false}
      />
    );

    expect(screen.queryByText('Your Eco Score')).toBeNull();
  });

  it('hides timeline section when showTimeline is false', () => {
    render(
      <EcoScoreDisplay
        result={mockResult}
        recommendations={mockRecommendations}
        showTimeline={false}
      />
    );

    expect(screen.queryByText('Sustainable Journey')).toBeNull();
  });
});
