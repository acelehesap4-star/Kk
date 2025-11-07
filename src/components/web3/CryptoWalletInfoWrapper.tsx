import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const LazyCryptoWalletInfo = lazy(() => import('./CryptoWalletInfo'));

interface CryptoWalletInfoWrapperProps {
  address: string;
}

export function CryptoWalletInfoWrapper({ address }: CryptoWalletInfoWrapperProps) {
  return (
    <Suspense fallback={
      <div className="p-4 rounded-lg border border-border/50 animate-pulse">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading wallet info...</span>
        </div>
      </div>
    }>
      <LazyCryptoWalletInfo address={address} />
    </Suspense>
  );
}