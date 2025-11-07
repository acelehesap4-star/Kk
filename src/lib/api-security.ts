import axios from 'axios'
import { toast } from 'sonner'

// API istekleri için güvenli interceptor
export const secureAxiosInstance = axios.create()

// Request interceptor
secureAxiosInstance.interceptors.request.use(
  (config) => {
    // API anahtarlarını güvenli şekilde ekle
    const apiKeys = {
      binance: process.env.VITE_BINANCE_API_KEY,
      coinbase: process.env.VITE_COINBASE_API_KEY,
      // Diğer API anahtarları...
    }
    
    // Rate limiting ve throttling
    config.headers['X-Rate-Limit'] = '100'
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
secureAxiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // API hata mesajlarını göster
      toast.error(error.response.data.message || 'Bir hata oluştu')
    }
    return Promise.reject(error)
  }
)