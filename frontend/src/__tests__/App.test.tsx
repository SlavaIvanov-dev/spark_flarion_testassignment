// frontend/src/__tests__/App.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import App from '../App';

// Mock the JobDashboard component
jest.mock('../components/JobDashboard', () => ({
    JobDashboard: () => <div data-testid="mock-job-dashboard">Mock Dashboard</div>,
}));

describe('App Component', () => {
    // Helper function to wrap render in act
    const renderApp = async () => {
        await act(async () => {
            render(<App />);
        });
    };

    it('renders the app with initial job ID and button', async () => {
        await renderApp();
        expect(screen.getByText('Spark Job Dashboard')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Job ID (e.g., job_001 to job_005)')).toHaveValue('job_001');
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
        expect(screen.getByTestId('mock-job-dashboard')).toBeInTheDocument();
    });

    it('updates job ID input when typing', async () => {
        await renderApp();
        const input = screen.getByPlaceholderText('Enter Job ID (e.g., job_001 to job_005)');
        fireEvent.change(input, { target: { value: 'job_002' } });
        expect(input).toHaveValue('job_002');
    });

    it('updates JobDashboard with new job ID on submit', async () => {
        await renderApp();
        const input = screen.getByPlaceholderText('Enter Job ID (e.g., job_001 to job_005)');
        const button = screen.getByRole('button', { name: /submit/i });
        fireEvent.change(input, { target: { value: 'job_003' } });
        await act(async () => {
            fireEvent.click(button);
        });
        await waitFor(() => {
            expect(screen.getByTestId('mock-job-dashboard')).toBeInTheDocument();
        });
    });

    it('submits empty job ID and renders JobDashboard', async () => {
        await renderApp();
        const input = screen.getByPlaceholderText('Enter Job ID (e.g., job_001 to job_005)');
        const button = screen.getByRole('button', { name: /submit/i });
        fireEvent.change(input, { target: { value: '' } });
        await act(async () => {
            fireEvent.click(button);
        });
        await waitFor(() => {
            expect(screen.getByTestId('mock-job-dashboard')).toBeInTheDocument();
        });
    });

    it('passes invalid job ID to JobDashboard on submit', async () => {
        await renderApp();
        const input = screen.getByPlaceholderText('Enter Job ID (e.g., job_001 to job_005)');
        const button = screen.getByRole('button', { name: /submit/i });
        fireEvent.change(input, { target: { value: 'invalid_job' } });
        await act(async () => {
            fireEvent.click(button);
        });
        await waitFor(() => {
            expect(screen.getByTestId('mock-job-dashboard')).toBeInTheDocument();
        });
    });
});