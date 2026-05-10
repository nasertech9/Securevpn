import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignInDialog } from '../app/components/SignInDialog';
import { SignUpDialog } from '../app/components/SignUpDialog';

describe('SignInDialog', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSignIn: vi.fn(),
    onSwitchToSignUp: vi.fn(),
  };

  it('should render sign in form when open', () => {
    render(<SignInDialog {...mockProps} />);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    render(<SignInDialog {...mockProps} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const submitButton = screen.getByText('Sign In');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    render(<SignInDialog {...mockProps} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign In');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should call onSignIn with valid credentials', async () => {
    render(<SignInDialog {...mockProps} />);

    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitButton = screen.getByText('Sign In');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSignIn).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('should switch to sign up', () => {
    render(<SignInDialog {...mockProps} />);

    const signUpLink = screen.getByText('Sign Up');
    fireEvent.click(signUpLink);

    expect(mockProps.onClose).toHaveBeenCalled();
    expect(mockProps.onSwitchToSignUp).toHaveBeenCalled();
  });
});

describe('SignUpDialog', () => {
  const mockProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSignUp: vi.fn(),
    onSwitchToSignIn: vi.fn(),
  };

  it('should render sign up form when open', () => {
    render(<SignUpDialog {...mockProps} />);
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('should validate all required fields', async () => {
    render(<SignUpDialog {...mockProps} />);

    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('should validate password strength', async () => {
    render(<SignUpDialog {...mockProps} />);

    const passwordInput = screen.getAllByPlaceholderText('••••••••')[0];
    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('should validate password match', async () => {
    render(<SignUpDialog {...mockProps} />);

    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    fireEvent.change(passwordInputs[0], { target: { value: 'Password1' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'Password2' } });

    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('should require terms acceptance', async () => {
    render(<SignUpDialog {...mockProps} />);

    const firstNameInput = screen.getByPlaceholderText('John');
    const lastNameInput = screen.getByPlaceholderText('Doe');
    const emailInput = screen.getByPlaceholderText('your@email.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInputs[0], { target: { value: 'Password123' } });
    fireEvent.change(passwordInputs[1], { target: { value: 'Password123' } });

    const submitButton = screen.getByText('Create Account');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
    });
  });

  it('should switch to sign in', () => {
    render(<SignUpDialog {...mockProps} />);

    const signInLink = screen.getByText('Sign In');
    fireEvent.click(signInLink);

    expect(mockProps.onClose).toHaveBeenCalled();
    expect(mockProps.onSwitchToSignIn).toHaveBeenCalled();
  });
});
