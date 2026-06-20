/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Calculator3D from '../Calculator3D';

jest.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    motion: {
      div: ({
        initial,
        animate,
        exit,
        transition,
        whileInView,
        viewport,
        style,
        children,
        ...rest
      }: any) => React.createElement('div', rest, children),
      span: ({
        initial,
        animate,
        exit,
        transition,
        whileInView,
        viewport,
        style,
        children,
        ...rest
      }: any) => React.createElement('span', rest, children),
      circle: ({
        initial,
        animate,
        exit,
        transition,
        whileInView,
        viewport,
        style,
        children,
        ...rest
      }: any) => React.createElement('circle', rest, children),
    },
    AnimatePresence: ({ children }: any) => children,
    useReducedMotion: () => true,
    useScroll: () => ({ scrollYProgress: 0 }),
    useTransform: () => 0,
  };
});

const mockInputs = {
  kilometersDrivenPerWeek: 100,
  vehicleType: 'petrol',
  flightHoursPerYear: 10,
  indianZone: 'national-average',
  electricityKWhPerMonth: 200,
  lpgCylindersPerYear: 6,
  naturalGasThermsPerMonth: 0,
  dietType: 'average',
  recyclingLevel: 'average',
};

describe('Calculator3D Component', () => {
  it('renders transport tab initially', () => {
    const setInputs = jest.fn();
    render(<Calculator3D inputs={mockInputs} setInputs={setInputs} />);

    expect(screen.getByText('Lifestyle Data')).toBeTruthy();
    expect(screen.getByText('Kilometers Driven Per Week')).toBeTruthy();
  });

  it('calls setInputs when transport inputs change', () => {
    const setInputs = jest.fn();
    render(<Calculator3D inputs={mockInputs} setInputs={setInputs} />);

    const kmInput = screen.getByDisplayValue('100');
    fireEvent.change(kmInput, { target: { value: '150' } });

    expect(setInputs).toHaveBeenCalledWith({
      ...mockInputs,
      kilometersDrivenPerWeek: 150,
    });
  });

  it('switches to energy tab and updates inputs', () => {
    const setInputs = jest.fn();
    render(<Calculator3D inputs={mockInputs} setInputs={setInputs} />);

    // Switch tab
    const energyTab = screen.getByText('Energy');
    fireEvent.click(energyTab);

    expect(screen.getByText('Electricity')).toBeTruthy();

    const electricityInput = screen.getByDisplayValue('200');
    fireEvent.change(electricityInput, { target: { value: '250' } });

    expect(setInputs).toHaveBeenCalledWith({
      ...mockInputs,
      electricityKWhPerMonth: 250,
    });
  });
});
