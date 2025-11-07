import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const LazyWalletInfo = lazy(() => import('./CryptoWalletInfo'));

interface WalletInfoWrapperProps {
  // Bileşen prop'larını buraya ekle
}

export function WalletInfoWrapper(props: WalletInfoWrapperProps) {
  return (
    <Suspense fallback={
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    }>
      <LazyWalletInfo {...props} />
    </Suspense>
  );
}