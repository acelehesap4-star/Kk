import { createContext, useContext, useState, useCallback } from 'react'
import { secureAxiosInstance } from '../lib/api-security'
import { errorHandler } from '../lib/error-handling'

interface TradingContextType {
  symbol: string
  price: number
  balance: number
  onSubmitOrder: (order: Order) => Promise<void>
}

interface Order {
  type: 'BUY' | 'SELL'
  amount: number
  price: number
}

const TradingContext = createContext<TradingContextType | undefined>(undefined)

export const TradingProvider = ({ children }: { children: React.ReactNode }) => {
  const [symbol, setSymbol] = useState('BTC/USDT')
  const [price, setPrice] = useState(0)
  const [balance, setBalance] = useState(0)

  const onSubmitOrder = useCallback(async (order: Order) => {
    try {
      await secureAxiosInstance.post('/api/orders', order)
      // Başarılı işlem
    } catch (error) {
      errorHandler(error as Error)
    }
  }, [])

  const value = {
    symbol,
    price,
    balance,
    onSubmitOrder
  }

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  )
}

export const useTradingContext = () => {
  const context = useContext(TradingContext)
  if (context === undefined) {
    throw new Error('useTradingContext must be used within a TradingProvider')
  }
  return context
}

export { TradingContext }