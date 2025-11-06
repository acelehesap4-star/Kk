import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

export const CryptoAdvancedTools: React.FC = () => {
  const { account, chainId } = useWeb3React();
  const [balance, setBalance] = React.useState<string>('0');
  const [gasPrice, setGasPrice] = React.useState<string>('0');

  React.useEffect(() => {
    if (account && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Get ETH balance
      provider.getBalance(account).then((balance) => {
        setBalance(ethers.utils.formatEther(balance));
      });

      // Get gas price
      provider.getGasPrice().then((price) => {
        setGasPrice(ethers.utils.formatUnits(price, 'gwei'));
      });

      // Subscribe to new blocks
      provider.on('block', (blockNumber) => {
        provider.getGasPrice().then((price) => {
          setGasPrice(ethers.utils.formatUnits(price, 'gwei'));
        });
      });

      return () => {
        provider.removeAllListeners('block');
      };
    }
  }, [account, chainId]);

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kripto Gelişmiş Araçlar</CardTitle>
        </CardHeader>
        <CardContent>
          Cüzdan bağlantısı gerekli
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kripto Gelişmiş Araçlar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">ETH Bakiye</div>
              <div className="text-2xl font-bold">{parseFloat(balance).toFixed(4)} ETH</div>
            </div>
            <div>
              <div className="text-sm font-medium">Gas Fiyatı</div>
              <div className="text-2xl font-bold">{parseFloat(gasPrice).toFixed(2)} Gwei</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};