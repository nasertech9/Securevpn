import { X } from 'lucide-react';
import { useState } from 'react';
import type { Plan } from '../../types/vpn';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  discount: number;
}

export function PaymentDialog({ isOpen, onClose, plan, discount }: PaymentDialogProps) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiration: '',
    cvv: '',
    firstName: '',
    lastName: '',
    country: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen || !plan) return null;

  const finalPrice = discount > 0 ? plan.price * (1 - discount / 100) : plan.price;

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiration = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Valid card number is required';
    }

    if (!formData.expiration || !/^\d{2}\/\d{2}$/.test(formData.expiration)) {
      newErrors.expiration = 'Valid expiration date (MM/YY) is required';
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV is required';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Billing address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      alert(`Payment processed successfully!\n\nPlan: ${plan.name}\nAmount: $${finalPrice.toFixed(2)}\n\nThank you for subscribing!`);
      onClose();
      setFormData({
        cardNumber: '',
        expiration: '',
        cvv: '',
        firstName: '',
        lastName: '',
        country: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <div>
            <h2 className="text-2xl">Complete Your Purchase</h2>
            <p className="text-gray-400 text-sm mt-1">
              {plan.name} Plan - ${finalPrice.toFixed(2)}/{plan.duration}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg mb-4">Payment Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">
                  Card Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleChange('cardNumber', formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:border-blue-500`}
                />
                {errors.cardNumber && (
                  <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">
                    Expiration <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.expiration}
                    onChange={(e) => handleChange('expiration', formatExpiration(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      errors.expiration ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-500`}
                  />
                  {errors.expiration && (
                    <p className="text-red-400 text-sm mt-1">{errors.expiration}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    CVV <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      errors.cvv ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-500`}
                  />
                  {errors.cvv && (
                    <p className="text-red-400 text-sm mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-4">Billing Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">
                    First name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      errors.firstName ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-500`}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    Last name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`w-full px-4 py-2 bg-gray-700 border ${
                      errors.lastName ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg focus:outline-none focus:border-blue-500`}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select a country</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="JP">Japan</option>
                  <option value="SG">Singapore</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">
                  Billing address line 1 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                  placeholder="Street address"
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    errors.addressLine1 ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:border-blue-500`}
                />
                {errors.addressLine1 && (
                  <p className="text-red-400 text-sm mt-1">{errors.addressLine1}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-2">Billing address line 2</label>
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleChange('addressLine2', e.target.value)}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-700 border ${
                    errors.city ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg focus:outline-none focus:border-blue-500`}
                />
                {errors.city && (
                  <p className="text-red-400 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
            <div className="text-lg">
              Total: <span className="text-2xl">${finalPrice.toFixed(2)}</span>
              <span className="text-gray-400">/{plan.duration}</span>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
