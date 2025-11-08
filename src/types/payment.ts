export interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  txHash?: string;
  network: string;
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
}

export type PaymentStatus = 'pending' | 'verified' | 'completed' | 'failed';

export interface PaymentVerification {
  paymentId: string;
  txHash: string;
  network: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  timestamp: Date;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  data?: PaymentVerification;
}