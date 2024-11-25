import { createClient } from '@supabase/supabase-js';

// Provide default values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface OrderData {
  // Customer Information
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  company_name?: string;

  // Property Information
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  sheet_number?: string;
  field_parcel_number?: string;
  district?: string;

  // Document Selection
  selected_documents: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  certified_grundbuchauszug: boolean;
  owner_proof_liegenschaftskarte: boolean;

  // Purpose and Interest
  document_purpose: string;
  legal_interest: string;

  // Signature and Payment
  signature_data: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_method: 'card' | 'paypal' | 'bank';
  payment_id?: string;
}

export const createOrder = async (orderData: OrderData) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }

  return data;
};

export const updateOrderStatus = async (orderId: string, status: OrderData['status'], paymentId?: string) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      status,
      payment_id: paymentId,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error updating order: ${error.message}`);
  }

  return data;
};