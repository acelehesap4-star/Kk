import '@testing-library/jest-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeAll(() => {
  // Test başlangıç konfigürasyonu
})

afterEach(() => {
  cleanup() // Her testten sonra DOM'u temizle
})

afterAll(() => {
  // Test bitişinde yapılacaklar
})