import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: "/B/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  build: {
    outDir: "docs",
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      external: [
        './src/components/trading/OrderPanel.tsx',
        './src/components/trading/CryptoAdvancedTools.tsx',
        './src/components/trading/MarketAnalysis.tsx'
      ],
      output: {
        manualChunks: {
          'vendor-core': [
            'react',
            'react-dom',
            'react-router-dom'
          ],
          'vendor-features': [
            '@tanstack/react-query',
            'framer-motion',
            'lightweight-charts'
          ],
          'vendor-web3': [
            'wagmi',
            '@wagmi/core',
            'viem',
            '@wagmi/connectors',
            'ethers'
          ],
          'vendor-ui': [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-toast',
            '@headlessui/react',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-checkbox'
          ],
          'vendor-crypto': [
            'crypto-js'
          ],
          'trading-orders-wrapper': [
            './src/components/trading/order/OrderPanelWrapper'
          ],
          'trading-core': [
            './src/components/trading/OrderPanel',
            './src/components/trading/OrderBook',
            './src/components/trading/MarketSelector',
            './src/components/trading/PriceDisplay',
            './src/components/trading/MarketSummary',
            './src/components/trading/TradingAlerts'
          ],
          'chart-features': [
            './src/components/chart/TradingViewChart',
            './src/components/chart/MainChartArea',
            './src/components/trading/depth/DepthChartContainer',
            './src/components/trading/depth/DepthChartGraph',
            './src/components/trading/VolumeChart',
            './src/components/trading/DrawingTools',
            './src/components/trading/IndicatorControls',
            'apexcharts',
            'react-apexcharts'
          ],
          'trading-feeds': [
            './src/components/trading/TradeFeed',
            './src/components/trading/NewsFeed',
            './src/components/trading/TradingSignals'
          ],
          'trading-advanced-orders': [
            './src/components/trading/AdvancedOrderTypes',
            './src/components/trading/RiskCalculator'
          ],
          'trading-terminal': [
            './src/components/trading/AdvancedTerminal',
            './src/components/trading/Terminal'
          ],
          'trading-tools': [
            './src/components/trading/ForexAdvancedTools',
            './src/components/trading/MarketSpecificTools'
          ],
          'admin-dashboard': [
            './src/components/admin/AdminPanel'
          ],
          'admin-core': [
            './src/components/admin/AdvancedAdminPanelWrapper',
            './src/components/AdvancedAdminPanel'
          ],
          'web3-core': [
            './src/components/web3/WalletButton',
            './src/components/web3/WalletInfoWrapper'
          ],
          'web3-features': [
            './src/components/web3/CryptoWalletInfo',
            './src/components/web3/CryptoWalletInfoWrapper'
          ],
          'web3-defi': [
            './src/components/web3/SwapInterface',
            './src/components/web3/CryptoPayment'
          ]
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
});
