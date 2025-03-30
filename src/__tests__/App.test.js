// src/__tests__/App.test.js

import { render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('<App /> component', () => {
    test('renders list of events', () => {
        const AppDOM = render(<App />).container.firstChild;
        expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
        });
    
    });
