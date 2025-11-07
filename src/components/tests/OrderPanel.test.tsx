import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OrderPanel from '../trading/OrderPanel'
import { TradingContext } from '../../context/trading-context'
import '@testing-library/jest-dom'

describe('OrderPanel', () => {
  const mockContext = {
    symbol: 'BTC/USDT',
    price: 50000,
    balance: 10000,
    onSubmitOrder: vi.fn()
  }

  it('renders order panel correctly', () => {
    render(
      <TradingContext.Provider value={mockContext}>
        <OrderPanel />
      </TradingContext.Provider>
    )
    
    expect(screen.getByText('BTC/USDT')).toBeInTheDocument()
    expect(screen.getByLabelText('Miktar')).toBeInTheDocument()
    expect(screen.getByLabelText('Fiyat')).toBeInTheDocument()
  })

  it('submits order correctly', async () => {
    render(
      <TradingContext.Provider value={mockContext}>
        <OrderPanel />
      </TradingContext.Provider>
    )
    
    const amountInput = screen.getByLabelText('Miktar')
    const priceInput = screen.getByLabelText('Fiyat')
    const submitButton = screen.getByText('Al')
    
    fireEvent.change(amountInput, { target: { value: '1' } })
    fireEvent.change(priceInput, { target: { value: '50000' } })
    fireEvent.click(submitButton)
    
    expect(mockContext.onSubmitOrder).toHaveBeenCalledWith({
      type: 'BUY',
      amount: 1,
      price: 50000
    })
  })
})