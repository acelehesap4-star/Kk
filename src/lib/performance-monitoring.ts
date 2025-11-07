import { useEffect } from 'react'

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Performance metrics
    const metrics = {
      FCP: 0,
      LCP: 0,
      CLS: 0,
      FID: 0
    }

    // First Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      metrics.FCP = entries[entries.length - 1].startTime
      console.log('FCP:', metrics.FCP)
    }).observe({ type: 'paint', buffered: true })

    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      metrics.LCP = entries[entries.length - 1].startTime
      console.log('LCP:', metrics.LCP)
    }).observe({ type: 'largest-contentful-paint', buffered: true })

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      metrics.CLS = entries[0].value
      console.log('CLS:', metrics.CLS)
    }).observe({ type: 'layout-shift', buffered: true })

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      metrics.FID = entries[0].processingStart - entries[0].startTime
      console.log('FID:', metrics.FID)
    }).observe({ type: 'first-input', buffered: true })

    return () => {
      // Clean up observers if needed
    }
  }, [])
}