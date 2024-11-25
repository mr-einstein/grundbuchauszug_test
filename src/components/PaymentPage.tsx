import React, { useState } from 'react';
import { FileText, CreditCard, Building2, CheckCircle } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { createOrder, updateOrderStatus, type OrderData } from '../services/supabase';

// Initialize Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface LocationState {
  propertyAddress?: string;
  selectedDocuments: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  totalAmount: number;
  orderData: Omit<OrderData, 'status' | 'payment_method' | 'payment_id'>;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      fontFamily: '"Open Sans", sans-serif',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};

interface CheckoutFormProps {
  amount: number;
  onPaymentComplete: (paymentId: string) => Promise<void>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onPaymentComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || 'Ein Fehler ist aufgetreten');
        setProcessing(false);
        return;
      }

      await onPaymentComplete(paymentMethod.id);
      
    } catch (err) {
      setError('Ein Fehler ist aufgetreten');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-md bg-white space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Kartennummer
          </label>
          <CardElement options={CARD_ELEMENT_OPTIONS} className="p-3 border rounded-md" />
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md transition-colors ${
          processing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {processing ? 'Wird verarbeitet...' : `${amount.toFixed(2)}€ Jetzt bezahlen`}
      </button>
    </form>
  );
};

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDocuments, totalAmount, orderData } = location.state as LocationState;
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card' | 'bank'>('card');
  const [orderId, setOrderId] = useState<string | null>(null);

  const handlePayment = async (method: OrderData['payment_method'], paymentId?: string) => {
    try {
      // Create initial order
      const order = await createOrder({
        ...orderData,
        status: 'pending',
        payment_method: method,
        payment_id: paymentId,
      });

      setOrderId(order.id);

      // Handle different payment methods
      switch (method) {
        case 'card':
          if (paymentId) {
            await updateOrderStatus(order.id, 'processing', paymentId);
            // Here you would typically redirect to a success page
            // navigate('/payment-success');
          }
          break;

        case 'paypal':
          // Redirect to PayPal
          // window.location.href = paypalUrl;
          break;

        case 'bank':
          await updateOrderStatus(order.id, 'pending');
          // Redirect to bank transfer instructions
          // navigate('/bank-transfer', { state: { orderId: order.id } });
          break;
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Handle error appropriately
    }
  };

  const handlePayPalClick = async () => {
    await handlePayment('paypal');
  };

  const handleBankTransferClick = async () => {
    await handlePayment('bank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-yellow-500" />
            <span className="font-semibold text-gray-800">dein-grundbuch-online.de</span>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1590593162201-f67611a18b87?auto=format&fit=crop&q=80&w=100"
            alt="German Flag"
            className="h-8"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold">Gleich geschafft</h1>
          </div>

          {/* Service Details */}
          <div className="bg-gray-50 p-4 rounded-md mb-6 space-y-2">
            <div className="text-sm text-gray-600">Antragsservice für:</div>
            <div>{selectedDocuments.map(doc => doc.name).join(', ')}</div>
          </div>

          {/* Payment Options */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Wie möchten Sie bezahlen?</h2>

            {/* PayPal Option */}
            <label className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="payment" 
                className="text-yellow-500" 
                checked={paymentMethod === 'paypal'}
                onChange={() => setPaymentMethod('paypal')}
              />
              <img 
                src="https://www.paypalobjects.com/webstatic/de_DE/i/de-pp-logo-150px.png"
                alt="PayPal"
                className="h-10 object-contain"
              />
              <div>
                <div className="font-medium">PayPal</div>
                <div className="text-sm text-gray-600">Mit PayPal zahlen</div>
              </div>
            </label>

            {/* Credit Card Option */}
            <label className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="payment" 
                className="text-yellow-500"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <CreditCard className="h-10 w-10 text-gray-600" />
              <div>
                <div className="font-medium">Kredit-/Debitkarte</div>
                <div className="flex gap-2 mt-1">
                  <img src="https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png" alt="Visa" className="h-6" />
                  <img src="https://brand.mastercard.com/content/dam/mccom/brandcenter/thumbnails/mastercard_vrt_pos_92px_2x.png" alt="Mastercard" className="h-6" />
                  <img src="https://www.americanexpress.com/content/dam/amex/us/merchant/supplies-uplift/logo/AMEX_Blue_Box_RGB_REV_RGB.png" alt="Amex" className="h-6" />
                </div>
              </div>
            </label>

            {/* Bank Transfer Option */}
            <label className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="payment" 
                className="text-yellow-500"
                checked={paymentMethod === 'bank'}
                onChange={() => setPaymentMethod('bank')}
              />
              <img 
                src="https://overo.de/wp-content/uploads/2021/01/Vorauskasse-300x96-1.png"
                alt="Vorkasse"
                className="h-10 object-contain"
              />
              <div>
                <div className="font-medium">Vorkasse (Überweisung)</div>
              </div>
            </label>

            {/* Payment Form */}
            <div className="mt-6">
              {paymentMethod === 'card' && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    amount={totalAmount} 
                    onPaymentComplete={async (paymentId) => {
                      await handlePayment('card', paymentId);
                    }}
                  />
                </Elements>
              )}
              
              {paymentMethod === 'paypal' && (
                <button 
                  onClick={handlePayPalClick}
                  className="w-full bg-[#ffc439] hover:bg-[#f4bb38] text-[#253b80] font-bold py-3 rounded-md"
                >
                  Mit PayPal bezahlen
                </button>
              )}
              
              {paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Bankverbindung</h3>
                    <div className="space-y-1 text-sm">
                      <p>Empfänger: dein-grundbuch-online.de</p>
                      <p>IBAN: DE89 3704 0044 0532 0130 00</p>
                      <p>BIC: COBADEFFXXX</p>
                      <p>Verwendungszweck: Wird nach Bestellung angezeigt</p>
                    </div>
                  </div>
                  <button
                    onClick={handleBankTransferClick}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-md"
                  >
                    Bestellung abschließen
                  </button>
                </div>
              )}
            </div>

            {/* Total Amount */}
            <div className="text-right text-sm">
              <div>Die Servicepauschale beträgt <span className="font-bold">jetzt nur einmalig {totalAmount.toFixed(2)} €</span></div>
              <div className="text-gray-600">(inkl. MwSt. und zzgl. von den Behörden erhobener Gebühren)</div>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-between items-center pt-4 border-t">
              <img 
                src="https://www.d-trust.net/sites/default/files/2017-03/logo_dtrust.png"
                alt="Dienstleistung aus Deutschland"
                className="h-8"
              />
              <img 
                src="https://www.datenschutz-nord-gruppe.de/fileadmin/_processed_/6/3/csm_DSN_Logo_Zusatz_RGB_300dpi_01_40582e6d8e.jpg"
                alt="Datenschutz"
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8 space-x-4 text-sm text-gray-600">
          <Link to="#" className="hover:text-gray-900">AGB</Link>
          <Link to="#" className="hover:text-gray-900">Widerruf</Link>
          <Link to="#" className="hover:text-gray-900">Datenschutz</Link>
          <Link to="#" className="hover:text-gray-900">Impressum</Link>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;