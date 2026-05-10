import { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { mockApi } from '../../api/mockApi';
import { PaymentDialog } from './PaymentDialog';
import type { Plan, ReferralCode } from '../../types/vpn';

export function PlanSelector() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<Plan | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [appliedReferral, setAppliedReferral] = useState<ReferralCode | null>(null);
  const [referralError, setReferralError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mockApi.getPlans().then(setPlans);
  }, []);

  const handleApplyReferral = async () => {
    if (!referralCode.trim()) return;

    setLoading(true);
    setReferralError('');

    try {
      const result = await mockApi.validateReferralCode(referralCode);
      if (result) {
        setAppliedReferral(result);
      } else {
        setReferralError('Invalid or expired referral code');
      }
    } catch (error) {
      setReferralError('Failed to validate code');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (price: number) => {
    if (appliedReferral && price > 0) {
      return price * (1 - appliedReferral.discount / 100);
    }
    return price;
  };

  const handlePlanAction = (plan: Plan) => {
    if (plan.price === 0) {
      toast.success(`Welcome to ${plan.name} plan!`, {
        description: 'Your free account has been activated. You can start using SecureVPN now.',
      });
      setSelectedPlan(plan.id);
    } else {
      setPaymentPlan(plan);
      setShowPaymentDialog(true);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl mb-2 text-center">Choose Your Plan</h2>
        <p className="text-center text-gray-400 mb-8">Select the perfect plan for your needs</p>

        <div className="mb-8 max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="Enter referral code"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
              disabled={loading || !!appliedReferral}
            />
            <button
              onClick={handleApplyReferral}
              disabled={loading || !!appliedReferral}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
          {appliedReferral && (
            <p className="mt-2 text-green-400 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {appliedReferral.discount}% discount applied!
            </p>
          )}
          {referralError && (
            <p className="mt-2 text-red-400 text-sm">{referralError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const finalPrice = calculatePrice(plan.price);
            const hasDiscount = finalPrice !== plan.price;

            return (
              <div
                key={plan.id}
                className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 bg-blue-950/20'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                } ${plan.recommended ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-sm">
                    Recommended
                  </div>
                )}

                <h3 className="text-2xl mb-2">{plan.name}</h3>
                <div className="mb-4">
                  {hasDiscount && (
                    <div className="text-gray-400 line-through text-sm">
                      ${plan.price.toFixed(2)}
                    </div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl">${finalPrice.toFixed(2)}</span>
                    <span className="text-gray-400">/{plan.duration}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 rounded-lg transition-colors ${
                    selectedPlan === plan.id
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanAction(plan);
                  }}
                >
                  {plan.price === 0 ? 'Get Started' : 'Subscribe'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <PaymentDialog
        isOpen={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
        plan={paymentPlan}
        discount={appliedReferral?.discount || 0}
      />
    </div>
  );
}
