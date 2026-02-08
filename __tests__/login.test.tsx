import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '@/app/login/page';

// Mock useRouter
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            refresh: jest.fn(),
        };
    },
}));

describe('LoginPage', () => {
    it('renders login form', () => {
        render(<LoginPage />);

        // Check for inputs
        const emailInput = screen.getByLabelText(/Email Address/i);
        const passwordInput = screen.getByLabelText(/Password/i);

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();

        // Check for submit button
        expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    });

    it('updates input values', () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement;

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
    });
});
