// src/__tests__/NumberOfEvents.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents.jsx';

describe('<NumberOfEvents /> component', () => {
    test('renders an input with role "spinbutton"', () => {
        render(<NumberOfEvents />);
        const inputElement = screen.getByRole('spinbutton');
        expect(inputElement).toBeInTheDocument();
    });

    test('default value of the input is 32', () => {
        render(<NumberOfEvents />);
        const inputElement = screen.getByRole('spinbutton');
        expect(inputElement.value).toBe('32');
    });

    test('value changes when user types', async () => {
        const setCurrentNOE = jest.fn();
        const user = userEvent.setup();
        render(<NumberOfEvents setCurrentNOE={setCurrentNOE} />);
        await user.type(inputElement, '{backspace}{backspace}10');
        expect(inputElement.value).toBe('10');
        expect(setCurrentNOE).toHaveBeenCalledWith(10);
    });