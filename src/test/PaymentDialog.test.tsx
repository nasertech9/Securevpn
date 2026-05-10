import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentDialog } from '../app/components/PaymentDialog';
import type { Plan } from '../types/vpn';

const mockPlan: Plan = {
  id: 'pro',
  name: 'Pro',
  price: 9.99,
  duration: 'month',
  features: ['5 devices', 'Unlimited bandwidth'],
  maxDevices: 5,
  bandwidth: 'Unlimited',
};

describe('PaymentDialog', () => {
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <PaymentDialog isOpen={false} onClose={() => {}} plan={mockPlan} discount={0} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render payment form when isOpen is true', () => {
    render(<PaymentDialog isOpen={true} onClose={() => {}} plan={mockPlan} discount={0} />);
    expect(screen.getByText('Complete Your Purchase')).toBeInTheDocument();
    expect(screen.getByText(/Pro Plan/)).toBeInTheDocument();
  });

  it('should display all required form fields', () => {
    render(<PaymentDialog isOpen={true} onClose={() => {}} plan={mockPlan} discount={0} />);

    expect(screen.getByPlaceholderText(/1234 5678 9012 3456/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/MM\/YY/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/123/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Street address/)).toBeInTheDocument();
  });

  it('should apply discount to price', () => {
    render(<PaymentDialog isOpen={true} onClose={() => {}} plan={mockPlan} discount={20} />);
    expect(screen.getByText('$7.99')).toBeInTheDocument();
  });

  it('should format card number with spaces', () => {
    render(<PaymentDialog isOpen={true} onClose={() => {}} plan={mockPlan} discount={0} />);

    const cardInput = screen.getByPlaceholderText(/1234 5678 9012 3456/) as HTMLInputElement;
    fireEvent.change(cardInput, { target: { value: '1234567890123456' } });

    expect(cardInput.value).toBe('1234 5678 9012 3456');
  });

  it('should format expiration date', () => {
    render(<PaymentDialog isOpen={true} onClose={() => {}} plan={mockPlan} discount={0} />);

    const expInput = screen.getByPlaceholderText(/MM\/YY/) as HTMLInputElement;
    fireEvent.change(expInput, { target: { value: '1225' } });

    expect(expInput.value).toBe('12/25');
  });

  it('should call onClose when cancel is clicked', () => {
    const onClose = vi.fn();
    render(<PaymentDialog isOpen={true} onClose={onClose} plan={mockPlan} discount={0} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
});
