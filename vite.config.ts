import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  base: '/Kk/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    host: "0.0.0.0",
    port: 12000,
    cors: true
  },
  build: {
    outDir: "docs",
    emptyOutDir: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            'framer-motion',
            'lightweight-charts',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-toast',
            '@headlessui/react',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-checkbox',
            'crypto-js'
          ],
          'trading': [
            './src/components/trading/order/OrderPanelWrapper',
            './src/components/trading/OrderPanel',
            './src/components/trading/OrderBook',
            './src/components/trading/MarketSelector',
            './src/components/trading/PriceDisplay',
            './src/components/trading/MarketSummary',
            './src/components/trading/TradingAlerts',
            './src/components/chart/TradingViewChart',
            './src/components/chart/MainChartArea',
            './src/components/trading/depth/DepthChartContainer',
            './src/components/trading/depth/DepthChartGraph',
            './src/components/trading/TradeFeed',
            './src/components/trading/NewsFeed',
            './src/components/trading/TradingSignals',
            './src/components/trading/AdvancedOrderTypes',
            './src/components/trading/RiskCalculator',
            './src/components/trading/Terminal',
            './src/components/trading/ForexAdvancedTools',
            './src/components/trading/MarketSpecificTools'
          ],
          'charts': [
            './src/components/trading/VolumeChart',
            './src/components/trading/DrawingTools',
            './src/components/trading/IndicatorControls',
            'apexcharts',
            'react-apexcharts'
          ],
          'admin': [
            './src/components/admin/AdminPanel'
          ]

        },
        entryFileNames: `assets/[name].${Date.now()}.[hash].js`,
        chunkFileNames: `assets/[name].${Date.now()}.[hash].js`,
        assetFileNames: `assets/[name].${Date.now()}.[hash].[ext]`
      }
    }
  }
});
