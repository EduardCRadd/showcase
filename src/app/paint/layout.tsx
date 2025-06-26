'use client'

import { QueryClient, QueryClientProvider } from 'react-query'

import { PaintTermsProvider } from '@/components/paint/terms/PaintTermsProvider'

const queryClient = new QueryClient()

function PaintLayout({ children }: { children: React.ReactNode }) {
  return (
    <PaintTermsProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PaintTermsProvider>
  )
}

export default PaintLayout
